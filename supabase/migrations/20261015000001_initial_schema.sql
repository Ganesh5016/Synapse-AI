-- Supabase Schema Migration: Synapse — AI Knowledge Evolution Platform
-- Migration: 20261015000001_initial_schema.sql
-- Description: Creates 30 normalized tables, pgvector extension, indexes, RLS policies, and search helper functions.

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Function to handle updated_at timestamp automatically
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 1. PROFILES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'student',
    bio TEXT,
    educational_level TEXT DEFAULT 'undergraduate',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trigger_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 2. USER PREFERENCES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    daily_study_minutes INT DEFAULT 30,
    preferred_days TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    notification_email BOOLEAN DEFAULT TRUE,
    notification_in_app BOOLEAN DEFAULT TRUE,
    timezone TEXT DEFAULT 'UTC',
    light_mode_accent TEXT DEFAULT '#7667F5',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT user_preferences_user_id_key UNIQUE (user_id)
);
CREATE TRIGGER trigger_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 3. LEARNING GOALS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.learning_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_date DATE,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
    progress_percentage NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trigger_learning_goals_updated_at BEFORE UPDATE ON public.learning_goals FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 4. SUBJECTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL means global subject
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    color_hex TEXT DEFAULT '#7667F5',
    icon_name TEXT DEFAULT 'BookOpen',
    is_custom BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trigger_subjects_updated_at BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 5. DOCUMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    page_count INT DEFAULT 0,
    processing_status TEXT DEFAULT 'queued' CHECK (processing_status IN ('uploading', 'queued', 'processing', 'ready', 'failed')),
    error_message TEXT,
    summary TEXT,
    processing_version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trigger_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 6. DOCUMENT CHUNKS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    page_number INT DEFAULT 1,
    content TEXT NOT NULL,
    token_count INT,
    embedding vector(384),
    embedding_model TEXT DEFAULT 'sentence-transformers/all-MiniLM-L6-v2',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_doc_chunks_user_id ON public.document_chunks(user_id);
CREATE INDEX IF NOT EXISTS idx_doc_chunks_document_id ON public.document_chunks(document_id);

-- ============================================================================
-- 7. NOTES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT DEFAULT '',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_favorite BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    word_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trigger_notes_updated_at BEFORE UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);

-- ============================================================================
-- 8. CONCEPTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.concepts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    ai_summary TEXT,
    difficulty_level TEXT DEFAULT 'intermediate' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT concepts_user_name_unique UNIQUE(user_id, name)
);
CREATE TRIGGER trigger_concepts_updated_at BEFORE UPDATE ON public.concepts FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 9. CONCEPT RELATIONSHIPS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.concept_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    source_concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
    target_concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
    relationship_type TEXT DEFAULT 'prerequisite' CHECK (relationship_type IN ('prerequisite', 'related_to', 'part_of', 'generalization_of')),
    confidence NUMERIC(3,2) DEFAULT 1.00,
    creation_method TEXT DEFAULT 'manual' CHECK (creation_method IN ('manual', 'ai_extracted')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_concepts_distinct CHECK (source_concept_id <> target_concept_id)
);

