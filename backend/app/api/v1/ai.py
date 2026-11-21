"""
AI & Grounded Assistant Router for Synapse.
Endpoints for:
  - System AI Health and rate-limit diagnostics
  - Text Summarization
  - Conversation thread management (CRUD)
  - Grounded RAG Chat with exact source citations
  - Concept & keyterm extraction
  - Practice Question generation
  - Spaced Repetition Flashcard generation
"""

from typing import List, Optional
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_current_user, AuthenticatedUser
from app.schemas.common import APIResponse
from app.schemas.ai import (
    AIHealthResponse,
    AISummarizeRequest,
    AISummarizeResponse,
    RAGQueryRequest,
    RAGQueryResponse,
    ConversationCreate,
    ConversationResponse,
    ConversationDetailResponse,
    MessageResponse,
    ConceptExtractionRequest,
    ConceptExtractionResponse,
    QuestionGenerationRequest,
    QuestionGenerationResponse,
    FlashcardGenerationRequest,
    FlashcardGenerationResponse,
)
from app.services.ai.inference import inference_service
from app.services.ai.rag_engine import (
    rag_engine,
    _LOCAL_CONVERSATIONS_DB,
    _LOCAL_MESSAGES_DB,
)
from app.services.ai.extractor import cognitive_extractor
from app.api.v1.documents import _LOCAL_DOCS_DB
from app.api.v1.notes import _LOCAL_NOTES_DB

router = APIRouter(prefix="/ai", tags=["AI Functionality"])


# ============================================================================
# 1. Health & Diagnostics
# ============================================================================

@router.get("/health", response_model=APIResponse[AIHealthResponse])
async def get_ai_health():
    """Inspects status of all configured Hugging Face models and rate limits."""
    health = await inference_service.get_health()
    return APIResponse(data=health, message="AI inference health retrieved")


# ============================================================================
# 2. Text Summarization
# ============================================================================

