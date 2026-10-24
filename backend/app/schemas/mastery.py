"""
Pydantic v2 schemas for Bayesian Knowledge Tracing (BKT) and Knowledge Gap Detection.
"""

from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone


class BKTParameters(BaseModel):
    p_l0: float = Field(default=0.40, ge=0.01, le=0.99, description="Initial prior probability of mastery")
    p_t: float = Field(default=0.15, ge=0.01, le=0.50, description="Probability of learning transition")
    p_g: float = Field(default=0.20, ge=0.01, le=0.40, description="Guess probability")
    p_s: float = Field(default=0.10, ge=0.01, le=0.30, description="Slip probability")


class ConceptMasteryItem(BaseModel):
    concept_id: str
    concept_name: str
    subject_id: str
    subject_name: str
    p_know: float
    mastery_level: Literal["Novice", "Developing", "Proficient", "Mastered"]
    attempts_count: int
    correct_count: int
    accuracy_rate: float
    last_practiced_at: Optional[datetime] = None
    decay_risk: Literal["Low", "Medium", "High"] = "Low"


class SubjectMasterySummary(BaseModel):
    subject_id: str
    subject_name: str
    subject_color: str
    average_mastery: float
    total_concepts: int
    mastered_count: int
    developing_count: int
    novice_count: int


class MasteryOverviewResponse(BaseModel):
    overall_mastery: float
    retention_health: float
    total_concepts: int
    mastered_concepts: int
    active_gaps_count: int
    subjects: List[SubjectMasterySummary]
    concept_mastery: List[ConceptMasteryItem]


class KnowledgeGapItem(BaseModel):
    gap_id: str
    concept_id: str
    concept_name: str
    subject_id: str
    subject_name: str
    severity: Literal["critical", "moderate", "minor"]
    current_mastery: float
    target_mastery: float = 0.85
    root_cause: str
    recommended_action: str
    action_type: Literal["review_notes", "practice_quiz", "flashcard_repetition", "study_prerequisite"]
    prerequisite_blocker_id: Optional[str] = None
    prerequisite_blocker_name: Optional[str] = None


class KnowledgeGapsResponse(BaseModel):
    gaps: List[KnowledgeGapItem]
    critical_count: int
    moderate_count: int
    minor_count: int
    overall_impact_summary: str


class BKTUpdateRequest(BaseModel):
    concept_id: str
    is_correct: bool
    response_time_seconds: Optional[float] = None


class BKTUpdateResponse(BaseModel):
    concept_id: str
    prior_mastery: float
    posterior_mastery: float
    mastery_level: Literal["Novice", "Developing", "Proficient", "Mastered"]
    delta: float
    learned_transition_occurred: bool
