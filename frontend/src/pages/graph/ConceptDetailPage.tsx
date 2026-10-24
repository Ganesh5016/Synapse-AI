import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Compass,
  Sparkles,
  BookOpen,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ConceptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Concept data
  const concept = {
    id: 'c0000000-0000-0000-0000-000000000003',
    name: 'Scaled Dot-Product Attention',
    slug: id || 'scaled-dot-product-attention',
    subject_name: 'Machine Learning & AI',
    subject_color: '#7667F5',
    difficulty_level: 'intermediate',
    description:
      'The foundational routing and correlation mechanism in Transformer networks. Scaled Dot-Product Attention calculates dynamic attention weights between query vectors (Q) and key vectors (K), scaling their inner product by 1/sqrt(d_k) to prevent softmax gradient vanishing.',
    mastery_score: 0.78,
    mastery_level: 'Proficient',
    decay_risk: 'Low',
    bkt_p_know: 0.78,
    key_terms: ['query', 'key', 'value', 'softmax', 'variance-scaling', 'projection'],
    prerequisites: [
      { name: 'Linear Algebra Foundations', mastery: 0.92, met: true, slug: 'linear-algebra-foundations' },
      { name: 'Gradient Descent & Backpropagation', mastery: 0.84, met: true, slug: 'gradient-descent-backprop' },
    ],
    unlocks: [
      { name: 'Multi-Head Attention', mastery: 0.65, met: false, slug: 'multi-head-attention' },
      { name: 'Transformer Architecture & Self-Attention', mastery: 0.52, met: false, slug: 'transformer-architecture' },
    ],
    linked_resources: [
      {
        title: 'Attention Is All You Need (Vaswani et al.)',
        type: 'document',
        snippet: 'Original paper introducing Scaled Dot-Product Attention and Multi-Head projection.',
        link: '/library',
      },
      {
        title: 'Transformer Attention Mechanics & Dot-Product Scaling',
        type: 'note',
        snippet: 'Comprehensive derivation of 1/sqrt(d_k) variance normalization.',
        link: '/notes/new',
      },
    ],
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. TOP BREADCRUMB & BACK BUTTON */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/graph')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Knowledge Graph</span>
        </button>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-primary border-primary/30">
            {concept.subject_name}
          </Badge>
          <Badge variant="success">{concept.mastery_level}</Badge>
        </div>
      </div>

      {/* 2. HERO OVERVIEW CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-primary-light/40 via-white to-accent-light/30 border border-primary/20 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-3 z-10 relative">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">
            Concept Blueprint
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-text tracking-tight">
            {concept.name}
          </h1>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            {concept.description}
          </p>

          {/* Key Terms */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {concept.key_terms.map((term) => (
              <span
                key={term}
                className="px-2.5 py-1 rounded-lg bg-white/90 border border-muted-border text-[11px] font-medium text-primary-text"
              >
                #{term}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-6 z-10 relative">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(`/practice?conceptId=${concept.slug}`)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white shadow-sm shadow-primary/20"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Practice 4 Questions</span>
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/flashcards')}
            className="flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-accent" />
            <span>Review Flashcards</span>
          </Button>

          <Button
            variant="ghost"
            size="md"
            onClick={() =>
              navigate(`/assistant?q=${encodeURIComponent(`Explain mathematical derivations for ${concept.name}`)}`)
            }
            className="flex items-center gap-1.5 text-xs text-muted hover:text-primary"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Ask AI Assistant</span>
          </Button>
        </div>
      </div>

      {/* 3. MASTERY METRICS & PREREQUISITES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Bayesian Mastery */}
        <Card className="p-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-muted block">
            Bayesian Mastery State
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-primary-text">
              {Math.round(concept.mastery_score * 100)}%
            </span>
            <span className="text-xs font-semibold text-success">Proficient Level</span>
          </div>
          <div className="w-full bg-surface-secondary rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${Math.round(concept.mastery_score * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-muted leading-relaxed">
            Updated via Bayesian Knowledge Tracing across your retrieval practice sessions.
          </p>
        </Card>

        {/* Card 2: Memory Retention Stability */}
        <Card className="p-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-muted block">
            Memory Retention Half-Life
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-primary-text">24 Days</span>
            <span className="text-xs font-semibold text-emerald-600">Low Decay Risk</span>
          </div>
          <p className="text-[11px] text-muted leading-relaxed">
            Your SM-2 interval is expanding steadily. The next optimal review is due in 3 days.
          </p>
        </Card>

        {/* Card 3: Cognitive Complexity */}
        <Card className="p-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-muted block">
            Cognitive Complexity
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-primary-text capitalize">
              {concept.difficulty_level}
            </span>
            <span className="text-xs text-muted">Bloom Level 4</span>
          </div>
          <p className="text-[11px] text-muted leading-relaxed">
            Requires synthesis of matrix linear algebra and differential optimization.
          </p>
        </Card>
      </div>

      {/* 4. PREREQUISITE & UNLOCKED CONCEPT ROADMAP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prerequisites */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-primary-text flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-success" />
              Foundational Prerequisites
            </h3>
            <span className="text-xs text-muted">2 of 2 Met</span>
          </div>

          <div className="space-y-2">
            {concept.prerequisites.map((p, i) => (
              <div
                key={i}
                onClick={() => navigate(`/concepts/${p.slug}`)}
                className="p-3 rounded-xl bg-surface/70 hover:bg-white border border-muted-border hover:border-primary/30 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <div>
                    <h5 className="text-xs font-bold text-primary-text group-hover:text-primary">
                      {p.name}
                    </h5>
                    <span className="text-[10px] text-muted">{Math.round(p.mastery * 100)}% Mastery</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary" />
              </div>
            ))}
          </div>
        </Card>

        {/* What This Unlocks */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-primary-text flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" />
              Advanced Concepts Unlocked
            </h3>
            <span className="text-xs text-muted">Next Curriculum</span>
          </div>

          <div className="space-y-2">
            {concept.unlocks.map((u, i) => (
              <div
                key={i}
                onClick={() => navigate(`/concepts/${u.slug}`)}
                className="p-3 rounded-xl bg-surface/70 hover:bg-white border border-muted-border hover:border-primary/30 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full border-2 border-primary/40 flex items-center justify-center" />
                  <div>
                    <h5 className="text-xs font-bold text-primary-text group-hover:text-primary">
                      {u.name}
                    </h5>
                    <span className="text-[10px] text-muted">Developing ({Math.round(u.mastery * 100)}%)</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 5. LINKED RESOURCES & NOTES */}
      <Card className="p-5 space-y-4">
        <h3 className="text-sm font-bold text-primary-text flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          Linked Library Papers & Notes
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {concept.linked_resources.map((res, i) => (
            <Link
              key={i}
              to={res.link}
              className="p-3.5 rounded-xl bg-white border border-muted-border hover:border-primary/40 transition-all flex flex-col justify-between group shadow-2xs"
            >
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  {res.type === 'document' ? (
                    <FileText className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <BookOpen className="w-3.5 h-3.5 text-accent" />
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                    {res.type}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-primary-text group-hover:text-primary mb-1">
                  {res.title}
                </h5>
                <p className="text-[11px] text-muted line-clamp-2">{res.snippet}</p>
              </div>

              <div className="pt-2 mt-2 border-t border-muted-border/40 flex items-center justify-end text-[11px] font-semibold text-primary">
                <span>Open Resource</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
};
