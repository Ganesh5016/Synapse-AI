"""
Pydantic v2 schemas for Adaptive Practice Center, questions, and submissions.
"""

from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone
from app.schemas.mastery import BKTUpdateResponse


class PracticeQuestionResponse(BaseModel):
    id: str
    concept_id: str
    concept_name: str
    subject_id: str
    question_type: Literal["multiple_choice", "true_false", "short_answer"]
    prompt: str
    options: Optional[List[str]] = None
    correct_answer: str
    explanation: str
    difficulty: Literal["beginner", "intermediate", "advanced"]
    hint: Optional[str] = None


class PracticeSubmitRequest(BaseModel):
    question_id: str
    selected_answer: str
    response_time_seconds: Optional[float] = None
    hint_used: bool = False


class PracticeSubmitResponse(BaseModel):
    is_correct: bool
    user_answer: str
    correct_answer: str
    explanation: str
    score_earned: int
    bkt_update: BKTUpdateResponse


class PracticeSessionSummary(BaseModel):
    session_id: str
    total_questions: int
    correct_count: int
    accuracy_rate: float
    total_score: int
    concept_gains: List[Dict[str, Any]]
