import pytest
from app.services.ai.rag_engine import GroundedRAGEngine
from app.services.ai.inference import HuggingFaceInferenceService


@pytest.mark.asyncio
async def test_rag_retrieval_matching_chunks():
    rag = GroundedRAGEngine()
    user_id = "demo-user-1234-5678-90ab"
    
    # Query for transformer attention
    citations = rag.retrieve_context(
        query="Transformer self-attention dot product",
        user_id=user_id,
        top_k=3,
        similarity_threshold=0.30,
    )
    
    assert len(citations) > 0
    first = citations[0]
    assert first.similarity_score > 0
    assert first.snippet is not None
    assert first.document_title is not None


@pytest.mark.asyncio
async def test_rag_zero_hallucination_guard():
    rag = GroundedRAGEngine()
    user_id = "demo-user-1234-5678-90ab"
    
    # Query for something completely absent from user corpus with high threshold
    resp = await rag.answer_query(
        query="Ancient Roman architectural techniques in 200 BC",
        user_id=user_id,
        top_k=3,
        similarity_threshold=0.90,
        strictly_grounded=True,
    )
    
    assert resp.is_grounded is False
    assert len(resp.citations) == 0
    assert "no direct evidence" in resp.answer or "not present" in resp.answer.lower() or "no direct information" in resp.answer.lower()


@pytest.mark.asyncio
async def test_rag_grounded_answer_generation():
    rag = GroundedRAGEngine()
    user_id = "demo-user-1234-5678-90ab"
    
    resp = await rag.answer_query(
        query="Explain scaled dot product attention",
        user_id=user_id,
        top_k=3,
        similarity_threshold=0.30,
        strictly_grounded=True,
    )
    
    assert resp.is_grounded is True
    assert len(resp.citations) > 0
    assert resp.conversation_id is not None
    assert resp.message_id is not None
    assert len(resp.suggested_follow_ups) > 0
