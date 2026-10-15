# DECISIONS.md — Architecture Decision Records

> **Purpose**: Log significant technical decisions and their rationale for Synapse.

---

## [DECISION-001] Strict Light Glassmorphism Design System

**Date**: 2026-10-15
**Status**: Accepted

### Context
User requirement explicitly specifies: "Use only the light theme. Do not implement a dark theme, dark-mode toggle, black dashboard, dark sidebar, or dark AI panels. Use premium glassmorphism, subtle gradients, elegant animations, responsive layouts, and excellent visual hierarchy."

### Decision
Implement design system using tokens:
- Page background: `#F7F8FC`
- Primary surface: `#FFFFFF`
- Secondary surface: `#F0F3FA`
- Primary text: `#20243A`
- Secondary text: `#69728A`
- Primary accent: `#7667F5`
- Secondary accent: `#9B8AFB`
- Success: `#229B72`, Warning: `#D99A32`, Error: `#D9536B`
- Border: `rgba(113, 122, 160, 0.16)`
- Blur: `backdrop-filter: blur(12px-20px)`

### Rationale
Ensures consistent visual identity without mixed themes or unreadable contrast. High contrast text with soft pastel and translucent glass panels creates a sophisticated SaaS aesthetic.

### Consequences
No dark mode toggles or dark variants will be created. All components must adhere to the light palette.

---

## [DECISION-002] Supabase PostgreSQL + Row Level Security (RLS)

**Date**: 2026-10-15
**Status**: Accepted

### Context
The platform requires authenticated user isolation, private document storage, vector similarity search, and relational integrity across 30+ tables.

### Decision
Use Supabase PostgreSQL 15+ with `pgvector` extension, Supabase Auth with JWT verification on FastAPI, and strict RLS policies on all user-owned tables. Service-role key stays strictly server-side.

### Rationale
Provides industry-standard security, atomic transactions, row-level multi-tenancy enforcement at the database layer, and seamless integration with frontend Supabase client for auth tokens.

---

## [DECISION-003] Hugging Face Inference for AI Pipeline

**Date**: 2026-10-15
**Status**: Accepted

### Context
Semantic understanding, document embeddings, summarization, and question generation must be executed through real AI models.

### Decision
Integrate Hugging Face Inference API via backend HTTP client (`httpx`) with configurable model IDs:
- Embeddings: `sentence-transformers/all-MiniLM-L6-v2` or `BAAI/bge-small-en-v1.5`
- Summarization: `facebook/bart-large-cnn` or `meta-llama/Llama-3.2-3B-Instruct`
- Generation & RAG: `meta-llama/Llama-3.2-3B-Instruct` / `mistralai/Mistral-7B-Instruct-v0.3`
Implement circuit breaker, exponential backoff, rate limit handling, and prompt grounding to enforce verified citations.

---

## [DECISION-004] Cognitive Mastery Modeling: Bayesian Knowledge Tracing & SM-2

**Date**: 2026-10-15
**Status**: Accepted

### Context
Learning progression must not rely merely on reading time or arbitrary scores; it requires cognitive evidence.

### Decision
- Track concept mastery via a documented multi-factor estimation model grounded in Bayesian Knowledge Tracing principles (prior mastery, slip, guess, transition probability).
- Implement the SuperMemo-2 (SM-2) algorithm for flashcard spaced repetition review schedules (calculating next repetition interval and ease factor based on performance grade 0-5).

---

*Last updated: 2026-10-15*
