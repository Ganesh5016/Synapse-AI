import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Play,
  Layers,
  BookOpen,
  FileText,
  Brain,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  Flame,
  Award,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface StudySession {
  id: string;
  title: string;
  description?: string;
  subject_name: string;
  subject_color: string;
  concept_id?: string;
  concept_name?: string;
  session_type: 'deep_work' | 'spaced_review' | 'diagnostic_quiz' | 'concept_exploration' | 'paper_reading';
  scheduled_start: string;
  duration_minutes: number;
  is_completed: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  target_cards_count?: number;
  target_questions_count?: number;
  notes?: string;
}

const DEFAULT_SESSIONS: StudySession[] = [
  {
    id: 'sess-01',
    title: 'Transformer Scaled Dot-Product Deep Dive',
    description: 'Work through query-key dimension scaling and softmax variance derivations.',
    subject_name: 'Machine Learning & AI',
    subject_color: '#7667F5',
    concept_id: 'c0000000-0000-0000-0000-000000000003',
    concept_name: 'Scaled Dot-Product Attention',
    session_type: 'deep_work',
    scheduled_start: new Date(Date.now() - 3600000 * 2).toISOString(),
    duration_minutes: 60,
    is_completed: true,
    difficulty: 'intermediate',
    target_questions_count: 8,
    notes: 'Focused on why 1/sqrt(d_k) prevents vanishing softmax gradients.',
  },
  {
    id: 'sess-02',
    title: 'Daily SM-2 Active Recall Flashcard Queue',
    description: 'Clear spaced repetition cards due for Cognitive Science and ML formulas.',
    subject_name: 'Cognitive Science & Psychology',
    subject_color: '#EC4899',
    concept_id: 'c0000000-0000-0000-0000-000000000008',
    concept_name: 'SuperMemo SM-2 Algorithm',
    session_type: 'spaced_review',
    scheduled_start: new Date(Date.now() + 3600000 * 2).toISOString(),
    duration_minutes: 30,
    is_completed: false,
    difficulty: 'beginner',
    target_cards_count: 14,
    notes: 'Target: achieve >= 90% recall quality score.',
  },
  {
    id: 'sess-03',
    title: 'Remediation: Singular Value Decomposition (SVD)',
    description: 'Prerequisite blocker remediation for multi-head subspace projections.',
    subject_name: 'Mathematics & Statistics',
    subject_color: '#10B981',
    concept_id: 'c0000000-0000-0000-0000-000000000001',
    concept_name: 'Linear Projections',
    session_type: 'diagnostic_quiz',
    scheduled_start: new Date(Date.now() + 86400000).toISOString(),
    duration_minutes: 45,
    is_completed: false,
    difficulty: 'intermediate',
    target_questions_count: 6,
    notes: 'Address critical knowledge gap identified by BKT diagnostic.',
  },
  {
    id: 'sess-04',
    title: 'Attention Is All You Need — Paper Deconstruction',
    description: 'Read multi-head attention section and map key equations to research notes.',
    subject_name: 'Machine Learning & AI',
    subject_color: '#7667F5',
    concept_id: 'c0000000-0000-0000-0000-000000000003',
    concept_name: 'Multi-Head Attention',
    session_type: 'paper_reading',
    scheduled_start: new Date(Date.now() + 86400000 * 2).toISOString(),
    duration_minutes: 90,
    is_completed: false,
    difficulty: 'advanced',
    notes: 'Annotate figures 1 and 2 in notes editor.',
  },
];