-- ============================================================================
-- 10. CONCEPT SOURCES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.concept_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE,
    page_number INT,
    citation_snippet TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 11. CONCEPT MASTERY
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.concept_mastery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
    mastery_score NUMERIC(4,3) DEFAULT 0.000 CHECK (mastery_score >= 0.000 AND mastery_score <= 1.000),
    mastery_status TEXT DEFAULT 'not_assessed' CHECK (mastery_status IN ('not_assessed', 'learning', 'developing', 'proficient', 'mastered')),
    attempts_count INT DEFAULT 0,
    correct_count INT DEFAULT 0,
    confidence_avg NUMERIC(3,2) DEFAULT 0.00,
    last_practiced_at TIMESTAMPTZ,
    next_review_due TIMESTAMPTZ,
    bkt_p_know NUMERIC(4,3) DEFAULT 0.100,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT concept_mastery_user_concept_unique UNIQUE(user_id, concept_id)
);
CREATE TRIGGER trigger_concept_mastery_updated_at BEFORE UPDATE ON public.concept_mastery FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 12. KNOWLEDGE GAPS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.knowledge_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
    gap_reason TEXT NOT NULL,
    severity TEXT DEFAULT 'moderate' CHECK (severity IN ('low', 'moderate', 'critical')),
    evidence_data JSONB DEFAULT '{}'::JSONB,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'addressed', 'dismissed')),
    recommended_action TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trigger_knowledge_gaps_updated_at BEFORE UPDATE ON public.knowledge_gaps FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 13. LEARNING PATHS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    target_goal TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    estimated_hours NUMERIC(4,1) DEFAULT 10.0,
    completion_percentage NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trigger_learning_paths_updated_at BEFORE UPDATE ON public.learning_paths FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 14. LEARNING PATH STEPS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.learning_path_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_path_id UUID NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    concept_id UUID REFERENCES public.concepts(id) ON DELETE SET NULL,
    step_order INT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    estimated_minutes INT DEFAULT 30,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 15. PRACTICE QUESTIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.practice_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    concept_id UUID REFERENCES public.concepts(id) ON DELETE SET NULL,
    document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    question_type TEXT DEFAULT 'mcq' CHECK (question_type IN ('mcq', 'true_false', 'short_answer', 'fill_blank')),
    difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    prompt TEXT NOT NULL,
    options JSONB, -- Array of strings for MCQ
    correct_answer TEXT NOT NULL,
    explanation TEXT NOT NULL,
    hint TEXT,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    is_reported BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 16. PRACTICE SESSIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.practice_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    mode TEXT DEFAULT 'practice' CHECK (mode IN ('practice', 'exam', 'gap_review')),
    total_questions INT NOT NULL DEFAULT 5,
    score_percentage NUMERIC(5,2),
    completed_at TIMESTAMPTZ,
    duration_seconds INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 17. PRACTICE ANSWERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.practice_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.practice_sessions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.practice_questions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    confidence_rating INT DEFAULT 3 CHECK (confidence_rating BETWEEN 1 AND 5),
    time_spent_seconds INT DEFAULT 0,
    hint_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 18. FLASHCARD DECKS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.flashcard_decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    card_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trigger_flashcard_decks_updated_at BEFORE UPDATE ON public.flashcard_decks FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 19. FLASHCARDS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_id UUID NOT NULL REFERENCES public.flashcard_decks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    concept_id UUID REFERENCES public.concepts(id) ON DELETE SET NULL,
    front_text TEXT NOT NULL,
    back_text TEXT NOT NULL,
    explanation TEXT,
    ease_factor NUMERIC(4,2) DEFAULT 2.50,
    interval_days INT DEFAULT 1,
    repetition_number INT DEFAULT 0,
    next_review_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trigger_flashcards_updated_at BEFORE UPDATE ON public.flashcards FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 20. FLASHCARD REVIEWS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.flashcard_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flashcard_id UUID NOT NULL REFERENCES public.flashcards(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 0 AND 5), -- SM-2 grade: 0=blackout, 5=perfect
    interval_days_applied INT NOT NULL,
    ease_factor_applied NUMERIC(4,2) NOT NULL,
    reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 21. STUDY TASKS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.study_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    concept_id UUID REFERENCES public.concepts(id) ON DELETE SET NULL,
    learning_path_id UUID REFERENCES public.learning_paths(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    estimated_minutes INT DEFAULT 30,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trigger_study_tasks_updated_at BEFORE UPDATE ON public.study_tasks FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 22. STUDY SESSIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    duration_minutes INT NOT NULL DEFAULT 25,
    session_type TEXT DEFAULT 'focus' CHECK (session_type IN ('focus', 'review', 'practice', 'reading')),
    notes_taken TEXT,
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 23. PROJECTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('planning', 'in_progress', 'completed', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trigger_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 24. PROJECT CONCEPTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.project_concepts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT project_concept_unique UNIQUE(project_id, concept_id)
);

-- ============================================================================
-- 25. ASSISTANT CONVERSATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.assistant_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trigger_conversations_updated_at BEFORE UPDATE ON public.assistant_conversations FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 26. ASSISTANT MESSAGES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.assistant_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.assistant_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    citations JSONB DEFAULT '[]'::JSONB,
    token_usage JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 27. NOTIFICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'reminder')),
    is_read BOOLEAN DEFAULT FALSE,
    link_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 28. USER FEEDBACK
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT DEFAULT 'general' CHECK (category IN ('general', 'ai_quality', 'bug', 'feature')),
    message TEXT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 29. AI JOB STATUS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.ai_job_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    job_type TEXT NOT NULL CHECK (job_type IN ('pdf_extraction', 'embedding_generation', 'concept_extraction', 'question_generation', 'summary_generation')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    progress_percentage INT DEFAULT 0,
    error_message TEXT,
    result_payload JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trigger_ai_job_status_updated_at BEFORE UPDATE ON public.ai_job_status FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 30. AUDIT EVENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    ip_address TEXT,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Function to check ownership
CREATE OR REPLACE FUNCTION auth_is_owner(record_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.uid() = record_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concept_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concept_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concept_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_path_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistant_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistant_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_job_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. User Preferences
CREATE POLICY "Users can view their own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Learning Goals
CREATE POLICY "Users can manage their own learning goals" ON public.learning_goals FOR ALL USING (auth.uid() = user_id);

-- 4. Subjects (Global read for null user_id, private CRUD for custom)
CREATE POLICY "Users can view global and own subjects" ON public.subjects FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "Users can insert own subjects" ON public.subjects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subjects" ON public.subjects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own subjects" ON public.subjects FOR DELETE USING (auth.uid() = user_id);

-- 5. Documents
CREATE POLICY "Users can manage their own documents" ON public.documents FOR ALL USING (auth.uid() = user_id);

-- 6. Document Chunks
CREATE POLICY "Users can view and delete their own chunks" ON public.document_chunks FOR ALL USING (auth.uid() = user_id);

-- 7. Notes
CREATE POLICY "Users can manage their own notes" ON public.notes FOR ALL USING (auth.uid() = user_id);

-- 8. Concepts
CREATE POLICY "Users can manage their own concepts" ON public.concepts FOR ALL USING (auth.uid() = user_id);

-- 9. Concept Relationships
CREATE POLICY "Users can manage their own concept relationships" ON public.concept_relationships FOR ALL USING (auth.uid() = user_id);

-- 10. Concept Sources (Check concept ownership)
CREATE POLICY "Users can view concept sources" ON public.concept_sources FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.concepts WHERE concepts.id = concept_sources.concept_id AND concepts.user_id = auth.uid())
);
CREATE POLICY "Users can insert concept sources" ON public.concept_sources FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.concepts WHERE concepts.id = concept_sources.concept_id AND concepts.user_id = auth.uid())
);
CREATE POLICY "Users can delete concept sources" ON public.concept_sources FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.concepts WHERE concepts.id = concept_sources.concept_id AND concepts.user_id = auth.uid())
);

