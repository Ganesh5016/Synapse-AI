"""
Project Knowledge Mapping Workspaces API Router.
Enables multi-modal workspaces aggregating research notes, documents, and concept subgraphs.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_current_user, AuthenticatedUser
from app.schemas.common import APIResponse
from app.schemas.projects import (
    ProjectWorkspaceResponse,
    ProjectWorkspaceCreateRequest,
    ProjectMilestoneToggleRequest,
    ProjectMilestone,
    ProjectResourceItem,
)
from app.api.v1.subjects import _LOCAL_SUBJECTS_DB

router = APIRouter(prefix="/projects", tags=["Project Workspaces"])

_NOW = datetime.now(timezone.utc)

# In-memory project workspaces
_LOCAL_PROJECTS_DB: List[Dict[str, Any]] = [
    {
        "id": "proj-01",
        "title": "Transformer Attention & Architectural Advancements",
        "description": "Comprehensive synthesis of scaled dot-product mechanics, multi-head projection subspaces, and FlashAttention I/O memory optimizations.",
        "subject_id": "a0000000-0000-0000-0000-000000000001",
        "status": "active",
        "due_date": _NOW + timedelta(days=14),
        "linked_notes": [
            {
                "id": "note-01",
                "title": "Scaled Dot-Product Mathematical Derivation",
                "type": "note",
                "metadata": {"tags": ["transformers", "equations"]},
            },
            {
                "id": "note-02",
                "title": "Memory Complexity Analysis (O(N^2) vs FlashAttention)",
                "type": "note",
                "metadata": {"tags": ["systems", "gpu-kernels"]},
            },
        ],
        "linked_documents": [
            {
                "id": "doc-01",
                "title": "Attention Is All You Need (Vaswani et al. 2017).pdf",
                "type": "paper",
                "metadata": {"pages": 15, "year": 2017},
            },
        ],
        "pinned_concepts": [
            {
                "id": "c0000000-0000-0000-0000-000000000003",
                "title": "Scaled Dot-Product Attention",
                "type": "concept",
                "metadata": {"mastery": 0.78, "difficulty": "intermediate"},
            },
            {
                "id": "c0000000-0000-0000-0000-000000000004",
                "title": "Multi-Head Attention",
                "type": "concept",
                "metadata": {"mastery": 0.65, "difficulty": "advanced"},
            },
        ],
        "milestones": [
            {
                "id": "m-01",
                "title": "Complete literature review of seminal attention papers",
                "is_completed": True,
                "due_date": _NOW - timedelta(days=2),
            },
            {
                "id": "m-02",
                "title": "Implement FlashAttention SRAM tile simulation in Python",
                "is_completed": False,
                "due_date": _NOW + timedelta(days=5),
            },
            {
                "id": "m-03",
                "title": "Pass adaptive practice diagnostic with >=85% score",
                "is_completed": False,
                "due_date": _NOW + timedelta(days=10),
            },
        ],
        "created_at": _NOW - timedelta(days=7),
        "updated_at": _NOW,
    },
    {
        "id": "proj-02",
        "title": "Cognitive Psychometrics & Bayesian Mastery",
        "description": "Exploration of knowledge tracing algorithms, Hidden Markov Models, and SuperMemo interval equations for intelligent tutoring systems.",
        "subject_id": "a0000000-0000-0000-0000-000000000005",
        "status": "active",
        "due_date": _NOW + timedelta(days=21),
        "linked_notes": [
            {
                "id": "note-03",
                "title": "BKT Expectation Maximization & Fit",
                "type": "note",
                "metadata": {"tags": ["psychometrics", "bkt"]},
            },
        ],
        "linked_documents": [],
        "pinned_concepts": [
            {
                "id": "c0000000-0000-0000-0000-000000000007",
                "title": "Bayesian Knowledge Tracing (BKT)",
                "type": "concept",
                "metadata": {"mastery": 0.88, "difficulty": "intermediate"},
            },
        ],
        "milestones": [
            {
                "id": "m-04",
                "title": "Derive Bayesian posterior update under guess and slip noise",
                "is_completed": True,
                "due_date": _NOW - timedelta(days=1),
            },
            {
                "id": "m-05",
                "title": "Benchmark SM-2 against empirical forgetting curves",
                "is_completed": False,
                "due_date": _NOW + timedelta(days=12),
            },
        ],
        "created_at": _NOW - timedelta(days=5),
        "updated_at": _NOW,
    },
]


def _format_project(p: dict) -> ProjectWorkspaceResponse:
    subjects_map = {str(sub["id"]): sub for sub in _LOCAL_SUBJECTS_DB}
    sub = subjects_map.get(p.get("subject_id") or "", {"name": "Machine Learning", "color": "#7667F5"})

    milestones = [
        ProjectMilestone(
            id=m["id"],
            title=m["title"],
            is_completed=m["is_completed"],
            due_date=m.get("due_date"),
        )
        for m in p.get("milestones", [])
    ]

    total_m = len(milestones)
    comp_m = sum(1 for m in milestones if m.is_completed)
    progress = round((comp_m / total_m) * 100, 1) if total_m > 0 else 0.0

    return ProjectWorkspaceResponse(
        id=p["id"],
        title=p["title"],
        description=p["description"],
        subject_id=p.get("subject_id"),
        subject_name=sub.get("name", "Machine Learning"),
        subject_color=sub.get("color", "#7667F5"),
        status=p.get("status", "active"),
        progress_percentage=progress,
        due_date=p.get("due_date"),
        linked_notes=[ProjectResourceItem(**n) for n in p.get("linked_notes", [])],
        linked_documents=[ProjectResourceItem(**d) for d in p.get("linked_documents", [])],
        pinned_concepts=[ProjectResourceItem(**c) for c in p.get("pinned_concepts", [])],
        milestones=milestones,
        created_at=p["created_at"],
        updated_at=p["updated_at"],
    )


@router.get("", response_model=APIResponse[List[ProjectWorkspaceResponse]])
async def list_projects(
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Retrieves all project workspaces for the authenticated user."""
    results = [
        _format_project(p)
        for p in _LOCAL_PROJECTS_DB
        if not p.get("user_id") or str(p["user_id"]) == str(current_user.id)
    ]
    return APIResponse(data=results, message=f"Retrieved {len(results)} project workspaces")


