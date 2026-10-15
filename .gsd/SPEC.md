# SPEC.md — Project Specification: Synapse — AI Knowledge Evolution Platform

> **Status**: `FINALIZED`
>
> ⚠️ **Planning Lock**: Requirements and specification are locked. Implementation proceeds according to the phased roadmap.

---

## Vision
**Synapse** is an AI Knowledge Evolution Platform designed to transform passive learning into active, evidence-grounded mastery. It unites personal knowledge management (notes, PDF ingestion, chunking, semantic vector indexing) with cognitive learning science (interactive knowledge graphs, Bayesian Knowledge Tracing, knowledge gap detection, SM-2 spaced repetition, and adaptive practice testing). Grounded in a user's own materials via Retrieval-Augmented Generation (RAG) powered by Hugging Face models, Synapse features an ultra-premium, light-only glassmorphism design system, real Supabase PostgreSQL authentication, storage, and row-level security.

---

## Goals

1. **Light-Only Glassmorphism User Experience**: Deliver an exceptionally polished, responsive (mobile, tablet, desktop) interface using Vite, React 18+, TypeScript, Tailwind CSS, Lucide icons, Framer Motion, Recharts, and React Flow. Strictly light theme (#F7F8FC page background, translucent surfaces, blur backdrops, soft shadows, lavender/blue ambient gradients).
2. **Production-Ready FastAPI Backend**: Build a modular, structured Python 3.12+ FastAPI application with Pydantic v2 schemas, JWT authentication against Supabase Auth, centralized exception handling, request ID tracing, background task execution, and rate limiting.
3. **Database Architecture & Zero-Trust RLS**: Architect a normalized Supabase PostgreSQL database schema across 30+ tables with UUID primary keys, foreign key constraints, indexes, pgvector embeddings, and comprehensive Row Level Security (RLS) policies guaranteeing total user isolation.
4. **Hugging Face AI & Grounded RAG**: Seamlessly integrate Hugging Face inference models for sentence embeddings, document summarization, question/flashcard generation, and conversational assistance. Enforce strict citations to user source notes/documents, evaluate answer faithfulness, and gracefully handle rate limits and outages without faking outputs.
5. **Cognitive Learning Engine**: Implement evidence-based mastery tracking (Bayesian Knowledge Tracing / multi-factor mastery estimation), automated knowledge gap detection, interactive React Flow knowledge graph visualization, SM-2 spaced repetition flashcards, and an adaptive practice center.
6. **Study Planning, Analytics & Workspaces**: Provide a full study planner with revision calendar, project knowledge mapping workspaces, comprehensive learning analytics with interactive Recharts, and exportable weekly/monthly reports.
7. **Empirical Quality & Deployment**: Deliver thorough unit, integration, and end-to-end tests, production Docker/deploy configs (Vercel + Render/Railway/Docker), seed data, and exhaustive documentation.

---

## Non-Goals (Out of Scope for v1.0)

- **Dark Theme / Dark Mode Toggle**: Explicitly prohibited per design requirements. The application is strictly Light Glassmorphism.
- **Simulated / Mock AI Responses**: No hardcoded demo text pretending to be AI. The system connects to live models with robust offline/error fallbacks and configuration alerts.
- **Client-Side Secret Exposure**: Supabase Service-Role key and Hugging Face tokens are strictly kept on the backend.
- **Arbitrary Code Execution**: No executing arbitrary model-generated Python, SQL, or shell scripts.
- **Multi-Tenant Public Collaboration in v1.0**: Workspaces and knowledge are strictly isolated per user; team collaboration is deferred to v2.0.

---

## Users & Personas

- **Lifelong Learners & Students**: Ingesting textbooks, research papers, and lecture notes to study efficiently with flashcards, quizzes, and personalized learning paths.
- **Knowledge Workers & Researchers**: Connecting complex concepts across technical domains, tracking concept mastery, identifying gaps, and querying their personal corpus via grounded AI.
- **Developers & Engineers**: Organizing architectural documentation, practicing technical concepts, and monitoring knowledge retention over time.

---

## Technical Constraints

- **Frontend**: React 18+, TypeScript, Vite, Tailwind CSS, Lucide React, Framer Motion, Recharts, React Flow (@xyflow/react), TanStack Query, React Hook Form, Zod.
- **Backend**: Python 3.12+, FastAPI, Pydantic v2, httpx, Pytest, PyPDF/pdfplumber, Supabase-py.
- **Database & Auth**: Supabase PostgreSQL 15+ with pgvector, Supabase Auth (JWT verification), Supabase Storage.
- **AI Inference**: Hugging Face Inference API / Inference Endpoints (`sentence-transformers` embeddings, text generation, summarization).
- **Environment**: Windows local host with Node.js v22.19, Python 3.13.

---

## Success Criteria

- [ ] **SC-01**: Clean build and type check on both frontend (`npm run build`) and backend (`pytest`).
- [ ] **SC-02**: Consistent, stunning light-only glassmorphism design implemented across all screens with zero dark theme elements or toggles.
- [ ] **SC-03**: Real Supabase Auth (signup, signin, session persistence, onboarding wizard, signout) working with protected route guards.
- [ ] **SC-04**: Complete PostgreSQL schema with 30+ tables and active RLS policies enforcing multi-user data isolation.
- [ ] **SC-05**: Document upload (PDF/Markdown/Text) to Supabase Storage with asynchronous chunking, embedding generation, and concept extraction.
- [ ] **SC-06**: Hybrid semantic search over notes and documents using cosine similarity on vector embeddings.
- [ ] **SC-07**: Grounded RAG AI Assistant citing verified source documents and page/chunk references.
- [ ] **SC-08**: Interactive React Flow knowledge graph rendering concept nodes, prerequisite links, and mastery levels with node filtering and inspection.
- [ ] **SC-09**: Adaptive Practice Center with multiple question types (MCQ, True/False, Short Answer), instant feedback, hints, and scoring.
- [ ] **SC-10**: SM-2 spaced repetition flashcard review system tracking intervals, ease factor, and due dates.
- [ ] **SC-11**: Evidence-based mastery tracking and automated knowledge gap detection based on practice performance.
- [ ] **SC-12**: Personalized AI learning path generation with reorderable steps and completion criteria.
- [ ] **SC-13**: Study planner with calendar/agenda views, task prioritization, and revision scheduling.
- [ ] **SC-14**: Comprehensive learning analytics with Recharts visualizations and CSV report exports.
- [ ] **SC-15**: Full deployment documentation, `.env.example` configurations, and Dockerfile setup.

---

*Last updated: 2026-10-15*
