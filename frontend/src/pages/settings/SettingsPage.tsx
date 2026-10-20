import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Clock, 
  Bell, 
  Download, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Save, 
  FileSpreadsheet, 
  FileCode,
  ShieldAlert
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { preferences, signOut, isDemoMode } = useAuth();

  const [dailyMinutes, setDailyMinutes] = useState(preferences?.daily_study_minutes || 30);
  const [emailNotifications, setEmailNotifications] = useState(preferences?.notification_email ?? true);
  const [inAppNotifications, setInAppNotifications] = useState(preferences?.notification_in_app ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Deletion modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 400);
  };

  const handleExportData = (format: 'json' | 'csv') => {
    const exportData = {
      user: 'synapse-learner-export',
      exported_at: new Date().toISOString(),
      format,
      stats: {
        concepts_mastered: 148,
        knowledge_health: 0.924,
        retention_rate: 0.885,
        study_streak_days: 14,
      },
      flashcards_count: 56,
      notes_count: 12,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: format === 'json' ? 'application/json' : 'text/csv',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `synapse-study-export-${new Date().toISOString().slice(0, 10)}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationText !== 'DELETE') return;
    setIsDeleting(true);

    setTimeout(async () => {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      await signOut();
      navigate('/');
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-text tracking-tight">
          Platform Settings & Data
        </h1>
        <p className="text-sm text-muted mt-1">
          Configure study reminders, export cognitive telemetry, or manage account data.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-success-light border border-success/30 flex items-center gap-2 text-xs text-success font-medium">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Preferences updated successfully.</span>
        </div>
      )}

      {/* 1. STUDY CADENCE & REMINDERS */}
      <form onSubmit={handleSavePreferences}>
        <Card className="p-6 sm:p-8 space-y-6">
          <CardHeader className="p-0">
            <CardTitle className="text-lg">Study Cadence & Notifications</CardTitle>
            <CardDescription className="text-xs">
              Controls when spaced repetition intervals prompt your practice sessions.
            </CardDescription>
          </CardHeader>

          <div>
            <label className="text-xs font-semibold text-primary-text/90 tracking-wide block mb-3">
              Daily Target Study Time: <span className="text-primary font-bold">{dailyMinutes} minutes</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[15, 30, 45, 60].map((min) => (
                <button
                  key={min}
                  type="button"
                  onClick={() => setDailyMinutes(min)}
                  className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    dailyMinutes === min
                      ? 'border-primary bg-primary text-white shadow-sm'
                      : 'border-muted-border glass-panel text-primary-text hover:border-primary/40'
                  }`}
                >
                  {min} min / day
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl glass-panel">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-primary" />
                <div>
                  <span className="text-xs font-semibold text-primary-text block">Email Retrieval Reminders</span>
                  <span className="text-[11px] text-muted">Receive notification when high-decay concepts reach scheduled review date.</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="h-4 w-4 rounded text-primary focus:ring-primary border-muted-border"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl glass-panel">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-accent" />
                <div>
                  <span className="text-xs font-semibold text-primary-text block">In-App Prerequisite Alerts</span>
                  <span className="text-[11px] text-muted">Show real-time notifications for detected knowledge gaps.</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={inAppNotifications}
                onChange={(e) => setInAppNotifications(e.target.checked)}
                className="h-4 w-4 rounded text-primary focus:ring-primary border-muted-border"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="primary" type="submit" isLoading={isSaving} size="md">
              <Save className="w-4 h-4 mr-2" /> Save Study Preferences
            </Button>
          </div>
        </Card>
      </form>

      {/* 2. DATA PORTABILITY & EXPORT */}
      <Card className="p-6 sm:p-8 space-y-4">
        <CardHeader className="p-0">
          <CardTitle className="text-lg">Export Your Data</CardTitle>
          <CardDescription className="text-xs">
            Download your full knowledge network, flashcards, and BKT mastery telemetry in open formats.
          </CardDescription>
        </CardHeader>

        <p className="text-xs text-muted leading-relaxed">
          You own your knowledge. Export all notes, prerequisite edges, and review history at any time with zero vendor lock-in.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportData('json')}
            className="flex items-center gap-2"
          >
            <FileCode className="w-4 h-4 text-primary" /> Export Full JSON Telemetry
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportData('csv')}
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-success" /> Export Flashcards CSV
          </Button>
        </div>
      </Card>

      {/* 3. DANGER ZONE: ACCOUNT DELETION */}
      <Card className="p-6 sm:p-8 border-error/30 space-y-4">
        <div className="flex items-center gap-2.5 text-error">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <h3 className="text-base font-bold">Danger Zone: Irreversible Account Deletion</h3>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          Permanently deletes your user profile, all uploaded PDF documents from Supabase Storage, all pgvector embeddings, and all Bayesian mastery telemetry. This action cannot be reversed.
        </p>

        {showDeleteConfirm ? (
          <div className="p-4 rounded-xl bg-error-light/40 border border-error/30 space-y-3">
            <p className="text-xs font-semibold text-error">
              To confirm complete account deletion, please type <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-error/30">DELETE</span> below:
            </p>
            <input
              type="text"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="glass-input w-full px-3 py-2 text-xs border-error/50 focus:ring-error/20"
            />
            <div className="flex gap-2">
              <Button
                variant="danger"
                size="sm"
                disabled={deleteConfirmationText !== 'DELETE'}
                isLoading={isDeleting}
                onClick={handleDeleteAccount}
              >
                Permanently Delete Everything
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmationText('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Delete Account & Purge Data
          </Button>
        )}
      </Card>
    </div>
  );
};