-- 11. Concept Mastery
CREATE POLICY "Users can manage their concept mastery" ON public.concept_mastery FOR ALL USING (auth.uid() = user_id);

-- 12. Knowledge Gaps
CREATE POLICY "Users can manage their knowledge gaps" ON public.knowledge_gaps FOR ALL USING (auth.uid() = user_id);

-- 13. Learning Paths
CREATE POLICY "Users can manage their learning paths" ON public.learning_paths FOR ALL USING (auth.uid() = user_id);

-- 14. Learning Path Steps
CREATE POLICY "Users can view their learning path steps" ON public.learning_path_steps FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.learning_paths WHERE learning_paths.id = learning_path_steps.learning_path_id AND learning_paths.user_id = auth.uid())
);
CREATE POLICY "Users can manage their learning path steps" ON public.learning_path_steps FOR ALL USING (
    EXISTS (SELECT 1 FROM public.learning_paths WHERE learning_paths.id = learning_path_steps.learning_path_id AND learning_paths.user_id = auth.uid())
);

-- 15. Practice Questions
CREATE POLICY "Users can manage their practice questions" ON public.practice_questions FOR ALL USING (auth.uid() = user_id);

-- 16. Practice Sessions
CREATE POLICY "Users can manage their practice sessions" ON public.practice_sessions FOR ALL USING (auth.uid() = user_id);

-- 17. Practice Answers
CREATE POLICY "Users can manage their practice answers" ON public.practice_answers FOR ALL USING (auth.uid() = user_id);

-- 18. Flashcard Decks
CREATE POLICY "Users can manage their flashcard decks" ON public.flashcard_decks FOR ALL USING (auth.uid() = user_id);

-- 19. Flashcards
CREATE POLICY "Users can manage their flashcards" ON public.flashcards FOR ALL USING (auth.uid() = user_id);

-- 20. Flashcard Reviews
CREATE POLICY "Users can manage their flashcard reviews" ON public.flashcard_reviews FOR ALL USING (auth.uid() = user_id);

-- 21. Study Tasks
CREATE POLICY "Users can manage their study tasks" ON public.study_tasks FOR ALL USING (auth.uid() = user_id);

-- 22. Study Sessions
CREATE POLICY "Users can manage their study sessions" ON public.study_sessions FOR ALL USING (auth.uid() = user_id);

-- 23. Projects
CREATE POLICY "Users can manage their projects" ON public.projects FOR ALL USING (auth.uid() = user_id);

-- 24. Project Concepts
CREATE POLICY "Users can manage their project concepts" ON public.project_concepts FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_concepts.project_id AND projects.user_id = auth.uid())
);

-- 25. Assistant Conversations
CREATE POLICY "Users can manage their assistant conversations" ON public.assistant_conversations FOR ALL USING (auth.uid() = user_id);

-- 26. Assistant Messages
CREATE POLICY "Users can manage their assistant messages" ON public.assistant_messages FOR ALL USING (auth.uid() = user_id);

-- 27. Notifications
CREATE POLICY "Users can view and update their notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- 28. User Feedback
CREATE POLICY "Users can insert feedback and view own feedback" ON public.user_feedback FOR ALL USING (auth.uid() = user_id);

-- 29. AI Job Status
CREATE POLICY "Users can view and manage their AI jobs" ON public.ai_job_status FOR ALL USING (auth.uid() = user_id);

-- 30. Audit Events
CREATE POLICY "Users can view own audit events" ON public.audit_events FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- HELPER VECTOR SEARCH FUNCTION (PGVECTOR)
-- ============================================================================
CREATE OR REPLACE FUNCTION match_document_chunks(
    p_user_id UUID,
    p_embedding vector(384),
    p_match_threshold FLOAT DEFAULT 0.5,
    p_match_count INT DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    document_id UUID,
    chunk_index INT,
    page_number INT,
    content TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        dc.id,
        dc.document_id,
        dc.chunk_index,
        dc.page_number,
        dc.content,
        1 - (dc.embedding <=> p_embedding) AS similarity
    FROM public.document_chunks dc
    WHERE dc.user_id = p_user_id
      AND 1 - (dc.embedding <=> p_embedding) > p_match_threshold
    ORDER BY dc.embedding <=> p_embedding
    LIMIT p_match_count;
END;
$$;
