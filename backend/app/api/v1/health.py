"""
Health check endpoints for Synapse backend.
Distinguishes between liveness (/health) and dependency readiness (/health/ready).
"""

from fastapi import APIRouter, status, Response
import httpx
from datetime import datetime, timezone
from app.core.config import settings
from app.schemas.common import HealthCheckResponse, APIResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthCheckResponse)
async def liveness_check():
    """
    Basic liveness probe for container orchestration and load balancers.
    """
    return HealthCheckResponse(
        status="ok",
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
        timestamp=datetime.now(timezone.utc),
        services={"api": "online"},
    )


@router.get("/health/ready", response_model=HealthCheckResponse)
async def readiness_check(response: Response):
    """
    Readiness probe validating external service configurations (Supabase, Hugging Face).
    Returns 200 if fully ready, or 503 if critical dependencies are misconfigured.
    """
    services_status = {}
    is_ready = True

    # 1. Check Supabase Config
    if settings.SUPABASE_URL and "localhost" not in settings.SUPABASE_URL:
        services_status["supabase"] = "configured"
    else:
        services_status["supabase"] = "local_dev_fallback"

    # 2. Check Hugging Face Config
    if settings.HF_TOKEN:
        services_status["huggingface"] = "configured"
    else:
        services_status["huggingface"] = "missing_token_fallback"
        # Note: In development mode, we allow partial readiness with fallback warning
        if settings.ENVIRONMENT == "production":
            is_ready = False

    overall_status = "ready" if is_ready else "degraded"
    if not is_ready:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    return HealthCheckResponse(
        status=overall_status,
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
        timestamp=datetime.now(timezone.utc),
        services=services_status,
    )
