"""
Common Pydantic v2 schemas for standardized request and response structures.
"""

from typing import Generic, TypeVar, Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime, timezone

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """Standard envelope for all successful API responses."""
    success: bool = True
    data: T
    message: Optional[str] = None
    meta: Optional[Dict[str, Any]] = None


class PaginatedMeta(BaseModel):
    page: int
    limit: int
    total_items: int
    total_pages: int
    has_next: bool
    has_prev: bool


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated collection response."""
    success: bool = True
    data: List[T]
    pagination: PaginatedMeta


class HealthCheckResponse(BaseModel):
    status: str = "ok"
    version: str
    environment: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    services: Dict[str, str] = {}
