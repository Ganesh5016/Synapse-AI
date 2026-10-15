# PLAN.md — Phase 1: Foundation

> **Phase**: 1 - Foundation  
> **Status**: Ready for execution  
> **Objective**: Scaffold the complete project foundation: frontend with light-only glassmorphism design system, comprehensive Supabase PostgreSQL schema with 30 tables and RLS, and modular FastAPI backend architecture.

---

## Context
- Requirements: REQ-01, REQ-02, REQ-03, REQ-04, REQ-05, NFR-01, NFR-04, NFR-05
- Design System: Light Glassmorphism only (#F7F8FC page background, #FFFFFF primary surface, #7667F5 primary accent, backdrop-blur, subtle gradients, soft shadows)
- Technologies: React 18 + TypeScript + Vite, Tailwind CSS, Python 3.12+ FastAPI, Supabase PostgreSQL with pgvector, RLS

---

## Tasks

<task id="1.1">
<title>Frontend Scaffolding & Light Glassmorphism Design System</title>
<description>
Initialize the `frontend/` directory with Vite React TypeScript. Install required dependencies: `tailwindcss`, `@tailwindcss/typography`, `lucide-react`, `framer-motion`, `clsx`, `tailwind-merge`, `react-router-dom`, `@tanstack/react-query`, `recharts`, `@xyflow/react`, `react-hook-form`, `zod`, `@hookform/resolvers`.
Configure `tailwind.config.js` and `src/styles/index.css` with the strict light glassmorphism palette, custom shadows, and glass utility classes (`glass-card`, `glass-panel`, `glass-input`, `glass-button`).
Create core UI primitives in `src/components/ui/` (Button, Card, Input, Badge, Skeleton, Dialog, Tooltip) and configure app routing shell.
</description>
<verification>
Run `npm run build` inside `frontend/` to ensure zero TypeScript errors and successful bundling.
</verification>
</task>

<task id="1.2">
<title>Supabase Database Schema Migrations & RLS Policies</title>
<description>
Create `supabase/migrations/20261015000001_initial_schema.sql` defining all 30 required tables:
1. `profiles`
2. `user_preferences`
3. `learning_goals`
4. `subjects`
5. `documents`
6. `document_chunks` (with pgvector embedding column)
7. `notes`
8. `concepts`
9. `concept_relationships`
10. `concept_sources`
11. `concept_mastery`
12. `knowledge_gaps`
13. `learning_paths`
14. `learning_path_steps`
15. `practice_questions`
16. `practice_sessions`
17. `practice_answers`
18. `flashcard_decks`
19. `flashcards`
20. `flashcard_reviews`
21. `study_tasks`
22. `study_sessions`
23. `projects`
24. `project_concepts`
25. `assistant_conversations`
26. `assistant_messages`
27. `notifications`
28. `user_feedback`
29. `ai_job_status`
30. `audit_events`
Include indexes, foreign keys with ON DELETE CASCADE, constraints, timestamps, and comprehensive RLS policies ensuring users can only read/write their own records.
Create `supabase/seed.sql` with synthetic development data.
</description>
<verification>
Inspect SQL syntax, verify table constraints, foreign keys, and RLS policies.
</verification>
</task>

<task id="1.3">
<title>FastAPI Backend Architecture & Security Middleware</title>
<description>
Create the `backend/` directory with `requirements.txt`, `app/main.py`, `app/core/config.py`, `app/core/security.py`, `app/core/logging.py`, `app/core/exceptions.py`.
Implement:
- Pydantic Settings for environment variables (Supabase URL, anon key, service-role key, Hugging Face token, models, frontend origins).
- JWT authentication middleware/dependency that extracts and verifies the Supabase bearer token and returns the current user profile.
- Centralized exception handlers for 400, 401, 403, 404, 422, 429, and 500 with standard JSON error structures.
- Structured JSON logging with unique Request IDs (`X-Request-ID`).
- Health endpoints (`GET /health` and `GET /health/ready`) checking database connectivity and Hugging Face configuration readiness.
- Root router `/api/v1` scaffolding.
</description>
<verification>
Run backend import check or test with Python to ensure all modules load without errors.
</verification>
</task>

---

## Success Criteria
- [ ] Frontend builds with zero errors (`npm run build`).
- [ ] Light glassmorphism design system tokens defined and ready for use.
- [ ] Complete Supabase SQL migration for 30 tables with RLS and seed data written.
- [ ] Backend FastAPI application bootstraps cleanly with security middleware, health checks, and standardized error responses.
- [ ] `.env.example` created for both frontend and backend.
