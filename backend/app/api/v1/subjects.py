"""
Subjects API Router for Synapse.
Provides predefined subjects and custom user-defined learning subjects.
"""

from typing import List, Optional
import uuid
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.core.security import get_current_user, AuthenticatedUser
from app.schemas.common import APIResponse

router = APIRouter(prefix="/subjects", tags=["Subjects"])


class SubjectResponse(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    description: Optional[str] = None
    color_hex: str
    icon_name: str
    is_custom: bool = False


PREDEFINED_SUBJECTS = [
    {
        "id": uuid.UUID("a0000000-0000-0000-0000-000000000001"),
        "name": "Machine Learning & AI",
        "slug": "machine-learning",
        "description": "Core algorithms, deep learning architectures, transformer models, and reinforcement learning.",
        "color_hex": "#7667F5",
        "icon_name": "Cpu",
        "is_custom": False,
    },
    {
        "id": uuid.UUID("a0000000-0000-0000-0000-000000000002"),
        "name": "Computer Systems & Architecture",
        "slug": "systems-architecture",
        "description": "Operating systems, distributed computing, memory hierarchies, and concurrency.",
        "color_hex": "#229B72",
        "icon_name": "Server",
        "is_custom": False,
    },
    {
        "id": uuid.UUID("a0000000-0000-0000-0000-000000000003"),
        "name": "Mathematics & Statistics",
        "slug": "mathematics-statistics",
        "description": "Linear algebra, probability theory, multivariate calculus, and Bayesian inference.",
        "color_hex": "#D99A32",
        "icon_name": "Binary",
        "is_custom": False,
    },
    {
        "id": uuid.UUID("a0000000-0000-0000-0000-000000000004"),
        "name": "Data Structures & Algorithms",
        "slug": "algorithms-data-structures",
        "description": "Asymptotic complexity, graph algorithms, dynamic programming, and data layout.",
        "color_hex": "#9B8AFB",
        "icon_name": "GitFork",
        "is_custom": False,
    },
    {
        "id": uuid.UUID("a0000000-0000-0000-0000-000000000005"),
        "name": "Cognitive Science & Psychology",
        "slug": "cognitive-science",
        "description": "Memory encoding, spaced retrieval practice, and cognitive load theory.",
        "color_hex": "#D9536B",
        "icon_name": "Brain",
        "is_custom": False,
    },
]


@router.get("", response_model=APIResponse[List[SubjectResponse]])
async def list_subjects(
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Retrieves all global and custom subjects."""
    return APIResponse(data=PREDEFINED_SUBJECTS, message="Subjects retrieved successfully")


# In-memory alias for cross-module lookup
_LOCAL_SUBJECTS_DB = PREDEFINED_SUBJECTS
