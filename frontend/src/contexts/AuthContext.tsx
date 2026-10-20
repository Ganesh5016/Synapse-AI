import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { UserProfile, UserPreferences, LearningGoal, OnboardingData } from '../types/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  preferences: UserPreferences | null;
  goals: LearningGoal[];
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null; user: User | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  completeOnboarding: (data: OnboardingData) => Promise<{ error: Error | null }>;
  enterDemoMode: () => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_PROFILE: UserProfile = {
  id: 'demo-user-1234-5678-90ab',
  email: 'alex.chen@synapse.edu',
  display_name: 'Alex Chen',
  avatar_url: null,
  role: 'student',
  bio: 'Mastering Machine Learning architectures and Bayesian Inference',
  educational_level: 'undergraduate',
  onboarding_completed: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEMO_PREFERENCES: UserPreferences = {
  id: 'demo-pref-1',
  user_id: 'demo-user-1234-5678-90ab',
  daily_study_minutes: 45,
  preferred_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  notification_email: true,
  notification_in_app: true,
  timezone: 'America/New_York',
  light_mode_accent: '#7667F5',
};

const DEMO_GOALS: LearningGoal[] = [
  {
    id: 'demo-goal-1',
    user_id: 'demo-user-1234-5678-90ab',
    title: 'Master Transformer Attention Mechanisms',
    description: 'Understand scaled dot-product attention, multi-head projections, and causal masking.',
    target_date: '2026-11-30',
    priority: 'high',
    status: 'active',
    progress_percentage: 68.5,
  },
  {
    id: 'demo-goal-2',
    user_id: 'demo-user-1234-5678-90ab',
    title: 'Bayesian Knowledge Tracing (BKT) Proofs',
    description: 'Derive slip, guess, transition, and prior probability updates for learner modeling.',
    target_date: '2026-12-15',
    priority: 'medium',
    status: 'active',
    progress_percentage: 42.0,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [, startTransition] = useTransition();

  // Load active session from Supabase
  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Supabase auth session fetch warning:', error.message);
        }

        if (mounted && currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          await loadUserData(currentSession.user.id);
        }
      } catch (err) {
        console.warn('Network or Supabase connection issue during init:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        await loadUserData(newSession.user.id);
      } else if (!isDemoMode) {
        setProfile(null);
        setPreferences(null);
        setGoals([]);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isDemoMode]);

  async function loadUserData(userId: string) {
    try {
      // 1. Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileData) {
        setProfile(profileData as UserProfile);
      }

      // 2. Fetch Preferences
      const { data: prefData } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (prefData) {
        setPreferences(prefData as UserPreferences);
      }

      // 3. Fetch Learning Goals
      const { data: goalsData } = await supabase
        .from('learning_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (goalsData) {
        setGoals(goalsData as LearningGoal[]);
      }
    } catch (err) {
      console.warn('Error fetching user data from Supabase:', err);
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { error: null };
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Sign in failed');
      return { error };
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || email.split('@')[0],
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Upsert default profile
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email,
          display_name: displayName || email.split('@')[0],
          role: 'student',
          educational_level: 'undergraduate',
          onboarding_completed: false,
        });
      }

      return { error: null, user: data.user };
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Sign up failed');
      return { error, user: null };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase sign out error:', err);
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setPreferences(null);
      setGoals([]);
      setIsDemoMode(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (isDemoMode) {
        setProfile(prev => (prev ? { ...prev, ...updates } : null));
        return { error: null };
      }

      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => (prev ? { ...prev, ...updates } : null));
      return { error: null };
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Update profile failed');
      return { error };
    }
  };

  const completeOnboarding = async (data: OnboardingData) => {
    try {
      if (isDemoMode) {
        setProfile(prev => prev ? {
          ...prev,
          display_name: data.display_name,
          role: data.role,
          educational_level: data.educational_level,
          onboarding_completed: true,
        } : null);
        return { error: null };
      }

      if (!user) throw new Error('No authenticated user');

      // 1. Update Profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          display_name: data.display_name,
          role: data.role,
          educational_level: data.educational_level,
          onboarding_completed: true,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // 2. Upsert Preferences
      await supabase.from('user_preferences').upsert({
        user_id: user.id,
        daily_study_minutes: data.daily_study_minutes,
        preferred_days: data.preferred_days,
        light_mode_accent: '#7667F5',
      });

      // 3. Insert Primary Goal
      if (data.primary_goal) {
        await supabase.from('learning_goals').insert({
          user_id: user.id,
          title: data.primary_goal,
          priority: 'high',
          status: 'active',
          progress_percentage: 0.0,
        });
      }

      // Reload fresh state
      await loadUserData(user.id);
      return { error: null };
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Failed to complete onboarding');
      return { error };
    }
  };

  const enterDemoMode = () => {
    startTransition(() => {
      setIsDemoMode(true);
      setUser({
        id: DEMO_PROFILE.id,
        app_metadata: {},
        user_metadata: { display_name: DEMO_PROFILE.display_name },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email: DEMO_PROFILE.email,
      } as User);
      setProfile(DEMO_PROFILE);
      setPreferences(DEMO_PREFERENCES);
      setGoals(DEMO_GOALS);
      setIsLoading(false);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        preferences,
        goals,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        completeOnboarding,
        enterDemoMode,
        isDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
