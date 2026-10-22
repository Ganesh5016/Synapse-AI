"""
Document Indexing and Vector Embedding Generation Engine.
Coordinates text chunking, batch Hugging Face embedding generation, and metadata mapping.
"""

from typing import List, Dict, Any, Optional
import uuid
from app.services.documents.chunker import RecursiveCharacterChunker, TextChunk
from app.services.embeddings.hf_embeddings import HuggingFaceEmbeddingService
from app.core.logging import logger
from app.core.exceptions import AIProviderException


class DocumentIndexerService:
    def __init__(
        self,
        embedding_service: Optional[HuggingFaceEmbeddingService] = None,
        chunk_size: int = 700,
        chunk_overlap: int = 100,
    ):
        self.chunker = RecursiveCharacterChunker(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        self.embedding_service = embedding_service or HuggingFaceEmbeddingService()

    async def index_document_pages(
        self,
        document_id: uuid.UUID,
        user_id: uuid.UUID,
        pages: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """
        Chunks pages and generates 384-dim dense vector embeddings.
        Returns a list of chunk dictionaries ready for insertion into `document_chunks`.
        """
        all_chunks: List[TextChunk] = []
        global_idx = 0

        for page in pages:
            page_num = page.get("page_number", 1)
            page_text = page.get("text", "")
            page_chunks = self.chunker.chunk_page(page_text, page_num, start_index=global_idx)
            all_chunks.extend(page_chunks)
            global_idx += len(page_chunks)

        if not all_chunks:
            logger.warning(f"No valid text chunks generated for document {document_id}")
            return []

        # Extract contents for batch vector embedding
        texts = [c.content for c in all_chunks]
        embeddings: List[List[float]] = []

        try:
            embeddings = await self.embedding_service.get_embeddings_batch(texts)
        except Exception as e:
            logger.error(f"Error generating embeddings for document {document_id}: {e}")
            # If Hugging Face is unreachable or token missing, generate placeholder 384-dim zeros
            # to allow offline pipeline continuity
            embeddings = [[0.0] * 384 for _ in texts]

        results = []
        for chunk, emb in zip(all_chunks, embeddings):
            results.append({
                "id": str(uuid.uuid4()),
                "document_id": str(document_id),
                "user_id": str(user_id),
                "chunk_index": chunk.chunk_index,
                "page_number": chunk.page_number,
                "content": chunk.content,
                "token_count": chunk.token_count,
                "embedding": emb,
            })

        return results
