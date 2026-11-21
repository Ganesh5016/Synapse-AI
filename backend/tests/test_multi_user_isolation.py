"""
Security and Multi-User Isolation Audit Test Suite.
Verifies zero-trust data isolation between authenticated users (Alpha vs Beta)
and rejection of unauthenticated requests across all core domains.
"""

import pytest
from httpx import AsyncClient, ASGITransport
from datetime import datetime, timezone, timedelta
import jwt

from app.main import app

USER_ALPHA_ID = "00000000-0000-0000-0000-useralpha0001"
USER_BETA_ID = "00000000-0000-0000-0000-userbeta000002"

TOKEN_ALPHA = jwt.encode(
    {"sub": USER_ALPHA_ID, "email": "alpha@synapse.edu", "role": "authenticated"},
    "mock-secret-for-tests-minimum-32-chars-long",
    algorithm="HS256",
)
TOKEN_BETA = jwt.encode(
    {"sub": USER_BETA_ID, "email": "beta@synapse.edu", "role": "authenticated"},
    "mock-secret-for-tests-minimum-32-chars-long",
    algorithm="HS256",
)

HEADERS_ALPHA = {"Authorization": f"Bearer {TOKEN_ALPHA}"}
HEADERS_BETA = {"Authorization": f"Bearer {TOKEN_BETA}"}


@pytest.mark.asyncio
async def test_unauthenticated_requests_rejected():
    """Unauthenticated requests must receive 401 Unauthorized."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res1 = await ac.get("/api/v1/notes")
        assert res1.status_code == 401

        res2 = await ac.get("/api/v1/planner/sessions")
        assert res2.status_code == 401

        res3 = await ac.get("/api/v1/projects")
        assert res3.status_code == 401


@pytest.mark.asyncio
async def test_notes_multi_user_isolation():
    """User Beta cannot view, access, update, or delete User Alpha's notes."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. User Alpha creates a confidential research note
        create_payload = {
            "title": "Alpha Confidential: Quantum Kernel Alignment",
            "content_markdown": "# Quantum Kernel Alignment\n\nExplicit derivation of trace distances.",
            "is_pinned": True,
            "tags": ["quantum", "kernels", "confidential"],
        }
        res_create = await ac.post("/api/v1/notes", json=create_payload, headers=HEADERS_ALPHA)
        assert res_create.status_code == 201
        alpha_note = res_create.json()["data"]
        alpha_note_id = alpha_note["id"]

        # 2. User Alpha can access their note directly
        res_get_alpha = await ac.get(f"/api/v1/notes/{alpha_note_id}", headers=HEADERS_ALPHA)
        assert res_get_alpha.status_code == 200
        assert res_get_alpha.json()["data"]["title"] == "Alpha Confidential: Quantum Kernel Alignment"

        # 3. User Beta lists notes -> Alpha's note is NOT included
        res_list_beta = await ac.get("/api/v1/notes", headers=HEADERS_BETA)
        assert res_list_beta.status_code == 200
        beta_notes = res_list_beta.json()["data"]
        assert not any(n["id"] == alpha_note_id for n in beta_notes)

        # 4. User Beta attempts to retrieve Alpha's note directly -> 404
        res_get_beta = await ac.get(f"/api/v1/notes/{alpha_note_id}", headers=HEADERS_BETA)
        assert res_get_beta.status_code == 404

        # 5. User Beta attempts to overwrite Alpha's note -> 404
        res_put_beta = await ac.put(
            f"/api/v1/notes/{alpha_note_id}",
            json={"title": "Hacked Title by Beta"},
            headers=HEADERS_BETA,
        )
        assert res_put_beta.status_code == 404

        # 6. User Beta attempts to delete Alpha's note -> 404
        res_del_beta = await ac.delete(f"/api/v1/notes/{alpha_note_id}", headers=HEADERS_BETA)
        assert res_del_beta.status_code == 404

        # 7. Verify Alpha's note is still intact
        res_verify = await ac.get(f"/api/v1/notes/{alpha_note_id}", headers=HEADERS_ALPHA)
        assert res_verify.status_code == 200
        assert res_verify.json()["data"]["title"] == "Alpha Confidential: Quantum Kernel Alignment"


