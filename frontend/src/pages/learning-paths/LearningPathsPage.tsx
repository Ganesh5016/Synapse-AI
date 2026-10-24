import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  BookOpen,
  Layers,
  FileText,
  Brain,
  Plus,
  Target,
  ChevronRight,
  BarChart2,
  ListOrdered,
  RefreshCw,
  Award,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface LearningPathStep {
  step_id: string;
  concept_id: string;
  concept_name: string;
  sequence_order: number;
  title: string;
  description: string;
  estimated_minutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  is_completed: boolean;
  action_type: 'read_note' | 'practice_quiz' | 'flashcard_review' | 'inspect_paper';
  action_url: string;
}

interface LearningPath {
  id: string;
  title: string;
  goal: string;
  subject_id: string;
  subject_name: string;
  description: string;
  estimated_hours: number;
  total_steps: number;
  completed_steps: number;
  progress_percentage: number;
  steps: LearningPathStep[];
}

const DEFAULT_PATH: LearningPath = {
  id: 'path-01',
  title: 'Foundations of Modern Attention & Bayesian Models',
  goal: 'Master Transformer Attention & Bayesian Models',
  subject_id: 'a0000000-0000-0000-0000-000000000001',
  subject_name: 'Machine Learning & AI',
  description:
    'Topologically sorted study progression generated from your knowledge graph dependencies, prioritized to eliminate prerequisite deficits before advanced multi-head architectures.',
  estimated_hours: 4.5,
  total_steps: 4,
  completed_steps: 1,
  progress_percentage: 25.0,
  steps: [
    {
      step_id: 'step-01',
      concept_id: 'c0000000-0000-0000-0000-000000000001',
      concept_name: 'Linear Projections & Vector Spaces',
      sequence_order: 1,
      title: 'Review Foundations: Linear Projections & Matrices',
      description: 'Strengthen prerequisite matrix dot-product operations before diving into self-attention scaling.',
      estimated_minutes: 25,
      difficulty: 'beginner',
      is_completed: true,
      action_type: 'read_note',
      action_url: '/library',
    },
    {
      step_id: 'step-02',
      concept_id: 'c0000000-0000-0000-0000-000000000003',
      concept_name: 'Scaled Dot-Product Attention',
      sequence_order: 2,
      title: 'Master Scaled Dot-Product Attention Mechanisms',
      description: 'Understand variance scaling by 1/sqrt(d_k), Query-Key softmax affinities, and Value aggregation.',
      estimated_minutes: 40,
      difficulty: 'intermediate',
      is_completed: false,
      action_type: 'practice_quiz',
      action_url: '/practice?conceptId=c0000000-0000-0000-0000-000000000003',
    },
    {
      step_id: 'step-03',
      concept_id: 'c0000000-0000-0000-0000-000000000007',
      concept_name: 'Bayesian Knowledge Tracing (BKT)',
      sequence_order: 3,
      title: 'Active Recall on BKT 2-State HMM Parameters',
      description: 'Reinforce latent state priors P(L0), transition P(T), slip P(S), and guess P(G) calculations.',
      estimated_minutes: 20,
      difficulty: 'intermediate',
      is_completed: false,
      action_type: 'flashcard_review',
      action_url: '/flashcards',
    },
    {
      step_id: 'step-04',
      concept_id: 'c0000000-0000-0000-0000-000000000008',
      concept_name: 'SuperMemo SM-2 Algorithm',
      sequence_order: 4,
      title: 'Empirical Verification of Spaced Repetition Scheduling',
      description: 'Audit Easiness Factor adjustments and interval boundary equations against real recall sequences.',
      estimated_minutes: 35,
      difficulty: 'advanced',
      is_completed: false,
      action_type: 'inspect_paper',
      action_url: '/notes/new',
    },
  ],
};

