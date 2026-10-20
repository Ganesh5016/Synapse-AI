import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Network, 
  Search, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  Shield, 
  BookOpen, 
  BarChart3, 
  Layers, 
  FileCheck, 
  Zap, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      icon: Search,
      title: 'Grounded Semantic RAG (Vector Search)',
      tag: 'AI Core',
      description: 'Zero hallucinations. Synapse divides your uploaded notes and textbooks into semantic chunks, generates high-dimensional embeddings via Hugging Face models, and performs cosine similarity search with exact source citations.',
      benefits: ['Precise page & paragraph citations', 'Support for PDF, Markdown, and rich text', 'Zero cross-user data leakage with PostgreSQL pgvector'],
    },
    {
      icon: TrendingUp,
      title: 'Bayesian Knowledge Tracing (BKT)',
      tag: 'Psychometrics',
      description: 'Unlike standard quiz apps that calculate simple percentages, Synapse uses standard BKT probabilistic modeling. We estimate your true latent mastery probability across each skill, factoring in slip rates, guessing probability, and skill transition dynamics.',
      benefits: ['Probabilistic mastery estimation', 'Slip & guess mitigation', 'Automated knowledge gap diagnosis'],
    },
    {
      icon: Network,
      title: 'Interactive Knowledge Graph Visualizer',
      tag: 'Network Science',
      description: 'Render your understanding as an interactive topological network using React Flow. Nodes represent concepts, colors denote current mastery state, and edges represent strict prerequisite dependencies.',
      benefits: ['Visual prerequisite trees', 'Instant bottleneck identification', 'Filter by subject or mastery status'],
    },
    {
      icon: Clock,
      title: 'SM-2 Adaptive Spaced Repetition',
      tag: 'Cognitive Retention',
      description: 'Beat the Ebbinghaus forgetting curve. Our spaced repetition engine implements the SuperMemo-2 scheduling algorithm to serve flashcards and practice problems at mathematically optimal intervals.',
      benefits: ['Automated review queue management', 'Ease-factor and interval recalibration', 'Reduces review load while maximizing retention'],
    },
    {
      icon: Layers,
      title: 'Multi-Modal Practice Center',
      tag: 'Active Recall',
      description: 'Test yourself with diverse question formats: multiple choice with distractor rationale, flashcard flips, short answer self-evaluations, and step-by-step problem derivations.',
      benefits: ['Targeted retrieval practice', 'Adaptive difficulty adjustments', 'Hints derived from prerequisite nodes'],
    },
    {
      icon: BarChart3,
      title: 'Cognitive Analytics & Evolution Insights',
      tag: 'Telemetry',
      description: 'Track your growth with interactive Recharts visualizations. Inspect your mastery distribution across subjects, monitor your daily study streak, and inspect projected retention over time.',
      benefits: ['Temporal mastery curves', 'Subject-level radar charts', 'Weekly study cadence tracking'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="primary">Platform Capabilities</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-text tracking-tight">
          Engineered for Deep Conceptual Learning
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          Synapse replaces shallow rote memorization with a scientifically validated knowledge development system.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <Card key={idx} className="flex flex-col justify-between hover:border-primary/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary">{feature.tag}</Badge>
                </div>
                <CardTitle className="mb-2 text-xl">{feature.title}</CardTitle>
                <CardDescription className="leading-relaxed mb-6">
                  {feature.description}
                </CardDescription>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-muted-border/50">
                {feature.benefits.map((benefit, bIdx) => (
                  <div key={bIdx} className="flex items-center gap-2 text-xs text-primary-text/90">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Call to action */}
      <div className="glass-panel p-10 rounded-3xl text-center space-y-6 max-w-3xl mx-auto border border-primary/20">
        <h3 className="text-2xl font-bold text-primary-text">Experience the difference in your study workflow</h3>
        <p className="text-sm text-muted">Get started for free or log in with your university/personal account.</p>
        <div className="flex justify-center gap-4">
          <Link to="/signup">
            <Button variant="primary" size="md">
              Start Free Today <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link to="/how-it-works">
            <Button variant="outline" size="md">
              Read Scientific Methodology
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
