---
milestone: v1.0
version: 1.0.0
updated: 2026-10-15T12:30:00Z
---

# ROADMAP.md — Synapse Platform Roadmap

> **Current Phase:** Phase 1 — Foundation
> **Status:** 🔄 In Progress

---

## Must-Haves (from SPEC)

- [ ] Complete full-stack application (React 18+ Vite frontend, FastAPI Python backend, Supabase DB/Auth/Storage)
- [ ] Strictly light-only glassmorphism design system (#F7F8FC page bg, translucent surfaces, blur, no dark theme)
- [ ] Real Supabase PostgreSQL database schema (30 tables) and Row Level Security (RLS) policies
- [ ] Live Hugging Face inference for embeddings, summarization, generation, and grounded RAG with real citations
- [ ] Interactive React Flow knowledge graph and concept mastery explorer
- [ ] Adaptive Practice Center with multiple question types, hints, and scoring
- [ ] SM-2 spaced repetition flashcards with due-queue management
- [ ] Bayesian Knowledge Tracing / mastery estimation and automated knowledge gap detection
- [ ] Study planner, project workspaces, and Recharts learning analytics
- [ ] Automated testing suite, deployment configs, and complete technical documentation

---

## Phases

### Phase 1: Foundation
**Status:** ✅ Complete
**Objective:** Establish core repository structure, light-only glassmorphism design system tokens, Supabase database migrations (30 tables + RLS + pgvector), FastAPI backend architecture with JWT auth verification, and environment configurations.
**Requirements:** REQ-01, REQ-02, REQ-03, REQ-04, REQ-05, NFR-01, NFR-04, NFR-05

**Plans:**
- [x] Plan 1.1: Project scaffolding & light glassmorphism design system setup (Vite, Tailwind, CSS variables, tokens)
- [x] Plan 1.2: Supabase database schema migrations (30 tables, constraints, indexes, RLS policies, seed script)
- [x] Plan 1.3: FastAPI backend core architecture (Pydantic models, Supabase JWT auth middleware, error handlers, config)

---

### Phase 2: Core Experience
**Status:** 🔄 In Progress
**Objective:** Deliver public marketing website, onboarding wizard, authenticated application shell, personalized dashboard, and user profile/settings.
**Depends on:** Phase 1
**Requirements:** REQ-06, REQ-07, REQ-08, REQ-09, REQ-10, NFR-02, NFR-06

**Plans:**
- [ ] Plan 2.1: Public marketing pages (Landing Page, Features, How It Works, About, FAQ, Legal)
- [ ] Plan 2.2: Supabase Auth flows & onboarding wizard (Sign Up, Sign In, Profile setup, Goal selection)
- [ ] Plan 2.3: Application shell, command palette, and personalized dashboard with live metrics

---

### Phase 3: Knowledge Management
**Status:** ⬜ Not Started
**Objective:** Build knowledge library, rich Markdown note editor, PDF upload & processing pipeline, text chunking, embedding generation, and hybrid semantic search.
**Depends on:** Phase 2
**Requirements:** REQ-11, REQ-12, REQ-13, REQ-14, REQ-15, REQ-16, NFR-03

**Plans:**
- [ ] Plan 3.1: Knowledge Library CRUD, filtering, tags, and Markdown notes editor with autosave
- [ ] Plan 3.2: PDF document upload to Supabase Storage, text extraction, chunking, and metadata storage
- [ ] Plan 3.3: Hugging Face vector embeddings generation, vector storage, and hybrid semantic retrieval

---

### Phase 4: AI Functionality
**Status:** ⬜ Not Started
**Objective:** Implement multi-model Hugging Face inference client, grounded RAG with strict source citations, conversational AI assistant, concept extraction, and question/flashcard generation.
**Depends on:** Phase 3
**Requirements:** REQ-17, REQ-18, REQ-19, REQ-20, REQ-21, REQ-22, NFR-07

**Plans:**
- [ ] Plan 4.1: Hugging Face inference service with resilience, exponential backoff, rate limiting, and health checks
- [ ] Plan 4.2: Grounded RAG engine and Synapse AI Assistant with source citation cards and conversation history
- [ ] Plan 4.3: Automated concept extraction, question generation, and flashcard generation with schema validation

---

### Phase 5: Learning Intelligence
**Status:** ⬜ Not Started
**Objective:** Build Bayesian Knowledge Tracing mastery estimation, knowledge gap detection, interactive React Flow knowledge graph, adaptive practice center, spaced repetition flashcard engine, and personalized learning paths.
**Depends on:** Phase 4
**Requirements:** REQ-23, REQ-24, REQ-25, REQ-26, REQ-27, REQ-28, REQ-29

**Plans:**
- [ ] Plan 5.1: Interactive React Flow Knowledge Graph and Concept Explorer detail pages
- [ ] Plan 5.2: Mastery tracking engine (BKT) and automated Knowledge Gap detection system
- [ ] Plan 5.3: Adaptive Practice Center (MCQ, True/False, Short Answer, Hints, Review) and SM-2 Spaced Repetition Flashcards
- [ ] Plan 5.4: Personalized AI Learning Path generation and progress tracker

---

### Phase 6: Planning & Analytics
**Status:** ⬜ Not Started
**Objective:** Implement study planner with calendar/agenda views, project knowledge mapping workspaces, comprehensive learning analytics with Recharts, report generation, and admin dashboard.
**Depends on:** Phase 5
**Requirements:** REQ-30, REQ-31, REQ-32, REQ-33, REQ-34

**Plans:**
- [ ] Plan 6.1: Study Planner & Revision Calendar (Weekly, Monthly, Daily views, Tasks, Deadlines)
- [ ] Plan 6.2: Project Knowledge Mapping workspaces linking notes, documents, and concepts
- [ ] Plan 6.3: Learning Analytics dashboard, weekly/monthly report generator, CSV export, and Admin overview

---

### Phase 7: Reliability & Release
**Status:** ⬜ Not Started
**Objective:** Complete automated test suites (frontend & backend), perform end-to-end user workflow verification, execute multi-user isolation audit, assemble deployment configurations, and finalize comprehensive documentation.
**Depends on:** Phase 6
**Requirements:** REQ-35, REQ-36, REQ-37

**Plans:**
- [ ] Plan 7.1: Frontend unit/component tests & Backend FastAPI Pytest test suite
- [ ] Plan 7.2: End-to-end workflow verification, multi-user isolation audit, and production build checks
- [ ] Plan 7.3: Production deployment configs, Dockerfiles, and complete technical documentation (API, DB, Architecture, Deployment)

---

## Progress Summary

| Phase | Status | Plans | Complete |
|-------|--------|-------|----------|
| 1. Foundation | 🔄 In Progress | 0/3 | 0% |
| 2. Core Experience | ⬜ Not Started | 0/3 | 0% |
| 3. Knowledge Management | ⬜ Not Started | 0/3 | 0% |
| 4. AI Functionality | ⬜ Not Started | 0/3 | 0% |
| 5. Learning Intelligence | ⬜ Not Started | 0/4 | 0% |
| 6. Planning & Analytics | ⬜ Not Started | 0/3 | 0% |
| 7. Reliability & Release | ⬜ Not Started | 0/3 | 0% |
