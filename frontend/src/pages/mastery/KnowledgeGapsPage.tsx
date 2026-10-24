import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Play,
  Layers,
  BookOpen,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  Filter,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface KnowledgeGap {
  id: string;
  concept_id: string;
  concept_name: string;
  subject_name: string;
  severity: 'critical' | 'moderate' | 'minor';
  current_mastery: number;
  target_mastery: number;
  root_cause: string;
  recommended_action: string;
  action_type: 'practice_quiz' | 'study_prerequisite' | 'flashcard_repetition';
  prereq_name?: string;
  slug: string;
}

export const KnowledgeGapsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const gaps: KnowledgeGap[] = [
    {
      id: 'gap-01',
      concept_id: 'c0000000-0000-0000-0000-000000000008',
      concept_name: 'SuperMemo SM-2 Spaced Repetition',
      subject_name: 'Cognitive Science & Psychology',
      severity: 'critical',
      current_mastery: 0.38,
      target_mastery: 0.85,
      root_cause:
        'Repeated retrieval errors on the Easiness Factor (EF) boundary conditions and repetition reset rules.',
      recommended_action:
        'Complete 4 targeted practice questions focused on EF lower bounding (EF >= 1.3) and review the spaced repetition deck.',
      action_type: 'practice_quiz',
      slug: 'sm-2-spaced-repetition',
    },
    {
      id: 'gap-02',
      concept_id: 'c0000000-0000-0000-0000-000000000005',
      concept_name: 'Transformer Architecture & Self-Attention',
      subject_name: 'Machine Learning & AI',
      severity: 'critical',
      current_mastery: 0.52,
      target_mastery: 0.85,
      root_cause:
        'Missing prerequisite mastery in Multi-Head Attention (currently at 65%). Attempting full architecture synthesis before mastering parallel projection subspaces.',
      recommended_action:
        'Review the Multi-Head Attention notes and complete prerequisite quiz before advancing.',
      action_type: 'study_prerequisite',
      prereq_name: 'Multi-Head Attention',
      slug: 'transformer-architecture',
    },
    {
      id: 'gap-03',
      concept_id: 'c0000000-0000-0000-0000-000000000007',
      concept_name: 'Bayesian Knowledge Tracing (BKT)',
      subject_name: 'Cognitive Science & Psychology',
      severity: 'moderate',
      current_mastery: 0.58,
      target_mastery: 0.80,
      root_cause:
        'Concept in developing state (58%). 14 days since last practice indicates high risk of retention decay.',
      recommended_action:
        'Review 4 active flashcards to reinforce Guess P(G) vs Slip P(S) parameter equations.',
      action_type: 'flashcard_repetition',
      slug: 'bayesian-knowledge-tracing',
    },
    {
      id: 'gap-04',
      concept_id: 'c0000000-0000-0000-0000-000000000004',
      concept_name: 'Multi-Head Attention',
      subject_name: 'Machine Learning & AI',
      severity: 'moderate',
      current_mastery: 0.65,
      target_mastery: 0.85,
      root_cause:
        'Moderate confidence. Inconsistent answers on linear transformation dimensions and parameter count.',
      recommended_action:
        'Practice 3 questions on projection matrices and head concatenation mechanics.',
      action_type: 'practice_quiz',
      slug: 'multi-head-attention',
    },
  ];

  const filteredGaps =
    filterSeverity === 'all'
      ? gaps
      : gaps.filter((g) => g.severity === filterSeverity);

  const criticalCount = gaps.filter((g) => g.severity === 'critical').length;
  const moderateCount = gaps.filter((g) => g.severity === 'moderate').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. TOP HEADER & METRICS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-warning/10 via-white to-primary-light/30 border border-warning/20 shadow-xs relative overflow-hidden">
        <div className="space-y-2 z-10 relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-warning/30 text-xs font-semibold text-warning-text mb-1">
            <Compass className="w-3.5 h-3.5 text-warning" />
            <span>Bayesian Diagnostic Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-text tracking-tight">
            Knowledge Gaps & Deficit Diagnostic
          </h1>
          <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
            Automated detection identifies prerequisite bottlenecks and memory decay risks before they hinder complex problem solving.
          </p>
        </div>

        {/* Severity Metrics */}
        <div className="flex items-center gap-3 z-10 relative">
          <div className="px-4 py-2.5 rounded-2xl bg-white/90 border border-muted-border text-center shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
              Critical
            </span>
            <span className="text-xl font-extrabold text-danger">{criticalCount}</span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-white/90 border border-muted-border text-center shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
              Moderate
            </span>
            <span className="text-xl font-extrabold text-warning">{moderateCount}</span>
          </div>
        </div>
      </div>

      {/* 2. FILTER PILLS */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 bg-surface-secondary/80 p-1 rounded-xl border border-muted-border">
          {['all', 'critical', 'moderate'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                filterSeverity === sev
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-muted hover:text-primary-text'
              }`}
            >
              {sev === 'all' ? 'All Gaps (4)' : `${sev} (${sev === 'critical' ? criticalCount : moderateCount})`}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/practice')}
          className="text-xs text-primary"
        >
          <Play className="w-3.5 h-3.5 mr-1" /> Practice Remediation Session
        </Button>
      </div>

      {/* 3. GAPS CARDS LIST */}
      <div className="space-y-4">
        {filteredGaps.map((gap) => {
          const isCritical = gap.severity === 'critical';
          return (
            <Card
              key={gap.id}
              className={`p-6 transition-all border hover:border-primary/40 ${
                isCritical ? 'bg-white/95 border-danger/30' : 'bg-white/90 border-muted-border'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        isCritical
                          ? 'bg-danger-light text-danger border-danger/30'
                          : 'bg-warning-light text-warning-text border-warning/30'
                      }`}
                    >
                      {gap.severity} Deficit
                    </span>
                    <span className="text-xs text-muted font-medium">{gap.subject_name}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-primary-text hover:text-primary cursor-pointer" onClick={() => navigate(`/concepts/${gap.slug}`)}>
                    {gap.concept_name}
                  </h3>

                  <p className="text-xs text-muted leading-relaxed">
                    <strong className="text-primary-text font-semibold">Root Cause: </strong>
                    {gap.root_cause}
                  </p>

                  <div className="p-3 rounded-xl bg-surface/80 border border-muted-border/80 text-xs text-primary-text leading-relaxed">
                    <strong className="text-primary font-semibold">Remediation Step: </strong>
                    {gap.recommended_action}
                  </div>
                </div>

                {/* Mastery Gauge & Action */}
                <div className="sm:w-56 flex-shrink-0 flex flex-col justify-between items-end gap-4 border-t sm:border-t-0 sm:border-l border-muted-border pt-4 sm:pt-0 sm:pl-6">
                  <div className="w-full space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-muted">Current</span>
                      <span className="font-bold text-primary-text">
                        {Math.round(gap.current_mastery * 100)}% / {Math.round(gap.target_mastery * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-surface-secondary rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCritical ? 'bg-danger' : 'bg-warning'
                        }`}
                        style={{ width: `${Math.round(gap.current_mastery * 100)}%` }}
                      />
                    </div>
                  </div>

                  {gap.action_type === 'practice_quiz' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/practice?conceptId=${gap.slug}`)}
                      className="w-full flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-hover text-white shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Take Practice Drill</span>
                    </Button>
                  )}

                  {gap.action_type === 'study_prerequisite' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/notes/new')}
                      className="w-full flex items-center justify-center gap-1.5 text-primary border-primary/30"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Review Prerequisite</span>
                    </Button>
                  )}

                  {gap.action_type === 'flashcard_repetition' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate('/flashcards')}
                      className="w-full flex items-center justify-center gap-1.5 text-accent"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Review Flashcards</span>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
