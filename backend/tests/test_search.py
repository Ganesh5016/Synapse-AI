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
async def test_search_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "query": "transformer attention key query value vectors",
            "match_count": 3,
            "threshold": 0.40
        }
        res = await client.post("/api/v1/search", json=payload, headers=AUTH_HEADERS)
        assert res.status_code == 200
        data = res.json()["data"]
        assert data["query"] == payload["query"]
        assert "results" in data
        assert isinstance(data["results"], list)
        if len(data["results"]) > 0:
            top_hit = data["results"][0]
            assert "similarity" in top_hit
            assert "page_number" in top_hit
            assert "content" in top_hit
