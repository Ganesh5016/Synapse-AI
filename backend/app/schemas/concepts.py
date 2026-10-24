"""
Pydantic v2 schemas for Synapse Concept Taxonomy, Knowledge Graph, and Mastery.
"""

from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone
import uuid


# ============================================================================
# 1. Concept Base & CRUD Schemas
# ============================================================================

class ConceptBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    slug: str = Field(..., min_length=2, max_length=140)
    description: Optional[str] = None
    subject_id: str
    difficulty_level: Literal["beginner", "intermediate", "advanced"] = "intermediate"
    key_terms: List[str] = Field(default_factory=list)


class ConceptCreate(ConceptBase):
    pass


class ConceptUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    difficulty_level: Optional[Literal["beginner", "intermediate", "advanced"]] = None
    key_terms: Optional[List[str]] = None


class ConceptResponse(ConceptBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    created_at: datetime
    updated_at: datetime
    mastery_score: float = 0.50
    mastery_level: Literal["Novice", "Developing", "Proficient", "Mastered"] = "Developing"
    prerequisite_count: int = 0
    dependent_count: int = 0


# ============================================================================
# 2. Graph Canvas Elements (React Flow / @xyflow/react Compatible)
# ============================================================================

class GraphNodeData(BaseModel):
    label: str
    slug: str
    subject_id: str
    subject_name: str
    difficulty_level: str
    mastery_score: float
    mastery_level: str
    prerequisites: List[str] = Field(default_factory=list)
    question_count: int = 0
    note_count: int = 0


class GraphNodePosition(BaseModel):
    x: float
    y: float


class ConceptGraphNode(BaseModel):
    id: str
    type: str = "conceptNode"
    position: GraphNodePosition
    data: GraphNodeData


class ConceptGraphEdge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = "prerequisite"
    animated: bool = False
    style: Optional[Dict[str, Any]] = None


class ConceptGraphResponse(BaseModel):
    nodes: List[ConceptGraphNode]
    edges: List[ConceptGraphEdge]
    total_concepts: int
    subject_filter: Optional[str] = None


# ============================================================================
# 3. Concept Detail with Provenance & Analytics
# ============================================================================

class ConceptLinkedResource(BaseModel):
    id: str
    title: str
    type: Literal["document", "note", "article"]
    snippet: str
    relevance_score: float


class ConceptPrerequisiteInfo(BaseModel):
    id: str
    name: str
    slug: str
    mastery_score: float
    mastery_level: str
    is_met: bool


class ConceptDetailResponse(BaseModel):
    concept: ConceptResponse
    subject_name: str
    subject_color: str
    prerequisites: List[ConceptPrerequisiteInfo]
    unlocks_next: List[ConceptPrerequisiteInfo]
    linked_resources: List[ConceptLinkedResource]
    practice_question_count: int
    flashcard_count: int
    last_practiced_at: Optional[datetime] = None
    bkt_p_know: float = 0.50
    decay_risk: Literal["Low", "Medium", "High"] = "Low"
