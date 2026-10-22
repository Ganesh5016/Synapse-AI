# PLAN.md — Phase 3: Knowledge Management

> **Phase**: 3 - Knowledge Management  
> **Status**: Ready for execution  
> **Objective**: Implement the Knowledge Library, rich Markdown note editor with autosave, PDF document ingestion pipeline (Supabase Storage + text extraction + semantic chunking), Hugging Face 384-dimensional vector embeddings, and hybrid semantic vector search over the user's corpus.

---

## Context
- Requirements: REQ-11, REQ-12, REQ-13, REQ-14, REQ-15, REQ-16, NFR-03, NFR-04, NFR-05, NFR-06
- Strictly Light-Only Glassmorphism UI
- PostgreSQL pgvector extension enabled (`match_document_chunks` RPC function)
- Hugging Face `all-MiniLM-L6-v2` 384-dim embedding model
- Supabase `documents` storage bucket with Row-Level Security

---

## Tasks

<task id="3.1">
<title>Knowledge Library & Rich Markdown Note Editor</title>
<description>
Create frontend and backend components for Knowledge Library and Notes management:
1. Backend Routers:
   - `backend/app/api/v1/notes.py`: Endpoints for `GET /api/v1/notes`, `POST /api/v1/notes`, `GET /api/v1/notes/{id}`, `PUT /api/v1/notes/{id}`, `DELETE /api/v1/notes/{id}`. Supports tag filtering, pinning, search, and subject assignment.
   - `backend/app/api/v1/subjects.py`: Endpoints for `GET /api/v1/subjects` (retrieving global and user-defined subjects).
   - `backend/app/schemas/notes.py` & `backend/app/schemas/subjects.py`: Pydantic request/response schemas.
2. Frontend Library & Note Editor:
   - `frontend/src/pages/library/KnowledgeLibraryPage.tsx`:
     - Filter tabs (All, Documents, Notes, Articles), subject filter pills, search input, sort options.
     - Document upload trigger modal, New Note modal/editor.
     - Grid/List view with cards showing title, snippet, word count, tags, subject badge, and quick actions.
   - `frontend/src/pages/notes/NotesEditorPage.tsx`:
     - Split/dual-mode Markdown editor with live preview (headings, lists, bold, code blocks, LaTeX equation blocks).
     - Autosave status indicator (Saving... / Saved), tag editor, word/character counter, pin toggle.
     - AI action quick menu: "Extract Concepts", "Generate Flashcards", "Summarize Key Takeaways".
</description>
<verification>
Verify notes CRUD endpoints via backend tests and verify frontend notes editor renders cleanly without errors.
</verification>
</task>

<task id="3.2">
<title>PDF Document Upload, Text Extraction & Chunking Pipeline</title>
<description>
Create document ingestion and parsing pipeline:
1. Backend Ingestion Engine:
   - `backend/app/services/documents/pdf_parser.py`: PyMuPDF / pypdf text extractor with page-by-page extraction, metadata parsing (title, author, page count, word count).
   - `backend/app/services/documents/chunker.py`: Recursive token/character chunker (500–800 chars target with 100 char sliding overlap), preserving sentence boundaries and recording page numbers.
   - `backend/app/api/v1/documents.py`:
     - `POST /api/v1/documents/upload`: Accepts multipart PDF files, validates size (< 25MB) and mime type, streams to Supabase Storage bucket `documents/{user_id}/{doc_id}.pdf`, creates `documents` record with `queued` status, and triggers background processing.
     - `GET /api/v1/documents`: Lists documents with pagination, subject filter, and processing statuses (`queued`, `processing`, `ready`, `failed`).
     - `GET /api/v1/documents/{id}`: Detailed document metadata with chunk count and preview.
     - `DELETE /api/v1/documents/{id}`: Deletes file from Supabase storage and cascades chunks/embeddings.
2. Frontend Upload Modal & Document Viewer:
   - `frontend/src/components/library/DocumentUploadModal.tsx`: Drag-and-drop PDF dropzone, upload progress bar, subject selector, and processing status polling.
   - `frontend/src/components/library/DocumentDetailModal.tsx`: Document chunk inspector, page preview, and citation viewer.
</description>
<verification>
Test document upload endpoint, verify chunk creation with correct page numbers and token counts.
</verification>
</task>

<task id="3.3">
<title>Vector Embeddings Pipeline & Hybrid Semantic Search</title>
<description>
Connect Hugging Face embeddings to document chunks and build semantic search:
1. Background Embeddings Worker:
   - `backend/app/services/documents/indexer.py`: Extracts chunks, calls `HuggingFaceEmbeddingService.get_embeddings_batch()`, inserts `document_chunks` rows with `vector(384)` embeddings, and updates `documents.processing_status = 'ready'`. Includes graceful fallback when HF API is rate-limited.
2. Hybrid Semantic Search API:
   - `backend/app/api/v1/search.py`:
     - `POST /api/v1/search`: Generates embedding for query, invokes `match_document_chunks` RPC function in PostgreSQL, performs lexical fallback/combination, and returns ranked chunks with document title, page number, content snippet, and cosine similarity score.
3. Frontend Global Search & Chunk Citations:
   - `frontend/src/pages/search/SearchPage.tsx` or Search drawer with similarity filter slider, subject filtering, and instant chunk previews with exact source highlights.
</description>
<verification>
Execute automated search tests with query embeddings and verify top-k chunk retrieval with cosine similarity scores.
</verification>
</task>

---

## Success Criteria
- [ ] Notes CRUD is fully operational with tags, subjects, and autosave.
- [ ] Markdown notes editor supports live preview, LaTeX syntax, and word counters.
- [ ] PDF document upload streams to Supabase Storage and records metadata.
- [ ] Text chunking splits documents into page-indexed segments with token counts.
- [ ] Hugging Face inference generates 384-dim embeddings for all chunks.
- [ ] Semantic search returns ranked document chunks with similarity scores and page citations.
- [ ] `npm run build` and `python -m pytest -v` pass with 100% success.
