import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  BookOpen, 
  Cpu, 
  Binary, 
  GitFork, 
  Clock, 
  Calendar, 
  Compass, 
  Target,
  GraduationCap,
  Microscope,
  Code2,
  Briefcase
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import { UserRole, EducationalLevel, OnboardingData } from '../../types/auth';

const ROLES: { id: UserRole; title: string; desc: string; icon: React.ElementType }[] = [
  { id: 'student', title: 'Student', desc: 'Preparing for university coursework, qualifying exams, or GRE/MCAT', icon: GraduationCap },
  { id: 'researcher', title: 'Researcher', desc: 'Synthesizing literature, tracing scientific concepts, and writing papers', icon: Microscope },
  { id: 'engineer', title: 'Engineer', desc: 'Mastering distributed systems, machine learning architectures, and CS', icon: Code2 },
  { id: 'professional', title: 'Professional', desc: 'Upskilling in technical and quantitative decision making', icon: Briefcase },
];

const PREDEFINED_SUBJECTS = [
  { id: 'machine-learning', name: 'Machine Learning & AI', icon: Cpu, color: '#7667F5', desc: 'Transformers, Backpropagation, Deep Architectures' },
  { id: 'mathematics-statistics', name: 'Mathematics & Statistics', icon: Binary, color: '#D99A32', desc: 'Linear Algebra, Bayesian Inference, Probability' },
  { id: 'systems-architecture', name: 'Systems & Architecture', icon: Cpu, color: '#229B72', desc: 'Concurrency, Memory Hierarchies, Operating Systems' },
  { id: 'algorithms-data-structures', name: 'Algorithms & Data Structures', icon: GitFork, color: '#9B8AFB', desc: 'Dynamic Programming, Graph Theory, Asymptotics' },
  { id: 'cognitive-science', name: 'Cognitive Science', icon: Brain, color: '#D9536B', desc: 'Memory Consolidation, Retrieval Practice, BKT' },
];

const STARTER_CONCEPTS_MAP: Record<string, string[]> = {
  'machine-learning': ['Self-Attention Mechanism', 'Transformer Positional Encoding', 'Cross-Entropy Loss Surface', 'Layer Normalization'],
  'mathematics-statistics': ['Singular Value Decomposition (SVD)', 'Bayes Theorem & Priors', 'Covariance Matrices', 'Eigenvectors & Eigenvalues'],
  'systems-architecture': ['Virtual Memory Paging', 'CPU Cache Coherency (MESI)', 'Process Scheduling', 'Atomic Operations'],
  'algorithms-data-structures': ['Breadth-First Search Trees', 'Memoized Fibonacci DAGs', 'Red-Black Tree Rotations', 'Dijkstras Shortest Path'],
  'cognitive-science': ['Ebbinghaus Forgetting Model', 'BKT Posterior Calculation', 'Active Testing Effect', 'Cognitive Load Theory'],
};

