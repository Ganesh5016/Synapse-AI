"""
End-to-End Student Lifecycle Integration Test.
Simulates a complete student learning journey from initial note taking,
grounded RAG query, BKT mastery testing, SM-2 flashcard review,
to study scheduling and learning analytics export.
"""

import pytest
from httpx import AsyncClient, ASGITransport
from datetime import datetime, timezone, timedelta
import jwt

from app.main import app

STUDENT_USER_ID = "00000000-0000-0000-0000-student000001"
TOKEN = jwt.encode(
    {"sub": STUDENT_USER_ID, "email": "elena.rostova@synapse.edu", "role": "authenticated"},
    "mock-secret-for-tests-minimum-32-chars-long",
    algorithm="HS256",
)
HEADERS = {"Authorization": f"Bearer {TOKEN}"}


@pytest.mark.asyncio
async def test_full_student_learning_lifecycle():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Step 1: Health & System Readiness Check
        health_res = await ac.get("/api/v1/health")
        assert health_res.status_code == 200
        health_data = health_res.json()
        assert health_data["status"] == "ok"

        # Step 2: Knowledge Ingestion — Create a detailed Markdown research note
        note_res = await ac.post(
            "/api/v1/notes",
            json={
                "title": "Diffusion Probabilistic Models & Score Matching",
                "content_markdown": "# Diffusion Models\n\nForward process adds Gaussian noise: $q(x_t | x_{t-1})$. Reverse process learns denoising score.",
                "is_pinned": True,
                "tags": ["generative-ai", "diffusion", "score-matching"],
            },
            headers=HEADERS,
        )
        assert note_res.status_code == 201
        created_note = note_res.json()["data"]
        assert created_note["word_count"] > 10

        # Step 3: Knowledge Graph Exploration
        graph_res = await ac.get("/api/v1/concepts/graph", headers=HEADERS)
        assert graph_res.status_code == 200
        graph_data = graph_res.json()["data"]
        assert "nodes" in graph_data
        assert "edges" in graph_data
        assert len(graph_data["nodes"]) >= 5

        # Step 4: Grounded RAG AI Assistant Query
        ai_res = await ac.post(
            "/api/v1/ai/ask",
            json={
                "query": "How does Scaled Dot-Product Attention prevent vanishing gradients?",
                "history": [],
            },
            headers=HEADERS,
        )
        assert ai_res.status_code == 200
        ai_data = ai_res.json()["data"]
        assert "answer" in ai_data
        assert "citations" in ai_data
        assert len(ai_data["citations"]) > 0

        # Step 5: Adaptive Practice Test with Bayesian Knowledge Tracing Update
        questions_res = await ac.get("/api/v1/practice/questions", headers=HEADERS)
        assert questions_res.status_code == 200
        q_list = questions_res.json()["data"]
        assert len(q_list) > 0
        first_q = q_list[0]

        submit_res = await ac.post(
            "/api/v1/practice/submit",
            json={
                "question_id": first_q["id"],
                "selected_answer": first_q["correct_answer"],
                "hint_used": True,
                "response_time_seconds": 22.5,
            },
            headers=HEADERS,
        )
        assert submit_res.status_code == 200
        submit_data = submit_res.json()["data"]
        assert "bkt_update" in submit_data
        assert "posterior_mastery" in submit_data["bkt_update"]

        # Step 6: Spaced Repetition Flashcard Review via SM-2
        due_res = await ac.get("/api/v1/flashcards/due", headers=HEADERS)
        assert due_res.status_code == 200
        due_cards = due_res.json()["data"]
        assert len(due_cards) > 0
        card_id = due_cards[0]["id"]

        review_res = await ac.post(
            f"/api/v1/flashcards/{card_id}/review",
            json={"quality_rating": 4},
            headers=HEADERS,
        )
        assert review_res.status_code == 200
        review_data = review_res.json()["data"]
        assert review_data["new_easiness_factor"] >= 1.3
        assert review_data["new_interval_days"] >= 1

        # Step 7: Temporal Revision Planning
        session_time = (datetime.now(timezone.utc) + timedelta(days=1)).isoformat()
        planner_res = await ac.post(
            "/api/v1/planner/sessions",
            json={
                "title": "Deep Review: Denoising Diffusion Probabilistic Models",
                "session_type": "deep_work",
                "scheduled_start": session_time,
                "duration_minutes": 60,
                "difficulty": "advanced",
            },
            headers=HEADERS,
        )
        assert planner_res.status_code == 201
        session_data = planner_res.json()["data"]
        assert session_data["is_completed"] is False

        # Step 8: Project Workspace Creation
        project_res = await ac.post(
            "/api/v1/projects",
            json={
                "title": "Generative Modeling Curriculum & Code Lab",
                "description": "Implementation repo for DDPM, Score SDEs, and Latent Diffusion.",
                "milestone_titles": ["Implement forward SDE", "Train reverse UNet", "Evaluate FID score"],
            },
            headers=HEADERS,
        )
        assert project_res.status_code == 201
        project_data = project_res.json()["data"]
        assert len(project_data["milestones"]) == 3

        # Step 9: Analytics & Weekly Report Verification
        analytics_res = await ac.get("/api/v1/analytics/overview", headers=HEADERS)
        assert analytics_res.status_code == 200
        analytics_data = analytics_res.json()["data"]
        assert "metrics" in analytics_data
        assert "radar_distribution" in analytics_data

        csv_res = await ac.get("/api/v1/analytics/export/csv", headers=HEADERS)
        assert csv_res.status_code == 200
        assert "Day,Date,MasteryScore" in csv_res.text
