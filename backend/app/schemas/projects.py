"""
Pydantic v2 schemas for Project Knowledge Mapping Workspaces.
"""

from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone


class ProjectMilestone(BaseModel):
    id: str
    title: str
    is_completed: bool = False
    due_date: Optional[datetime] = None


class ProjectResourceItem(BaseModel):
    id: str
    title: str
    type: Literal["note", "document", "paper", "concept"]
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ProjectWorkspaceResponse(BaseModel):
    id: str
    title: str
    description: str
    subject_id: Optional[str] = None
    subject_name: Optional[str] = "Machine Learning"
    subject_color: Optional[str] = "#7667F5"
    status: Literal["active", "completed", "archived"] = "active"
    progress_percentage: float = 0.0
    due_date: Optional[datetime] = None
    linked_notes: List[ProjectResourceItem] = Field(default_factory=list)
    linked_documents: List[ProjectResourceItem] = Field(default_factory=list)
    pinned_concepts: List[ProjectResourceItem] = Field(default_factory=list)
    milestones: List[ProjectMilestone] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime


class ProjectWorkspaceCreateRequest(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    description: str = Field(..., max_length=1000)
    subject_id: Optional[str] = None
    due_date: Optional[datetime] = None
    pinned_concept_ids: List[str] = Field(default_factory=list)
    linked_note_ids: List[str] = Field(default_factory=list)
    milestone_titles: List[str] = Field(default_factory=list)


class ProjectMilestoneToggleRequest(BaseModel):
    is_completed: bool
