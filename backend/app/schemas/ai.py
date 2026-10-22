"""
Pydantic v2 schemas for Synapse AI Functionality.
Covers inference, multi-model health, Grounded RAG with strict citations,
conversations, concept extraction, question generation, and flashcard generation.
"""

from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone
import uuid


# ============================================================================
# 1. AI Health & Model Status
# ============================================================================

class AIModelStatus(BaseModel):
    model_id: str
    task: str  # "feature-extraction", "summarization", "text-generation", "reranking"
    status: Literal["ready", "loading", "offline", "fallback"]
    latency_ms: Optional[float] = None
    last_checked: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AIHealthResponse(BaseModel):
    overall_status: Literal["healthy", "degraded", "offline"]
    models: List[AIModelStatus]
    rate_limit_remaining: int
    rate_limit_reset_seconds: int
    hf_token_configured: bool
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ============================================================================
# 2. Text Summarization & Generation
# ============================================================================

class AISummarizeRequest(BaseModel):
    text: str = Field(..., min_length=10, max_length=50000, description="Raw text or notes to summarize")
    max_length: int = Field(default=250, ge=30, le=1000)
    min_length: int = Field(default=50, ge=10, le=300)
    focus: Optional[str] = Field(default=None, description="Optional conceptual focus for the summary")


class AISummarizeResponse(BaseModel):
    summary: str
    original_length: int
    summary_length: int
    model: str
    latency_ms: float
    key_points: List[str] = Field(default_factory=list)


class AIGenerateRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=8000)
    system_prompt: Optional[str] = None
    max_tokens: int = Field(default=512, ge=16, le=2048)
    temperature: float = Field(default=0.7, ge=0.0, le=1.5)


class AIGenerateResponse(BaseModel):
    generated_text: str
    model: str
    finish_reason: str = "stop"
    latency_ms: float


# ============================================================================
# 3. Grounded RAG & Citations
# ============================================================================

class SourceCitation(BaseModel):
    citation_id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    chunk_id: Optional[str] = None
    document_id: Optional[str] = None
    document_title: str
    page_number: Optional[int] = None
    chunk_index: Optional[int] = None
    similarity_score: float
    snippet: str
    source_type: Literal["document", "note"] = "document"


class RAGQueryRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=2000, description="User question or research query")
    conversation_id: Optional[str] = Field(default=None, description="Conversation session to attach message to")
    top_k: int = Field(default=5, ge=1, le=15)
    similarity_threshold: float = Field(default=0.35, ge=0.1, le=0.9)
    strictly_grounded: bool = Field(default=True, description="Enforce strict answers based only on corpus")
    subject_id: Optional[str] = None


class RAGQueryResponse(BaseModel):
    answer: str
    citations: List[SourceCitation] = Field(default_factory=list)
    conversation_id: str
    message_id: str
    is_grounded: bool = True
    context_chunk_count: int
    latency_ms: float
    suggested_follow_ups: List[str] = Field(default_factory=list)


# ============================================================================
# 4. Conversations & Messages
# ============================================================================

class ConversationCreate(BaseModel):
    title: Optional[str] = Field(default="New Conversation", max_length=255)


class ConversationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    user_id: str
    title: str
    created_at: datetime
    updated_at: datetime
    message_count: int = 0
    last_message_preview: Optional[str] = None


class MessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    conversation_id: str
    role: Literal["user", "assistant", "system"]
    content: str
    citations: List[SourceCitation] = Field(default_factory=list)
    created_at: datetime


class ConversationDetailResponse(BaseModel):
    conversation: ConversationResponse
    messages: List[MessageResponse]


# ============================================================================
# 5. Concept Extraction
# ============================================================================

class ConceptExtractionRequest(BaseModel):
    text: Optional[str] = Field(default=None, max_length=30000, description="Raw text or note content")
    document_id: Optional[str] = None
    note_id: Optional[str] = None
    max_concepts: int = Field(default=6, ge=1, le=20)


class ExtractedConcept(BaseModel):
    name: str
    slug: str
    description: str
    difficulty_level: Literal["beginner", "intermediate", "advanced"] = "intermediate"
    key_terms: List[str] = Field(default_factory=list)
    suggested_prerequisites: List[str] = Field(default_factory=list)


class ConceptExtractionResponse(BaseModel):
    concepts: List[ExtractedConcept]
    count: int
    source_name: Optional[str] = None
    latency_ms: float


# ============================================================================
# 6. Question & Flashcard Generation
# ============================================================================

class QuestionGenerationRequest(BaseModel):
    text: Optional[str] = Field(default=None, max_length=30000)
    note_id: Optional[str] = None
    document_id: Optional[str] = None
    concept_id: Optional[str] = None
    count: int = Field(default=4, ge=1, le=10)
    difficulty: Literal["beginner", "intermediate", "advanced"] = "intermediate"
    question_types: List[Literal["multiple_choice", "true_false", "short_answer"]] = [
        "multiple_choice",
        "true_false",
    ]


class GeneratedQuestion(BaseModel):
    question_type: Literal["multiple_choice", "true_false", "short_answer"]
    prompt: str
    options: Optional[List[str]] = None
    correct_answer: str
    explanation: str
    difficulty: Literal["beginner", "intermediate", "advanced"]
    hint: Optional[str] = None


class QuestionGenerationResponse(BaseModel):
    questions: List[GeneratedQuestion]
    count: int
    source_name: Optional[str] = None
    latency_ms: float


class FlashcardGenerationRequest(BaseModel):
    text: Optional[str] = Field(default=None, max_length=30000)
    note_id: Optional[str] = None
    document_id: Optional[str] = None
    concept_id: Optional[str] = None
    deck_id: Optional[str] = None
    count: int = Field(default=5, ge=1, le=15)


class GeneratedFlashcard(BaseModel):
    front: str
    back: str
    hint: Optional[str] = None
    tags: List[str] = Field(default_factory=list)


class FlashcardGenerationResponse(BaseModel):
    flashcards: List[GeneratedFlashcard]
    count: int
    source_name: Optional[str] = None
    latency_ms: float
