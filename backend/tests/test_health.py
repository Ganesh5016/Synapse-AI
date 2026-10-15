"""
Tests for Synapse Health and Readiness Endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_liveness_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "version" in data
    assert "environment" in data
    assert data["services"]["api"] == "online"


def test_api_v1_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


def test_readiness_health_check():
    response = client.get("/health/ready")
    assert response.status_code in [200, 503]
    data = response.json()
    assert "supabase" in data["services"]
    assert "huggingface" in data["services"]


def test_request_id_and_process_time_headers():
    response = client.get("/health")
    assert "X-Request-ID" in response.headers
    assert "X-Process-Time" in response.headers
