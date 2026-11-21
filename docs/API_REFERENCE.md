# API Reference — Synapse REST API (v1)

The Synapse REST API provides 14 specialized routers under the `/api/v1` prefix. All endpoints (except public health checks) require an authenticated Supabase JWT Bearer token in the `Authorization` header:

```http
Authorization: Bearer <supabase_jwt_token>
```

All responses conform to the standard `APIResponse[T]` wrapper:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2026-10-29T10:00:00Z"
}
```

---

## 1. System & Health (`/api/v1/health`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/health` | Core platform readiness and uptime status | No |
| `GET` | `/health/ready` | Deep database, pgvector, and Hugging Face API checks | No |

---

## 2. Research Notes (`/api/v1/notes`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/notes` | Lists notes for the authenticated user (supports `subject_id`, `tag`, `search`) | Yes |
| `POST` | `/notes` | Creates a new research note with Markdown body and tags | Yes |
| `GET` | `/notes/{note_id}` | Retrieves a single note by ID (enforces user isolation) | Yes |
| `PUT` | `/notes/{note_id}` | Updates note title, markdown content, tags, or pinned state | Yes |
| `DELETE` | `/notes/{note_id}` | Soft/hard deletes a note belonging to user | Yes |

---

## 3. Documents & PDF Processing (`/api/v1/documents`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/documents` | Lists all uploaded PDF documents for user | Yes |
| `POST` | `/documents/upload` | Multipart PDF upload, text extraction, sliding-window chunking | Yes |
| `GET` | `/documents/{document_id}` | Retrieves document metadata and processing status | Yes |
| `GET` | `/documents/{document_id}/chunks` | Retrieves extracted text chunks and similarity metadata | Yes |
| `DELETE` | `/documents/{document_id}` | Deletes document and cascading chunks from storage | Yes |

---

## 4. Hybrid Search (`/api/v1/search`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/search` | Executes hybrid semantic (pgvector) and keyword search across notes & documents | Yes |

---

## 5. Subjects & Domains (`/api/v1/subjects`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/subjects` | Lists all active subject disciplines and visual themes | Yes |
| `GET` | `/subjects/{subject_id}` | Retrieves subject details, total concepts, and enrollments | Yes |

---

## 6. AI & Grounded Assistant (`/api/v1/ai`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/ai/health` | Status and latency of Hugging Face inference models | Yes |
| `POST` | `/ai/summarize` | Generates concise academic summary with key takeaways | Yes |
| `POST` | `/ai/chat` | Grounded RAG query returning verified citation cards `[1]` | Yes |
| `POST` | `/ai/ask` | Alias for Grounded RAG chat | Yes |
| `GET` | `/ai/conversations` | Lists conversational threads for current user | Yes |
| `POST` | `/ai/conversations` | Initiates new conversation thread | Yes |
| `GET` | `/ai/conversations/{id}` | Retrieves conversation message history | Yes |
| `DELETE` | `/ai/conversations/{id}` | Deletes conversation session | Yes |
| `POST` | `/ai/extract-concepts` | Extracts key concepts and definitions from arbitrary text | Yes |
| `POST` | `/ai/generate-questions` | Generates diagnostic questions from uploaded notes or text | Yes |
| `POST` | `/ai/generate-flashcards`| Generates SM-2 flashcard pairs with front/back/hints | Yes |

---

## 7. Knowledge Graph & Concepts (`/api/v1/concepts`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/concepts` | Lists concepts filtered by subject or keyword | Yes |
| `GET` | `/concepts/graph` | Returns full React Flow node & edge graph with prerequisite links | Yes |
| `GET` | `/concepts/{concept_id}`| Returns concept detail, prerequisite tree, and linked notes/papers | Yes |

---

## 8. Bayesian Knowledge Tracing & Mastery (`/api/v1/mastery`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/mastery` | Overview of user mastery, overall retention health, and radar distribution | Yes |
| `GET` | `/mastery/gaps` | Automated knowledge gap detection identifying critical prerequisite blockers | Yes |
| `POST` | `/mastery/update` | Directly recalculates BKT posterior based on concept observation | Yes |

---

## 9. Adaptive Practice Center (`/api/v1/practice`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/practice/questions` | Retrieves adaptive practice questions targeted to user's knowledge state | Yes |
| `POST` | `/practice/submit` | Submits question answer, returns correctness, explanation, and live BKT update | Yes |

---

## 10. SM-2 Spaced Repetition Flashcards (`/api/v1/flashcards`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/flashcards/decks` | Lists flashcard decks, card counts, and due counts | Yes |
| `GET` | `/flashcards/due` | Fetches cards currently due for review ($next\_due\_at \le now$) | Yes |
| `POST` | `/flashcards/{id}/review`| Submits SM-2 review rating (0-5), updates interval and easiness factor | Yes |

---

## 11. Personalized Learning Paths (`/api/v1/learning-paths`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/learning-paths` | Retrieves customized learning paths generated for user | Yes |
| `GET` | `/learning-paths/{id}`| Retrieves stage milestones, concept steps, and progress percentage | Yes |

---

## 12. Study Planner & Revision Calendar (`/api/v1/planner`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/planner/sessions` | Lists scheduled study sessions (supports completion & subject filters) | Yes |
| `POST` | `/planner/sessions` | Schedules a new study session, quiz block, or paper reading block | Yes |
| `GET` | `/planner/sessions/{id}`| Retrieves session details | Yes |
| `PUT` | `/planner/sessions/{id}`| Updates session schedule, duration, or toggles completion | Yes |
| `DELETE` | `/planner/sessions/{id}`| Cancels/deletes scheduled study session | Yes |

---

## 13. Project Knowledge Workspaces (`/api/v1/projects`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/projects` | Lists user's project workspaces with progress percentages | Yes |
| `POST` | `/projects` | Creates project workspace aggregating notes, papers, and milestones | Yes |
| `GET` | `/projects/{project_id}`| Retrieves project detail, linked notes, papers, and milestones | Yes |
| `PUT` | `/projects/{project_id}/milestones/{milestone_id}` | Toggles milestone completion state | Yes |
| `DELETE` | `/projects/{project_id}`| Deletes project workspace (enforcing user isolation) | Yes |

---

## 14. Learning Analytics & Reporting (`/api/v1/analytics`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/analytics/overview` | Multidimensional psychometric analytics, radar scores, cognitive load | Yes |
| `GET` | `/analytics/report/weekly`| AI-generated weekly synthesis report modal data and recommendations | Yes |
| `GET` | `/analytics/export/csv` | Streams learning activity and mastery progression in RFC 4180 CSV | Yes |

