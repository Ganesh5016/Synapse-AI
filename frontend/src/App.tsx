import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layouts
import { PublicLayout } from './pages/public/PublicLayout';
import { AppShell } from './components/layout/AppShell';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { AboutPage } from './pages/public/AboutPage';
import { FAQPage } from './pages/public/FAQPage';
import { PrivacyPage } from './pages/public/PrivacyPage';
import { TermsPage } from './pages/public/TermsPage';
import { ContactPage } from './pages/public/ContactPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { OnboardingWizard } from './pages/auth/OnboardingWizard';

// App Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { KnowledgeLibraryPage } from './pages/library/KnowledgeLibraryPage';
import { NotesEditorPage } from './pages/notes/NotesEditorPage';
import { SearchPage } from './pages/search/SearchPage';
import { AIAssistantPage } from './pages/assistant/AIAssistantPage';
import { KnowledgeGraphPage } from './pages/graph/KnowledgeGraphPage';
import { ConceptDetailPage } from './pages/graph/ConceptDetailPage';
import { KnowledgeGapsPage } from './pages/mastery/KnowledgeGapsPage';
import { PracticeCenterPage } from './pages/practice/PracticeCenterPage';
import { FlashcardsQueuePage } from './pages/flashcards/FlashcardsQueuePage';
import { LearningPathsPage } from './pages/learning-paths/LearningPathsPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isDemoMode, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user && !isDemoMode) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Marketing Website */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Authentication & Onboarding */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingWizard />
              </ProtectedRoute>
            }
          />

          {/* Authenticated SaaS Experience */}
          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/library" element={<KnowledgeLibraryPage />} />
            <Route path="/notes" element={<KnowledgeLibraryPage />} />
            <Route path="/notes/new" element={<NotesEditorPage />} />
            <Route path="/notes/:id" element={<NotesEditorPage />} />
            <Route path="/notes/edit" element={<NotesEditorPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/assistant" element={<AIAssistantPage />} />
            <Route path="/graph" element={<KnowledgeGraphPage />} />
            <Route path="/concepts/:id" element={<ConceptDetailPage />} />
            <Route path="/practice" element={<PracticeCenterPage />} />
            <Route path="/flashcards" element={<FlashcardsQueuePage />} />
            <Route path="/gaps" element={<KnowledgeGapsPage />} />
            <Route path="/learning-paths" element={<LearningPathsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
