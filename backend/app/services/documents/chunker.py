"""
Semantic Text Chunking Engine for Synapse.
Splits continuous text or page-by-page documents into bounded overlapping chunks
while preserving paragraph and sentence boundaries for optimal vector embedding.
"""

from typing import List, Dict, Any, Optional
import re


class TextChunk:
    def __init__(self, content: str, chunk_index: int, page_number: int, token_count: int):
        self.content = content
        self.chunk_index = chunk_index
        self.page_number = page_number
        self.token_count = token_count

    def to_dict(self) -> Dict[str, Any]:
        return {
            "content": self.content,
            "chunk_index": self.chunk_index,
            "page_number": self.page_number,
            "token_count": self.token_count,
        }


class RecursiveCharacterChunker:
    """
    Recursively splits text into chunks targeting `chunk_size` characters with `chunk_overlap`.
    Prioritizes double newlines, single newlines, sentence terminators, and spaces.
    """

    def __init__(
        self,
        chunk_size: int = 700,
        chunk_overlap: int = 100,
        min_chunk_size: int = 80,
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.min_chunk_size = min_chunk_size
        self.separators = ["\n\n", "\n", ". ", "; ", ", ", " "]

    def _estimate_tokens(self, text: str) -> int:
        """Rough token count estimation (~4 characters per token)."""
        return max(1, len(text) // 4)

    def chunk_page(self, page_text: str, page_number: int, start_index: int = 0) -> List[TextChunk]:
        """Splits a single document page text into TextChunk objects."""
        text = page_text.strip()
        if not text:
            return []

        chunks: List[str] = self._split_text(text)
        result: List[TextChunk] = []

        curr_idx = start_index
        for ch in chunks:
            clean = ch.strip()
            if len(clean) >= self.min_chunk_size:
                result.append(
                    TextChunk(
                        content=clean,
                        chunk_index=curr_idx,
                        page_number=page_number,
                        token_count=self._estimate_tokens(clean),
                    )
                )
                curr_idx += 1

        return result

    def _split_text(self, text: str) -> List[str]:
        if len(text) <= self.chunk_size:
            return [text]

        splits = self._split_by_separator(text, 0)
        return self._merge_splits(splits)

    def _split_by_separator(self, text: str, sep_idx: int) -> List[str]:
        if sep_idx >= len(self.separators):
            # Hard character slice as fallback
            return [text[i : i + self.chunk_size] for i in range(0, len(text), self.chunk_size)]

        sep = self.separators[sep_idx]
        parts = text.split(sep)
        final_splits = []

        for p in parts:
            if len(p) > self.chunk_size:
                sub_splits = self._split_by_separator(p, sep_idx + 1)
                final_splits.extend(sub_splits)
            else:
                final_splits.append(p)

        return final_splits

    def _merge_splits(self, splits: List[str]) -> List[str]:
        chunks = []
        current_chunk = []
        current_len = 0

        for s in splits:
            s_len = len(s)
            if current_len + s_len > self.chunk_size and current_chunk:
                chunk_str = " ".join(current_chunk).strip()
                if chunk_str:
                    chunks.append(chunk_str)

                # Overlap: keep the tail segment
                while current_chunk and current_len > self.chunk_overlap:
                    popped = current_chunk.pop(0)
                    current_len -= len(popped) + 1

            current_chunk.append(s)
            current_len += s_len + 1

        if current_chunk:
            final_str = " ".join(current_chunk).strip()
            if final_str:
                chunks.append(final_str)

        return chunks
