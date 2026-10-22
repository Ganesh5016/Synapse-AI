import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app
import jwt

# Generate a mock token for test user
MOCK_USER_ID = "demo-user-1234-5678-90ab"
MOCK_TOKEN = jwt.encode(
    {"sub": MOCK_USER_ID, "email": "alex.chen@synapse.edu", "role": "authenticated"},
    "mock-secret-for-tests",
    algorithm="HS256"
)
AUTH_HEADERS = {"Authorization": f"Bearer {MOCK_TOKEN}"}


@pytest.mark.asyncio
async def test_list_notes():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/notes", headers=AUTH_HEADERS)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert isinstance(data["data"], list)
        assert len(data["data"]) >= 1


@pytest.mark.asyncio
async def test_create_and_delete_note():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "title": "Asymptotic Complexity Proofs",
            "content_markdown": "# Big-O Notation\n\nFormal proof that $T(n) = 3n^2 + 5n \\in O(n^2)$.",
            "tags": ["algorithms", "math"],
            "is_pinned": False
        }
        res = await client.post("/api/v1/notes", json=payload, headers=AUTH_HEADERS)
        assert res.status_code == 201
        created = res.json()["data"]
        note_id = created["id"]
        assert created["title"] == "Asymptotic Complexity Proofs"
        assert created["word_count"] > 0

        # Retrieve
        get_res = await client.get(f"/api/v1/notes/{note_id}", headers=AUTH_HEADERS)
        assert get_res.status_code == 200

        # Delete
        del_res = await client.delete(f"/api/v1/notes/{note_id}", headers=AUTH_HEADERS)
        assert del_res.status_code == 204