@router.post("/summarize", response_model=APIResponse[AISummarizeResponse])
async def summarize_text(
    payload: AISummarizeRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Summarizes document chunks or notes using facebook/bart-large-cnn with fallback."""
    result = await inference_service.summarize(
        text=payload.text,
        max_length=payload.max_length,
        min_length=payload.min_length,
        user_key=str(current_user.id),
    )
    return APIResponse(data=result, message="Text summarized successfully")


# ============================================================================
# 3. Conversations Management
# ============================================================================

@router.get("/conversations", response_model=APIResponse[List[ConversationResponse]])
async def list_conversations(
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Returns all conversation threads for the current user."""
    user_convs = [
        c for c in _LOCAL_CONVERSATIONS_DB if str(c.get("user_id")) == str(current_user.id)
    ]
    # Augment with message counts and last message preview
    results: List[ConversationResponse] = []
    for c in user_convs:
        msgs = [m for m in _LOCAL_MESSAGES_DB if str(m.get("conversation_id")) == str(c["id"])]
        last_msg = msgs[-1]["content"][:60] if msgs else None
        results.append(
            ConversationResponse(
                id=str(c["id"]),
                user_id=str(c["user_id"]),
                title=c["title"],
                created_at=c["created_at"],
                updated_at=c["updated_at"],
                message_count=len(msgs),
                last_message_preview=last_msg,
            )
        )

    # Sort newest first
    results.sort(key=lambda x: x.updated_at, reverse=True)
    return APIResponse(data=results, message=f"Retrieved {len(results)} conversations")


@router.post("/conversations", response_model=APIResponse[ConversationResponse], status_code=status.HTTP_201_CREATED)
async def create_conversation(
    payload: ConversationCreate,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Creates a new empty conversation session."""
    conv_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    conv_record = {
        "id": conv_id,
        "user_id": str(current_user.id),
        "title": payload.title or "New Conversation",
        "created_at": now,
        "updated_at": now,
    }
    _LOCAL_CONVERSATIONS_DB.append(conv_record)
    return APIResponse(
        data=ConversationResponse(
            id=conv_id,
            user_id=str(current_user.id),
            title=conv_record["title"],
            created_at=now,
            updated_at=now,
            message_count=0,
        ),
        message="Conversation created",
    )


@router.get("/conversations/{conversation_id}", response_model=APIResponse[ConversationDetailResponse])
async def get_conversation(
    conversation_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Retrieves full conversation details and chronological message history."""
    conv = next(
        (c for c in _LOCAL_CONVERSATIONS_DB if str(c.get("id")) == str(conversation_id) and str(c.get("user_id")) == str(current_user.id)),
        None,
    )
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    raw_msgs = [m for m in _LOCAL_MESSAGES_DB if str(m.get("conversation_id")) == str(conversation_id)]
    messages = [
        MessageResponse(
            id=str(m["id"]),
            conversation_id=str(m["conversation_id"]),
            role=m["role"],
            content=m["content"],
            citations=m.get("citations", []),
            created_at=m["created_at"],
        )
        for m in raw_msgs
    ]

    conv_summary = ConversationResponse(
        id=str(conv["id"]),
        user_id=str(conv["user_id"]),
        title=conv["title"],
        created_at=conv["created_at"],
        updated_at=conv["updated_at"],
        message_count=len(messages),
    )

    return APIResponse(
        data=ConversationDetailResponse(conversation=conv_summary, messages=messages),
        message="Conversation details loaded",
    )


@router.delete("/conversations/{conversation_id}", response_model=APIResponse[dict])
async def delete_conversation(
    conversation_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Deletes a conversation and its messages."""
    global _LOCAL_CONVERSATIONS_DB, _LOCAL_MESSAGES_DB
    idx = next(
        (i for i, c in enumerate(_LOCAL_CONVERSATIONS_DB) if str(c.get("id")) == str(conversation_id) and str(c.get("user_id")) == str(current_user.id)),
        None,
    )
    if idx is None:
        raise HTTPException(status_code=404, detail="Conversation not found")

    _LOCAL_CONVERSATIONS_DB.pop(idx)
    _LOCAL_MESSAGES_DB = [m for m in _LOCAL_MESSAGES_DB if str(m.get("conversation_id")) != str(conversation_id)]
    return APIResponse(data={"deleted_id": conversation_id}, message="Conversation deleted")


# ============================================================================
# 4. Grounded RAG Chat
# ============================================================================

@router.post("/chat", response_model=APIResponse[RAGQueryResponse])
@router.post("/ask", response_model=APIResponse[RAGQueryResponse])
async def chat_rag(
    payload: RAGQueryRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """
    Submits user query to Grounded RAG Assistant.
    Retrieves candidate document chunks and notes, generates strictly cited answer,
    and returns verified citation cards.
    """
    response = await rag_engine.answer_query(
        query=payload.query,
        user_id=str(current_user.id),
        conversation_id=payload.conversation_id,
        top_k=payload.top_k,
        similarity_threshold=payload.similarity_threshold,
        strictly_grounded=payload.strictly_grounded,
        subject_id=payload.subject_id,
    )
    return APIResponse(data=response, message="Grounded response generated")


# ============================================================================
# 5. Concept Extraction
# ============================================================================

@router.post("/extract-concepts", response_model=APIResponse[ConceptExtractionResponse])
async def extract_concepts(
    payload: ConceptExtractionRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Extracts concepts, definitions, and prerequisites from text, note, or document."""
    text_to_process = payload.text or ""
    source_name = "Text Input"

    if payload.note_id:
        note = next((n for n in _LOCAL_NOTES_DB if str(n["id"]) == str(payload.note_id)), None)
        if note:
            text_to_process = f"{note['title']}\n\n{note['content_markdown']}"
            source_name = note["title"]

    elif payload.document_id:
        doc = next((d for d in _LOCAL_DOCS_DB if str(d["id"]) == str(payload.document_id)), None)
        if doc:
            source_name = doc["title"]
            # Combine snippets from this document's chunks
            from app.api.v1.documents import _LOCAL_CHUNKS_DB
            chunks = [c["content"] for c in _LOCAL_CHUNKS_DB if str(c["document_id"]) == str(payload.document_id)]
            text_to_process = "\n\n".join(chunks)

    if not text_to_process:
        raise HTTPException(status_code=400, detail="No text, note_id, or document_id provided for concept extraction")

    result = await cognitive_extractor.extract_concepts(
        text=text_to_process,
        max_concepts=payload.max_concepts,
        source_name=source_name,
        user_key=str(current_user.id),
    )
    return APIResponse(data=result, message=f"Extracted {result.count} concepts")


# ============================================================================
# 6. Question Generation
# ============================================================================

@router.post("/generate-questions", response_model=APIResponse[QuestionGenerationResponse])
async def generate_questions(
    payload: QuestionGenerationRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Generates practice questions (MCQ, True/False, Short Answer) from study materials."""
    text_to_process = payload.text or ""
    source_name = "Study Text"

    if payload.note_id:
        note = next((n for n in _LOCAL_NOTES_DB if str(n["id"]) == str(payload.note_id)), None)
        if note:
            text_to_process = f"{note['title']}\n\n{note['content_markdown']}"
            source_name = note["title"]

    elif payload.document_id:
        doc = next((d for d in _LOCAL_DOCS_DB if str(d["id"]) == str(payload.document_id)), None)
        if doc:
            source_name = doc["title"]
            from app.api.v1.documents import _LOCAL_CHUNKS_DB
            chunks = [c["content"] for c in _LOCAL_CHUNKS_DB if str(c["document_id"]) == str(payload.document_id)]
            text_to_process = "\n\n".join(chunks)

    if not text_to_process:
        raise HTTPException(status_code=400, detail="No source text, note_id, or document_id provided for question generation")

    result = await cognitive_extractor.generate_questions(
        text=text_to_process,
        count=payload.count,
        difficulty=payload.difficulty,
        question_types=payload.question_types,
        source_name=source_name,
        user_key=str(current_user.id),
    )
    return APIResponse(data=result, message=f"Generated {result.count} questions")


# ============================================================================
# 7. Flashcard Generation
# ============================================================================

@router.post("/generate-flashcards", response_model=APIResponse[FlashcardGenerationResponse])
async def generate_flashcards(
    payload: FlashcardGenerationRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Generates atomic front/back flashcards for spaced repetition."""
    text_to_process = payload.text or ""
    source_name = "Study Text"

    if payload.note_id:
        note = next((n for n in _LOCAL_NOTES_DB if str(n["id"]) == str(payload.note_id)), None)
        if note:
            text_to_process = f"{note['title']}\n\n{note['content_markdown']}"
            source_name = note["title"]

    elif payload.document_id:
        doc = next((d for d in _LOCAL_DOCS_DB if str(d["id"]) == str(payload.document_id)), None)
        if doc:
            source_name = doc["title"]
            from app.api.v1.documents import _LOCAL_CHUNKS_DB
            chunks = [c["content"] for c in _LOCAL_CHUNKS_DB if str(c["document_id"]) == str(payload.document_id)]
            text_to_process = "\n\n".join(chunks)

    if not text_to_process:
        raise HTTPException(status_code=400, detail="No source text, note_id, or document_id provided for flashcard generation")

    result = await cognitive_extractor.generate_flashcards(
        text=text_to_process,
        count=payload.count,
        source_name=source_name,
        user_key=str(current_user.id),
    )
    return APIResponse(data=result, message=f"Generated {result.count} flashcards")
