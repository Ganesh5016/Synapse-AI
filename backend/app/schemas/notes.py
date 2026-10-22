from typing import Optional, List, Union
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone
import uuid


class NoteBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Note title")
    content_markdown: str = Field(default="", description="Markdown content body")
    subject_id: Optional[uuid.UUID] = Field(default=None, description="Linked subject UUID")
    is_pinned: bool = Field(default=False, description="Pin status")
    tags: List[str] = Field(default_factory=list, description="Array of topical tags")


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    content_markdown: Optional[str] = None
    subject_id: Optional[uuid.UUID] = None
    is_pinned: Optional[bool] = None
    tags: Optional[List[str]] = None


class NoteResponse(NoteBase):
    id: uuid.UUID
    user_id: Union[uuid.UUID, str]
    word_count: int = 0
    reading_time_minutes: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
