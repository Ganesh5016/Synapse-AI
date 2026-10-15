"""
V1 API router consolidating domain-specific sub-routers.
"""

from fastapi import APIRouter
from app.api.v1.health import router as health_router

api_v1_router = APIRouter(prefix="/api/v1")

# Mount health routes (available at both root and /api/v1 for convenience)
api_v1_router.include_router(health_router)
