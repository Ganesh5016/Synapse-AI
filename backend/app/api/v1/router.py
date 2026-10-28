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
from app.api.v1.concepts import router as concepts_router
from app.api.v1.mastery import router as mastery_router
from app.api.v1.practice import router as practice_router
from app.api.v1.flashcards import router as flashcards_router
from app.api.v1.learning_paths import router as learning_paths_router
from app.api.v1.planner import router as planner_router
from app.api.v1.projects import router as projects_router
from app.api.v1.analytics import router as analytics_router

api_v1_router = APIRouter(prefix="/api/v1")

# Mount sub-routers
api_v1_router.include_router(health_router)
api_v1_router.include_router(notes_router)
api_v1_router.include_router(documents_router)
api_v1_router.include_router(search_router)
api_v1_router.include_router(subjects_router)
api_v1_router.include_router(ai_router)
api_v1_router.include_router(concepts_router)
api_v1_router.include_router(mastery_router)
api_v1_router.include_router(practice_router)
api_v1_router.include_router(flashcards_router)
api_v1_router.include_router(learning_paths_router)
api_v1_router.include_router(planner_router)
api_v1_router.include_router(projects_router)
api_v1_router.include_router(analytics_router)
