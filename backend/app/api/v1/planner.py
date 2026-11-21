"""
Study Planner & Revision Calendar API Router.
Provides session scheduling, revision blocks, agenda views, and completion tracking.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.security import get_current_user, AuthenticatedUser
from app.schemas.common import APIResponse
from app.schemas.planner import (
    StudySessionResponse,
    StudySessionCreateRequest,
    StudySessionUpdateRequest,
    CalendarAgendaEvent,
)
from app.api.v1.subjects import _LOCAL_SUBJECTS_DB
from app.api.v1.concepts import _LOCAL_CONCEPTS_DB

router = APIRouter(prefix="/planner", tags=["Study Planner & Calendar"])

# Seed in-memory study sessions
_NOW = datetime.now(timezone.utc)
_TODAY_MORNING = _NOW.replace(hour=9, minute=0, second=0, microsecond=0)

_LOCAL_SESSIONS_DB: List[Dict[str, Any]] = [
    {
        "id": "sess-01",
        "title": "Transformer Scaled Dot-Product Deep Dive",
        "description": "Work through query-key dimension scaling and softmax variance derivations.",
        "subject_id": "a0000000-0000-0000-0000-000000000001",
        "concept_id": "c0000000-0000-0000-0000-000000000003",
        "session_type": "deep_work",
        "scheduled_start": _TODAY_MORNING + timedelta(hours=1),
        "duration_minutes": 60,
        "is_completed": True,
        "completed_at": _TODAY_MORNING + timedelta(hours=2),
        "difficulty": "intermediate",
        "target_questions_count": 8,
        "notes": "Focused on why 1/sqrt(d_k) prevents vanishing softmax gradients.",
        "created_at": _NOW - timedelta(days=2),
        "updated_at": _NOW,
    },
    {
        "id": "sess-02",
        "title": "Daily SM-2 Active Recall Flashcard Queue",
        "description": "Clear spaced repetition cards due for Cognitive Science and ML formulas.",
        "subject_id": "a0000000-0000-0000-0000-000000000005",
        "concept_id": "c0000000-0000-0000-0000-000000000008",
        "session_type": "spaced_review",
        "scheduled_start": _TODAY_MORNING + timedelta(hours=4),
        "duration_minutes": 30,
        "is_completed": False,
        "completed_at": None,
        "difficulty": "beginner",
        "target_cards_count": 14,
        "notes": "Target: achieve >= 90% recall quality score.",
        "created_at": _NOW - timedelta(days=1),
        "updated_at": _NOW,
    },
    {
        "id": "sess-03",
        "title": "Remediation: Singular Value Decomposition (SVD)",
        "description": "Prerequisite blocker remediation for multi-head subspace projections.",
        "subject_id": "a0000000-0000-0000-0000-000000000002",
        "concept_id": "c0000000-0000-0000-0000-000000000001",
        "session_type": "diagnostic_quiz",
        "scheduled_start": _TODAY_MORNING + timedelta(days=1, hours=2),
        "duration_minutes": 45,
        "is_completed": False,
        "completed_at": None,
        "difficulty": "intermediate",
        "target_questions_count": 6,
        "notes": "Address critical knowledge gap identified by BKT diagnostic.",
        "created_at": _NOW,
        "updated_at": _NOW,
    },
    {
        "id": "sess-04",
        "title": "Attention Is All You Need — Paper Deconstruction",
        "description": "Read multi-head attention section and map key equations to research notes.",
        "subject_id": "a0000000-0000-0000-0000-000000000001",
        "concept_id": "c0000000-0000-0000-0000-000000000003",
        "session_type": "paper_reading",
        "scheduled_start": _TODAY_MORNING + timedelta(days=2, hours=5),
        "duration_minutes": 90,
        "is_completed": False,
        "completed_at": None,
        "difficulty": "advanced",
        "target_questions_count": None,
        "notes": "Annotate figures 1 and 2 in notes editor.",
        "created_at": _NOW,
        "updated_at": _NOW,
    },
]


def _format_session(s: dict) -> StudySessionResponse:
    subjects_map = {str(sub["id"]): sub for sub in _LOCAL_SUBJECTS_DB}
    concepts_map = {c["id"]: c["name"] for c in _LOCAL_CONCEPTS_DB}

    sub = subjects_map.get(s.get("subject_id") or "", {"name": "General", "color": "#7667F5"})
    c_name = concepts_map.get(s.get("concept_id") or "")

    return StudySessionResponse(
        id=s["id"],
        title=s["title"],
        description=s.get("description"),
        subject_id=s.get("subject_id"),
        subject_name=sub.get("name", "General"),
        subject_color=sub.get("color", "#7667F5"),
        concept_id=s.get("concept_id"),
        concept_name=c_name,
        session_type=s.get("session_type", "deep_work"),
        scheduled_start=s["scheduled_start"],
        duration_minutes=s["duration_minutes"],
        is_completed=s["is_completed"],
        completed_at=s.get("completed_at"),
        difficulty=s.get("difficulty", "intermediate"),
        target_cards_count=s.get("target_cards_count"),
        target_questions_count=s.get("target_questions_count"),
        notes=s.get("notes"),
        created_at=s["created_at"],
        updated_at=s["updated_at"],
    )


@router.get("/sessions", response_model=APIResponse[List[StudySessionResponse]])
async def list_study_sessions(
    is_completed: Optional[bool] = None,
    subject_id: Optional[str] = None,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Lists study sessions with optional completion or subject filter."""
    filtered = [
        s for s in _LOCAL_SESSIONS_DB
        if not s.get("user_id") or str(s["user_id"]) == str(current_user.id)
    ]
    if is_completed is not None:
        filtered = [s for s in filtered if s["is_completed"] == is_completed]
    if subject_id:
        filtered = [s for s in filtered if s.get("subject_id") == subject_id]

    # Sort chronologically
    sorted_sessions = sorted(filtered, key=lambda s: s["scheduled_start"])
    results = [_format_session(s) for s in sorted_sessions]
    return APIResponse(data=results, message=f"Retrieved {len(results)} study sessions")


