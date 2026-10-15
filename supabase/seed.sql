-- Supabase Seed Data: Synapse — AI Knowledge Evolution Platform
-- Description: Realistic synthetic preview seed data for local development

-- 1. Predefined Global Subjects (user_id IS NULL)
INSERT INTO public.subjects (id, user_id, name, slug, description, color_hex, icon_name, is_custom)
VALUES
    ('a0000000-0000-0000-0000-000000000001', NULL, 'Machine Learning & AI', 'machine-learning', 'Core algorithms, deep learning architectures, transformer models, and reinforcement learning.', '#7667F5', 'Cpu', FALSE),
    ('a0000000-0000-0000-0000-000000000002', NULL, 'Computer Systems & Architecture', 'systems-architecture', 'Operating systems, distributed computing, memory hierarchies, and concurrency.', '#229B72', 'Server', FALSE),
    ('a0000000-0000-0000-0000-000000000003', NULL, 'Mathematics & Statistics', 'mathematics-statistics', 'Linear algebra, probability theory, multivariate calculus, and Bayesian inference.', '#D99A32', 'Binary', FALSE),
    ('a0000000-0000-0000-0000-000000000004', NULL, 'Data Structures & Algorithms', 'algorithms-data-structures', 'Asymptotic complexity, graph algorithms, dynamic programming, and data layout.', '#9B8AFB', 'GitFork', FALSE),
    ('a0000000-0000-0000-0000-000000000005', NULL, 'Cognitive Science & Psychology', 'cognitive-science', 'Memory encoding, spaced retrieval practice, and cognitive load theory.', '#D9536B', 'Brain', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Note: Synthetic user-owned records (notes, concepts, practice questions) will be populated dynamically
-- upon user registration / demo profile seed or via the onboarding wizard.
