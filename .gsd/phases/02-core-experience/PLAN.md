# PLAN.md — Phase 2: Core Experience

> **Phase**: 2 - Core Experience  
> **Status**: Ready for execution  
> **Objective**: Deliver complete public marketing pages, Supabase Auth integration, multi-step Onboarding Wizard, authenticated Application Shell with Command Palette, and the personalized Learning Dashboard.

---

## Context
- Requirements: REQ-06, REQ-07, REQ-08, REQ-09, REQ-10, NFR-01, NFR-02, NFR-06
- Strictly Light-Only Glassmorphism UI (#F7F8FC page background, translucent surfaces, blur backdrops, soft shadows, lavender/blue ambient gradients)
- Complete page navigation using `react-router-dom`

---

## Tasks

<task id="2.1">
<title>Public Marketing Website & Sub-Pages</title>
<description>
Create the public marketing suite in `frontend/src/pages/public/`:
1. `LandingPage.tsx`:
   - Hero section: "Turn What You Learn Into What You Know"
   - Interactive Knowledge Graph visualization preview
   - Product Preview Dashboard mockup
   - Feature Grid: Semantic RAG, Bayesian Mastery, Adaptive Practice, Spaced Repetition
   - How Synapse Works: Step-by-step cognitive retention loop
   - Privacy & Security: Highlighting PostgreSQL Row-Level Security
   - FAQ Accordion with common learning questions
   - Premium Footer with links
2. Dedicated sub-pages:
   - `FeaturesPage.tsx`: Deep-dive into each platform capability
   - `HowItWorksPage.tsx`: Cognitive science foundation (BKT, SM-2, retrieval practice)
   - `AboutPage.tsx`: Platform mission and methodology
   - `FAQPage.tsx`: Comprehensive searchable FAQ
   - `PrivacyPage.tsx` & `TermsPage.tsx`: Security and data rights
   - `ContactPage.tsx`: Working feedback and support request form
</description>
<verification>
Verify all routes resolve cleanly in React Router and build without TypeScript errors.
</verification>
</task>

<task id="2.2">
<title>Supabase Authentication & Multi-Step Onboarding Wizard</title>
<description>
Create authentication and user setup flows in `frontend/src/pages/auth/`:
1. `LoginPage.tsx`: Email/password login with real Supabase Auth integration, validation via React Hook Form + Zod, and setup-aware Google Sign-In notice.
2. `SignUpPage.tsx`: Registration with email confirmation handling and immediate redirection to onboarding.
3. `ForgotPasswordPage.tsx`: Password recovery with clear status feedback.
4. `OnboardingWizard.tsx`: Multi-step interactive wizard:
   - Step 1: Profile & Role (Student, Researcher, Engineer, Professional)
   - Step 2: Learning Goals & Subjects of Interest
   - Step 3: Current Knowledge Level & Target Exam/Goal
   - Step 4: Study Cadence (Minutes per day, study days)
   - Step 5: Initial Learning Plan Generation (recommending starting concepts)
   - Persists state to Supabase `profiles`, `user_preferences`, and `learning_goals` tables.
Create `frontend/src/services/supabase.ts` and `frontend/src/hooks/useAuth.ts` for session persistence and route protection.
</description>
<verification>
Ensure form validations trigger appropriately and auth state persists in React Context.
</verification>
</task>

<task id="2.3">
<title>Authenticated Application Shell, Command Palette & Personalized Dashboard</title>
<description>
Build the core SaaS application shell and dashboard:
1. `AppShell.tsx`:
   - Collapsible Left Sidebar with 13 functional navigation links, active states, badge counters, and responsive mobile drawer.
   - Glassmorphic Top Bar with semantic search input, Command Palette trigger (`Ctrl+K`), notifications popover, breadcrumbs, and profile avatar menu.
   - `CommandPalette.tsx`: Global search modal for instant navigation, concept lookup, and quick actions.
2. `DashboardPage.tsx`:
   - Dynamic welcome section greeting user with personalized study insight.
   - 6 Metric Cards: Knowledge Health, Concepts Mastered, Learning Streak, Retention Estimate, Study Time, Practice Accuracy.
   - Interactive Recharts Visualizations: Knowledge Evolution over time, Mastery by Subject radar/bar chart, Practice Activity heat/bar chart.
   - AI Insight Card with contextual study recommendations.
   - "Continue Learning" Queue: Recently viewed concepts, due flashcards, pending revisions.
3. `ProfilePage.tsx` & `SettingsPage.tsx`:
   - Account settings, study preferences, data export to JSON/CSV, and confirmed account deletion flow.
</description>
<verification>
Test full routing navigation across public, auth, and dashboard screens; verify responsive behavior on desktop, tablet, and mobile; run `npm run build`.
</verification>
</task>

---

## Success Criteria
- [ ] Public marketing site has functional routes for all 7 public pages.
- [ ] Authentication screens validate input with Zod and integrate with Supabase Auth client.
- [ ] Onboarding wizard guides users through 5 steps and persists preferences.
- [ ] Application Shell provides fluid collapsible navigation, mobile drawer, and Command Palette (`Ctrl+K`).
- [ ] Personalized Dashboard displays live metrics, interactive Recharts, and actionable "Continue Learning" queues.
- [ ] `npm run build` succeeds with zero errors.
