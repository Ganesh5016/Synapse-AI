"""
Pydantic v2 schemas for Multidimensional Learning Analytics & Weekly Reports.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone


class SubjectMasteryRadar(BaseModel):
    subject_id: str
    subject_name: str
    score: float
    retention_rate: float
    concept_count: int
    color: str


class CognitiveLoadTrajectory(BaseModel):
    day: str
    date_label: str
    mastery: float
    retention: float
    cognitive_load: float
    questions_attempted: int
    minutes_studied: int


class LearningVelocityMetrics(BaseModel):
    weekly_study_minutes: int
    active_streak_days: int
    retention_average: float
    mastered_nodes_count: int
    in_progress_nodes_count: int
    total_due_flashcards: int
    bkt_average_p_know: float


class AnalyticsOverviewResponse(BaseModel):
    metrics: LearningVelocityMetrics
    radar_distribution: List[SubjectMasteryRadar]
    trajectory_7d: List[CognitiveLoadTrajectory]
    generated_at: datetime


class WeeklySynthesisReport(BaseModel):
    report_id: str
    week_label: str
    generated_at: datetime
    study_time_hours: float
    questions_answered: int
    cards_reviewed: int
    overall_accuracy: float
    breakthrough_concepts: List[str]
    urgent_gaps: List[str]
    recommended_focus: str
    summary_ai_narrative: str
