# Synapse — Cognitive Learning Intelligence Platform

Synapse is an AI-native cognitive learning platform engineered for university researchers, students, and lifelong learners. It unifies Bayesian knowledge modeling, spaced repetition scheduling, strict grounded retrieval-augmented generation (RAG), and multi-modal knowledge workspaces into a unified light-only glassmorphic environment.

---

## 🌟 Key Features

- **Strict Light-Only Glassmorphism**: Designed with visual translucency, soft depth, and backdrop blurs (`#F7F8FC`) to minimize cognitive fatigue during prolonged research sessions.
- **Interactive Knowledge Graph (`/graph`)**: Powered by React Flow v12 with custom nodes, prerequisite mapping, concept traversal, and real-time mastery badges.
- **Bayesian Knowledge Tracing (BKT)**: Implements a 2-state Hidden Markov Model tracking latent mastery probabilities ($P(L)$) with guess/slip compensation.
- **Automated Knowledge Gap Detection (`/mastery`)**: Traverses prerequisite graphs to identify critical foundational blockers and surfaces prescriptive remediation actions.
- **SuperMemo SM-2 Spaced Repetition (`/flashcards`)**: Adaptive flashcard scheduling with 3D card-flip animations, easiness factor updates, and daily due-queue management.
- **Adaptive Practice Center (`/practice`)**: Multi-format diagnostic testing (MCQ, True/False, Short Answer) with progressive hints and immediate mastery updates.
- **Grounded AI Assistant & RAG (`/ai`)**: Corpus-grounded conversational search that provides numerical source citations `[1]` linked directly to source notes and documents.
- **Study Planner & Calendar (`/planner`)**: Multi-view revision scheduling (Day, Week, Month) integrating practice drills, flashcard intervals, and research reading sessions.
- **Project Knowledge Workspaces (`/projects`)**: Unified synthesis environments linking Markdown notes, PDF research papers, concept subgraphs, and milestone tracking.
- **Multidimensional Learning Analytics (`/analytics`)**: Recharts radar charts for subject mastery distribution, cognitive load vs retention health trajectories, AI weekly synthesis reports, and CSV learning data export.
- **Global Command Palette (`Ctrl+K`)**: Rapid keyboard-driven navigation across notes, concepts, study sessions, and quick actions.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, React Flow v12 (`@xyflow/react`), Recharts, Lucide Icons, TanStack Query |
| **Backend** | Python 3.12+, FastAPI, Pydantic v2, Uvicorn, Pytest |
| **Database & Auth** | Supabase PostgreSQL 15, `pgvector`, Row Level Security (RLS), Supabase GoTrue Auth, Supabase Storage |
| **AI Inference** | Hugging Face Serverless Inference API (`BAAI/bge-small-en-v1.5`, `facebook/bart-large-cnn`, `mistralai/Mistral-7B-Instruct-v0.2`) |
| **DevOps & Containers** | Docker (multi-stage builds), Docker Compose, Nginx, Render Blueprint (`render.yaml`), Vercel (`vercel.json`) |

---

## 🚀 Quick Start

### Option A: Docker Compose (Recommended)

Run the entire platform locally with full container isolation:

```bash
# Clone the repository
git clone https://github.com/your-org/synapse.git
cd synapse

# Launch backend and frontend containers
docker compose up --build
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)
- **API Documentation (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Option B: Local Development

#### 1. Backend Setup
```bash
cd backend
python -m venv venv

# Windows (PowerShell)
.\venv\Scripts\Activate.ps1
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing & Verification

Synapse includes comprehensive test suites ensuring multi-user isolation, mathematical algorithm correctness, and end-to-end student lifecycle reliability:

```bash
# Run all backend tests (48 passing tests)
cd backend
python -m pytest tests/

# Run frontend typecheck and production build
cd frontend
npm run build
```

---

## 📚 Technical Documentation

Exhaustive technical documentation is available in the [`docs/`](./docs) directory:

- [System Architecture Guide](./docs/ARCHITECTURE.md) — Cognitive algorithms (BKT, SM-2), RAG pipeline, and glassmorphism design system rules.
- [API Reference](./docs/API_REFERENCE.md) — Endpoint specifications across all 14 REST routers.
- [Database Schema Reference](./docs/DATABASE_SCHEMA.md) — 30 relational tables, pgvector configurations, and Row Level Security policies.
- [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md) — Step-by-step production deployment on Render, Vercel, and Docker Compose.

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

