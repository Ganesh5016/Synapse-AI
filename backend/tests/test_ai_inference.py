import pytest
from app.services.ai.inference import HuggingFaceInferenceService, SlidingWindowRateLimiter
from app.core.exceptions import RateLimitException


@pytest.mark.asyncio
async def test_sliding_window_rate_limiter():
    limiter = SlidingWindowRateLimiter(limit=3, window_seconds=10)
    
    # 3 calls should succeed
    allowed1, rem1, _ = await limiter.check("test-user")
    assert allowed1 is True
    assert rem1 == 2

    allowed2, rem2, _ = await limiter.check("test-user")
    assert allowed2 is True
    assert rem2 == 1

    allowed3, rem3, _ = await limiter.check("test-user")
    assert allowed3 is True
    assert rem3 == 0

    # 4th call should be blocked
    allowed4, rem4, reset = await limiter.check("test-user")
    assert allowed4 is False
    assert rem4 == 0
    assert reset > 0

    # Different user key should not be blocked
    other_allowed, _, _ = await limiter.check("other-user")
    assert other_allowed is True


@pytest.mark.asyncio
async def test_fallback_embeddings_dimensions():
    service = HuggingFaceInferenceService()
    # Force offline fallback vectors
    service.token = None
    
    texts = ["Attention mechanisms in Transformers", "Gradient descent optimization"]
    embeddings = await service.get_embeddings(texts)
    
    assert len(embeddings) == 2
    assert len(embeddings[0]) == 384
    assert len(embeddings[1]) == 384
    
    # Check vectors are normalized (magnitude approx 1.0)
    import math
    norm0 = math.sqrt(sum(x * x for x in embeddings[0]))
    norm1 = math.sqrt(sum(x * x for x in embeddings[1]))
    assert abs(norm0 - 1.0) < 1e-4
    assert abs(norm1 - 1.0) < 1e-4


@pytest.mark.asyncio
async def test_fallback_summarization():
    service = HuggingFaceInferenceService()
    service.token = None
    
    long_text = (
        "Retrieval-Augmented Generation (RAG) is an AI framework for improving the quality of LLM responses. "
        "It leverages external knowledge bases to reference authoritative facts before generating a response. "
        "This substantially reduces hallucinations and provides verifiable provenance for users. "
        "In educational technology, RAG ensures that study assistants cite exact textbook pages and student notes."
    )
    
    resp = await service.summarize(long_text, max_length=200, min_length=30)
    assert resp.summary is not None
    assert len(resp.summary) > 0
    assert resp.original_length == len(long_text)
    assert "Fallback" in resp.model
    assert len(resp.key_points) > 0


@pytest.mark.asyncio
async def test_fallback_generation_with_citations():
    service = HuggingFaceInferenceService()
    service.token = None
    
    prompt = (
        "Context: [1] Deep Learning Book (p. 45): Backpropagation computes analytical gradients.\n"
        "[2] Attention Paper (p. 2): Scaled dot-product attention scales with sqrt(d_k).\n\n"
        "Question: How does scaled attention work?"
    )
    
    resp = await service.generate(prompt=prompt)
    assert resp.generated_text is not None
    assert "[1]" in resp.generated_text or "scaled attention" in resp.generated_text.lower()
    assert resp.model is not None


@pytest.mark.asyncio
async def test_ai_health_inspection():
    service = HuggingFaceInferenceService()
    health = await service.get_health()
    
    assert health.overall_status in ("healthy", "degraded", "offline")
    assert len(health.models) >= 3
    assert health.rate_limit_remaining >= 0