export const LearningPathsPage: React.FC = () => {
  const navigate = useNavigate();
  const [paths, setPaths] = useState<LearningPath[]>([DEFAULT_PATH]);
  const [activePathId, setActivePathId] = useState<string>('path-01');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [newGoal, setNewGoal] = useState('Master Transformer Attention & Bayesian Models');
  const [targetMastery, setTargetMastery] = useState(85);
  const [isGenerating, setIsGenerating] = useState(false);

  const activePath = paths.find(p => p.id === activePathId) || paths[0];

  // Fetch paths from API if running
  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/learning-paths', {
          headers: { 'Authorization': 'Bearer demo-token' },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setPaths(json.data);
            setActivePathId(json.data[0].id);
          }
        }
      } catch {
        // Fall back gracefully to initialized path
      }
    };
    fetchPaths();
  }, []);

  const handleToggleStep = async (stepId: string) => {
    // Optimistic local update
    setPaths(prevPaths =>
      prevPaths.map(path => {
        if (path.id !== activePath.id) return path;

        const updatedSteps = path.steps.map(step => {
          if (step.step_id === stepId) {
            return { ...step, is_completed: !step.is_completed };
          }
          return step;
        });

        const completedCount = updatedSteps.filter(s => s.is_completed).length;
        const progress = Math.round((completedCount / updatedSteps.length) * 100);

        return {
          ...path,
          steps: updatedSteps,
          completed_steps: completedCount,
          progress_percentage: progress,
        };
      })
    );

    // Call API endpoint
    try {
      await fetch(`http://localhost:8000/api/v1/learning-paths/${activePath.id}/steps/${stepId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token',
        },
      });
    } catch {
      // Local state is already updated
    }
  };

  const handleGeneratePath = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch('http://localhost:8000/api/v1/learning-paths/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token',
        },
        body: JSON.stringify({
          goal: newGoal,
          target_mastery: targetMastery / 100,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setPaths(prev => [json.data, ...prev]);
          setActivePathId(json.data.id);
          setShowGenerateModal(false);
          setIsGenerating(false);
          return;
        }
      }
    } catch {
      // Create local fallback path
    }

    // Local synthesized path fallback
    const syntheticPath: LearningPath = {
      id: `path-${Date.now()}`,
      title: `${newGoal} Curriculum`,
      goal: newGoal,
      subject_id: 'a0000000-0000-0000-0000-000000000001',
      subject_name: 'Machine Learning & AI',
      description: `AI-customized curriculum sequenced for ${targetMastery}% target mastery threshold.`,
      estimated_hours: 3.8,
      total_steps: 3,
      completed_steps: 0,
      progress_percentage: 0.0,
      steps: [
        {
          step_id: `s-${Date.now()}-1`,
          concept_id: 'c0000000-0000-0000-0000-000000000002',
          concept_name: 'Dot-Product Scaling',
          sequence_order: 1,
          title: 'Foundations & Mathematical Intuition',
          description: 'Establish core conceptual anchors before architectural implementation.',
          estimated_minutes: 30,
          difficulty: 'intermediate',
          is_completed: false,
          action_type: 'read_note',
          action_url: '/library',
        },
        {
          step_id: `s-${Date.now()}-2`,
          concept_id: 'c0000000-0000-0000-0000-000000000003',
          concept_name: 'Scaled Dot-Product Attention',
          sequence_order: 2,
          title: 'Adaptive Practice & Diagnostic Testing',
          description: 'Verify problem solving under varied temperature and dimensional settings.',
          estimated_minutes: 45,
          difficulty: 'intermediate',
          is_completed: false,
          action_type: 'practice_quiz',
          action_url: '/practice',
        },
        {
          step_id: `s-${Date.now()}-3`,
          concept_id: 'c0000000-0000-0000-0000-000000000004',
          concept_name: 'Multi-Head Attention Projections',
          sequence_order: 3,
          title: 'Synthesis & Integration Milestone',
          description: 'Connect parallel subspaces to transformer encoder layers.',
          estimated_minutes: 40,
          difficulty: 'advanced',
          is_completed: false,
          action_type: 'flashcard_review',
          action_url: '/flashcards',
        },
      ],
    };

    setPaths(prev => [syntheticPath, ...prev]);
    setActivePathId(syntheticPath.id);
    setShowGenerateModal(false);
    setIsGenerating(false);
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'read_note':
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
      case 'practice_quiz':
        return <Layers className="w-4 h-4 text-amber-600" />;
      case 'flashcard_review':
        return <Clock className="w-4 h-4 text-emerald-600" />;
      case 'inspect_paper':
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <Compass className="w-4 h-4 text-indigo-600" />;
    }
  };

  const getActionBadgeLabel = (actionType: string) => {
    switch (actionType) {
      case 'read_note':
        return 'Knowledge Read';
      case 'practice_quiz':
        return 'Practice Quiz';
      case 'flashcard_review':
        return 'Flashcard Review';
      case 'inspect_paper':
        return 'Research Paper';
      default:
        return 'Study Step';
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
                <Compass className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-primary-text tracking-tight">
                Personalized Learning Paths
              </h1>
              <Badge variant="primary" className="ml-2">Topological DAG</Badge>
            </div>
            <p className="text-sm text-secondary-text mt-1">
              AI-sequenced curriculum roadmaps calculated from prerequisite graph dependencies and Bayesian mastery gaps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowGenerateModal(true)}
              className="text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Generate AI Path
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/gaps')}
              className="text-xs"
            >
              <Target className="w-3.5 h-3.5 mr-1.5" />
              View Gaps
            </Button>
          </div>
        </div>

        {/* Active Path Header Card */}
        {activePath && (
          <div className="bg-white/85 backdrop-blur-md border border-neutral-200/80 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-neutral-100 text-neutral-700">
                    {activePath.subject_name}
                  </Badge>
                  <span className="text-xs text-secondary-text">
                    Estimated Time: {activePath.estimated_hours} hours
                  </span>
                </div>
                <h2 className="text-xl font-bold text-primary-text">
                  {activePath.title}
                </h2>
                <p className="text-sm text-secondary-text max-w-2xl">
                  {activePath.description}
                </p>
              </div>

              {/* Progress Dial Box */}
              <div className="bg-neutral-50/80 border border-neutral-200/80 rounded-2xl p-4 flex items-center gap-4 shrink-0 min-w-[200px] justify-between">
                <div>
                  <span className="text-xs text-secondary-text block">Curriculum Progress</span>
                  <span className="text-2xl font-extrabold text-primary-text">
                    {activePath.progress_percentage}%
                  </span>
                  <span className="text-xs text-secondary-text block mt-0.5">
                    {activePath.completed_steps} of {activePath.total_steps} steps complete
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-primary flex items-center justify-center font-bold text-xs text-primary shadow-xs">
                  {activePath.progress_percentage}%
                </div>
              </div>
            </div>

            {/* Horizontal Progress Bar */}
            <div className="mt-6 w-full bg-neutral-200/70 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${activePath.progress_percentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Milestone Steps Timeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-semibold text-primary-text flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-primary" />
              Sequenced Milestones & Prerequisites
            </h3>
            <span className="text-xs text-secondary-text">
              Topologically sorted by prerequisite DAG
            </span>
          </div>

          <div className="space-y-3">
            {activePath && activePath.steps.map((step, idx) => {
              const isLocked = idx > 0 && !activePath.steps[idx - 1].is_completed && !step.is_completed;

              return (
                <div
                  key={step.step_id}
                  className={`bg-white/85 backdrop-blur-md border rounded-2xl p-5 transition-all shadow-xs ${
                    step.is_completed
                      ? 'border-emerald-200/80 bg-emerald-50/20'
                      : isLocked
                      ? 'border-neutral-200/60 opacity-80'
                      : 'border-neutral-200/80 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Left: Checkbox + Step Info */}
                    <div className="flex items-start gap-3.5">
                      <button
                        onClick={() => handleToggleStep(step.step_id)}
                        className={`mt-1 p-1 rounded-full transition-colors shrink-0 ${
                          step.is_completed
                            ? 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200'
                            : 'text-neutral-400 hover:text-primary bg-neutral-100'
                        }`}
                        title={step.is_completed ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {step.is_completed ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-bold text-neutral-400">
                            STEP {step.sequence_order}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-neutral-100 text-neutral-700">
                            {getActionIcon(step.action_type)}
                            {getActionBadgeLabel(step.action_type)}
                          </span>
                          <Badge
                            variant={
                              step.difficulty === 'beginner'
                                ? 'success'
                                : step.difficulty === 'intermediate'
                                ? 'primary'
                                : 'warning'
                            }
                            className="text-[10px] px-1.5 py-0.2"
                          >
                            {step.difficulty}
                          </Badge>
                          <span className="text-xs text-secondary-text">
                            ~{step.estimated_minutes} mins
                          </span>
                        </div>

                        <h4 className={`text-base font-semibold ${
                          step.is_completed ? 'line-through text-secondary-text' : 'text-primary-text'
                        }`}>
                          {step.title}
                        </h4>
                        
                        <p className="text-xs text-secondary-text max-w-xl">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Launch Button */}
                    <div className="flex items-center gap-2 sm:self-center shrink-0">
                      <Button
                        variant={step.is_completed ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => navigate(step.action_url)}
                        className="text-xs shadow-xs"
                      >
                        {step.is_completed ? 'Review' : 'Start Step'}
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Generate Path Modal */}
        {showGenerateModal && (
          <div className="fixed inset-0 bg-primary-text/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-neutral-200/80 shadow-xl space-y-5 animate-scale-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-50 text-primary rounded-lg">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-primary-text text-lg">Generate AI Learning Path</h3>
                </div>
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="text-neutral-400 hover:text-neutral-600 text-sm font-semibold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleGeneratePath} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-secondary-text block mb-1">
                    Learning Goal / Target Skill
                  </label>
                  <input
                    type="text"
                    value={newGoal}
                    onChange={e => setNewGoal(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="e.g. Master Self-Attention Subspaces"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-secondary-text mb-1">
                    <span>Target Bayesian Mastery</span>
                    <span className="text-primary font-bold">{targetMastery}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="95"
                    step="5"
                    value={targetMastery}
                    onChange={e => setTargetMastery(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                    <span>Developing (60%)</span>
                    <span>Proficient (80%)</span>
                    <span>Mastered (95%)</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowGenerateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                        Generate Roadmap
                      </>
                    )}
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