@pytest.mark.asyncio
async def test_planner_multi_user_isolation():
    """User Beta cannot alter or delete User Alpha's scheduled study sessions."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. User Alpha creates a study session
        start_time = (datetime.now(timezone.utc) + timedelta(days=2)).isoformat()
        create_payload = {
            "title": "Alpha Master Thesis Writing Block",
            "description": "Finalize Chapter 4 on Attention Subspaces",
            "session_type": "deep_work",
            "scheduled_start": start_time,
            "duration_minutes": 120,
            "difficulty": "advanced",
        }
        res_create = await ac.post("/api/v1/planner/sessions", json=create_payload, headers=HEADERS_ALPHA)
        assert res_create.status_code == 201
        alpha_session = res_create.json()["data"]
        alpha_session_id = alpha_session["id"]

        # 2. User Beta attempts to mark Alpha's session as completed -> 403 Forbidden
        res_put_beta = await ac.put(
            f"/api/v1/planner/sessions/{alpha_session_id}",
            json={"is_completed": True, "notes": "Tampered by Beta"},
            headers=HEADERS_BETA,
        )
        assert res_put_beta.status_code == 403

        # 3. User Beta attempts to delete Alpha's session -> 403 Forbidden
        res_del_beta = await ac.delete(f"/api/v1/planner/sessions/{alpha_session_id}", headers=HEADERS_BETA)
        assert res_del_beta.status_code == 403

        # 4. User Alpha can successfully update their own session
        res_put_alpha = await ac.put(
            f"/api/v1/planner/sessions/{alpha_session_id}",
            json={"is_completed": True, "notes": "Successfully wrote 8 pages"},
            headers=HEADERS_ALPHA,
        )
        assert res_put_alpha.status_code == 200
        assert res_put_alpha.json()["data"]["is_completed"] is True


@pytest.mark.asyncio
async def test_projects_multi_user_isolation():
    """User Beta cannot access, toggle milestones, or delete User Alpha's project workspace."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. User Alpha creates a project workspace
        create_payload = {
            "title": "Alpha Research: Neuromorphic Computing Core",
            "description": "Spike-timing-dependent plasticity modeling.",
            "milestone_titles": ["Spiking model derivation", "Hardware benchmark"],
        }
        res_create = await ac.post("/api/v1/projects", json=create_payload, headers=HEADERS_ALPHA)
        assert res_create.status_code == 201
        alpha_project = res_create.json()["data"]
        alpha_proj_id = alpha_project["id"]
        milestone_id = alpha_project["milestones"][0]["id"]

        # 2. User Beta attempts to read Alpha's private project -> 403 Forbidden
        res_get_beta = await ac.get(f"/api/v1/projects/{alpha_proj_id}", headers=HEADERS_BETA)
        assert res_get_beta.status_code == 403

        # 3. User Beta attempts to toggle milestone in Alpha's project -> 403 Forbidden
        res_toggle_beta = await ac.put(
            f"/api/v1/projects/{alpha_proj_id}/milestones/{milestone_id}",
            json={"is_completed": True},
            headers=HEADERS_BETA,
        )
        assert res_toggle_beta.status_code == 403

        # 4. User Beta attempts to delete Alpha's project -> 403 Forbidden
        res_del_beta = await ac.delete(f"/api/v1/projects/{alpha_proj_id}", headers=HEADERS_BETA)
        assert res_del_beta.status_code == 403

        # 5. User Alpha can access and toggle milestone
        res_toggle_alpha = await ac.put(
            f"/api/v1/projects/{alpha_proj_id}/milestones/{milestone_id}",
            json={"is_completed": True},
            headers=HEADERS_ALPHA,
        )
        assert res_toggle_alpha.status_code == 200
        assert res_toggle_alpha.json()["data"]["milestones"][0]["is_completed"] is True
