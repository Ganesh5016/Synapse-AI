# PLAN.md — Phase 4: AI Functionality

> **Phase**: 4 - AI Functionality  
> **Status**: Ready for execution  
> **Objective**: Implement multi-model Hugging Face inference client with resilience and rate limiting, grounded RAG engine with strict document/page citations, conversational AI assistant with session persistence, automated concept extraction, and structured question/flashcard generation.

---

## Context
- Requirements: REQ-17, REQ-18, REQ-19, REQ-20, REQ-21, REQ-22, NFR-03, NFR-04, NFR-05, NFR-06, NFR-07
- Light-Only Glassmorphism UI (#F7F8FC page background, translucent glass panels)
- Supabase tables: `assistant_conversations`, `assistant_messages`, `concepts`, `practice_questions`, `flashcards`
- Multi-Model Hugging Face Inference:
  - Embeddings: `sentence-transformers/all-MiniLM-L6-v2` (384-dim)
  - Summarization: `facebook/bart-large-cnn`
  - Generation / Chat: `meta-llama/Llama-3.2-3B-Instruct`
  - Reranker: `cross-encoder/ms-marco-MiniLM-L-6-v2`
- Strict zero-trust user data isolation (NFR-04) and graceful AI degradation (NFR-07)

---

## Tasks

<task id="4.1">
<title>Hugging Face Multi-Model Inference Service & Resilience Engine</title>
<description>
Build the centralized resilient AI inference service:
1. `backend/app/schemas/ai.py`:
   - Schemas for health, summarization, generation, RAG, concept extraction, questions, and flashcards.
2. `backend/app/services/ai/inference.py`:
   - Unified `HuggingFaceInferenceService`:
     - Embeddings generation (384-dim)
     - Text summarization via `facebook/bart-large-cnn`
     - Text generation via `meta-llama/Llama-3.2-3B-Instruct` (with structured JSON prompt formatting)
     - Exponential backoff with random jitter for HTTP 429 (rate-limit) and 503 (model loading)
     - In-memory sliding-window rate limiter per user/IP
     - Graceful offline fallback response generator when HF token is absent or upstream API is unavailable (NFR-07)
     - Model health status inspector (`get_health()`)
3. Unit tests for inference client, retry backoff, and fallback logic in `backend/tests/test_ai_inference.py`.
</description>
<verification>
Run backend pytest tests for inference service and rate limiter.
</verification>
</task>

<task id="4.2">
<title>Grounded RAG Pipeline & Conversational Assistant Endpoints</title>
<description>
Build the Grounded RAG engine and Assistant conversation APIs:
1. `backend/app/services/ai/rag_engine.py`:
   - Grounded RAG engine combining dense vector search and lexical matching over user's notes and document chunks.
   - Filter candidates by `user_id` to guarantee multi-user isolation.
   - Prompt formatting with explicit citation anchors `[1]`, `[2]`.
   - Explicit zero-hallucination guard: if no chunks exceed threshold, returns clear notice that the information is not in the user's corpus.
   - Citation extractor parsing references into structured citation objects (`chunk_id`, `document_title`, `page_number`, `similarity_score`, `snippet`).
2. `backend/app/api/v1/ai.py`:
   - `GET /api/v1/ai/health`: Returns model statuses, latency, and rate limit counters.
   - `POST /api/v1/ai/conversations`: Create conversation thread.
   - `GET /api/v1/ai/conversations`: List user conversation threads.
   - `GET /api/v1/ai/conversations/{id}`: Get conversation and message history.
   - `DELETE /api/v1/ai/conversations/{id}`: Delete conversation thread.
   - `POST /api/v1/ai/chat`: Send prompt, perform RAG retrieval, generate answer, save message & citations.
   - `POST /api/v1/ai/summarize`: Summarize raw text, note, or document.
3. Tests for RAG retrieval and conversation endpoints in `backend/tests/test_rag.py` and `backend/tests/test_ai_endpoints.py`.
</description>
<verification>
Run pytest to verify conversation CRUD and RAG response structure with verified citations.
</verification>
</task>

<task id="4.3">
<title>Automated Concept Extraction, Question Generation & Flashcard Generation</title>
<description>
Implement cognitive learning generators:
1. `backend/app/services/ai/extractor.py`:
   - Concept Extraction: extracts domain concepts, definitions, complexity level, and prerequisite relationships from note or document chunks.
   - Question Generation: generates multiple choice questions (with 4 options, correct answer, explanation), true/false questions, and short-answer prompts.
   - Flashcard Generation: produces front/back flashcard pairs with hints and tags.
2. `backend/app/api/v1/ai.py`:
   - `POST /api/v1/ai/extract-concepts`: Concept extraction endpoint.
   - `POST /api/v1/ai/generate-questions`: Practice question generation endpoint.
   - `POST /api/v1/ai/generate-flashcards`: Spaced repetition flashcard generation endpoint.
3. Integration with database persistence: ability to optionally save extracted concepts into `concepts`, generated questions into `practice_questions`, and flashcards into `flashcards`.
</description>
<verification>
Verify concept extraction, question generation, and flashcard generation endpoints return valid Pydantic schemas.
</verification>
</task>

<task id="4.4">
<title>Frontend Synapse AI Assistant & Grounded Learning Interface</title>
<description>
Create the frontend AI Assistant UI and integrate with library and notes:
1. `frontend/src/pages/assistant/AIAssistantPage.tsx`:
   - Light glassmorphism design (#F7F8FC background, blurred translucent panels, rich typography).
   - Sidebar with conversation threads (New Chat, active chats list, delete chat).
   - Grounded Mode toggle ("Strictly Grounded in My Documents" vs "General Learning Assistant").
   - Chat message thread with Markdown rendering, LaTeX math support, and avatar badges.
   - Source Citation Cards: expandable citation cards beneath assistant answers showing Document Title, Page number, chunk snippet, and relevance score, with click-to-preview modal.
   - Quick prompt starter chips ("Summarize my recent notes", "Extract key concepts from Chapter 2", "Quiz me on Attention Mechanisms").
   - Clear error states, loading skeletons, and token quota warnings.
2. Connect Navigation & Routes:
   - Add `/assistant` route in `App.tsx`.
   - Update `AppShell.tsx` navigation link for 'Grounded Assistant' to `/assistant`.
   - Update `CommandPalette.tsx` to include assistant actions.
   - Wire action buttons in `NotesEditorPage.tsx` ("Extract Concepts", "Generate Flashcards") and `KnowledgeLibraryPage.tsx` to invoke AI workflows.
</description>
<verification>
Run `npm run build` (`tsc -b && vite build`) to verify clean compilation with 0 errors.
</verification>
</task>

---

## Verification Evidence Plan

| Verification Target | Command / Check | Required Output |
|---------------------|-----------------|-----------------|
| Backend Pytest Suite | `python -m pytest` | All new AI and RAG tests pass |
| Frontend TypeScript | `npm run build` | 0 errors, clean asset emission |
| RAG Citations | API verification | Citation cards contain chunk_id, doc title, page, snippet |
| Graceful Degradation | Offline inference test | Non-crashing informative response |