@router.post("/sessions", response_model=APIResponse[StudySessionResponse], status_code=status.HTTP_201_CREATED)
async def create_study_session(
    payload: StudySessionCreateRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Schedules a new study session or revision block."""
    new_id = f"sess-{len(_LOCAL_SESSIONS_DB) + 1:02d}"
    now = datetime.now(timezone.utc)

    session_record = {
        "id": new_id,
        "user_id": str(current_user.id),
        "title": payload.title,
        "description": payload.description,
        "subject_id": payload.subject_id,
        "concept_id": payload.concept_id,
        "session_type": payload.session_type,
        "scheduled_start": payload.scheduled_start,
        "duration_minutes": payload.duration_minutes,
        "is_completed": False,
        "completed_at": None,
        "difficulty": payload.difficulty,
        "target_cards_count": payload.target_cards_count,
        "target_questions_count": payload.target_questions_count,
        "notes": payload.notes,
        "created_at": now,
        "updated_at": now,
    }

    _LOCAL_SESSIONS_DB.append(session_record)
    result = _format_session(session_record)
    return APIResponse(data=result, message="Study session scheduled successfully")


@router.get("/upcoming", response_model=APIResponse[List[StudySessionResponse]])
async def get_upcoming_sessions(
    limit: int = Query(default=5, ge=1, le=20),
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Returns upcoming incomplete study sessions ordered by scheduled time."""
    uncompleted = [s for s in _LOCAL_SESSIONS_DB if not s["is_completed"]]
    sorted_uncompleted = sorted(uncompleted, key=lambda s: s["scheduled_start"])[:limit]
    results = [_format_session(s) for s in sorted_uncompleted]
    return APIResponse(data=results, message=f"Retrieved {len(results)} upcoming study sessions")


@router.get("/agenda", response_model=APIResponse[List[CalendarAgendaEvent]])
async def get_calendar_agenda(
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Returns calendar agenda events for rendering on day/week/month schedule grids."""
    subjects_map = {str(sub["id"]): sub for sub in _LOCAL_SUBJECTS_DB}
    events = []

    for s in _LOCAL_SESSIONS_DB:
        sub = subjects_map.get(s.get("subject_id") or "", {"name": "General", "color": "#7667F5"})
        end_time = s["scheduled_start"] + timedelta(minutes=s["duration_minutes"])
        events.append(
            CalendarAgendaEvent(
                id=s["id"],
                title=s["title"],
                start=s["scheduled_start"],
                end=end_time,
                session_type=s.get("session_type", "deep_work"),
                subject_name=sub.get("name", "General"),
                subject_color=sub.get("color", "#7667F5"),
                is_completed=s["is_completed"],
            )
        )

    return APIResponse(data=events, message=f"Retrieved {len(events)} calendar events")


@router.put("/sessions/{session_id}", response_model=APIResponse[StudySessionResponse])
async def update_study_session(
    session_id: str,
    payload: StudySessionUpdateRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Updates time, notes, or completion status of a study session."""
    target = next((s for s in _LOCAL_SESSIONS_DB if s["id"] == session_id), None)
    if not target:
        raise HTTPException(status_code=404, detail="Study session not found")

    if target.get("user_id") and str(target["user_id"]) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Forbidden: You cannot modify another user's session")

    now = datetime.now(timezone.utc)
    if payload.title is not None:
        target["title"] = payload.title
    if payload.scheduled_start is not None:
        target["scheduled_start"] = payload.scheduled_start
    if payload.duration_minutes is not None:
        target["duration_minutes"] = payload.duration_minutes
    if payload.notes is not None:
        target["notes"] = payload.notes
    if payload.is_completed is not None:
        target["is_completed"] = payload.is_completed
        target["completed_at"] = now if payload.is_completed else None

    target["updated_at"] = now
    result = _format_session(target)
    return APIResponse(data=result, message="Study session updated")


@router.delete("/sessions/{session_id}", response_model=APIResponse[dict])
async def delete_study_session(
    session_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Deletes or cancels a study session."""
    global _LOCAL_SESSIONS_DB
    existing = next((s for s in _LOCAL_SESSIONS_DB if s["id"] == session_id), None)
    if not existing:
        raise HTTPException(status_code=404, detail="Study session not found")

    if existing.get("user_id") and str(existing["user_id"]) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Forbidden: You cannot delete another user's session")

    _LOCAL_SESSIONS_DB = [s for s in _LOCAL_SESSIONS_DB if s["id"] != session_id]
    return APIResponse(data={"deleted_id": session_id}, message="Study session removed")
