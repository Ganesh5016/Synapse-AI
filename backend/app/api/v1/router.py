"""
V1 API router consolidating domain-specific sub-routers.
"""

from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.notes import router as notes_router
from app.api.v1.documents import router as documents_router
from app.api.v1.search import router as search_router
from app.api.v1.subjects import router as subjects_router
from app.api.v1.ai import router as ai_router

api_v1_router = APIRouter(prefix="/api/v1")

# Mount sub-routers
api_v1_router.include_router(health_router)
api_v1_router.include_router(notes_router)
api_v1_router.include_router(documents_router)
api_v1_router.include_router(search_router)
api_v1_router.include_router(subjects_router)
api_v1_router.include_router(ai_router)
