"""
Mastery & Bayesian Knowledge Tracing (BKT) Router for Synapse.
Provides endpoints for mastery dashboards, real-time BKT probability updates,
and automated knowledge gap diagnostics.
"""

from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_current_user, AuthenticatedUser
from app.schemas.common import APIResponse
from app.schemas.mastery import (
    MasteryOverviewResponse,
    SubjectMasterySummary,
    ConceptMasteryItem,
    KnowledgeGapsResponse,
    BKTUpdateRequest,
    BKTUpdateResponse,
)
from app.services.learning.bkt_engine import bkt_engine
from app.services.learning.gap_detector import gap_detector
from app.api.v1.concepts import _LOCAL_CONCEPTS_DB
from app.api.v1.subjects import _LOCAL_SUBJECTS_DB

router = APIRouter(prefix="/mastery", tags=["Learning Intelligence & Mastery"])


@router.get("", response_model=APIResponse[MasteryOverviewResponse])
async def get_mastery_overview(
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Returns aggregated mastery statistics across subjects and concepts."""
    subjects_map = {str(s["id"]): s for s in _LOCAL_SUBJECTS_DB}

    concept_items: List[ConceptMasteryItem] = []
    total_mastery_sum = 0.0

    for c in _LOCAL_CONCEPTS_DB:
        m_score = float(c.get("mastery_score", 0.50))
        total_mastery_sum += m_score
        sid = str(c["subject_id"])
        s_obj = subjects_map.get(sid, {"name": "Computer Science", "color": "#4F46E5"})
        
        # Calculate attempts and accuracy estimates
        attempts = 6 if m_score > 0.70 else (4 if m_score > 0.50 else 2)
        correct = int(attempts * m_score)

        concept_items.append(
            ConceptMasteryItem(
                concept_id=c["id"],
                concept_name=c["name"],
                subject_id=sid,
                subject_name=s_obj.get("name", "Computer Science"),
                p_know=m_score,
                mastery_level=c.get("mastery_level", "Developing"),
                attempts_count=attempts,
                correct_count=correct,
                accuracy_rate=round(m_score, 2),
                last_practiced_at=c.get("updated_at"),
                decay_risk="Low" if m_score >= 0.75 else ("Medium" if m_score >= 0.50 else "High"),
            )
        )

    # Subject summaries
    subject_summaries: List[SubjectMasterySummary] = []
    for sid, s_obj in subjects_map.items():
        s_concepts = [c for c in _LOCAL_CONCEPTS_DB if str(c["subject_id"]) == sid]
        if s_concepts:
            avg_m = sum(c["mastery_score"] for c in s_concepts) / len(s_concepts)
            mastered = sum(1 for c in s_concepts if c["mastery_score"] >= 0.85)
            developing = sum(1 for c in s_concepts if 0.40 <= c["mastery_score"] < 0.85)
            novice = sum(1 for c in s_concepts if c["mastery_score"] < 0.40)

            subject_summaries.append(
                SubjectMasterySummary(
                    subject_id=sid,
                    subject_name=s_obj.get("name", "Subject"),
                    subject_color=s_obj.get("color", "#4F46E5"),
                    average_mastery=round(avg_m, 2),
                    total_concepts=len(s_concepts),
                    mastered_count=mastered,
                    developing_count=developing,
                    novice_count=novice,
                )
            )

    overall_m = round(total_mastery_sum / max(1, len(_LOCAL_CONCEPTS_DB)), 2)
    mastered_cnt = sum(1 for c in _LOCAL_CONCEPTS_DB if c.get("mastery_score", 0) >= 0.85)

    gaps = gap_detector.detect_gaps(str(current_user.id))

    return APIResponse(
        data=MasteryOverviewResponse(
            overall_mastery=overall_m,
            retention_health=0.86,
            total_concepts=len(_LOCAL_CONCEPTS_DB),
            mastered_concepts=mastered_cnt,
            active_gaps_count=len(gaps.gaps),
            subjects=subject_summaries,
            concept_mastery=concept_items,
        ),
        message="Mastery overview calculated",
    )


@router.post("/update", response_model=APIResponse[BKTUpdateResponse])
async def update_bkt_mastery(
    payload: BKTUpdateRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """
    Updates latent mastery probability P(L_t) using Bayesian Knowledge Tracing.
    Invoked upon submitting a practice attempt.
    """
    concept = next((c for c in _LOCAL_CONCEPTS_DB if c["id"] == payload.concept_id), None)
    if not concept:
        raise HTTPException(status_code=404, detail="Concept not found")

    prior = float(concept.get("mastery_score", 0.50))
    _, posterior, level = bkt_engine.update_mastery(
        current_p_know=prior,
        is_correct=payload.is_correct,
    )

    concept["mastery_score"] = posterior
    concept["mastery_level"] = level
    concept["updated_at"] = datetime.now(timezone.utc)

    delta = round(posterior - prior, 4)

    return APIResponse(
        data=BKTUpdateResponse(
            concept_id=payload.concept_id,
            prior_mastery=prior,
            posterior_mastery=posterior,
            mastery_level=level,
            delta=delta,
            learned_transition_occurred=delta > 0.05,
        ),
        message=f"BKT updated: {int(prior*100)}% -> {int(posterior*100)}% ({level})",
    )


@router.get("/gaps", response_model=APIResponse[KnowledgeGapsResponse])
async def get_knowledge_gaps(
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """
    Runs automated gap detection over prerequisite chains and recent practice error rates.
    """
    diagnostics = gap_detector.detect_gaps(str(current_user.id))
    return APIResponse(data=diagnostics, message="Knowledge gaps detected")
