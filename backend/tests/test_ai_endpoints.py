import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app
import jwt

MOCK_USER_ID = "demo-user-1234-5678-90ab"
MOCK_TOKEN = jwt.encode(
    {"sub": MOCK_USER_ID, "email": "alex.chen@synapse.edu", "role": "authenticated"},
    "mock-secret-for-tests",
    algorithm="HS256"
)
AUTH_HEADERS = {"Authorization": f"Bearer {MOCK_TOKEN}"}


@pytest.mark.asyncio
async def test_ai_health_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/api/v1/ai/health")
        assert resp.status_code == 200
        body = resp.json()
        assert body["success"] is True
        assert "models" in body["data"]
        assert len(body["data"]["models"]) >= 3


@pytest.mark.asyncio
async def test_ai_summarize_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "text": "Machine learning algorithms optimize mathematical objective functions using gradient updates on iterative batches of training samples.",
            "max_length": 150,
            "min_length": 20,
        }
        resp = await client.post("/api/v1/ai/summarize", json=payload, headers=AUTH_HEADERS)
        assert resp.status_code == 200
        data = resp.json()["data"]
        assert "summary" in data
        assert data["original_length"] > 0


@pytest.mark.asyncio
async def test_ai_conversations_crud():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Create conversation
        create_resp = await client.post(
            "/api/v1/ai/conversations",
            json={"title": "Test Attention Chat"},
            headers=AUTH_HEADERS,
        )
        assert create_resp.status_code == 201
        conv_id = create_resp.json()["data"]["id"]

        # 2. List conversations
        list_resp = await client.get("/api/v1/ai/conversations", headers=AUTH_HEADERS)
        assert list_resp.status_code == 200
        conv_list = list_resp.json()["data"]
        assert any(c["id"] == conv_id for c in conv_list)

        # 3. Get conversation detail
        get_resp = await client.get(f"/api/v1/ai/conversations/{conv_id}", headers=AUTH_HEADERS)
        assert get_resp.status_code == 200
        assert get_resp.json()["data"]["conversation"]["id"] == conv_id

        # 4. Delete conversation
        del_resp = await client.delete(f"/api/v1/ai/conversations/{conv_id}", headers=AUTH_HEADERS)
        assert del_resp.status_code == 200


@pytest.mark.asyncio
async def test_ai_grounded_chat_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "query": "How is the scaling factor in self-attention calculated?",
            "top_k": 3,
            "strictly_grounded": True,
        }
        resp = await client.post("/api/v1/ai/chat", json=payload, headers=AUTH_HEADERS)
        assert resp.status_code == 200
        data = resp.json()["data"]
        assert "answer" in data
        assert "citations" in data
        assert data["conversation_id"] is not None


@pytest.mark.asyncio
async def test_ai_extract_concepts_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "text": "Self-attention mechanisms allow input representations to interact with each other to compute dynamic contextual weights.",
            "max_concepts": 3,
        }
        resp = await client.post("/api/v1/ai/extract-concepts", json=payload, headers=AUTH_HEADERS)
        assert resp.status_code == 200
        data = resp.json()["data"]
        assert data["count"] > 0
        assert "concepts" in data


@pytest.mark.asyncio
async def test_ai_generate_questions_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "text": "Bayesian Knowledge Tracing predicts whether a student knows a skill based on observed correct and incorrect practice responses.",
            "count": 2,
            "difficulty": "intermediate",
            "question_types": ["multiple_choice", "true_false"],
        }
        resp = await client.post("/api/v1/ai/generate-questions", json=payload, headers=AUTH_HEADERS)
        assert resp.status_code == 200
        data = resp.json()["data"]
        assert data["count"] > 0
        assert len(data["questions"]) > 0


@pytest.mark.asyncio
async def test_ai_generate_flashcards_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "text": "In the SM-2 algorithm, intervals expand exponentially when review responses are graded with high recall quality.",
            "count": 3,
        }
        resp = await client.post("/api/v1/ai/generate-flashcards", json=payload, headers=AUTH_HEADERS)
        assert resp.status_code == 200
        data = resp.json()["data"]
        assert data["count"] > 0
        assert len(data["flashcards"]) > 0
