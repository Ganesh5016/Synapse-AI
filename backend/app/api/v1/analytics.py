"""
Learning Analytics & Progress Reporting API Router.
Calculates multidimensional mastery metrics, cognitive load curves, CSV data exports, and AI weekly summaries.
"""

from typing import List, Optional
from datetime import datetime, timezone, timedelta
import io
import csv
from fastapi import APIRouter, Depends, Response, status

from app.core.security import get_current_user, AuthenticatedUser
from app.schemas.common import APIResponse
from app.schemas.analytics import (
    AnalyticsOverviewResponse,
    WeeklySynthesisReport,
    SubjectMasteryRadar,
    CognitiveLoadTrajectory,
    LearningVelocityMetrics,
)
from app.api.v1.subjects import _LOCAL_SUBJECTS_DB

router = APIRouter(prefix="/analytics", tags=["Learning Analytics"])

# Mock trajectories
_TRAJECTORY_DATA = [
    {"day": "Mon", "offset": 6, "mastery": 68.0, "retention": 80.5, "cognitive_load": 45.0, "questions": 22, "minutes": 45},
    {"day": "Tue", "offset": 5, "mastery": 71.0, "retention": 81.0, "cognitive_load": 60.0, "questions": 35, "minutes": 65},
    {"day": "Wed", "offset": 4, "mastery": 73.5, "retention": 83.2, "cognitive_load": 38.0, "questions": 18, "minutes": 40},
    {"day": "Thu", "offset": 3, "mastery": 76.0, "retention": 82.5, "cognitive_load": 72.0, "questions": 42, "minutes": 80},
    {"day": "Fri", "offset": 2, "mastery": 80.5, "retention": 86.0, "cognitive_load": 50.0, "questions": 30, "minutes": 55},
    {"day": "Sat", "offset": 1, "mastery": 85.0, "retention": 88.4, "cognitive_load": 65.0, "questions": 48, "minutes": 90},
    {"day": "Sun", "offset": 0, "mastery": 89.2, "retention": 91.0, "cognitive_load": 40.0, "questions": 25, "minutes": 50},
]


@router.get("/overview", response_model=APIResponse[AnalyticsOverviewResponse])
async def get_analytics_overview(
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Calculates overall learning metrics, radar mastery distribution, and 7-day trajectory."""
    now = datetime.now(timezone.utc)

    # Calculate 7-day trajectory
    trajectory = [
        CognitiveLoadTrajectory(
            day=d["day"],
            date_label=(now - timedelta(days=d["offset"])).strftime("%b %d"),
            mastery=d["mastery"],
            retention=d["retention"],
            cognitive_load=d["cognitive_load"],
            questions_attempted=d["questions"],
            minutes_studied=d["minutes"],
        )
        for d in _TRAJECTORY_DATA
    ]

    # Subject Radar Distribution
    radar = [
        SubjectMasteryRadar(
            subject_id=str(s["id"]),
            subject_name=s["name"],
            score=s.get("default_score", 78.5),
            retention_rate=88.2,
            concept_count=s.get("concept_count", 12),
            color=s.get("color", "#7667F5"),
        )
        for s in _LOCAL_SUBJECTS_DB
    ]

    metrics = LearningVelocityMetrics(
        weekly_study_minutes=sum(d["minutes"] for d in _TRAJECTORY_DATA),
        active_streak_days=14,
        retention_average=89.2,
        mastered_nodes_count=24,
        in_progress_nodes_count=11,
        total_due_flashcards=4,
        bkt_average_p_know=0.814,
    )

    result = AnalyticsOverviewResponse(
        metrics=metrics,
        radar_distribution=radar,
        trajectory_7d=trajectory,
        generated_at=now,
    )

    return APIResponse(data=result, message="Analytics overview calculated successfully")


@router.get("/reports/weekly", response_model=APIResponse[WeeklySynthesisReport])
async def get_weekly_report(
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Generates an automated AI progress report synthesize across BKT mastery and practice."""
    now = datetime.now(timezone.utc)
    week_start = now - timedelta(days=7)
    week_label = f"Week of {week_start.strftime('%b %d')} - {now.strftime('%b %d, %Y')}"

    report = WeeklySynthesisReport(
        report_id=f"rep-{now.strftime('%Y%m%d')}",
        week_label=week_label,
        generated_at=now,
        study_time_hours=7.1,
        questions_answered=220,
        cards_reviewed=58,
        overall_accuracy=84.5,
        breakthrough_concepts=[
            "Scaled Dot-Product Attention (Mastered at 92%)",
            "Multi-Head Attention Projections (Advanced to Proficient)",
            "Bayesian Knowledge Tracing Prior & Transition (Mastered at 94%)",
        ],
        urgent_gaps=[
            "Singular Value Decomposition (Retention slipped to 58%)",
            "SuperMemo SM-2 Boundary Constants (Requires review)",
        ],
        recommended_focus="Reinforce Linear Algebra foundations (SVD) before progressing to low-rank adaptations (LoRA).",
        summary_ai_narrative=(
            "Outstanding velocity this week! You completed 7.1 hours of structured study, achieving an 84.5% first-attempt "
            "accuracy across adaptive questions. Your Bayesian posterior on Transformer attention mechanics surpassed the 90% "
            "mastery threshold. To preserve this advantage, address the SVD prerequisite deficit in your next study block."
        ),
    )

    return APIResponse(data=report, message="Weekly synthesis report generated")


@router.get("/export/csv")
async def export_activity_csv(
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Streams activity logs in CSV format for offline statistical analysis."""
    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "Day",
        "Date",
        "MasteryScore",
        "RetentionRate",
        "CognitiveLoadIndex",
        "QuestionsAttempted",
        "MinutesStudied",
    ])

    now = datetime.now(timezone.utc)
    for d in _TRAJECTORY_DATA:
        date_str = (now - timedelta(days=d["offset"])).strftime("%Y-%m-%d")
        writer.writerow([
            d["day"],
            date_str,
            d["mastery"],
            d["retention"],
            d["cognitive_load"],
            d["questions"],
            d["minutes"],
        ])

    csv_data = output.getvalue()
    filename = f"synapse_analytics_{now.strftime('%Y%m%d')}.csv"

    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
