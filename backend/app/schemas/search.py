"""
Pydantic v2 schemas for Hybrid Vector and Lexical Search.
"""

from typing import Optional, List
from pydantic import BaseModel, Field
import uuid


class SearchQueryRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=1000, description="Natural language search query")
    match_count: int = Field(default=5, ge=1, le=20, description="Number of chunks to return")
    threshold: float = Field(default=0.45, ge=0.0, le=1.0, description="Minimum cosine similarity")
    subject_id: Optional[uuid.UUID] = Field(default=None, description="Optional subject scope")


class SearchResultChunk(BaseModel):
    id: uuid.UUID
    document_id: uuid.UUID
    document_title: Optional[str] = None
    chunk_index: int
    page_number: int
    content: str
    similarity: float
    subject_id: Optional[uuid.UUID] = None


class SearchResponse(BaseModel):
    query: str
    results_count: int
    results: List[SearchResultChunk]
    latency_seconds: float
