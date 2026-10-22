"""
Documents API Router for Synapse.
Supports PDF upload, text extraction, chunk inspection, and deletion.
"""

from typing import List, Optional
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status, BackgroundTasks

from app.core.security import get_current_user, AuthenticatedUser
from app.schemas.documents import DocumentResponse, DocumentChunkResponse, DocumentUploadResponse
from app.schemas.common import APIResponse
from app.services.documents.pdf_parser import PDFParserService
from app.services.documents.indexer import DocumentIndexerService
from app.core.logging import logger

router = APIRouter(prefix="/documents", tags=["Documents"])

# In-memory document and chunk database
_LOCAL_DOCS_DB: List[dict] = [
    {
        "id": uuid.UUID("33333333-3333-3333-3333-333333333333"),
        "user_id": uuid.UUID("demo-user-1234-5678-90ab") if False else "demo-user-1234-5678-90ab",
        "title": "Attention Is All You Need (Vaswani et al.)",
        "subject_id": uuid.UUID("a0000000-0000-0000-0000-000000000001"),
        "file_type": "pdf",
        "file_size_bytes": 1048576,
        "page_count": 15,
        "storage_path": "documents/demo-user-1234-5678-90ab/attention-is-all-you-need.pdf",
        "processing_status": "ready",
        "processing_error": None,
        "chunk_count": 28,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
]

_LOCAL_CHUNKS_DB: List[dict] = [
    {
        "id": uuid.UUID("44444444-4444-4444-4444-444444444441"),
        "document_id": uuid.UUID("33333333-3333-3333-3333-333333333333"),
        "user_id": "demo-user-1234-5678-90ab",
        "chunk_index": 0,
        "page_number": 1,
        "content": "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.",
        "token_count": 64,
        "similarity": 0.89,
        "created_at": datetime.now(timezone.utc),
    },
    {
        "id": uuid.UUID("44444444-4444-4444-4444-444444444442"),
        "document_id": uuid.UUID("33333333-3333-3333-3333-333333333333"),
        "user_id": "demo-user-1234-5678-90ab",
        "chunk_index": 1,
        "page_number": 3,
        "content": "An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key.",
        "token_count": 68,
        "similarity": 0.94,
        "created_at": datetime.now(timezone.utc),
    },
]


@router.get("", response_model=APIResponse[List[DocumentResponse]])
async def list_documents(
    subject_id: Optional[uuid.UUID] = None,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Lists all uploaded documents for user."""
    results = [d for d in _LOCAL_DOCS_DB if str(d["user_id"]) == str(current_user.id)]
    if subject_id:
        results = [d for d in results if str(d.get("subject_id")) == str(subject_id)]

    results.sort(key=lambda x: x["created_at"], reverse=True)
    return APIResponse(data=results, message="Documents retrieved successfully")


@router.post("/upload", response_model=APIResponse[DocumentUploadResponse], status_code=status.HTTP_201_CREATED)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    subject_id: Optional[uuid.UUID] = Form(None),
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """
    Accepts multipart PDF upload, validates size (<25MB), extracts text, and generates chunks.
    """
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF documents are supported for upload."
        )

    file_bytes = await file.read()
    file_size = len(file_bytes)

    if file_size > 25 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Document size exceeds 25MB maximum limit."
        )

    doc_id = uuid.uuid4()
    doc_title = title or file.filename.rsplit(".", 1)[0]
    storage_path = f"documents/{current_user.id}/{doc_id}.pdf"

    # Extract text from PDF
    parsed = PDFParserService.extract_text_from_bytes(file_bytes)
    page_count = parsed.get("page_count", 1)

    # Synchronously index chunks (or background task in production)
    indexer = DocumentIndexerService()
    user_uuid = uuid.UUID(current_user.id) if "-" in current_user.id else uuid.uuid4()
    chunks = await indexer.index_document_pages(
        document_id=doc_id,
        user_id=user_uuid,
        pages=parsed.get("pages", [])
    )

    doc_record = {
        "id": doc_id,
        "user_id": current_user.id,
        "title": doc_title,
        "subject_id": subject_id,
        "file_type": "pdf",
        "file_size_bytes": file_size,
        "page_count": page_count,
        "storage_path": storage_path,
        "processing_status": "ready",
        "processing_error": None,
        "chunk_count": len(chunks),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }

    _LOCAL_DOCS_DB.append(doc_record)
    for c in chunks:
        _LOCAL_CHUNKS_DB.append({
            "id": uuid.UUID(c["id"]) if isinstance(c["id"], str) else c["id"],
            "document_id": doc_id,
            "user_id": current_user.id,
            "chunk_index": c["chunk_index"],
            "page_number": c["page_number"],
            "content": c["content"],
            "token_count": c["token_count"],
            "similarity": None,
            "created_at": datetime.now(timezone.utc),
        })

    return APIResponse(
        data=DocumentUploadResponse(
            document_id=doc_id,
            title=doc_title,
            status="ready",
            message=f"Successfully extracted {len(chunks)} chunks across {page_count} pages.",
        ),
        message="Document uploaded and processed successfully"
    )


@router.get("/{document_id}", response_model=APIResponse[DocumentResponse])
async def get_document(
    document_id: uuid.UUID,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Retrieves document metadata."""
    for d in _LOCAL_DOCS_DB:
        if str(d["id"]) == str(document_id) and str(d["user_id"]) == str(current_user.id):
            return APIResponse(data=d, message="Document metadata retrieved")

    raise HTTPException(status_code=404, detail="Document not found")


@router.get("/{document_id}/chunks", response_model=APIResponse[List[DocumentChunkResponse]])
async def get_document_chunks(
    document_id: uuid.UUID,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Retrieves all parsed text chunks for a specific document."""
    chunks = [c for c in _LOCAL_CHUNKS_DB if str(c["document_id"]) == str(document_id) and str(c["user_id"]) == str(current_user.id)]
    chunks.sort(key=lambda x: x["chunk_index"])
    return APIResponse(data=chunks, message="Document chunks retrieved")


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: uuid.UUID,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Deletes document and cascades all related chunks."""
    global _LOCAL_DOCS_DB, _LOCAL_CHUNKS_DB
    _LOCAL_DOCS_DB = [d for d in _LOCAL_DOCS_DB if not (str(d["id"]) == str(document_id) and str(d["user_id"]) == str(current_user.id))]
    _LOCAL_CHUNKS_DB = [c for c in _LOCAL_CHUNKS_DB if not (str(c["document_id"]) == str(document_id) and str(c["user_id"]) == str(current_user.id))]
    return
