"""
Notes API Router for Synapse.
Supports CRUD, tag filtering, word count computation, and pinning.
"""

from typing import List, Optional
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Query, HTTPException, status

from app.core.security import get_current_user, AuthenticatedUser
from app.schemas.notes import NoteCreate, NoteUpdate, NoteResponse
from app.schemas.common import APIResponse

router = APIRouter(prefix="/notes", tags=["Notes"])

# In-memory store for fast local testing and fallback
_LOCAL_NOTES_DB: List[dict] = [
    {
        "id": "11111111-1111-1111-1111-111111111111",
        "user_id": "demo-user-1234-5678-90ab",
        "title": "Transformer Attention Mechanics & Dot-Product Scaling",
        "content_markdown": "# Transformer Attention\n\nAttention mechanisms compute a weighted sum of values based on query-key similarity.\n\n$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$\n\n## Key Components\n- Query matrix $Q$\n- Key matrix $K$\n- Value matrix $V$\n- Scaling factor $\\frac{1}{\\sqrt{d_k}}$ prevents vanishing gradients in softmax.",
        "subject_id": "a0000000-0000-0000-0000-000000000001",
        "is_pinned": True,
        "tags": ["machine-learning", "transformers", "attention"],
        "word_count": 48,
        "reading_time_minutes": 1,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "id": "22222222-2222-2222-2222-222222222222",
        "user_id": "demo-user-1234-5678-90ab",
        "title": "Bayesian Knowledge Tracing Posterior Derivations",
        "content_markdown": "# Bayesian Knowledge Tracing (BKT)\n\nBKT uses a two-state Hidden Markov Model to track mastery of latent skill $L$.\n\n- $P(L_0)$: Prior mastery probability\n- $P(T)$: Learning transition rate\n- $P(G)$: Guess probability\n- $P(S)$: Slip probability",
        "subject_id": "a0000000-0000-0000-0000-000000000005",
        "is_pinned": False,
        "tags": ["cognitive-science", "psychometrics", "bkt"],
        "word_count": 35,
        "reading_time_minutes": 1,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
]


def _compute_word_count(text: str) -> int:
    return len(text.split()) if text else 0


@router.get("", response_model=APIResponse[List[NoteResponse]])
async def list_notes(
    subject_id: Optional[uuid.UUID] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Lists all notes belonging to the authenticated user with optional filtering."""
    results = [n for n in _LOCAL_NOTES_DB if str(n["user_id"]) == str(current_user.id)]

    if subject_id:
        results = [n for n in results if str(n.get("subject_id")) == str(subject_id)]

    if tag:
        results = [n for n in results if tag.lower() in [t.lower() for t in n.get("tags", [])]]

    if search:
        s = search.lower()
        results = [n for n in results if s in n["title"].lower() or s in n["content_markdown"].lower()]

    # Sort pinned first, then updated_at descending
    results.sort(key=lambda x: (not x["is_pinned"], x["updated_at"]), reverse=True)

    return APIResponse(data=results, message="Notes retrieved successfully")


@router.post("", response_model=APIResponse[NoteResponse], status_code=status.HTTP_201_CREATED)
async def create_note(
    payload: NoteCreate,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Creates a new Markdown note for the authenticated user."""
    words = _compute_word_count(payload.content_markdown)
    new_note = {
        "id": uuid.uuid4(),
        "user_id": current_user.id,
        "title": payload.title,
        "content_markdown": payload.content_markdown,
        "subject_id": payload.subject_id,
        "is_pinned": payload.is_pinned,
        "tags": payload.tags,
        "word_count": words,
        "reading_time_minutes": max(1, words // 200),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    _LOCAL_NOTES_DB.append(new_note)
    return APIResponse(data=new_note, message="Note created successfully")


@router.get("/{note_id}", response_model=APIResponse[NoteResponse])
async def get_note(
    note_id: uuid.UUID,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Retrieves a single note by ID."""
    for n in _LOCAL_NOTES_DB:
        if str(n["id"]) == str(note_id) and str(n["user_id"]) == str(current_user.id):
            return APIResponse(data=n, message="Note retrieved")

    raise HTTPException(status_code=404, detail="Note not found")


@router.put("/{note_id}", response_model=APIResponse[NoteResponse])
async def update_note(
    note_id: uuid.UUID,
    payload: NoteUpdate,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Updates an existing note."""
    for n in _LOCAL_NOTES_DB:
        if str(n["id"]) == str(note_id) and str(n["user_id"]) == str(current_user.id):
            if payload.title is not None:
                n["title"] = payload.title
            if payload.content_markdown is not None:
                n["content_markdown"] = payload.content_markdown
                words = _compute_word_count(payload.content_markdown)
                n["word_count"] = words
                n["reading_time_minutes"] = max(1, words // 200)
            if payload.subject_id is not None:
                n["subject_id"] = payload.subject_id
            if payload.is_pinned is not None:
                n["is_pinned"] = payload.is_pinned
            if payload.tags is not None:
                n["tags"] = payload.tags
            n["updated_at"] = datetime.now(timezone.utc)
            return APIResponse(data=n, message="Note updated successfully")

    raise HTTPException(status_code=404, detail="Note not found")


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(
    note_id: uuid.UUID,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Deletes a note."""
    for i, n in enumerate(_LOCAL_NOTES_DB):
        if str(n["id"]) == str(note_id) and str(n["user_id"]) == str(current_user.id):
            _LOCAL_NOTES_DB.pop(i)
            return

    raise HTTPException(status_code=404, detail="Note not found")
