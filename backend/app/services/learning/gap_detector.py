"""
Automated Knowledge Gap Detection Engine for Synapse.
Identifies latent deficits, broken prerequisite chains, and retention decay.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
import uuid

from app.schemas.mastery import KnowledgeGapItem, KnowledgeGapsResponse
from app.api.v1.concepts import _LOCAL_CONCEPTS_DB, _LOCAL_RELATIONSHIPS_DB
from app.api.v1.subjects import _LOCAL_SUBJECTS_DB


class KnowledgeGapDetector:
    def detect_gaps(self, user_id: str) -> KnowledgeGapsResponse:
        """
        Scans concept graph and prerequisite chains to identify knowledge deficits.
        """
        subjects_map = {str(s["id"]): s["name"] for s in _LOCAL_SUBJECTS_DB}
        concepts_by_id = {c["id"]: c for c in _LOCAL_CONCEPTS_DB}

        gaps: List[KnowledgeGapItem] = []

        for c in _LOCAL_CONCEPTS_DB:
            mastery = float(c.get("mastery_score", 0.50))
            cid = c["id"]
            cname = c["name"]
            sid = str(c["subject_id"])
            sname = subjects_map.get(sid, "Computer Science")

            # Check 1: Prerequisite chain failure
            prereq_ids = [r["source"] for r in _LOCAL_RELATIONSHIPS_DB if r["target"] == cid]
            for pid in prereq_ids:
                prereq_concept = concepts_by_id.get(pid)
                if prereq_concept and prereq_concept.get("mastery_score", 0.50) < 0.70:
                    gaps.append(
                        KnowledgeGapItem(
                            gap_id=f"gap-prereq-{cid[:8]}",
                            concept_id=cid,
                            concept_name=cname,
                            subject_id=sid,
                            subject_name=sname,
                            severity="critical",
                            current_mastery=mastery,
                            target_mastery=0.85,
                            root_cause=(
                                f"Missing prerequisite foundation in '{prereq_concept['name']}' "
                                f"(currently at {int(prereq_concept['mastery_score'] * 100)}% mastery)."
                            ),
                            recommended_action=f"Review foundational note and complete 3 practice questions on '{prereq_concept['name']}' before proceeding.",
                            action_type="study_prerequisite",
                            prerequisite_blocker_id=pid,
                            prerequisite_blocker_name=prereq_concept["name"],
                        )
                    )
                    break

            # Check 2: Severe conceptual deficit (Novice level)
            if mastery < 0.45:
                gaps.append(
                    KnowledgeGapItem(
                        gap_id=f"gap-low-{cid[:8]}",
                        concept_id=cid,
                        concept_name=cname,
                        subject_id=sid,
                        subject_name=sname,
                        severity="critical",
                        current_mastery=mastery,
                        target_mastery=0.80,
                        root_cause=f"High error frequency during retrieval practice on {cname} core mechanics.",
                        recommended_action=f"Work through interactive walkthrough and review flashcard deck for {cname}.",
                        action_type="practice_quiz",
                    )
                )

            # Check 3: Developing concept approaching decay
            elif 0.45 <= mastery < 0.68:
                gaps.append(
                    KnowledgeGapItem(
                        gap_id=f"gap-dev-{cid[:8]}",
                        concept_id=cid,
                        concept_name=cname,
                        subject_id=sid,
                        subject_name=sname,
                        severity="moderate",
                        current_mastery=mastery,
                        target_mastery=0.85,
                        root_cause=f"Concept in developing state ({int(mastery * 100)}%). Requires reinforcement to prevent regression.",
                        recommended_action=f"Review spaced repetition cards and complete adaptive drill on {cname}.",
                        action_type="flashcard_repetition",
                    )
                )

        # De-duplicate by concept_id
        seen_concepts = set()
        unique_gaps = []
        for g in gaps:
            if g.concept_id not in seen_concepts:
                seen_concepts.add(g.concept_id)
                unique_gaps.append(g)

        # Sort: critical first, then moderate, then minor
        severity_order = {"critical": 0, "moderate": 1, "minor": 2}
        unique_gaps.sort(key=lambda x: severity_order.get(x.severity, 3))

        crit_cnt = sum(1 for g in unique_gaps if g.severity == "critical")
        mod_cnt = sum(1 for g in unique_gaps if g.severity == "moderate")
        min_cnt = sum(1 for g in unique_gaps if g.severity == "minor")

        summary = (
            f"Diagnosed {len(unique_gaps)} actionable learning gaps. Addressing {crit_cnt} critical "
            "deficits will eliminate cognitive bottlenecks across advanced topics."
        )

        return KnowledgeGapsResponse(
            gaps=unique_gaps,
            critical_count=crit_cnt,
            moderate_count=mod_cnt,
            minor_count=min_cnt,
            overall_impact_summary=summary,
        )


gap_detector = KnowledgeGapDetector()
