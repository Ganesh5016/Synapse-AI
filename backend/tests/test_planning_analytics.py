"""
Unit and Integration tests for Phase 6: Study Planner, Projects, and Analytics API.
"""

import pytest
from httpx import AsyncClient, ASGITransport
from datetime import datetime, timezone, timedelta

import jwt
from app.main import app

MOCK_USER_ID = "demo-user-1234-5678-90ab"
MOCK_TOKEN = jwt.encode(
    {"sub": MOCK_USER_ID, "email": "alex.chen@synapse.edu", "role": "authenticated"},
    "mock-secret-for-tests",
    algorithm="HS256",
)
HEADERS = {"Authorization": f"Bearer {MOCK_TOKEN}"}


@pytest.mark.asyncio
async def test_planner_sessions_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. List initial sessions
        res = await ac.get("/api/v1/planner/sessions", headers=HEADERS)
        assert res.status_code == 200
        data = res.json()["data"]
        assert len(data) >= 3
        first_id = data[0]["id"]

        # 2. Get upcoming sessions
        up_res = await ac.get("/api/v1/planner/upcoming", headers=HEADERS)
        assert up_res.status_code == 200
        up_data = up_res.json()["data"]
        assert isinstance(up_data, list)

        # 3. Get calendar agenda
        agenda_res = await ac.get("/api/v1/planner/agenda", headers=HEADERS)
        assert agenda_res.status_code == 200
        agenda_events = agenda_res.json()["data"]
        assert len(agenda_events) >= 3
        assert "start" in agenda_events[0]
        assert "end" in agenda_events[0]

        # 4. Create new study session
        start_time = (datetime.now(timezone.utc) + timedelta(days=3)).isoformat()
        create_payload = {
            "title": "Quantum Computation & Qubit Gates",
            "description": "Study Hadamard gates and unitary transformations",
            "session_type": "deep_work",
            "scheduled_start": start_time,
            "duration_minutes": 50,
            "difficulty": "advanced",
        }
        create_res = await ac.post("/api/v1/planner/sessions", json=create_payload, headers=HEADERS)
        assert create_res.status_code == 201
        created = create_res.json()["data"]
        new_sess_id = created["id"]
        assert created["title"] == "Quantum Computation & Qubit Gates"
        assert created["is_completed"] is False

        # 5. Toggle session completion
        update_res = await ac.put(
            f"/api/v1/planner/sessions/{new_sess_id}",
            json={"is_completed": True, "notes": "Completed 10 exercises"},
            headers=HEADERS,
        )
        assert update_res.status_code == 200
        updated = update_res.json()["data"]
        assert updated["is_completed"] is True
        assert updated["completed_at"] is not None


@pytest.mark.asyncio
async def test_projects_workspace_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. List projects
        res = await ac.get("/api/v1/projects", headers=HEADERS)
        assert res.status_code == 200
        projects = res.json()["data"]
        assert len(projects) >= 2
        proj_id = projects[0]["id"]

        # 2. Get specific project
        single_res = await ac.get(f"/api/v1/projects/{proj_id}", headers=HEADERS)
        assert single_res.status_code == 200
        project = single_res.json()["data"]
        assert project["id"] == proj_id
        assert "milestones" in project
        assert len(project["milestones"]) > 0

        # 3. Toggle project milestone
        milestone_id = project["milestones"][0]["id"]
        toggle_res = await ac.put(
            f"/api/v1/projects/{proj_id}/milestones/{milestone_id}",
            json={"is_completed": False},
            headers=HEADERS,
        )
        assert toggle_res.status_code == 200
        toggled = toggle_res.json()["data"]
        target_m = next(m for m in toggled["milestones"] if m["id"] == milestone_id)
        assert target_m["is_completed"] is False

        # 4. Create new project workspace
        create_payload = {
            "title": "Low-Rank Adaptation (LoRA) Fine-Tuning Lab",
            "description": "Hands-on implementation of parameter-efficient rank decomposition matrices.",
            "milestone_titles": ["Study rank factor equations", "Run parameter count comparisons"],
        }
        new_proj_res = await ac.post("/api/v1/projects", json=create_payload, headers=HEADERS)
        assert new_proj_res.status_code == 201
        created_p = new_proj_res.json()["data"]
        assert created_p["title"] == "Low-Rank Adaptation (LoRA) Fine-Tuning Lab"
        assert len(created_p["milestones"]) == 2


@pytest.mark.asyncio
async def test_analytics_and_reports_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Overview metrics & radar
        overview_res = await ac.get("/api/v1/analytics/overview", headers=HEADERS)
        assert overview_res.status_code == 200
        overview = overview_res.json()["data"]
        assert "metrics" in overview
        assert "radar_distribution" in overview
        assert "trajectory_7d" in overview
        assert overview["metrics"]["active_streak_days"] == 14
        assert len(overview["trajectory_7d"]) == 7

        # 2. Weekly synthesis report
        report_res = await ac.get("/api/v1/analytics/reports/weekly", headers=HEADERS)
        assert report_res.status_code == 200
        report = report_res.json()["data"]
        assert "week_label" in report
        assert "breakthrough_concepts" in report
        assert len(report["breakthrough_concepts"]) >= 2
        assert "urgent_gaps" in report
        assert "summary_ai_narrative" in report

        # 3. CSV Activity Log Export
        csv_res = await ac.get("/api/v1/analytics/export/csv", headers=HEADERS)
        assert csv_res.status_code == 200
        assert "text/csv" in csv_res.headers["content-type"]
        csv_text = csv_res.text
        assert "Day,Date,MasteryScore,RetentionRate" in csv_text
        assert "Mon" in csv_text
        assert "Sun" in csv_text
