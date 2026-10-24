import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app
import jwt

MOCK_USER_ID = "demo-user-1234-5678-90ab"
MOCK_TOKEN = jwt.encode(
    {"sub": MOCK_USER_ID, "email": "alex.chen@synapse.edu", "role": "authenticated"},
    "mock-secret-for-tests",
    algorithm="HS256",
)
AUTH_HEADERS = {"Authorization": f"Bearer {MOCK_TOKEN}"}


@pytest.mark.asyncio
async def test_concept_graph_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/api/v1/concepts/graph", headers=AUTH_HEADERS)
        assert resp.status_code == 200
        data = resp.json()["data"]
        assert len(data["nodes"]) >= 5
        assert len(data["edges"]) >= 5
        assert data["nodes"][0]["data"]["label"] is not None


@pytest.mark.asyncio
async def test_concept_detail_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Check Scaled Dot-Product Attention
        cid = "c0000000-0000-0000-0000-000000000003"
        resp = await client.get(f"/api/v1/concepts/{cid}", headers=AUTH_HEADERS)
        assert resp.status_code == 200
        data = resp.json()["data"]
        assert data["concept"]["name"] == "Scaled Dot-Product Attention"
        assert len(data["prerequisites"]) >= 1
        assert len(data["linked_resources"]) >= 1


@pytest.mark.asyncio
async def test_mastery_overview_and_gaps_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Overview
        resp = await client.get("/api/v1/mastery", headers=AUTH_HEADERS)
        assert resp.status_code == 200
        data = resp.json()["data"]
        assert data["overall_mastery"] > 0
        assert len(data["subjects"]) >= 1

        # Gaps
        gaps_resp = await client.get("/api/v1/mastery/gaps", headers=AUTH_HEADERS)
        assert gaps_resp.status_code == 200
        gaps_data = gaps_resp.json()["data"]
        assert len(gaps_data["gaps"]) >= 1
        assert gaps_data["critical_count"] >= 0


@pytest.mark.asyncio
async def test_practice_questions_and_submission():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Fetch questions
        q_resp = await client.get("/api/v1/practice/questions", headers=AUTH_HEADERS)
        assert q_resp.status_code == 200
        questions = q_resp.json()["data"]
        assert len(questions) >= 1

        # 2. Submit answer
        first_q = questions[0]
        sub_resp = await client.post(
            "/api/v1/practice/submit",
            json={
                "question_id": first_q["id"],
                "selected_answer": first_q["correct_answer"],
            },
            headers=AUTH_HEADERS,
        )
        assert sub_resp.status_code == 200
        sub_data = sub_resp.json()["data"]
        assert sub_data["is_correct"] is True
        assert sub_data["bkt_update"]["posterior_mastery"] > 0


@pytest.mark.asyncio
async def test_flashcards_due_and_review():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Fetch due cards
        due_resp = await client.get("/api/v1/flashcards/due", headers=AUTH_HEADERS)
        assert due_resp.status_code == 200
        due_cards = due_resp.json()["data"]
        assert len(due_cards) >= 1

        # 2. Review card with rating 4
        fc_id = due_cards[0]["id"]
        rev_resp = await client.post(
            f"/api/v1/flashcards/{fc_id}/review",
            json={"quality_rating": 4},
            headers=AUTH_HEADERS,
        )
        assert rev_resp.status_code == 200
        rev_data = rev_resp.json()["data"]
        assert rev_data["new_repetition_number"] >= 1
        assert rev_data["new_easiness_factor"] >= 1.3


@pytest.mark.asyncio
async def test_learning_paths_generation_and_step():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. List paths
        list_resp = await client.get("/api/v1/learning-paths", headers=AUTH_HEADERS)
        assert list_resp.status_code == 200
        paths = list_resp.json()["data"]
        assert len(paths) >= 1

        # 2. Toggle step completion
        p = paths[0]
        step = p["steps"][0]
        toggle_resp = await client.put(
            f"/api/v1/learning-paths/{p['id']}/steps/{step['step_id']}",
            headers=AUTH_HEADERS,
        )
        assert toggle_resp.status_code == 200
        updated_path = toggle_resp.json()["data"]
        assert updated_path["steps"][0]["is_completed"] != step["is_completed"]
