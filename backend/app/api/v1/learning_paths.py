"""
Learning Paths API Router for Synapse.
Provides personalized curriculum pathways, milestone progress tracking, and step toggling.
"""

from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_current_user, AuthenticatedUser
from app.schemas.common import APIResponse
from app.schemas.learning_paths import (
    LearningPathResponse,
    LearningPathGenerateRequest,
)
from app.services.learning.path_generator import path_generator

router = APIRouter(prefix="/learning-paths", tags=["Learning Paths"])

# In-memory store
_LOCAL_PATHS_DB: List[LearningPathResponse] = []


def _ensure_seed_path():
    if not _LOCAL_PATHS_DB:
        default_path = path_generator.generate_path(
            subject_id=None,
            goal="Master Transformer Attention & Bayesian Models",
        )
        _LOCAL_PATHS_DB.append(default_path)


_ensure_seed_path()


@router.get("", response_model=APIResponse[List[LearningPathResponse]])
async def list_learning_paths(
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Retrieves all active learning paths for the user."""
    _ensure_seed_path()
    return APIResponse(data=_LOCAL_PATHS_DB, message=f"Retrieved {len(_LOCAL_PATHS_DB)} learning paths")


@router.post("/generate", response_model=APIResponse[LearningPathResponse], status_code=status.HTTP_201_CREATED)
async def generate_new_learning_path(
    payload: LearningPathGenerateRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Generates an AI personalized learning path sequenced by prerequisite dependencies."""
    new_path = path_generator.generate_path(
        subject_id=payload.subject_id,
        goal=payload.goal or "Master Curriculum Concepts",
        target_mastery=payload.target_mastery,
    )
    _LOCAL_PATHS_DB.insert(0, new_path)
    return APIResponse(data=new_path, message="Personalized learning path generated")


@router.put("/{path_id}/steps/{step_id}", response_model=APIResponse[LearningPathResponse])
async def toggle_step_completion(
    path_id: str,
    step_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Toggles milestone completion status for a step in a learning path."""
    target_path = next((p for p in _LOCAL_PATHS_DB if p.id == path_id), None)
    if not target_path:
        raise HTTPException(status_code=404, detail="Learning path not found")

    step = next((s for s in target_path.steps if s.step_id == step_id), None)
    if not step:
        raise HTTPException(status_code=404, detail="Step not found")

    step.is_completed = not step.is_completed

    # Recalculate progress
    comp = sum(1 for s in target_path.steps if s.is_completed)
    target_path.completed_steps = comp
    target_path.progress_percentage = round((comp / len(target_path.steps)) * 100, 1)
    target_path.updated_at = datetime.now(timezone.utc)

    return APIResponse(data=target_path, message=f"Step {step_id} status updated")
