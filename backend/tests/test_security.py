"""
Tests for Synapse JWT authentication and security module.
"""

import pytest
import jwt
from fastapi import HTTPException
from app.core.security import verify_supabase_token, AuthenticatedUser


def test_verify_valid_token_payload():
    # Construct a synthetic valid token with standard 32-byte HMAC key
    payload = {
        "sub": "b0000000-0000-0000-0000-000000000001",
        "email": "learner@synapse.ai",
        "role": "authenticated",
        "aud": "authenticated",
    }
    token = jwt.encode(payload, "secret-key-that-is-at-least-32-bytes-long", algorithm="HS256")
    
    # In development mode without SUPABASE_JWT_SECRET, unverified decode extracts payload
    decoded = verify_supabase_token(token)
    assert decoded["sub"] == "b0000000-0000-0000-0000-000000000001"
    assert decoded["email"] == "learner@synapse.ai"


def test_verify_malformed_token():
    with pytest.raises(HTTPException) as exc_info:
        verify_supabase_token("invalid.token.structure")
    assert exc_info.value.status_code == 401
