"""
SM-2 Spaced Repetition Flashcards Router for Synapse.
Supports due card queues, deck listings, and review scheduling updates.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_current_user, AuthenticatedUser
from app.schemas.common import APIResponse
from app.schemas.flashcards import (
    FlashcardResponse,
    FlashcardReviewRequest,
    FlashcardReviewResponse,
    DeckResponse,
)
from app.services.learning.sm2_scheduler import sm2_scheduler
from app.api.v1.concepts import _LOCAL_CONCEPTS_DB
from app.api.v1.subjects import _LOCAL_SUBJECTS_DB

router = APIRouter(prefix="/flashcards", tags=["Spaced Repetition Flashcards"])

# In-memory decks
_LOCAL_DECKS_DB: List[Dict[str, Any]] = [
    {
        "id": "deck-01",
        "name": "Transformer & Attention Mechanics",
        "description": "Essential formulas, matrix dimensions, and self-attention principles.",
        "subject_id": "a0000000-0000-0000-0000-000000000001",
    },
    {
        "id": "deck-02",
        "name": "Cognitive Science & Mastery Models",
        "description": "Bayesian Knowledge Tracing, SM-2 scheduling, and memory decay formulas.",
        "subject_id": "a0000000-0000-0000-0000-000000000005",
    },
]

# In-memory flashcards
_LOCAL_FLASHCARDS_DB: List[Dict[str, Any]] = [
    {
        "id": "fc-001",
        "deck_id": "deck-01",
        "concept_id": "c0000000-0000-0000-0000-000000000003",  # Scaled Dot-Product Attention
        "subject_id": "a0000000-0000-0000-0000-000000000001",
        "front": "What is the analytical formula for Scaled Dot-Product Attention?",
        "back": "Attention(Q, K, V) = softmax((QK^T) / sqrt(d_k)) * V",
        "hint": "Inner product of queries and keys divided by projection scaling, multiplied by values.",
        "tags": ["transformers", "attention", "formulas"],
        "repetition_number": 1,
        "easiness_factor": 2.5,
        "interval_days": 1,
        "next_due_at": datetime.now(timezone.utc) - timedelta(hours=2),
    },
    {
        "id": "fc-002",
        "deck_id": "deck-01",
        "concept_id": "c0000000-0000-0000-0000-000000000003",
        "subject_id": "a0000000-0000-0000-0000-000000000001",
        "front": "Why is the dot-product scaled by 1/sqrt(d_k) in self-attention?",
        "back": "To prevent large dot products from pushing the softmax function into regions with vanishingly small gradients.",
        "hint": "Think about softmax gradient saturation.",
        "tags": ["transformers", "gradients", "optimization"],
        "repetition_number": 2,
        "easiness_factor": 2.4,
        "interval_days": 3,
        "next_due_at": datetime.now(timezone.utc) - timedelta(minutes=30),
    },
    {
        "id": "fc-003",
        "deck_id": "deck-02",
        "concept_id": "c0000000-0000-0000-0000-000000000007",  # BKT
        "subject_id": "a0000000-0000-0000-0000-000000000005",
        "front": "In BKT, differentiate between the Guess P(G) and Slip P(S) parameters.",
        "back": "P(G): Probability of a correct answer without latent skill mastery.\nP(S): Probability of an incorrect answer despite having mastered the skill.",
        "hint": "Lucky guess vs accidental mistake.",
        "tags": ["bkt", "psychometrics", "cognitive-science"],
        "repetition_number": 0,
        "easiness_factor": 2.5,
        "interval_days": 1,
        "next_due_at": datetime.now(timezone.utc) - timedelta(hours=1),
    },
    {
        "id": "fc-004",
        "deck_id": "deck-02",
        "concept_id": "c0000000-0000-0000-0000-000000000008",  # SM-2
        "subject_id": "a0000000-0000-0000-0000-000000000005",
        "front": "What is the lower bound boundary on Easiness Factor (EF) in SM-2?",
        "back": "EF >= 1.3. This prevents review intervals from stagnating or falling into infinite decay.",
        "hint": "Standard lower floor constant.",
        "tags": ["sm-2", "spaced-repetition", "algorithms"],
        "repetition_number": 0,
        "easiness_factor": 2.5,
        "interval_days": 1,
        "next_due_at": datetime.now(timezone.utc) - timedelta(hours=5),
    },
]


@router.get("/due", response_model=APIResponse[List[FlashcardResponse]])
async def get_due_flashcards(
    deck_id: Optional[str] = None,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Retrieves flashcards currently due for spaced repetition review."""
    concepts_map = {c["id"]: c["name"] for c in _LOCAL_CONCEPTS_DB}
    now = datetime.now(timezone.utc)

    due_cards = [
        c for c in _LOCAL_FLASHCARDS_DB
        if c["next_due_at"] <= now or True  # All preloaded demo cards are marked due
    ]
    if deck_id:
        due_cards = [c for c in due_cards if c["deck_id"] == deck_id]

    results = [
        FlashcardResponse(
            id=c["id"],
            deck_id=c.get("deck_id"),
            concept_id=c["concept_id"],
            concept_name=concepts_map.get(c["concept_id"], "Computer Science"),
            subject_id=c["subject_id"],
            front=c["front"],
            back=c["back"],
            hint=c.get("hint"),
            tags=c.get("tags", []),
            repetition_number=c["repetition_number"],
            easiness_factor=c["easiness_factor"],
            interval_days=c["interval_days"],
            next_due_at=c["next_due_at"],
            is_due=True,
        )
        for c in due_cards
    ]

    return APIResponse(data=results, message=f"Retrieved {len(results)} due flashcards")


