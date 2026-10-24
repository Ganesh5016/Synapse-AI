# PLAN.md — Phase 5: Learning Intelligence

> **Phase**: 5 - Learning Intelligence  
> **Status**: Ready for execution  
> **Objective**: Build the interactive React Flow knowledge graph, concept explorer detail views, Bayesian Knowledge Tracing (BKT) mastery estimation engine, automated knowledge gap detection, adaptive practice center with instant explanation, SM-2 spaced repetition flashcard queue, and personalized AI learning path generator.

---

## Context
- Requirements: REQ-23, REQ-24, REQ-25, REQ-26, REQ-27, REQ-28, REQ-29, NFR-01, NFR-02, NFR-03, NFR-04
- UI Design: Strictly Light-Only Glassmorphism UI (#F7F8FC background, translucent glass panels, subtle borders)
- Frontend graph library: `@xyflow/react` v12.3.2 (installed)
- Frontend charts: `recharts` v2.12.7 (installed)
- Database schema: `concepts`, `concept_relationships`, `concept_mastery`, `practice_questions`, `flashcards`, `flashcard_reviews`
- Cognitive learning algorithms:
  - Bayesian Knowledge Tracing (HMM with parameters $P(L_0), P(T), P(G), P(S)$)
  - SuperMemo SM-2 Spaced Repetition (Repetitions $n$, Easiness Factor $EF \ge 1.3$, Interval $I$)
  - Topological DAG prerequisite sequencing for Learning Paths

---

## Tasks

<task id="5.1">
<title>Interactive Knowledge Graph & Concept Explorer Details</title>
<description>
Build the interactive React Flow Knowledge Graph and Concept Explorer:
1. Backend Schemas & Router:
   - `backend/app/schemas/concepts.py`: Concept schemas (`ConceptResponse`, `ConceptGraphNode`, `ConceptGraphEdge`, `ConceptGraphResponse`, `ConceptDetailResponse`, `ConceptMasterySummary`).
   - `backend/app/api/v1/concepts.py`:
     - `GET /api/v1/concepts/graph`: Returns nodes and edges formatted for React Flow, with subject filtering and user mastery status.
     - `GET /api/v1/concepts`: Lists all concepts with search, subject filter, and pagination.
     - `GET /api/v1/concepts/{id}`: Detailed concept view with prerequisites, linked notes, papers, and practice metrics.
2. Frontend Graph & Concept Detail Pages:
   - `frontend/src/pages/graph/KnowledgeGraphPage.tsx`:
     - Interactive `@xyflow/react` canvas with custom glassmorphic concept nodes.
     - Node colors reflect mastery level (Novice: slate, Developing: amber, Proficient: blue, Mastered: emerald).
     - Subject filter bar, search input, zoom controls, minimap, and node click detail drawer.
     - Quick actions: "Practice Concept", "Inspect Linked Notes", "View Learning Path".
   - `frontend/src/pages/graph/ConceptDetailPage.tsx`:
     - Header with mastery badge, difficulty tag, and domain taxonomy.
     - Prerequisite chain visualization (what to learn before / what unlocks next).
     - Linked library documents, notes excerpts, and formula equations.
</description>
<verification>
Verify concept graph endpoint returns valid nodes/edges and frontend renders without errors.
</verification>
</task>

<task id="5.2">
<title>Bayesian Knowledge Tracing (BKT) & Automated Knowledge Gap Detection</title>
<description>
Build cognitive science mastery estimation and gap diagnosis:
1. Backend BKT Service (`backend/app/services/learning/bkt_engine.py`):
   - Hidden Markov Model tracking mastery probability $P(L_t)$:
     - Update equations on practice observation $O_t \in \{\text{correct}, \text{incorrect}\}$:
       $$P(L_t \mid O_t = 1) = \frac{P(L_{t-1})(1 - P(S))}{P(L_{t-1})(1 - P(S)) + (1 - P(L_{t-1}))P(G)}$$
       $$P(L_t \mid O_t = 0) = \frac{P(L_{t-1})P(S)}{P(L_{t-1})P(S) + (1 - P(L_{t-1}))(1 - P(G))}$$
       $$P(L_{t+1}) = P(L_t \mid O_t) + (1 - P(L_t \mid O_t))P(T)$$
   - Categorizes mastery: Novice (<0.40), Developing (0.40–0.69), Proficient (0.70–0.89), Mastered (>=0.90).
2. Automated Knowledge Gap Detector (`backend/app/services/learning/gap_detector.py`):
   - Detects low-mastery concepts, retention decay over time, and broken prerequisite chains.
   - Generates actionable remediation items with severity ("Critical", "Moderate", "Minor") and recommended corrective action.
3. API Router (`backend/app/api/v1/mastery.py`):
   - `GET /api/v1/mastery`: Summary of user mastery across subjects.
   - `GET /api/v1/mastery/gaps`: Prioritized list of diagnosed knowledge gaps with remediation steps.
4. Frontend Knowledge Gaps Page (`frontend/src/pages/mastery/KnowledgeGapsPage.tsx`):
   - Glassmorphic diagnostic dashboard displaying severity pills, root cause analysis, decay indicators, and "Start Remediation Practice" buttons.
</description>
<verification>
Unit tests verifying mathematical accuracy of BKT posterior updates and gap detection logic.
</verification>
</task>

<task id="5.3">
<title>Adaptive Practice Center & SM-2 Spaced Repetition Flashcards</title>
<description>
Implement retrieval testing and spaced repetition engines:
1. Spaced Repetition Scheduler (`backend/app/services/learning/sm2_scheduler.py`):
   - Standard SM-2 algorithm:
     - Rating $q \in \{0, 1, 2, 3, 4, 5\}$
     - If $q < 3$: $n = 0, I = 1$ (reset item)
     - If $q \ge 3$: $n = 1 \implies I = 1$, $n = 2 \implies I = 6$, $n > 2 \implies I = \text{round}(I \times EF)$
     - $EF' = \max(1.3, EF + (0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02)))$
2. Backend Routers:
   - `backend/app/api/v1/practice.py`:
     - `GET /api/v1/practice/questions`: Filter questions by concept or subject.
     - `POST /api/v1/practice/submit`: Grades answer, records attempt, triggers BKT mastery update.
   - `backend/app/api/v1/flashcards.py`:
     - `GET /api/v1/flashcards/due`: Returns due flashcards for today.
     - `POST /api/v1/flashcards/{id}/review`: Updates SM-2 interval and due date.
3. Frontend Practice & Flashcards Interfaces:
   - `frontend/src/pages/practice/PracticeCenterPage.tsx`:
     - Question runner supporting Multiple Choice, True/False, and Short Answer.
     - Hint reveal with progressive penalty, instant explanation on answer submission, live score, and completion recap.
   - `frontend/src/pages/flashcards/FlashcardsQueuePage.tsx`:
     - 3D card flipping interaction, SM-2 rating buttons (Again, Hard, Good, Easy), remaining queue counter, and progress bar.
</description>
<verification>
Verify SM-2 calculations and practice submission API updates BKT mastery state.
</verification>
</task>

<task id="5.4">
<title>Personalized AI Learning Path Generator & App Navigation Integration</title>
<description>
Build personalized curriculum planning:
1. Backend Learning Path Generator (`backend/app/services/learning/path_generator.py`):
   - Constructs directed acyclic graph (DAG) of concepts based on prerequisite relationships.
   - Generates sequenced milestone steps tailored to user target subjects and existing mastery gaps.
2. Router (`backend/app/api/v1/learning_paths.py`):
   - `GET /api/v1/learning-paths`: Lists active user learning paths.
   - `POST /api/v1/learning-paths/generate`: Generates personalized AI learning path for chosen goal.
   - `PUT /api/v1/learning-paths/{id}/steps/{step_id}`: Marks milestone step completed.
3. Frontend Learning Paths Page (`frontend/src/pages/learning-paths/LearningPathsPage.tsx`):
   - Visual milestone roadmap with progress badges, estimated hours, prerequisite indicators, and "Start Step" triggers.
4. Route & Navigation Wiring:
   - Wire `/graph`, `/concepts/:id`, `/practice`, `/flashcards`, `/gaps`, and `/learning-paths` in `App.tsx` and `AppShell.tsx`.
   - Update `DashboardPage.tsx` tab triggers to route directly to dedicated pages.
</description>
<verification>
Run `python -m pytest` and `npm run build` (`tsc -b && vite build`) to verify all tests and build pass with 0 errors.
</verification>
</task>

---

## Verification Evidence Plan

| Verification Target | Command / Check | Required Output |
|---------------------|-----------------|-----------------|
| Backend Pytest Suite | `python -m pytest` | All BKT, SM-2, graph, practice, and path tests pass |
| Frontend TypeScript | `npm run build` | 0 errors, clean asset emission |
| BKT Math Verification | `test_bkt.py` | Posterior bounds strictly within [0.0, 1.0] |
| SM-2 Math Verification | `test_sm2.py` | EF bounded $\ge 1.3$, intervals expand accurately |
