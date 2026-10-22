"""
PDF Text and Metadata Extraction Service.
Supports in-memory byte buffer parsing and file stream reading.
"""

import io
from typing import List, Dict, Any, Optional
from app.core.logging import logger
from app.core.exceptions import ValidationException


class PDFParserService:
    @staticmethod
    def extract_text_from_bytes(pdf_bytes: bytes) -> Dict[str, Any]:
        """
        Extracts page-by-page text and document metadata from raw PDF bytes.
        Returns:
            {
                "page_count": int,
                "total_chars": int,
                "pages": [{"page_number": int, "text": str}],
                "metadata": dict
            }
        """
        try:
            import pypdf
        except ImportError:
            raise ValidationException("pypdf is not installed. PDF parsing unavailable.")

        if not pdf_bytes:
            raise ValidationException("Empty PDF payload supplied")

        stream = io.BytesIO(pdf_bytes)
        try:
            reader = pypdf.PdfReader(stream)
            page_count = len(reader.pages)
            pages: List[Dict[str, Any]] = []
            total_chars = 0

            for idx, page in enumerate(reader.pages):
                text = page.extract_text() or ""
                clean_text = text.strip()
                total_chars += len(clean_text)
                pages.append({
                    "page_number": idx + 1,
                    "text": clean_text
                })

            raw_meta = reader.metadata or {}
            metadata = {
                "title": getattr(raw_meta, "title", None) or "Untitled Document",
                "author": getattr(raw_meta, "author", None),
                "creator": getattr(raw_meta, "creator", None),
            }

            return {
                "page_count": page_count,
                "total_chars": total_chars,
                "pages": pages,
                "metadata": metadata,
            }
        except Exception as e:
            logger.error(f"Failed to parse PDF bytes: {e}")
            raise ValidationException(f"Invalid or corrupted PDF file: {str(e)}")