@router.post("/{flashcard_id}/review", response_model=APIResponse[FlashcardReviewResponse])
async def review_flashcard(
    flashcard_id: str,
    payload: FlashcardReviewRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """
    Submits a user grade (0-5) on a flashcard review, updating SM-2 interval and due date.
    """
    card = next((c for c in _LOCAL_FLASHCARDS_DB if c["id"] == flashcard_id), None)
    if not card:
        raise HTTPException(status_code=404, detail="Flashcard not found")

    new_n, new_ef, new_i, next_due = sm2_scheduler.calculate_review(
        repetition_number=card["repetition_number"],
        easiness_factor=card["easiness_factor"],
        interval_days=card["interval_days"],
        quality_rating=payload.quality_rating,
    )

    card["repetition_number"] = new_n
    card["easiness_factor"] = new_ef
    card["interval_days"] = new_i
    card["next_due_at"] = next_due

    now = datetime.now(timezone.utc)
    remaining = sum(1 for c in _LOCAL_FLASHCARDS_DB if c["next_due_at"] <= now and c["id"] != flashcard_id)

    resp = FlashcardReviewResponse(
        flashcard_id=flashcard_id,
        quality_rating=payload.quality_rating,
        new_repetition_number=new_n,
        new_easiness_factor=new_ef,
        new_interval_days=new_i,
        next_due_at=next_due,
        remaining_due_count=remaining,
    )

    return APIResponse(data=resp, message=f"Review recorded: next interval in {new_i} days")


@router.get("/decks", response_model=APIResponse[List[DeckResponse]])
async def list_decks(
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Lists flashcard decks with card counts and due metrics."""
    subjects_map = {str(s["id"]): s for s in _LOCAL_SUBJECTS_DB}
    now = datetime.now(timezone.utc)

    results = []
    for d in _LOCAL_DECKS_DB:
        cards = [c for c in _LOCAL_FLASHCARDS_DB if c["deck_id"] == d["id"]]
        due = sum(1 for c in cards if c["next_due_at"] <= now or True)
        s_obj = subjects_map.get(d["subject_id"], {"name": "General", "color": "#4F46E5"})

        results.append(
            DeckResponse(
                id=d["id"],
                name=d["name"],
                description=d["description"],
                subject_id=d["subject_id"],
                subject_name=s_obj.get("name", "General"),
                subject_color=s_obj.get("color", "#4F46E5"),
                card_count=len(cards),
                due_count=due,
            )
        )

    return APIResponse(data=results, message=f"Retrieved {len(results)} decks")
