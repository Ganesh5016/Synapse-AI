# ARCHITECTURE.md — Synapse System Architecture

> **System:** Synapse — AI Knowledge Evolution Platform  
> **Architecture Pattern:** Decoupled Client-Server with PostgreSQL/pgvector & Hosted Hugging Face AI Inference

---

## High-Level Topology

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (Frontend)                         │
│  React 18 + Vite + TypeScript + Tailwind CSS (Light Glassmorphism)     │
│  - Lucide Icons, Framer Motion, TanStack Query, React Hook Form + Zod  │
│  - React Flow (Interactive Knowledge Graph), Recharts (Analytics)      │
│  - Supabase JS Client (Auth session & token management)                │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ HTTPS / JWT Bearer
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        API LAYER (FastAPI Backend)                     │
│  Python 3.12+ / FastAPI / Pydantic v2 / httpx / PyPDF                  │
│  - Auth Middleware (JWT signature & claim verification)                │
│  - Rate Limiting, Request ID tracing, Centralized Error Handling       │
│  - Domain Services: Documents, Embeddings, RAG, Mastery, Practice      │
│  - Background Task Queue: PDF ingestion, chunking, graph generation    │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
                   │ PostgreSQL Protocol / REST      │ HTTPS (Inference API)
                   ▼                                 ▼
┌──────────────────────────────────────┐   ┌─────────────────────────────┐
│       DATABASE & STORAGE LAYER       │   │        AI / ML LAYER        │
│          (Supabase Cloud)            │   │      (Hugging Face)         │
│  - PostgreSQL 15+ with pgvector      │   │ - Embeddings: MiniLM-L6-v2  │
│  - Row Level Security (RLS) policies │   │ - Summarization: BART / LLM │
│  - 30 Normalized relational tables   │   │ - Text Generation & RAG     │
│  - Supabase Storage (Private PDFs)   │   │ - Exponential backoff/retry │
└──────────────────────────────────────┘   └─────────────────────────────┘
```

---

## Directory Organization

```
synapse/
  frontend/                  # React 18 + TypeScript + Vite SPA
    src/
      components/
        ui/                  # Glassmorphism UI primitives (Button, Card, Modal, Input, Badge, Skeleton)
        layout/              # AppShell, Sidebar, Header, Breadcrumbs, CommandPalette
        charts/              # Recharts analytics visualizations
        knowledge-graph/     # React Flow interactive nodes & edges
        learning/            # Practice, Flashcards, Learning Path components
      pages/
        public/              # Landing, Features, How It Works, FAQ, Legal
        auth/                # Login, Signup, Forgot Password, Onboarding Wizard
        dashboard/           # Personalized Metrics, Activity, AI Insight, Continue Learning
        library/             # Notes, Documents, Uploads, Markdown Editor
        knowledge/           # Knowledge Graph & Concept Explorer
        learning/            # Learning Paths & Recommendations
        practice/            # Adaptive Practice Center & Exam Mode
        flashcards/          # Spaced Repetition Flashcard Review
        planner/             # Study Planner, Calendar, Task Management
        analytics/           # Learning Analytics & Report Exports
        projects/            # Knowledge Mapping Project Workspaces
        profile/             # Settings, Preferences, Data Export
        admin/               # Operational Health & AI metrics
      hooks/                 # Custom React hooks (useAuth, useKnowledgeGraph, useMastery)
      services/              # API clients & Supabase browser client
      types/                 # TypeScript interfaces & types
      styles/                # index.css (Design tokens, glassmorphism utilities)
    package.json
    tailwind.config.js
    vite.config.ts

  backend/                   # FastAPI Python 3.12+ Service
    app/
      main.py                # FastAPI app initialization, CORS, middleware
      core/
        config.py            # Pydantic Settings (ENV loading, validation)
        security.py          # Supabase JWT decoding, token verification
        logging.py           # Structured JSON logging with request IDs
        exceptions.py        # Centralized exception handlers
      api/
        routes/              # Endpoints grouped by domain (auth, docs, notes, graph, ai, etc.)
      schemas/               # Pydantic v2 request/response schemas
      models/                # Domain models & database mappings
      services/
        documents/           # PDF text extraction & chunking
        embeddings/          # Hugging Face embedding generation
        retrieval/           # Vector similarity & hybrid search
        generation/          # Hugging Face LLM prompt generation & RAG
        knowledge_graph/     # Graph node/edge extraction & relationships
        mastery/             # Bayesian Knowledge Tracing & mastery tracking
        practice/            # Adaptive question selection & scoring
        flashcards/          # SM-2 spaced repetition engine
      workers/               # Asynchronous task handlers for PDF & AI batching
    requirements.txt
    Dockerfile

  supabase/
    migrations/              # SQL migrations for all 30 tables, RLS, pgvector
    seed.sql                 # Realistic synthetic seed data for development

  docs/                      # Comprehensive documentation
    ARCHITECTURE.md
    DATABASE.md
    API.md
    AI_MODELS.md
    DEPLOYMENT.md
    TESTING.md
```

---

## Data Flow Sequences

### 1. Document Ingestion & Vector Indexing
1. User uploads PDF via Frontend -> Supabase Storage (private bucket).
2. Backend receives upload notification / trigger.
3. PDF parser (`pypdf` / `pdfplumber`) extracts raw text and section metadata.
4. Chunker splits text into semantic chunks (~500 tokens with 100-token overlap).
5. Embedding service calls Hugging Face `sentence-transformers/all-MiniLM-L6-v2` to compute 384-dimensional dense vectors.
6. Chunks, metadata, and vectors are saved to `document_chunks` table in Supabase PostgreSQL with `user_id` ownership.
7. Concept extraction worker identifies key concepts and connects them to the user's `concepts` table.

### 2. Grounded RAG Query Sequence
1. User submits question via AI Assistant interface.
2. Backend verifies caller JWT and obtains `user_id`.
3. Question embedding is generated via Hugging Face embedding endpoint.
4. Cosine similarity search executes against `document_chunks` where `user_id == current_user`.
5. Top-K relevant chunks are assembled with source metadata (document name, page number, chunk id).
6. Generation model receives grounded prompt instructing it to answer strictly based on retrieved chunks and cite sources.
7. Backend validates the response schema, verifies citations, and streams or returns the grounded answer.

---

*Last updated: 2026-10-15*
