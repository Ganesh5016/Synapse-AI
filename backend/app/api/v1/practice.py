"""
Practice Center API Router for Synapse.
Supports adaptive question retrieval, automatic grading, and BKT mastery feedback.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.security import get_current_user, AuthenticatedUser
from app.schemas.common import APIResponse
from app.schemas.practice import (
    PracticeQuestionResponse,
    PracticeSubmitRequest,
    PracticeSubmitResponse,
    PracticeSessionSummary,
)
from app.schemas.mastery import BKTUpdateResponse
from app.services.learning.bkt_engine import bkt_engine
from app.api.v1.concepts import _LOCAL_CONCEPTS_DB

router = APIRouter(prefix="/practice", tags=["Practice Center"])

# In-memory practice questions seed
_LOCAL_QUESTIONS_DB: List[Dict[str, Any]] = [
    {
        "id": "q-001",
        "concept_id": "c0000000-0000-0000-0000-000000000003",  # Scaled Dot-Product Attention
        "subject_id": "a0000000-0000-0000-0000-000000000001",
        "question_type": "multiple_choice",
        "prompt": "Why is the inner product QK^T scaled by 1/sqrt(d_k) in Transformer self-attention?",
        "options": [
            "To prevent dot products from pushing softmax into regions with vanishingly small gradients",
            "To reduce the matrix multiplication complexity from O(N^2) to linear time",
            "To normalize the positional encodings across variable sequence lengths",
            "To compute orthogonal projection matrices without learned parameter weights",
        ],
        "correct_answer": "To prevent dot products from pushing softmax into regions with vanishingly small gradients",
        "explanation": "For large projection dimensions d_k, the dot products grow large in magnitude, driving the softmax function into saturated regions where the gradient is near zero. Dividing by sqrt(d_k) stabilizes the variance of the dot products to 1.",
        "difficulty": "intermediate",
        "hint": "Consider the mathematical effect of large input values on the derivative of the softmax function.",
    },
    {
        "id": "q-002",
        "concept_id": "c0000000-0000-0000-0000-000000000003",
        "subject_id": "a0000000-0000-0000-0000-000000000001",
        "question_type": "true_false",
        "prompt": "True or False: In scaled dot-product attention, the keys (K) and values (V) must always share the exact same sequence length.",
        "options": ["True", "False"],
        "correct_answer": "True",
        "explanation": "Because the attention weights produced by QK^T multiply the Value matrix V along its sequence dimension, Keys and Values must correspond to the same number of tokens.",
        "difficulty": "intermediate",
        "hint": "Examine the matrix dimensions in Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V.",
    },
    {
        "id": "q-003",
        "concept_id": "c0000000-0000-0000-0000-000000000007",  # BKT
        "subject_id": "a0000000-0000-0000-0000-000000000005",
        "question_type": "multiple_choice",
        "prompt": "In Bayesian Knowledge Tracing, which parameter denotes the probability of answering correctly when the latent skill is NOT mastered?",
        "options": [
            "Guess parameter P(G)",
            "Slip parameter P(S)",
            "Transit parameter P(T)",
            "Prior parameter P(L0)",
        ],
        "correct_answer": "Guess parameter P(G)",
        "explanation": "P(G) is the guess probability representing a student guessing the correct answer despite not having mastered the latent skill. P(S) is slipping on a skill that is mastered.",
        "difficulty": "beginner",
        "hint": "This parameter accounts for lucky guesses on multiple choice assessments.",
    },
    {
        "id": "q-004",
        "concept_id": "c0000000-0000-0000-0000-000000000008",  # SM-2
        "subject_id": "a0000000-0000-0000-0000-000000000005",
        "question_type": "multiple_choice",
        "prompt": "What is the lower bound enforced on the Easiness Factor (EF) in the SuperMemo SM-2 algorithm?",
        "options": [
            "1.3",
            "1.0",
            "2.5",
            "0.5",
        ],
        "correct_answer": "1.3",
        "explanation": "In SM-2, EF is bounded from below at 1.3 to avoid interval stagnation or infinite decay for challenging cards.",
        "difficulty": "intermediate",
        "hint": "The standard formula clamps EF to be at least this value greater than 1.0.",
    },
    {
        "id": "q-005",
        "concept_id": "c0000000-0000-0000-0000-000000000002",  # Gradient Descent
        "subject_id": "a0000000-0000-0000-0000-000000000001",
        "question_type": "multiple_choice",
        "prompt": "In gradient descent, what happens if the learning rate is set excessively high?",
        "options": [
            "The optimization can diverge and overshoot the loss minimum",
            "The model guarantees convergence in a single epoch",
            "The analytical gradient updates decay to zero prematurely",
            "The Hessian matrix eigenvalues collapse to zero",
        ],
        "correct_answer": "The optimization can diverge and overshoot the loss minimum",
        "explanation": "Excessively high learning rates cause parameter updates to oscillate wildly, potentially diverging to infinity.",
        "difficulty": "beginner",
        "hint": "Think about step size along a steep convex bowl.",
    },
]


@router.get("/questions", response_model=APIResponse[List[PracticeQuestionResponse]])
async def get_practice_questions(
    concept_id: Optional[str] = None,
    subject_id: Optional[str] = None,
    difficulty: Optional[str] = None,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Retrieves practice questions filtered by concept, subject, or difficulty."""
    concepts_map = {c["id"]: c["name"] for c in _LOCAL_CONCEPTS_DB}

    filtered = _LOCAL_QUESTIONS_DB
    if concept_id:
        filtered = [q for q in filtered if q["concept_id"] == concept_id]
    if subject_id and subject_id != "all":
        filtered = [q for q in filtered if q["subject_id"] == subject_id]
    if difficulty:
        filtered = [q for q in filtered if q["difficulty"] == difficulty]

    results: List[PracticeQuestionResponse] = [
        PracticeQuestionResponse(
            id=q["id"],
            concept_id=q["concept_id"],
            concept_name=concepts_map.get(q["concept_id"], "Machine Learning"),
            subject_id=q["subject_id"],
            question_type=q["question_type"],
            prompt=q["prompt"],
            options=q.get("options"),
            correct_answer=q["correct_answer"],
            explanation=q["explanation"],
            difficulty=q["difficulty"],
            hint=q.get("hint"),
        )
        for q in filtered
    ]

    return APIResponse(data=results, message=f"Retrieved {len(results)} practice questions")


