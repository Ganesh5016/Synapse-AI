"""
Main FastAPI application entry point for Synapse — AI Knowledge Evolution Platform.
Configures CORS, middleware, centralized exception handlers, logging, and routing.
"""

import time
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.core.exceptions import (
    SynapseException,
    synapse_exception_handler,
    http_exception_handler,
    validation_exception_handler,
    global_exception_handler,
)
from app.api.v1.router import api_v1_router
from app.api.v1.health import router as root_health_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle events: startup validation and graceful shutdown."""
    setup_logging()
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION} [{settings.ENVIRONMENT}]")
    if not settings.HF_TOKEN:
        logger.warning("HF_TOKEN is not configured. AI inference features will operate with offline fallback warnings.")
    if not settings.SUPABASE_JWT_SECRET:
        logger.warning("SUPABASE_JWT_SECRET is not configured. Running with development JWT validation.")
    yield
    logger.info(f"Shutting down {settings.APP_NAME}")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for Synapse — AI Knowledge Evolution Platform",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID", "X-Process-Time"],
)


@app.middleware("http")
async def request_tracing_middleware(request: Request, call_next):
    """
    Attaches unique X-Request-ID and measures X-Process-Time on every request.
    """
    request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
    request.state.request_id = request_id
    start_time = time.time()

    response = await call_next(request)

    process_time = time.time() - start_time
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    return response


# Register Exception Handlers
app.add_exception_handler(SynapseException, synapse_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# Mount Routes
app.include_router(root_health_router)
app.include_router(api_v1_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
