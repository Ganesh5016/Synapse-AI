"""
Security and authentication module for Synapse backend.
Verifies Supabase JWT access tokens and derives authenticated user identity.
"""

from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from pydantic import BaseModel
from app.core.config import settings

bearer_scheme = HTTPBearer(auto_error=False)


class AuthenticatedUser(BaseModel):
    id: str
    email: str
    role: str = "authenticated"
    app_metadata: Dict[str, Any] = {}
    user_metadata: Dict[str, Any] = {}


def verify_supabase_token(token: str) -> Dict[str, Any]:
    """
    Decodes and validates a Supabase JWT access token.
    If SUPABASE_JWT_SECRET is configured, enforces signature validation.
    In local dev without secret, decodes payload and verifies basic claims.
    """
    try:
        if settings.SUPABASE_JWT_SECRET:
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated",
                options={"verify_exp": True},
            )
        else:
            # Fallback for local development or mock environments
            payload = jwt.decode(
                token,
                options={"verify_signature": False, "verify_exp": False},
            )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session token has expired. Please re-authenticate.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> AuthenticatedUser:
    """
    FastAPI dependency to enforce authentication on protected endpoints.
    Derives user ID strictly from the verified JWT sub claim.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header with Bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = verify_supabase_token(credentials.credentials)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload is missing subject ('sub') claim",
            headers={"WWW-Authenticate": "Bearer"},
        )

    email = payload.get("email", "")
    role = payload.get("role", "authenticated")
    app_metadata = payload.get("app_metadata", {})
    user_metadata = payload.get("user_metadata", {})

    return AuthenticatedUser(
        id=user_id,
        email=email,
        role=role,
        app_metadata=app_metadata,
        user_metadata=user_metadata,
    )


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> Optional[AuthenticatedUser]:
    """
    FastAPI dependency for endpoints that support both public and authenticated views.
    """
    if not credentials:
        return None
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None
