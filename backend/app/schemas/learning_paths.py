"""
Pydantic v2 schemas for Personalized AI Learning Paths and Milestones.
"""

from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone


class LearningPathStep(BaseModel):
    step_id: str
    concept_id: str
    concept_name: str
    sequence_order: int
    title: str
    description: str
    estimated_minutes: int
    difficulty: Literal["beginner", "intermediate", "advanced"]
    is_completed: bool = False
    action_type: Literal["read_note", "practice_quiz", "flashcard_review", "inspect_paper"]
    action_url: str


class LearningPathResponse(BaseModel):
    id: str
    title: str
    goal: str
    subject_id: str
    subject_name: str
    description: str
    estimated_hours: float
    total_steps: int
    completed_steps: int
    progress_percentage: float
    steps: List[LearningPathStep]
    created_at: datetime
    updated_at: datetime


class LearningPathGenerateRequest(BaseModel):
    subject_id: Optional[str] = None
    goal: Optional[str] = Field(default="Master Transformer Attention & Bayesian Models", max_length=200)
    target_mastery: float = Field(default=0.85, ge=0.50, le=0.99)
