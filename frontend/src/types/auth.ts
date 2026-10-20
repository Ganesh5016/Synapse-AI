export type UserRole = 'student' | 'researcher' | 'engineer' | 'professional';

export type EducationalLevel = 'high_school' | 'undergraduate' | 'graduate' | 'phd' | 'self_directed';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  bio: string | null;
  educational_level: EducationalLevel;
  onboarding_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserPreferences {
  id?: string;
  user_id?: string;
  daily_study_minutes: number;
  preferred_days: string[];
  notification_email: boolean;
  notification_in_app: boolean;
  timezone: string;
  light_mode_accent: string;
}

export interface LearningGoal {
  id?: string;
  user_id?: string;
  title: string;
  description?: string;
  target_date?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  progress_percentage: number;
}

export interface OnboardingData {
  role: UserRole;
  display_name: string;
  educational_level: EducationalLevel;
  primary_goal: string;
  selected_subjects: string[];
  current_knowledge_level: 'beginner' | 'intermediate' | 'advanced';
  daily_study_minutes: number;
  preferred_days: string[];
  recommended_starter_concepts: string[];
}
