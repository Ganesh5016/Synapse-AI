"""
Pydantic v2 schemas for SM-2 Spaced Repetition Flashcards and Decks.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone


class FlashcardResponse(BaseModel):
    id: str
    deck_id: Optional[str] = None
    concept_id: str
    concept_name: str
    subject_id: str
    front: str
    back: str
    hint: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    repetition_number: int = 0
    easiness_factor: float = 2.5
    interval_days: int = 1
    next_due_at: datetime
    is_due: bool = True


class FlashcardReviewRequest(BaseModel):
    quality_rating: int = Field(..., ge=0, le=5, description="SM-2 response grade from 0 to 5")
    response_time_seconds: Optional[float] = None


class FlashcardReviewResponse(BaseModel):
    flashcard_id: str
    quality_rating: int
    new_repetition_number: int
    new_easiness_factor: float
    new_interval_days: int
    next_due_at: datetime
    remaining_due_count: int


class DeckResponse(BaseModel):
    id: str
    name: str
    description: str
    subject_id: str
    subject_name: str
    subject_color: str
    card_count: int
    due_count: int
