"""
Concepts & Knowledge Graph API Router for Synapse.
Provides endpoints for concept exploration, graph visualization, and prerequisite chaining.
"""

from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.security import get_current_user, AuthenticatedUser
from app.schemas.common import APIResponse
from app.schemas.concepts import (
    ConceptResponse,
    ConceptCreate,
    ConceptUpdate,
    ConceptGraphNode,
    ConceptGraphEdge,
    ConceptGraphResponse,
    ConceptDetailResponse,
    ConceptLinkedResource,
    ConceptPrerequisiteInfo,
    GraphNodeData,
    GraphNodePosition,
)
from app.api.v1.subjects import _LOCAL_SUBJECTS_DB

router = APIRouter(prefix="/concepts", tags=["Concepts & Knowledge Graph"])


# ============================================================================
# Seed Concept Database (Machine Learning, Cognitive Science, Deep Learning)
# ============================================================================

_LOCAL_CONCEPTS_DB: List[Dict[str, Any]] = [
    {
        "id": "c0000000-0000-0000-0000-000000000001",
        "name": "Linear Algebra Foundations",
        "slug": "linear-algebra-foundations",
        "subject_id": "a0000000-0000-0000-0000-000000000003",
        "difficulty_level": "beginner",
        "description": "Vector spaces, dot products, matrix projections, and eigenvalues essential for machine learning.",
        "key_terms": ["vector", "matrix", "dot-product", "projection", "eigenvalues"],
        "mastery_score": 0.92,
        "mastery_level": "Mastered",
        "position_x": 100.0,
        "position_y": 150.0,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "id": "c0000000-0000-0000-0000-000000000002",
        "name": "Gradient Descent & Backpropagation",
        "slug": "gradient-descent-backprop",
        "subject_id": "a0000000-0000-0000-0000-000000000001",
        "difficulty_level": "beginner",
        "description": "First-order iterative optimization algorithm for finding the local minimum of a differentiable objective function.",
        "key_terms": ["gradient", "learning-rate", "chain-rule", "loss-function", "optimizer"],
        "mastery_score": 0.84,
        "mastery_level": "Proficient",
        "position_x": 350.0,
        "position_y": 150.0,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "id": "c0000000-0000-0000-0000-000000000003",
        "name": "Scaled Dot-Product Attention",
        "slug": "scaled-dot-product-attention",
        "subject_id": "a0000000-0000-0000-0000-000000000001",
        "difficulty_level": "intermediate",
        "description": "Core routing mechanism calculating attention weights from Query and Key inner products divided by sqrt(d_k).",
        "key_terms": ["query", "key", "value", "softmax", "scaling-factor", "gradients"],
        "mastery_score": 0.78,
        "mastery_level": "Proficient",
        "position_x": 620.0,
        "position_y": 120.0,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "id": "c0000000-0000-0000-0000-000000000004",
        "name": "Multi-Head Attention",
        "slug": "multi-head-attention",
        "subject_id": "a0000000-0000-0000-0000-000000000001",
        "difficulty_level": "intermediate",
        "description": "Projects queries, keys, and values into multiple representation subspaces in parallel before concatenation.",
        "key_terms": ["multi-head", "subspaces", "projection", "concatenation", "linear-layer"],
        "mastery_score": 0.65,
        "mastery_level": "Developing",
        "position_x": 900.0,
        "position_y": 120.0,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "id": "c0000000-0000-0000-0000-000000000005",
        "name": "Transformer Architecture & Self-Attention",
        "slug": "transformer-architecture",
        "subject_id": "a0000000-0000-0000-0000-000000000001",
        "difficulty_level": "advanced",
        "description": "Full encoder-decoder sequence transduction network replacing recurrence with stacked self-attention layers.",
        "key_terms": ["encoder", "decoder", "residual-connections", "layer-norm", "feedforward"],
        "mastery_score": 0.52,
        "mastery_level": "Developing",
        "position_x": 1180.0,
        "position_y": 150.0,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "id": "c0000000-0000-0000-0000-000000000006",
        "name": "Bayesian Probability & Posterior Updates",
        "slug": "bayesian-probability-posterior",
        "subject_id": "a0000000-0000-0000-0000-000000000003",
        "difficulty_level": "beginner",
        "description": "Conditional probability frameworks updating belief distributions in light of observed empirical evidence.",
        "key_terms": ["bayes-theorem", "prior", "likelihood", "posterior", "evidence"],
        "mastery_score": 0.88,
        "mastery_level": "Proficient",
        "position_x": 350.0,
        "position_y": 380.0,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "id": "c0000000-0000-0000-0000-000000000007",
        "name": "Bayesian Knowledge Tracing (BKT)",
        "slug": "bayesian-knowledge-tracing",
        "subject_id": "a0000000-0000-0000-0000-000000000005",
        "difficulty_level": "intermediate",
        "description": "Psychometric model tracking student skill mastery over discrete practice opportunities using a Hidden Markov Model.",
        "key_terms": ["prior-p_l0", "transit-p_t", "guess-p_g", "slip-p_s", "hmm"],
        "mastery_score": 0.58,
        "mastery_level": "Developing",
        "position_x": 650.0,
        "position_y": 380.0,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
    {
        "id": "c0000000-0000-0000-0000-000000000008",
        "name": "SuperMemo SM-2 Spaced Repetition",
        "slug": "sm-2-spaced-repetition",
        "subject_id": "a0000000-0000-0000-0000-000000000005",
        "difficulty_level": "intermediate",
        "description": "Empirical memory decay scheduling algorithm computing expanding review intervals and easiness factor (EF).",
        "key_terms": ["easiness-factor", "repetition-count", "interval-days", "ebbinghaus-decay"],
        "mastery_score": 0.38,
        "mastery_level": "Novice",
        "position_x": 950.0,
        "position_y": 380.0,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    },
]

# Directed prerequisite relationships (source -> target means source is prerequisite for target)
_LOCAL_RELATIONSHIPS_DB: List[Dict[str, str]] = [
    {
        "id": "rel-01",
        "source": "c0000000-0000-0000-0000-000000000001",  # Linear Algebra
        "target": "c0000000-0000-0000-0000-000000000002",  # Gradient Descent
    },
    {
        "id": "rel-02",
        "source": "c0000000-0000-0000-0000-000000000001",  # Linear Algebra
        "target": "c0000000-0000-0000-0000-000000000003",  # Scaled Dot-Product Attention
    },
    {
        "id": "rel-03",
        "source": "c0000000-0000-0000-0000-000000000002",  # Gradient Descent
        "target": "c0000000-0000-0000-0000-000000000003",  # Scaled Dot-Product Attention
    },
    {
        "id": "rel-04",
        "source": "c0000000-0000-0000-0000-000000000003",  # Scaled Dot-Product Attention
        "target": "c0000000-0000-0000-0000-000000000004",  # Multi-Head Attention
    },
    {
        "id": "rel-05",
        "source": "c0000000-0000-0000-0000-000000000004",  # Multi-Head Attention
        "target": "c0000000-0000-0000-0000-000000000005",  # Transformer Architecture
    },
    {
        "id": "rel-06",
        "source": "c0000000-0000-0000-0000-000000000006",  # Bayesian Probability
        "target": "c0000000-0000-0000-0000-000000000007",  # Bayesian Knowledge Tracing
    },
    {
        "id": "rel-07",
        "source": "c0000000-0000-0000-0000-000000000007",  # BKT
        "target": "c0000000-0000-0000-0000-000000000008",  # SM-2 Spaced Repetition
    },
]


# ============================================================================
# API Endpoints
# ============================================================================

@router.get("/graph", response_model=APIResponse[ConceptGraphResponse])
async def get_concept_graph(
    subject_id: Optional[str] = Query(None, description="Filter nodes by subject ID"),
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """
    Returns graph nodes and prerequisite directed edges formatted for React Flow.
    """
    subjects_map = {str(s["id"]): s["name"] for s in _LOCAL_SUBJECTS_DB}

    filtered_concepts = _LOCAL_CONCEPTS_DB
    if subject_id and subject_id != "all":
        filtered_concepts = [c for c in _LOCAL_CONCEPTS_DB if str(c["subject_id"]) == str(subject_id)]

    valid_node_ids = {c["id"] for c in filtered_concepts}

    nodes: List[ConceptGraphNode] = []
    for c in filtered_concepts:
        # Find prerequisites for this concept
        prereq_ids = [r["source"] for r in _LOCAL_RELATIONSHIPS_DB if r["target"] == c["id"]]
        prereq_names = [
            next((x["name"] for x in _LOCAL_CONCEPTS_DB if x["id"] == pid), "Prerequisite")
            for pid in prereq_ids
        ]

        nodes.append(
            ConceptGraphNode(
                id=c["id"],
                type="conceptNode",
                position=GraphNodePosition(x=c["position_x"], y=c["position_y"]),
                data=GraphNodeData(
                    label=c["name"],
                    slug=c["slug"],
                    subject_id=c["subject_id"],
                    subject_name=subjects_map.get(str(c["subject_id"]), "Computer Science"),
                    difficulty_level=c["difficulty_level"],
                    mastery_score=c["mastery_score"],
                    mastery_level=c["mastery_level"],
                    prerequisites=prereq_names,
                    question_count=4,
                    note_count=2,
                ),
            )
        )

    edges: List[ConceptGraphEdge] = []
    for r in _LOCAL_RELATIONSHIPS_DB:
        if r["source"] in valid_node_ids and r["target"] in valid_node_ids:
            edges.append(
                ConceptGraphEdge(
                    id=f"edge-{r['source']}-{r['target']}",
                    source=r["source"],
                    target=r["target"],
                    label="prerequisite",
                    animated=True,
                )
            )

    return APIResponse(
        data=ConceptGraphResponse(
            nodes=nodes,
            edges=edges,
            total_concepts=len(nodes),
            subject_filter=subject_id,
        ),
        message=f"Retrieved knowledge graph with {len(nodes)} nodes and {len(edges)} prerequisite edges",
    )


@router.get("", response_model=APIResponse[List[ConceptResponse]])
async def list_concepts(
    subject_id: Optional[str] = None,
    search: Optional[str] = None,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Lists concepts with subject filtering and keyword search."""
    concepts = _LOCAL_CONCEPTS_DB
    if subject_id and subject_id != "all":
        concepts = [c for c in concepts if str(c["subject_id"]) == str(subject_id)]

    if search:
        s_lower = search.lower()
        concepts = [
            c for c in concepts
            if s_lower in c["name"].lower() or s_lower in c.get("description", "").lower()
        ]

    results: List[ConceptResponse] = []
    for c in concepts:
        prereqs = sum(1 for r in _LOCAL_RELATIONSHIPS_DB if r["target"] == c["id"])
        dependents = sum(1 for r in _LOCAL_RELATIONSHIPS_DB if r["source"] == c["id"])
        results.append(
            ConceptResponse(
                id=c["id"],
                name=c["name"],
                slug=c["slug"],
                description=c.get("description"),
                subject_id=c["subject_id"],
                difficulty_level=c["difficulty_level"],
                key_terms=c.get("key_terms", []),
                mastery_score=c.get("mastery_score", 0.50),
                mastery_level=c.get("mastery_level", "Developing"),
                prerequisite_count=prereqs,
                dependent_count=dependents,
                created_at=c["created_at"],
                updated_at=c["updated_at"],
            )
        )

    return APIResponse(data=results, message=f"Retrieved {len(results)} concepts")


@router.get("/{concept_id}", response_model=APIResponse[ConceptDetailResponse])
async def get_concept_detail(
    concept_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Retrieves full concept details, prerequisite chain, and linked resources."""
    concept = next((c for c in _LOCAL_CONCEPTS_DB if c["id"] == concept_id), None)
    if not concept:
        raise HTTPException(status_code=404, detail="Concept not found")

    subjects_map = {str(s["id"]): s for s in _LOCAL_SUBJECTS_DB}
    subj = subjects_map.get(str(concept["subject_id"]), {"name": "Computer Science", "color": "#4F46E5"})

    # Prerequisite chain
    prereq_ids = [r["source"] for r in _LOCAL_RELATIONSHIPS_DB if r["target"] == concept_id]
    prerequisites: List[ConceptPrerequisiteInfo] = []
    for pid in prereq_ids:
        p_c = next((x for x in _LOCAL_CONCEPTS_DB if x["id"] == pid), None)
        if p_c:
            prerequisites.append(
                ConceptPrerequisiteInfo(
                    id=p_c["id"],
                    name=p_c["name"],
                    slug=p_c["slug"],
                    mastery_score=p_c["mastery_score"],
                    mastery_level=p_c["mastery_level"],
                    is_met=p_c["mastery_score"] >= 0.70,
                )
            )

    # Next concepts unlocked
    next_ids = [r["target"] for r in _LOCAL_RELATIONSHIPS_DB if r["source"] == concept_id]
    unlocks_next: List[ConceptPrerequisiteInfo] = []
    for nid in next_ids:
        n_c = next((x for x in _LOCAL_CONCEPTS_DB if x["id"] == nid), None)
        if n_c:
            unlocks_next.append(
                ConceptPrerequisiteInfo(
                    id=n_c["id"],
                    name=n_c["name"],
                    slug=n_c["slug"],
                    mastery_score=n_c["mastery_score"],
                    mastery_level=n_c["mastery_level"],
                    is_met=n_c["mastery_score"] >= 0.70,
                )
            )

    # Linked resources
    linked_resources = [
        ConceptLinkedResource(
            id="doc-attn",
            title="Attention Is All You Need (Vaswani et al.)",
            type="document",
            snippet="Core paper proposing self-attention mechanisms replacing recurrence.",
            relevance_score=0.95,
        ),
        ConceptLinkedResource(
            id="note-attn",
            title="Transformer Attention Mechanics & Dot-Product Scaling",
            type="note",
            snippet="Detailed LaTeX formulas and proofs regarding 1/sqrt(d_k) variance scaling.",
            relevance_score=0.92,
        ),
    ]

    decay_risk = "Low" if concept["mastery_score"] >= 0.75 else ("Medium" if concept["mastery_score"] >= 0.50 else "High")

    resp = ConceptDetailResponse(
        concept=ConceptResponse(
            id=concept["id"],
            name=concept["name"],
            slug=concept["slug"],
            description=concept["description"],
            subject_id=concept["subject_id"],
            difficulty_level=concept["difficulty_level"],
            key_terms=concept.get("key_terms", []),
            mastery_score=concept["mastery_score"],
            mastery_level=concept["mastery_level"],
            prerequisite_count=len(prerequisites),
            dependent_count=len(unlocks_next),
            created_at=concept["created_at"],
            updated_at=concept["updated_at"],
        ),
        subject_name=subj.get("name", "Computer Science"),
        subject_color=subj.get("color", "#4F46E5"),
        prerequisites=prerequisites,
        unlocks_next=unlocks_next,
        linked_resources=linked_resources,
        practice_question_count=6,
        flashcard_count=8,
        last_practiced_at=datetime.now(timezone.utc),
        bkt_p_know=concept["mastery_score"],
        decay_risk=decay_risk,
    )

    return APIResponse(data=resp, message="Concept details retrieved")
