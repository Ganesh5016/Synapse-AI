import pytest
from app.services.documents.chunker import RecursiveCharacterChunker


def test_recursive_chunker_basic():
    chunker = RecursiveCharacterChunker(chunk_size=200, chunk_overlap=30, min_chunk_size=20)
    sample_text = (
        "Transformer models rely on self-attention mechanisms to compute representations. "
        "Each token attends to every other token in parallel. "
        "This removes sequential recurrence and speeds up training significantly. "
        "Positional encodings provide information regarding the token order in sequences."
    )

    chunks = chunker.chunk_page(sample_text, page_number=1, start_index=0)
    assert len(chunks) >= 2
    assert chunks[0].page_number == 1
    assert chunks[0].chunk_index == 0
    assert chunks[0].token_count > 0
    assert len(chunks[0].content) >= 20


def test_recursive_chunker_empty_text():
    chunker = RecursiveCharacterChunker(chunk_size=200, chunk_overlap=30)
    chunks = chunker.chunk_page("   ", page_number=1)
    assert len(chunks) == 0
