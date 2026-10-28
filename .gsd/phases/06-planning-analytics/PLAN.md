# PLAN.md — Phase 6: Planning & Analytics

> **Phase**: 6 - Planning & Analytics  
> **Status**: Ready for execution  
> **Objective**: Implement comprehensive study scheduling, calendar/agenda planners, project knowledge mapping workspaces, multidimensional learning analytics, automated progress report generation, and administrative system controls.

---

## Context
- Requirements: REQ-30, REQ-31, REQ-32, REQ-33, REQ-34, NFR-01, NFR-02, NFR-04
- UI Design: Strictly Light-Only Glassmorphism UI (#F7F8FC background, translucent glass panels, subtle borders)
- Frontend charts: `recharts` v2.12.7
- Calendar/Scheduler: Responsive custom agenda & grid views (Day, Week, Month) with event drag/drop and status toggles.

---

## Tasks

<task id="6.1">
<title>Study Planner & Revision Calendar Engine</title>
<description>
Build the temporal study planning system:
1. Backend Schemas & Router:
   - `backend/app/schemas/planner.py`: `StudySessionResponse`, `StudySessionCreateRequest`, `StudyGoalItem`, `CalendarAgendaEvent`.
   - `backend/app/api/v1/planner.py`:
     - `GET /api/v1/planner/sessions`: Filter by date range, subject, or completion status.
     - `POST /api/v1/planner/sessions`: Schedule new study session or revision block.
     - `PUT /api/v1/planner/sessions/{id}`: Update time, mark attended/completed.
     - `GET /api/v1/planner/upcoming`: Quick widget endpoint for upcoming study deadlines.
2. Frontend Study Planner Page:
   - `frontend/src/pages/planner/StudyPlannerPage.tsx`:
     - Day, Week, and Month view switcher.
     - Interactive schedule grid with time blocks, concept associations, and session difficulty pills.
     - Quick "Add Study Session" modal with recurrence options and SM-2 due card integration.
     - Direct "Start Session" triggers routing to practice or flashcard queues.
</description>
<verification>
Unit tests for session scheduling and calendar queries; frontend build verification.
</verification>
</task>

<task id="6.2">
<title>Project Knowledge Mapping Workspaces</title>
<description>
Implement multi-modal project workspaces connecting research notes, documents, and concepts:
1. Backend Schemas & Router:
   - `backend/app/schemas/projects.py`: `ProjectWorkspaceResponse`, `ProjectWorkspaceCreateRequest`, `ProjectResourceLink`.
   - `backend/app/api/v1/projects.py`:
     - `GET /api/v1/projects`: List active research/curriculum projects.
     - `POST /api/v1/projects`: Create project workspace.
     - `GET /api/v1/projects/{id}`: Detailed workspace with linked notes, uploaded PDFs, concept subgraphs, and milestone checklists.
2. Frontend Project Workspace Page:
   - `frontend/src/pages/projects/ProjectWorkspacePage.tsx`:
     - Kanban/List milestone tracking.
     - Pinned concepts and linked research notes sidebar.
     - Export project brief as Markdown or PDF.
</description>
<verification>
API endpoints for project creation and linking; frontend workspace interaction test.
</verification>
</task>

<task id="6.3">
<title>Learning Analytics Dashboard & Report Generation</title>
<description>
Build comprehensive psychometric and progress reporting:
1. Backend Schemas & Analytics Router:
   - `backend/app/schemas/analytics.py`: `MasteryRadarMetric`, `CognitiveLoadMetric`, `StudyVelocityMetric`, `WeeklyReportResponse`.
   - `backend/app/api/v1/analytics.py`:
     - `GET /api/v1/analytics/overview`: Subject mastery distribution, retention projections, weekly study minutes.
     - `GET /api/v1/analytics/reports/weekly`: Automated weekly synthesis report with top breakthroughs, urgent gaps, and velocity index.
     - `GET /api/v1/analytics/export/csv`: Export learning activity data in standard CSV format.
2. Frontend Analytics & Reporting Pages:
   - `frontend/src/pages/analytics/MasteryAnalyticsPage.tsx`:
     - Recharts Radar chart (subject competency balance), Area charts (retention vs cognitive load), Bar charts (questions attempted vs accuracy).
     - Export data button (CSV download).
     - 1-click printable Weekly Learning Report modal.
</description>
<verification>
Pytest tests for analytics aggregation and CSV generation; frontend build verification.
</verification>
</task>

---

## Acceptance Criteria
- [ ] Users can view and manage study sessions across calendar views with live status toggling.
- [ ] Projects can aggregate notes, documents, and concept subgraphs into a unified workspace.
- [ ] Recharts radar and area visualizations illustrate multidimensional mastery growth and retention decay.
- [ ] CSV data export and weekly report synthesis endpoints operate securely with zero-trust user isolation.
- [ ] All frontend pages conform to strictly light-only glassmorphism design system.
