"""
Core configuration settings for Synapse Backend using Pydantic Settings.
Loads environment variables from .env file or host environment.
"""

from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # Application
    APP_NAME: str = "Synapse API"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # Security & CORS
    FRONTEND_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]
    JWT_SECRET_KEY: Optional[str] = None
    JWT_ALGORITHM: str = "HS256"

    # Supabase Configuration
    SUPABASE_URL: str = Field(default="https://sqpxcjgubxfesiimofjn.supabase.co", description="Supabase project URL")
    SUPABASE_ANON_KEY: str = Field(default="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxcHhjamd1YnhmZXNpaW1vZmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNDIwMjEsImV4cCI6MjEwNzYxODAyMX0.-Dd3CQPKOHgJV4LBDCQI6mGA-n9cDOUA8QIRwkZ9_SM", description="Supabase public anon key")
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = Field(default=None, description="Privileged service role key")
    SUPABASE_JWT_SECRET: Optional[str] = Field(default=None, description="Supabase JWT secret for verification")
    SUPABASE_STORAGE_BUCKET_DOCS: str = "documents"

    # Hugging Face AI Configuration
    HF_TOKEN: Optional[str] = Field(default=None, description="Hugging Face User Access Token")
    HF_API_BASE_URL: str = "https://api-inference.huggingface.co/models"
    HF_EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    HF_SUMMARIZATION_MODEL: str = "facebook/bart-large-cnn"
    HF_GENERATION_MODEL: str = "meta-llama/Llama-3.2-3B-Instruct"
    HF_RERANKER_MODEL: Optional[str] = "cross-encoder/ms-marco-MiniLM-L-6-v2"
    HF_REQUEST_TIMEOUT_SECONDS: float = 30.0
    HF_MAX_RETRIES: int = 3

    # Retrieval & RAG
    VECTOR_DIMENSION: int = 384
    MAX_RAG_CHUNKS: int = 5
    SIMILARITY_THRESHOLD: float = 0.45

    # Rate Limiting
    RATE_LIMIT_AI_REQUESTS_PER_MINUTE: int = 20
    RATE_LIMIT_BURST: int = 5


settings = Settings()
