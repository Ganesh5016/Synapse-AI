"""
Pydantic v2 schemas for the Study Planner & Revision Calendar.
"""

from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone


class StudySessionResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    subject_id: Optional[str] = None
    subject_name: Optional[str] = "General"
    subject_color: Optional[str] = "#7667F5"
    concept_id: Optional[str] = None
    concept_name: Optional[str] = None
    session_type: Literal[
        "deep_work",
        "spaced_review",
        "diagnostic_quiz",
        "concept_exploration",
        "paper_reading"
    ] = "deep_work"
    scheduled_start: datetime
    duration_minutes: int = 45
    is_completed: bool = False
    completed_at: Optional[datetime] = None
    difficulty: Literal["beginner", "intermediate", "advanced"] = "intermediate"
    target_cards_count: Optional[int] = None
    target_questions_count: Optional[int] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class StudySessionCreateRequest(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    description: Optional[str] = Field(default=None, max_length=500)
    subject_id: Optional[str] = None
    concept_id: Optional[str] = None
    session_type: Literal[
        "deep_work",
        "spaced_review",
        "diagnostic_quiz",
        "concept_exploration",
        "paper_reading"
    ] = "deep_work"
    scheduled_start: datetime
    duration_minutes: int = Field(default=45, ge=5, le=360)
    difficulty: Literal["beginner", "intermediate", "advanced"] = "intermediate"
    target_cards_count: Optional[int] = Field(default=None, ge=1, le=100)
    target_questions_count: Optional[int] = Field(default=None, ge=1, le=50)
    notes: Optional[str] = None


class StudySessionUpdateRequest(BaseModel):
    title: Optional[str] = None
    is_completed: Optional[bool] = None
    scheduled_start: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    notes: Optional[str] = None


class CalendarAgendaEvent(BaseModel):
    id: str
    title: str
    start: datetime
    end: datetime
    session_type: str
    subject_name: str
    subject_color: str
    is_completed: bool
