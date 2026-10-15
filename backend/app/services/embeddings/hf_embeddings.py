"""
Hugging Face Embedding Service for Synapse.
Uses hosted Inference API for sentence-transformers models to produce dense vector embeddings.
Includes exponential backoff, retry logic, timeout handling, and input truncation safeguards.
"""

import asyncio
import random
import time
from typing import List, Optional
import httpx
from app.core.config import settings
from app.core.logging import logger
from app.core.exceptions import AIProviderException


class HuggingFaceEmbeddingService:
    def __init__(
        self,
        model_id: Optional[str] = None,
        token: Optional[str] = None,
        max_retries: int = 3,
        timeout: float = 30.0,
    ):
        self.model_id = model_id or settings.HF_EMBEDDING_MODEL
        self.token = token or settings.HF_TOKEN
        self.max_retries = max_retries
        self.timeout = timeout
        self.api_url = f"{settings.HF_API_BASE_URL}/{self.model_id}"

    async def get_embedding(self, text: str) -> List[float]:
        """Generates a single dense embedding vector for a text query or chunk."""
        embeddings = await self.get_embeddings_batch([text])
        if not embeddings:
            raise AIProviderException("Failed to generate embedding: empty result returned")
        return embeddings[0]

    async def get_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """
        Generates dense vector embeddings for a batch of texts.
        Implements exponential backoff with jitter on 429/503 errors.
        """
        if not texts:
            return []

        if not self.token:
            raise AIProviderException(
                "Hugging Face token is not configured. Please supply HF_TOKEN in environment."
            )

        # Truncate overly long text strings to avoid model context overflow (~512 tokens max for miniLM)
        clean_texts = [t[:2000].strip() if len(t) > 2000 else t.strip() for t in texts]

        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }
        payload = {
            "inputs": clean_texts,
            "options": {"wait_for_model": True, "use_cache": True},
        }

        last_error = None
        for attempt in range(1, self.max_retries + 1):
            start_time = time.time()
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    response = await client.post(self.api_url, headers=headers, json=payload)

                latency = time.time() - start_time

                if response.status_code == 200:
                    data = response.json()
                    logger.info(
                        f"HF Embeddings success: {len(clean_texts)} items in {latency:.3f}s [model: {self.model_id}]"
                    )
                    # Response format: List of float lists
                    if isinstance(data, list):
                        return data
                    elif isinstance(data, dict) and "embeddings" in data:
                        return data["embeddings"]
                    else:
                        raise AIProviderException(f"Unexpected embedding response structure: {type(data)}")

                # Handle model loading (503) or rate limiting (429)
                if response.status_code in (429, 503):
                    retry_after = float(response.headers.get("retry-after", "2.0"))
                    backoff = retry_after + (2 ** attempt) + random.uniform(0.1, 0.5)
                    logger.warning(
                        f"HF rate limited / model loading (HTTP {response.status_code}). "
                        f"Attempt {attempt}/{self.max_retries}, retrying in {backoff:.2f}s..."
                    )
                    await asyncio.sleep(backoff)
                    continue

                error_detail = response.text
                logger.error(f"HF Embeddings HTTP {response.status_code}: {error_detail}")
                raise AIProviderException(
                    f"HTTP {response.status_code} from Hugging Face: {error_detail[:200]}"
                )

            except httpx.TimeoutException:
                logger.warning(f"HF Embeddings timeout on attempt {attempt}/{self.max_retries}")
                if attempt == self.max_retries:
                    raise AIProviderException(
                        f"Hugging Face embedding request timed out after {self.timeout}s"
                    )
                await asyncio.sleep(1.5 * attempt)
            except httpx.RequestError as exc:
                last_error = exc
                logger.warning(f"HF Embeddings connection error: {str(exc)}")
                if attempt == self.max_retries:
                    raise AIProviderException(f"Connection failure to Hugging Face API: {str(exc)}")
                await asyncio.sleep(1.0 * attempt)

        raise AIProviderException(f"Embedding request failed after {self.max_retries} retries: {str(last_error)}")


embedding_service = HuggingFaceEmbeddingService()
