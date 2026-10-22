"""
Pydantic v2 schemas for Documents and Chunks.
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
import uuid


class DocumentBase(BaseModel):
    title: str
    subject_id: Optional[uuid.UUID] = None
    file_type: str = "pdf"
    file_size_bytes: int = 0
    page_count: int = 0


class DocumentResponse(DocumentBase):
    id: uuid.UUID
    user_id: uuid.UUID
    storage_path: str
    processing_status: str
    processing_error: Optional[str] = None
    chunk_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DocumentChunkResponse(BaseModel):
    id: uuid.UUID
    document_id: uuid.UUID
    chunk_index: int
    page_number: int
    content: str
    token_count: Optional[int] = None
    similarity: Optional[float] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class DocumentUploadResponse(BaseModel):
    document_id: uuid.UUID
    title: str
    status: str
    message: str
