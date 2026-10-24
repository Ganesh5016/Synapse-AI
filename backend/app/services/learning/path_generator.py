"""
AI Learning Path Generator for Synapse.
Applies topological DAG prerequisite sequencing and mastery profiling
to build personalized, step-by-step curriculum milestones.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
import uuid

from app.schemas.learning_paths import LearningPathResponse, LearningPathStep
from app.api.v1.concepts import _LOCAL_CONCEPTS_DB, _LOCAL_RELATIONSHIPS_DB
from app.api.v1.subjects import _LOCAL_SUBJECTS_DB


class LearningPathGeneratorService:
    def generate_path(
        self,
        subject_id: Optional[str] = None,
        goal: str = "Master Transformer Attention & Bayesian Models",
        target_mastery: float = 0.85,
    ) -> LearningPathResponse:
        """
        Constructs a sequenced learning path based on DAG topological sort.
        """
        subjects_map = {str(s["id"]): s["name"] for s in _LOCAL_SUBJECTS_DB}

        # Filter concepts
        concepts = _LOCAL_CONCEPTS_DB
        if subject_id and subject_id != "all":
            concepts = [c for c in _LOCAL_CONCEPTS_DB if str(c["subject_id"]) == str(subject_id)]

        # Topological sorting based on _LOCAL_RELATIONSHIPS_DB
        in_degree = {c["id"]: 0 for c in concepts}
        adj: Dict[str, List[str]] = {c["id"]: [] for c in concepts}

        for r in _LOCAL_RELATIONSHIPS_DB:
            src, tgt = r["source"], r["target"]
            if src in in_degree and tgt in in_degree:
                adj[src].append(tgt)
                in_degree[tgt] += 1

        queue = [cid for cid, deg in in_degree.items() if deg == 0]
        sorted_ids: List[str] = []

        while queue:
            curr = queue.pop(0)
            sorted_ids.append(curr)
            for neighbor in adj[curr]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)

        # Append any unreached concepts
        for c in concepts:
            if c["id"] not in sorted_ids:
                sorted_ids.append(c["id"])

        concepts_by_id = {c["id"]: c for c in concepts}
        steps: List[LearningPathStep] = []

        completed_count = 0
        total_minutes = 0

        action_cycle = ["read_note", "practice_quiz", "flashcard_review", "inspect_paper"]

        for idx, cid in enumerate(sorted_ids, 1):
            c = concepts_by_id[cid]
            mastery = float(c.get("mastery_score", 0.50))
            is_comp = mastery >= 0.70
            if is_comp:
                completed_count += 1

            act_type = action_cycle[idx % len(action_cycle)]
            mins = 25 if c["difficulty_level"] == "beginner" else (35 if c["difficulty_level"] == "intermediate" else 45)
            total_minutes += mins

            steps.append(
                LearningPathStep(
                    step_id=f"step-{idx:02d}",
                    concept_id=cid,
                    concept_name=c["name"],
                    sequence_order=idx,
                    title=f"Step {idx}: {c['name']}",
                    description=c.get("description", "Master key theoretical mechanisms and practice retrieval."),
                    estimated_minutes=mins,
                    difficulty=c["difficulty_level"],
                    is_completed=is_comp,
                    action_type=act_type,  # type: ignore
                    action_url=f"/practice?conceptId={cid}",
                )
            )

        prog_pct = round((completed_count / max(1, len(steps))) * 100, 1)
        sub_name = subjects_map.get(str(subject_id), "Artificial Intelligence & Cognitive Models")

        return LearningPathResponse(
            id=str(uuid.uuid4()),
            title=f"Curriculum Roadmap: {goal}",
            goal=goal,
            subject_id=subject_id or "all",
            subject_name=sub_name,
            description="Personalized sequence ordered by cognitive prerequisite dependencies and current mastery gaps.",
            estimated_hours=round(total_minutes / 60.0, 1),
            total_steps=len(steps),
            completed_steps=completed_count,
            progress_percentage=prog_pct,
            steps=steps,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )


path_generator = LearningPathGeneratorService()
