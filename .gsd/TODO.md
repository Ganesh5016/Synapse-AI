# TODO.md — Synapse Pending Items

## Phase 1: Foundation
- [ ] Initialize frontend Vite project with React 18 and TypeScript
- [ ] Configure Tailwind CSS with strict Light Glassmorphism design tokens (#F7F8FC page bg, translucent cards, backdrop blur, accent gradients)
- [ ] Install and configure UI libraries: lucide-react, framer-motion, clsx, tailwind-merge
- [ ] Author Supabase SQL migrations (30 tables, UUID PKs, pgvector extension, RLS policies, indexes)
- [ ] Author Supabase seed script with realistic synthetic data for dev preview
- [ ] Initialize Python FastAPI backend with Pydantic v2 schemas, JWT auth verification, logging, CORS, and health endpoints
- [ ] Create `.env.example` files for frontend and backend

## Future Phases
- [ ] Build landing page, onboarding wizard, app shell, and dashboard (Phase 2)
- [ ] Build knowledge library, PDF parser/chunker, embedding pipeline, hybrid search (Phase 3)
- [ ] Build Hugging Face AI assistant, grounded RAG, question/flashcard generator (Phase 4)
- [ ] Build knowledge graph, mastery tracking, practice center, SM-2 flashcards (Phase 5)
- [ ] Build study planner, project workspaces, analytics, export reports (Phase 6)
- [ ] Build test suites, multi-user isolation checks, Docker & deployment configs (Phase 7)