@router.post("/submit", response_model=APIResponse[PracticeSubmitResponse])
async def submit_practice_answer(
    payload: PracticeSubmitRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """
    Submits user answer to a question, grades it, and updates BKT concept mastery.
    """
    question = next((q for q in _LOCAL_QUESTIONS_DB if q["id"] == payload.question_id), None)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    is_correct = payload.selected_answer.strip().lower() == question["correct_answer"].strip().lower()

    # Apply Bayesian Knowledge Tracing update
    concept = next((c for c in _LOCAL_CONCEPTS_DB if c["id"] == question["concept_id"]), None)
    prior = float(concept.get("mastery_score", 0.50)) if concept else 0.50

    _, posterior, level = bkt_engine.update_mastery(
        current_p_know=prior,
        is_correct=is_correct,
    )

    if concept:
        concept["mastery_score"] = posterior
        concept["mastery_level"] = level
        concept["updated_at"] = datetime.now(timezone.utc)

    delta = round(posterior - prior, 4)
    score = 100 if is_correct else 20

    bkt_resp = BKTUpdateResponse(
        concept_id=question["concept_id"],
        prior_mastery=prior,
        posterior_mastery=posterior,
        mastery_level=level,
        delta=delta,
        learned_transition_occurred=delta > 0.05,
    )

    resp = PracticeSubmitResponse(
        is_correct=is_correct,
        user_answer=payload.selected_answer,
        correct_answer=question["correct_answer"],
        explanation=question["explanation"],
        score_earned=score,
        bkt_update=bkt_resp,
    )

    return APIResponse(
        data=resp,
        message="Correct answer!" if is_correct else "Incorrect answer. Review explanation.",
    )
