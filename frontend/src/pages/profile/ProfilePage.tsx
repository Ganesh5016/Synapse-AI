import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  GraduationCap, 
  Target, 
  Save, 
  CheckCircle2, 
  Sparkles, 
  Brain, 
  BookOpen, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import { UserRole, EducationalLevel } from '../../types/auth';

export const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile, goals, isDemoMode } = useAuth();

  const initialName = profile?.display_name || 
                      user?.user_metadata?.display_name || 
                      user?.user_metadata?.full_name || 
                      (user?.email ? user.email.split('@')[0] : '');

  const [displayName, setDisplayName] = useState(initialName);
  const [role, setRole] = useState<UserRole>(profile?.role || 'student');
  const [educationalLevel, setEducationalLevel] = useState<EducationalLevel>(profile?.educational_level || 'undergraduate');
  const [bio, setBio] = useState(profile?.bio || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    const currentName = profile?.display_name || 
                        user?.user_metadata?.display_name || 
                        user?.user_metadata?.full_name || 
                        (user?.email ? user.email.split('@')[0] : '');
    if (currentName) {
      setDisplayName(currentName);
    }
    if (profile?.role) setRole(profile.role);
    if (profile?.educational_level) setEducationalLevel(profile.educational_level);
    if (profile?.bio !== undefined && profile?.bio !== null) setBio(profile.bio);
  }, [profile, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    await updateProfile({
      display_name: displayName,
      role,
      educational_level: educationalLevel,
      bio,
    });

    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-text tracking-tight">
          Learner Profile & Credentials
        </h1>
        <p className="text-sm text-muted mt-1">
          Manage your research persona, educational level, and mastery tracking parameters.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-success-light border border-success/30 flex items-center gap-2 text-xs text-success font-medium">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Profile changes saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6 sm:p-8">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-lg">Personal Information</CardTitle>
            <CardDescription className="text-xs">
              Your details are stored in your private PostgreSQL profile guarded by RLS.
            </CardDescription>
          </CardHeader>

          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-muted-border/60 mb-6">
            <div className="w-20 h-20 rounded-2xl gradient-accent text-white flex items-center justify-center text-2xl font-bold shadow-md">
              {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-bold text-primary-text text-base">{displayName}</h3>
              <p className="text-xs text-muted">{user?.email || 'Authenticated User'}</p>
              <div className="flex gap-2 pt-1 justify-center sm:justify-start">
                <Badge variant="primary">{role.toUpperCase()}</Badge>
                {isDemoMode && <Badge variant="secondary">Demo Mode</Badge>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Input
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-primary-text/90 tracking-wide">
                Primary Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="glass-input px-3.5 py-2.5 text-sm text-primary-text focus:outline-none"
              >
                <option value="student">Student</option>
                <option value="researcher">Researcher</option>
                <option value="engineer">Engineer</option>
                <option value="professional">Professional</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-primary-text/90 tracking-wide">
                Educational Level
              </label>
              <select
                value={educationalLevel}
                onChange={(e) => setEducationalLevel(e.target.value as EducationalLevel)}
                className="glass-input px-3.5 py-2.5 text-sm text-primary-text focus:outline-none"
              >
                <option value="high_school">High School</option>
                <option value="undergraduate">Undergraduate Degree</option>
                <option value="graduate">Master's Degree</option>
                <option value="phd">PhD / Doctoral</option>
                <option value="self_directed">Self-Directed Practitioner</option>
              </select>
            </div>

            <Input
              label="Account Email (Authenticated)"
              value={user?.email || ''}
              disabled
              helperText="Managed via Supabase Auth credentials"
            />
          </div>

          <div className="flex flex-col space-y-1.5 mb-6">
            <label className="text-xs font-semibold text-primary-text/90 tracking-wide">
              Academic Bio & Research Focus
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="glass-input px-3.5 py-2.5 text-sm text-primary-text focus:outline-none"
              placeholder="Describe your current study focus, qualifying exam target, or research project..."
            />
          </div>

          <div className="flex justify-end">
            <Button variant="primary" type="submit" isLoading={isSaving} size="md">
              <Save className="w-4 h-4 mr-2" /> Save Profile Changes
            </Button>
          </div>
        </Card>
      </form>

      {/* Active Learning Goals Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold">Active Learning Goals</CardTitle>
            <CardDescription className="text-xs">
              Directly influences Bayesian recommendation queues and practice generation.
            </CardDescription>
          </div>
          <Target className="w-5 h-5 text-primary" />
        </CardHeader>

        <div className="divide-y divide-muted-border/50">
          {goals.length === 0 ? (
            <p className="py-4 text-xs text-muted">No learning goals registered. Set one in your Onboarding Wizard.</p>
          ) : (
            goals.map((g, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-primary-text">{g.title}</h4>
                  {g.description && <p className="text-xs text-muted mt-0.5">{g.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-primary">{g.progress_percentage}%</span>
                  <Badge variant={g.priority === 'high' ? 'primary' : 'secondary'}>
                    {g.priority.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