@router.post("", response_model=APIResponse[ProjectWorkspaceResponse], status_code=status.HTTP_201_CREATED)
async def create_project(
    payload: ProjectWorkspaceCreateRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Creates a new project knowledge workspace with linked resources and milestones."""
    new_id = f"proj-{len(_LOCAL_PROJECTS_DB) + 1:02d}"
    now = datetime.now(timezone.utc)

    milestones = [
        {"id": f"m-{new_id}-{i+1}", "title": title, "is_completed": False, "due_date": payload.due_date}
        for i, title in enumerate(payload.milestone_titles or ["Define project scope", "Synthesize findings"])
    ]

    record = {
        "id": new_id,
        "user_id": str(current_user.id),
        "title": payload.title,
        "description": payload.description,
        "subject_id": payload.subject_id,
        "status": "active",
        "due_date": payload.due_date or (now + timedelta(days=14)),
        "linked_notes": [],
        "linked_documents": [],
        "pinned_concepts": [],
        "milestones": milestones,
        "created_at": now,
        "updated_at": now,
    }

    _LOCAL_PROJECTS_DB.insert(0, record)
    result = _format_project(record)
    return APIResponse(data=result, message="Project workspace created successfully")


@router.get("/{project_id}", response_model=APIResponse[ProjectWorkspaceResponse])
async def get_project(
    project_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Gets a specific project workspace by ID."""
    p = next((proj for proj in _LOCAL_PROJECTS_DB if proj["id"] == project_id), None)
    if not p:
        raise HTTPException(status_code=404, detail="Project workspace not found")
    if p.get("user_id") and str(p["user_id"]) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Forbidden: You cannot access another user's project")
    return APIResponse(data=_format_project(p), message="Project workspace retrieved")


@router.put("/{project_id}/milestones/{milestone_id}", response_model=APIResponse[ProjectWorkspaceResponse])
async def toggle_project_milestone(
    project_id: str,
    milestone_id: str,
    payload: ProjectMilestoneToggleRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Toggles milestone completion status in a project."""
    p = next((proj for proj in _LOCAL_PROJECTS_DB if proj["id"] == project_id), None)
    if not p:
        raise HTTPException(status_code=404, detail="Project workspace not found")
    if p.get("user_id") and str(p["user_id"]) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Forbidden: You cannot modify another user's project")

    m = next((ms for ms in p.get("milestones", []) if ms["id"] == milestone_id), None)
    if not m:
        raise HTTPException(status_code=404, detail="Milestone not found")

    m["is_completed"] = payload.is_completed
    p["updated_at"] = datetime.now(timezone.utc)

    return APIResponse(data=_format_project(p), message="Project milestone updated")


@router.delete("/{project_id}", response_model=APIResponse[dict])
async def delete_project(
    project_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Deletes a project workspace."""
    global _LOCAL_PROJECTS_DB
    existing = next((proj for proj in _LOCAL_PROJECTS_DB if proj["id"] == project_id), None)
    if not existing:
        raise HTTPException(status_code=404, detail="Project workspace not found")
    if existing.get("user_id") and str(existing["user_id"]) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Forbidden: You cannot delete another user's project")

    _LOCAL_PROJECTS_DB = [proj for proj in _LOCAL_PROJECTS_DB if proj["id"] != project_id]
    return APIResponse(data={"deleted_id": project_id}, message="Project workspace removed")