export const StudyPlannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<StudySession[]>(DEFAULT_SESSIONS);
  const [activeView, setActiveView] = useState<'agenda' | 'day' | 'week'>('agenda');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<StudySession['session_type']>('deep_work');
  const [newDuration, setNewDuration] = useState(45);
  const [newDifficulty, setNewDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));

  // Sync with API if running
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/planner/sessions', {
          headers: { 'Authorization': 'Bearer demo-token' },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setSessions(json.data);
          }
        }
      } catch {
        // Fall back gracefully
      }
    };
    fetchSessions();
  }, []);

  const handleToggleComplete = async (sessionId: string) => {
    const currentSession = sessions.find(s => s.id === sessionId);
    if (!currentSession) return;

    const nextCompleted = !currentSession.is_completed;

    // Optimistic update
    setSessions(prev =>
      prev.map(s => (s.id === sessionId ? { ...s, is_completed: nextCompleted } : s))
    );

    try {
      await fetch(`http://localhost:8000/api/v1/planner/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token',
        },
        body: JSON.stringify({ is_completed: nextCompleted }),
      });
    } catch {
      // Local state preserved
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newSess: StudySession = {
      id: `sess-${Date.now()}`,
      title: newTitle,
      description: 'Scheduled focus block.',
      subject_name: 'Machine Learning & AI',
      subject_color: '#7667F5',
      session_type: newType,
      scheduled_start: new Date(`${newDate}T10:00:00Z`).toISOString(),
      duration_minutes: newDuration,
      is_completed: false,
      difficulty: newDifficulty,
    };

    setSessions(prev => [newSess, ...prev]);
    setShowAddModal(false);
    setNewTitle('');

    try {
      await fetch('http://localhost:8000/api/v1/planner/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token',
        },
        body: JSON.stringify({
          title: newTitle,
          session_type: newType,
          scheduled_start: newSess.scheduled_start,
          duration_minutes: newDuration,
          difficulty: newDifficulty,
        }),
      });
    } catch {
      // Fallback works locally
    }
  };

  const filteredSessions = filterType === 'all'
    ? sessions
    : sessions.filter(s => s.session_type === filterType);

  const completedCount = sessions.filter(s => s.is_completed).length;
  const totalHours = (sessions.reduce((acc, s) => acc + s.duration_minutes, 0) / 60).toFixed(1);

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'deep_work':
        return <Brain className="w-4 h-4 text-indigo-600" />;
      case 'spaced_review':
        return <Clock className="w-4 h-4 text-pink-600" />;
      case 'diagnostic_quiz':
        return <Layers className="w-4 h-4 text-emerald-600" />;
      case 'paper_reading':
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <CalendarIcon className="w-4 h-4 text-indigo-600" />;
    }
  };

  const getSessionTypeBadge = (type: string) => {
    switch (type) {
      case 'deep_work':
        return 'Deep Work';
      case 'spaced_review':
        return 'Flashcard Review';
      case 'diagnostic_quiz':
        return 'Practice Diagnostic';
      case 'paper_reading':
        return 'Paper Deconstruct';
      default:
        return 'Study Session';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-50 border border-indigo-200/60 rounded-xl text-primary">
                <CalendarIcon className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-primary-text tracking-tight">
                Study Planner & Revision Calendar
              </h1>
              <Badge variant="primary" className="ml-2">SM-2 Aligned</Badge>
            </div>
            <p className="text-sm text-secondary-text mt-1">
              Time-blocked mastery sessions, spaced repetition queues, and active recall deadlines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Schedule Session
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/flashcards')}
              className="text-xs"
            >
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              Due Cards
            </Button>
          </div>
        </div>

        {/* Metric Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-md border border-neutral-200/80 rounded-2xl p-4 shadow-xs">
            <span className="text-xs text-secondary-text block">Planned Time</span>
            <div className="text-2xl font-bold text-primary-text mt-0.5">{totalHours} hrs</div>
            <span className="text-[11px] text-neutral-400">Across {sessions.length} sessions</span>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-neutral-200/80 rounded-2xl p-4 shadow-xs">
            <span className="text-xs text-secondary-text block">Completed</span>
            <div className="text-2xl font-bold text-emerald-600 mt-0.5">{completedCount} of {sessions.length}</div>
            <span className="text-[11px] text-emerald-600 font-medium">
              {Math.round((completedCount / (sessions.length || 1)) * 100)}% adherence
            </span>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-neutral-200/80 rounded-2xl p-4 shadow-xs">
            <span className="text-xs text-secondary-text flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Current Streak
            </span>
            <div className="text-2xl font-bold text-primary-text mt-0.5">14 Days</div>
            <span className="text-[11px] text-neutral-400">Target: 21 days</span>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-neutral-200/80 rounded-2xl p-4 shadow-xs">
            <span className="text-xs text-secondary-text block">Spaced Reviews</span>
            <div className="text-2xl font-bold text-primary mt-0.5">4 Cards Due</div>
            <span className="text-[11px] text-indigo-600 font-medium">Optimal memory window</span>
          </div>
        </div>

        {/* View Switcher & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/80 backdrop-blur-md border border-neutral-200/80 rounded-2xl p-3 shadow-xs">
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveView('agenda')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeView === 'agenda' ? 'bg-white text-primary-text shadow-xs' : 'text-secondary-text hover:text-primary-text'
              }`}
            >
              Agenda List
            </button>
            <button
              onClick={() => setActiveView('day')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeView === 'day' ? 'bg-white text-primary-text shadow-xs' : 'text-secondary-text hover:text-primary-text'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setActiveView('week')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeView === 'week' ? 'bg-white text-primary-text shadow-xs' : 'text-secondary-text hover:text-primary-text'
              }`}
            >
              This Week
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-secondary-text">Type:</span>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-primary text-secondary-text"
            >
              <option value="all">All Session Types</option>
              <option value="deep_work">Deep Work</option>
              <option value="spaced_review">Flashcard Review</option>
              <option value="diagnostic_quiz">Practice Diagnostic</option>
              <option value="paper_reading">Paper Deconstruct</option>
            </select>
          </div>
        </div>

        {/* Agenda / Session Cards List */}
        <div className="space-y-3">
          {filteredSessions.map((session) => {
            const startDate = new Date(session.scheduled_start);
            const dateLabel = startDate.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            });
            const timeLabel = startDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={session.id}
                className={`bg-white/85 backdrop-blur-md border rounded-2xl p-5 transition-all shadow-xs ${
                  session.is_completed
                    ? 'border-emerald-200/80 bg-emerald-50/15'
                    : 'border-neutral-200/80 hover:border-indigo-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Left: Complete Checkbox + Details */}
                  <div className="flex items-start gap-3.5">
                    <button
                      onClick={() => handleToggleComplete(session.id)}
                      className={`mt-1 p-1 rounded-full transition-colors shrink-0 ${
                        session.is_completed
                          ? 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200'
                          : 'text-neutral-400 hover:text-primary bg-neutral-100'
                      }`}
                      title={session.is_completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {session.is_completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-secondary-text">
                          {dateLabel} • {timeLabel} ({session.duration_minutes}m)
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-neutral-100 text-neutral-700">
                          {getSessionIcon(session.session_type)}
                          {getSessionTypeBadge(session.session_type)}
                        </span>
                        <Badge
                          variant={
                            session.difficulty === 'beginner'
                              ? 'success'
                              : session.difficulty === 'intermediate'
                              ? 'primary'
                              : 'warning'
                          }
                          className="text-[10px] px-1.5 py-0.2"
                        >
                          {session.difficulty}
                        </Badge>
                      </div>

                      <h3 className={`text-base font-semibold ${
                        session.is_completed ? 'line-through text-secondary-text' : 'text-primary-text'
                      }`}>
                        {session.title}
                      </h3>

                      {session.description && (
                        <p className="text-xs text-secondary-text max-w-xl">
                          {session.description}
                        </p>
                      )}

                      {session.concept_name && (
                        <div className="pt-1 flex items-center gap-1.5 text-xs text-indigo-700 font-medium">
                          <Brain className="w-3.5 h-3.5" />
                          <span>Concept Anchor: {session.concept_name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Action Button */}
                  <div className="flex items-center gap-2 sm:self-center shrink-0">
                    <Button
                      variant={session.is_completed ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => {
                        if (session.session_type === 'spaced_review') navigate('/flashcards');
                        else if (session.session_type === 'diagnostic_quiz') navigate('/practice');
                        else navigate('/notes/new');
                      }}
                      className="text-xs shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                      {session.is_completed ? 'Review Again' : 'Start Session'}
                    </Button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Schedule Session Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-primary-text/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-neutral-200/80 shadow-xl space-y-5 animate-scale-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-50 text-primary rounded-lg">
                    <CalendarIcon className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-primary-text text-lg">Schedule Study Session</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-neutral-400 hover:text-neutral-600 text-sm font-semibold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateSession} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-secondary-text block mb-1">
                    Session Title
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="e.g. FlashAttention & SRAM Tile Mapping"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-secondary-text block mb-1">
                      Session Type
                    </label>
                    <select
                      value={newType}
                      onChange={e => setNewType(e.target.value as StudySession['session_type'])}
                      className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary"
                    >
                      <option value="deep_work">Deep Work</option>
                      <option value="spaced_review">Flashcard Review</option>
                      <option value="diagnostic_quiz">Practice Diagnostic</option>
                      <option value="paper_reading">Paper Reading</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-secondary-text block mb-1">
                      Difficulty
                    </label>
                    <select
                      value={newDifficulty}
                      onChange={e => setNewDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                      className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-secondary-text block mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-secondary-text block mb-1">
                      Duration: {newDuration} mins
                    </label>
                    <input
                      type="range"
                      min="15"
                      max="180"
                      step="15"
                      value={newDuration}
                      onChange={e => setNewDuration(Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer mt-2"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                  >
                    Save Session
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
