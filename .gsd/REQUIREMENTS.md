---
milestone: v1.0
updated: 2026-10-15T12:30:00Z
---

# REQUIREMENTS.md — Synapse Platform Requirements

## Functional Requirements

| ID | Requirement | Source | Phase | Status |
|----|-------------|--------|-------|--------|
| REQ-01 | Light-Only Glassmorphism Design System (#F7F8FC, translucency, blur, tokens) | SPEC Goal 1 | 1 | Pending |
| REQ-02 | Supabase Database Schema (30 tables, UUID PKs, indexes, pgvector) | SPEC Goal 3 | 1 | Pending |
| REQ-03 | Supabase Row Level Security (RLS) policies for total data isolation | SPEC Goal 3 | 1 | Pending |
| REQ-04 | Supabase Auth (Sign Up, Sign In, Session Restoration, Protected Routes) | SPEC Goal 2, 3 | 1 | Pending |
| REQ-05 | FastAPI Backend Architecture (Pydantic v2, JWT Auth, Centralized Errors) | SPEC Goal 2 | 1 | Pending |
| REQ-06 | Public Marketing Pages (Landing Page, Features, How It Works, FAQ, Legal) | SPEC Goal 1 | 2 | Pending |
| REQ-07 | Interactive Onboarding Wizard (Roles, Goals, Knowledge Level, Plan Gen) | SPEC Goal 1, 2 | 2 | Pending |
| REQ-08 | Authenticated Application Shell (Collapsible Nav, Top Bar, Command Bar) | SPEC Goal 1 | 2 | Pending |
| REQ-09 | Personalized Dashboard (Metrics, Charts, AI Insights, Continue Learning) | SPEC Goal 1, 6 | 2 | Pending |
| REQ-10 | User Profile & Settings Management (Preferences, Data Export, Deletion) | SPEC Goal 1, 2 | 2 | Pending |
| REQ-11 | Knowledge Library CRUD (Notes, Resources, Tags, Filters, Multi-type) | SPEC Goal 1, 2 | 3 | Pending |
| REQ-12 | Markdown Notes Editor (Autosave, Tags, Word Count, AI Action Bar) | SPEC Goal 1 | 3 | Pending |
| REQ-13 | PDF Document Upload & Background Ingestion (Supabase Storage, Extraction) | SPEC Goal 2, 4 | 3 | Pending |
| REQ-14 | Text Chunking & Hugging Face Vector Embeddings Pipeline | SPEC Goal 4 | 3 | Pending |
| REQ-15 | Hybrid Semantic & Lexical Search over User Corpus | SPEC Goal 4 | 3 | Pending |
| REQ-16 | Concepts & Relationships Management (CRUD, Linking, Taxonomy) | SPEC Goal 1, 5 | 3 | Pending |
| REQ-17 | Hugging Face Multi-Model Inference Integration (Embeddings, Summary, Gen) | SPEC Goal 4 | 4 | Pending |
| REQ-18 | Grounded RAG Pipeline with Strict Document & Chunk Source Citations | SPEC Goal 4 | 4 | Pending |
| REQ-19 | Synapse AI Conversational Assistant (History, Grounding, Streaming/Paging) | SPEC Goal 4 | 4 | Pending |
| REQ-20 | AI Concept & Keyterm Extraction from Uploaded Documents & Notes | SPEC Goal 4 | 4 | Pending |
| REQ-21 | AI Question & Flashcard Generation with Schema & Quality Validation | SPEC Goal 4 | 4 | Pending |
| REQ-22 | AI Inference Resilience (Retries, Exponential Backoff, Rate Limits, Health) | SPEC Goal 4 | 4 | Pending |
| REQ-23 | Evidence-Based Mastery Engine (BKT / Multi-Factor Estimation) | SPEC Goal 5 | 5 | Pending |
| REQ-24 | Automated Knowledge Gap Detection & Corrective Action Recommendations | SPEC Goal 5 | 5 | Pending |
| REQ-25 | Interactive React Flow Knowledge Graph (Nodes, Edges, Filtering, Detail) | SPEC Goal 1, 5 | 5 | Pending |
| REQ-26 | Concept Explorer Detail Pages with Mastery Badges & Practice History | SPEC Goal 1, 5 | 5 | Pending |
| REQ-27 | Adaptive Practice Center (MCQ, True/False, Short Answer, Hints, Review) | SPEC Goal 5 | 5 | Pending |
| REQ-28 | Spaced Repetition Flashcards Engine (SM-2 Algorithm, Due Queue, Decks) | SPEC Goal 5 | 5 | Pending |
| REQ-29 | Personalized AI Learning Paths (DAG Prerequisites, Reorderable Steps) | SPEC Goal 5 | 5 | Pending |
| REQ-30 | Study Planner & Revision Calendar (Weekly/Monthly/Daily, Reminders) | SPEC Goal 6 | 6 | Pending |
| REQ-31 | Project Knowledge Mapping Workspaces (Milestones, Linked Concepts) | SPEC Goal 6 | 6 | Pending |
| REQ-32 | Comprehensive Analytics Dashboard (Growth, Retention, Accuracy, Charts) | SPEC Goal 6 | 6 | Pending |
| REQ-33 | Learning Reports Generation & CSV Data Export | SPEC Goal 6 | 6 | Pending |
| REQ-34 | Operational Admin Dashboard (System Health, Latency, Token Usage) | SPEC Goal 2 | 6 | Pending |
| REQ-35 | Comprehensive Testing Suite (Frontend Unit/Integration, Backend Pytest) | SPEC Goal 7 | 7 | Pending |
| REQ-36 | End-to-End Workflow Verification & Multi-User Security Audit | SPEC Goal 7 | 7 | Pending |
| REQ-37 | Production Deployment Configuration & Complete System Documentation | SPEC Goal 7 | 7 | Pending |

---

## Non-Functional Requirements

| ID | Requirement | Category | Phase | Status |
|----|-------------|----------|-------|--------|
| NFR-01 | Strict Light-Only Glassmorphism UI (No Dark Theme / No Dark Mode Toggle) | UI/UX | 1-7 | Pending |
| NFR-02 | Fully Responsive Layouts (Desktop >=1440, Laptop 1024-1439, Tablet 768-1023, Mobile 320-767) | UI/UX | 1-7 | Pending |
| NFR-03 | API Response Time < 200ms for standard CRUD; async processing for heavy AI/PDF | Performance | 1-7 | Pending |
| NFR-04 | Zero-Trust Data Isolation via Supabase RLS and server-side token derivation | Security | 1-7 | Pending |
| NFR-05 | No Client-Side Secret Leakage (Service keys & HF tokens backend-only) | Security | 1-7 | Pending |
| NFR-06 | Robust Error Handling, Loading Skeletons, and Empty States for all views | UX/Reliability | 1-7 | Pending |
| NFR-07 | Graceful AI Degradation when model quotas or rate limits are reached | Reliability | 4 | Pending |

---

## Constraints

| ID | Constraint | Source | Impact |
|----|------------|--------|--------|
| CON-01 | React 18+ TypeScript Vite Frontend | Master Prompt | Strict framework compliance |
| CON-02 | Python 3.12+ FastAPI Backend | Master Prompt | Backend implementation |
| CON-03 | Supabase PostgreSQL, Auth, Storage, RLS | Master Prompt | Database & Auth stack |
| CON-04 | Hugging Face Inference API / Endpoints | Master Prompt | Embeddings and model inference |
| CON-05 | Light Theme Only (No Dark Theme) | Master Prompt | Design tokens and CSS rules |