export const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();
  const { profile, completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State
  const [role, setRole] = useState<UserRole>(profile?.role || 'student');
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [educationalLevel, setEducationalLevel] = useState<EducationalLevel>('undergraduate');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['machine-learning', 'mathematics-statistics']);
  const [primaryGoal, setPrimaryGoal] = useState('Master Transformer Attention and Bayesian Knowledge Tracing');
  const [knowledgeLevel, setKnowledgeLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [selectedDays, setSelectedDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);

  const toggleSubject = (slug: string) => {
    setSelectedSubjects(prev =>
      prev.includes(slug) ? (prev.length > 1 ? prev.filter(s => s !== slug) : prev) : [...prev, slug]
    );
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? (prev.length > 1 ? prev.filter(d => d !== day) : prev) : [...prev, day]
    );
  };

  const getRecommendedStarterConcepts = () => {
    const concepts: string[] = [];
    selectedSubjects.forEach(subj => {
      const list = STARTER_CONCEPTS_MAP[subj] || [];
      concepts.push(...list.slice(0, 2));
    });
    return concepts.slice(0, 6);
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    const onboardingPayload: OnboardingData = {
      role,
      display_name: displayName || 'Learner',
      educational_level: educationalLevel,
      primary_goal: primaryGoal,
      selected_subjects: selectedSubjects,
      current_knowledge_level: knowledgeLevel,
      daily_study_minutes: dailyMinutes,
      preferred_days: selectedDays,
      recommended_starter_concepts: getRecommendedStarterConcepts(),
    };

    await completeOnboarding(onboardingPayload);
    setIsSubmitting(false);
    navigate('/dashboard');
  };

  const totalSteps = 5;

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl px-4 z-10">
        {/* Wizard Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-muted mb-2">
            <span className="flex items-center gap-1.5 text-primary">
              <Sparkles className="w-3.5 h-3.5" /> Step {step} of {totalSteps}
            </span>
            <span>
              {step === 1 && 'Role & Profile'}
              {step === 2 && 'Subjects & Target Goals'}
              {step === 3 && 'Baseline Knowledge Level'}
              {step === 4 && 'Study Cadence'}
              {step === 5 && 'Synthesized Learning Plan'}
            </span>
          </div>
          <div className="w-full bg-surface-secondary h-2 rounded-full overflow-hidden border border-muted-border/60">
            <div
              className="gradient-accent h-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Card Container */}
        <Card className="p-6 sm:p-10 shadow-xl">
          {/* STEP 1: ROLE & BASIC PROFILE */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-primary-text tracking-tight">How will you use Synapse?</h2>
                <p className="text-sm text-muted mt-1">This helps tailor question generation and mastery decay rates.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const isSelected = role === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                        isSelected
                          ? 'border-primary bg-primary-light/40 shadow-sm'
                          : 'border-muted-border/80 glass-panel hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? 'bg-primary text-white' : 'bg-surface-secondary text-muted'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-primary-text text-sm">{r.title}</h4>
                      </div>
                      <p className="text-xs text-muted leading-relaxed">{r.desc}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Input
                  label="Display Name"
                  placeholder="e.g. Alex Chen"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
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
              </div>
            </div>
          )}

          {/* STEP 2: SUBJECTS & PRIMARY GOAL */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-primary-text tracking-tight">Select your focus areas</h2>
                <p className="text-sm text-muted mt-1">Choose at least one subject to populate your knowledge graph.</p>
              </div>

              <div className="space-y-2.5">
                {PREDEFINED_SUBJECTS.map((subj) => {
                  const isSelected = selectedSubjects.includes(subj.id);
                  const Icon = subj.icon;
                  return (
                    <div
                      key={subj.id}
                      onClick={() => toggleSubject(subj.id)}
                      className={`p-3.5 rounded-xl cursor-pointer border flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-primary bg-primary-light/30 shadow-sm'
                          : 'border-muted-border/80 glass-panel hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: subj.color }}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-primary-text text-sm">{subj.name}</h4>
                          <p className="text-xs text-muted">{subj.desc}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-primary bg-primary text-white' : 'border-muted-border'}`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Input
                label="Primary Objective / Target Examination"
                placeholder="e.g. Master Transformer Attention and pass ML qualifying exam"
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
              />
            </div>
          )}

          {/* STEP 3: BASELINE KNOWLEDGE LEVEL */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-primary-text tracking-tight">What is your current depth?</h2>
                <p className="text-sm text-muted mt-1">This sets the initial prior probability P(L₀) in Bayesian Knowledge Tracing.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'beginner', title: 'Foundational', prob: 'P(L₀) ≈ 0.15', desc: 'Starting fresh. Require thorough explanations and fundamental prerequisite checks.' },
                  { id: 'intermediate', title: 'Proficient', prob: 'P(L₀) ≈ 0.40', desc: 'Familiar with core concepts. Ready for deep application problems and derivations.' },
                  { id: 'advanced', title: 'Specialist', prob: 'P(L₀) ≈ 0.70', desc: 'Looking for edge cases, nuanced proofs, and rapid retention maintenance.' },
                ].map((lvl) => {
                  const isSelected = knowledgeLevel === lvl.id;
                  return (
                    <div
                      key={lvl.id}
                      onClick={() => setKnowledgeLevel(lvl.id as 'beginner' | 'intermediate' | 'advanced')}
                      className={`p-4 rounded-2xl cursor-pointer border flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-primary bg-primary-light/40 shadow-sm'
                          : 'border-muted-border/80 glass-panel hover:border-primary/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-primary-text text-sm">{lvl.title}</h4>
                          <Badge variant={isSelected ? 'primary' : 'secondary'}>{lvl.prob}</Badge>
                        </div>
                        <p className="text-xs text-muted leading-relaxed">{lvl.desc}</p>
                      </div>
                      <div className="pt-4 flex justify-end">
                        <div className={`w-4 h-4 rounded-full border ${isSelected ? 'border-primary bg-primary' : 'border-muted-border'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: STUDY CADENCE */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-primary-text tracking-tight">Establish your study habit</h2>
                <p className="text-sm text-muted mt-1">Spaced repetition functions best with consistent daily increments.</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-primary-text/90 tracking-wide block mb-3">
                  Target Daily Study Time: <span className="text-primary font-bold">{dailyMinutes} minutes</span>
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[15, 30, 45, 60].map((min) => (
                    <button
                      key={min}
                      type="button"
                      onClick={() => setDailyMinutes(min)}
                      className={`py-3 rounded-xl text-sm font-semibold border transition-all ${
                        dailyMinutes === min
                          ? 'border-primary bg-primary text-white shadow-sm'
                          : 'border-muted-border glass-panel text-primary-text hover:border-primary/40'
                      }`}
                    >
                      {min} min
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-primary-text/90 tracking-wide block mb-3">
                  Active Study Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'border-primary bg-primary-light text-primary'
                            : 'border-muted-border glass-panel text-muted hover:text-primary'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: INITIAL PLAN GENERATION */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl gradient-accent text-white flex items-center justify-center mx-auto shadow-md">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-primary-text tracking-tight">Your Personalized Knowledge Plan</h2>
                <p className="text-xs text-muted max-w-md mx-auto">
                  Based on your {role} profile and baseline confidence, we have generated your starter concept queue:
                </p>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-primary/20 space-y-3">
                <span className="text-xs font-bold text-primary uppercase tracking-wider block">Recommended Starter Nodes</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {getRecommendedStarterConcepts().map((concept, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-muted-border/60 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                      <span className="font-medium text-primary-text">{concept}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-success-light/50 border border-success/30 flex items-center gap-3 text-xs text-success-text">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                <span>Preferences will be saved to your private PostgreSQL profile with Row-Level Security.</span>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-8 border-t border-muted-border/60 mt-8">
            {step > 1 ? (
              <Button
                variant="outline"
                size="md"
                onClick={() => setStep(s => s - 1)}
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
              </Button>
            ) : <div />}

            {step < totalSteps ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(s => s + 1)}
              >
                Continue <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                onClick={handleFinish}
                className="shadow-md shadow-primary/25"
              >
                Launch Your Dashboard <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
