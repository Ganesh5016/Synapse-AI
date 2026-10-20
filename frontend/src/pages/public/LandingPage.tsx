import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Brain, 
  Network, 
  ChevronRight, 
  CheckCircle2, 
  TrendingUp, 
  Flame,
  Clock,
  Layers,
  Search,
  Shield,
  Zap,
  BookOpen,
  ArrowRight,
  Plus,
  Minus,
  HelpCircle,
  FileText
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { enterDemoMode } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleDemoClick = () => {
    enterDemoMode();
    navigate('/dashboard');
  };

  const faqs = [
    {
      q: 'How does Synapse differ from generic AI chatbots like ChatGPT?',
      a: 'Generic chatbots suffer from hallucination and possess zero awareness of what you specifically know or forget. Synapse strictly grounds AI responses inside your uploaded documents with verifiable page citations, tracks your mastery probability using Bayesian Knowledge Tracing (BKT), and schedules reviews before memory decay occurs.',
    },
    {
      q: 'What is Bayesian Knowledge Tracing (BKT)?',
      a: 'BKT is an established psychometric model that estimates the probability that a student understands a latent skill based on observable test interactions, updating prior probabilities through Bayesian updates while accounting for slips and lucky guesses.',
    },
    {
      q: 'Is my uploaded material secure and private?',
      a: 'Absolutely. Every document and flashcard is strictly isolated using Supabase PostgreSQL Row-Level Security (RLS). Other users cannot query or view your documents. Furthermore, your data is never used to train global AI models.',
    },
    {
      q: 'Can I use Synapse for technical subjects like Machine Learning, Math, or Medicine?',
      a: 'Yes! Synapse is designed specifically for deep, hierarchical knowledge domains with rich Markdown, LaTeX equations, graph visualizations, and multi-concept prerequisite graphs.',
    },
  ];

  return (
    <div className="space-y-24 py-12">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs font-semibold text-primary mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Evidence-Based Cognitive Retention Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-primary-text tracking-tight leading-[1.1] mb-8 max-w-4xl mx-auto">
          Turn What You Learn <br />
          <span className="bg-clip-text text-transparent gradient-accent">
            Into What You Know.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Personalized, mathematically grounded knowledge synthesis. Synapse connects your personal notes, tracks Bayesian mastery, and prevents memory decay with spaced retrieval.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <Link to="/signup" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/25">
              Start Learning Free <ChevronRight className="w-5 h-5 ml-1.5" />
            </Button>
          </Link>
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={handleDemoClick}
            className="w-full sm:w-auto hover:border-primary/40"
          >
            Explore Interactive Demo
          </Button>
        </div>

        {/* Live Hero Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-panel rounded-2xl p-4 text-left">
            <span className="text-xs text-muted font-medium uppercase tracking-wider block mb-1">Knowledge Health</span>
            <div className="text-2xl font-bold text-primary-text flex items-center gap-1.5">
              92.4% <span className="text-xs font-semibold text-success">+3.8%</span>
            </div>
          </div>
          <div className="glass-panel rounded-2xl p-4 text-left">
            <span className="text-xs text-muted font-medium uppercase tracking-wider block mb-1">Concepts Mastered</span>
            <div className="text-2xl font-bold text-primary-text flex items-center gap-1.5">
              148 <span className="text-xs text-muted font-normal">in ML & Math</span>
            </div>
          </div>
          <div className="glass-panel rounded-2xl p-4 text-left">
            <span className="text-xs text-muted font-medium uppercase tracking-wider block mb-1">Retrieval Streak</span>
            <div className="text-2xl font-bold text-primary-text flex items-center gap-1.5">
              14 Days <Flame className="w-4 h-4 text-warning" />
            </div>
          </div>
          <div className="glass-panel rounded-2xl p-4 text-left">
            <span className="text-xs text-muted font-medium uppercase tracking-wider block mb-1">Citation Accuracy</span>
            <div className="text-2xl font-bold text-primary-text flex items-center gap-1.5">
              100% <Shield className="w-4 h-4 text-success" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT PREVIEW & KNOWLEDGE GRAPH MOCKUP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-4 sm:p-6 rounded-3xl border border-muted-border/80 shadow-2xl relative overflow-hidden">
          {/* Mock Browser Header */}
          <div className="flex items-center justify-between pb-4 border-b border-muted-border/60 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-error/60" />
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
              <span className="text-xs text-muted ml-3 font-mono">synapse.app/dashboard/graph</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted">
              <Badge variant="primary">Graph View Active</Badge>
              <Badge variant="outline">24 Connected Nodes</Badge>
            </div>
          </div>

          {/* Interactive Graph Simulation Area */}
          <div className="bg-surface-secondary/40 rounded-2xl p-6 sm:p-10 border border-muted-border/50 relative overflow-hidden min-h-[360px] flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-4 z-10">
              <div>
                <span className="text-xs font-bold text-primary tracking-wider uppercase">Active Concept Network</span>
                <h3 className="text-xl font-bold text-primary-text">Machine Learning Architecture & Transformers</h3>
              </div>
              <div className="flex gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs bg-white text-primary-text shadow-sm border border-muted-border">
                  <span className="w-2 h-2 rounded-full bg-success mr-2" /> Mastered (p &gt; 0.85)
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs bg-white text-primary-text shadow-sm border border-muted-border">
                  <span className="w-2 h-2 rounded-full bg-warning mr-2" /> Learning (p = 0.52)
                </span>
              </div>
            </div>

            {/* Visual Node Diagram */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8 z-10">
              <div className="glass-panel p-4 rounded-xl border border-success/30 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-success mb-1">
                    <span>Prerequisite Node</span>
                    <span>94%</span>
                  </div>
                  <h4 className="font-bold text-primary-text text-sm">Self-Attention Mechanism</h4>
                  <p className="text-xs text-muted mt-1">Q, K, V dot-product projection</p>
                </div>
                <div className="w-full bg-muted-border/40 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-success h-full rounded-full" style={{ width: '94%' }} />
                </div>
              </div>

              <div className="glass-panel p-4 rounded-xl border-2 border-primary/40 shadow-md relative flex flex-col justify-between">
                <div className="absolute -top-2.5 right-3">
                  <Badge variant="primary">Target Focus</Badge>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-primary mb-1">
                    <span>Core Target</span>
                    <span>72%</span>
                  </div>
                  <h4 className="font-bold text-primary-text text-sm">Multi-Head Attention</h4>
                  <p className="text-xs text-muted mt-1">Parallel subspace representations</p>
                </div>
                <div className="w-full bg-muted-border/40 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '72%' }} />
                </div>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-warning/30 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-warning mb-1">
                    <span>Upcoming Review</span>
                    <span>48%</span>
                  </div>
                  <h4 className="font-bold text-primary-text text-sm">Causal Masking & Decoding</h4>
                  <p className="text-xs text-muted mt-1">Autoregressive sequence synthesis</p>
                </div>
                <div className="w-full bg-muted-border/40 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-warning h-full rounded-full" style={{ width: '48%' }} />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-muted pt-4 border-t border-muted-border/40 gap-3 z-10">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" /> Dynamic prerequisite inference powered by Bayesian Knowledge Tracing
              </span>
              <button 
                onClick={handleDemoClick}
                className="text-primary font-semibold hover:underline flex items-center gap-1"
              >
                Open Full Interactive Graph <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE CAPABILITIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="primary" className="mb-3">Architected for Depth</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-text tracking-tight">
            Four Pillars of Cognitive Mastery
          </h2>
          <p className="text-muted mt-3 text-base">
            Every feature is engineered against empirical research in cognitive psychology and psychometrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <Card>
            <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-5 shadow-sm">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-primary-text mb-2">Grounded Semantic RAG</h3>
            <p className="text-sm text-muted leading-relaxed">
              Inference powered by Hugging Face models strictly grounded in your personal uploaded PDFs and Markdown notes. Zero ungrounded hallucination.
            </p>
          </Card>

          {/* Card 2 */}
          <Card>
            <div className="w-12 h-12 rounded-2xl bg-success-light text-success flex items-center justify-center mb-5 shadow-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-primary-text mb-2">Bayesian Mastery (BKT)</h3>
            <p className="text-sm text-muted leading-relaxed">
              Dynamically estimates your latent knowledge state after every question, factoring in slip probabilities, lucky guesses, and prerequisite readiness.
            </p>
          </Card>

          {/* Card 3 */}
          <Card>
            <div className="w-12 h-12 rounded-2xl bg-accent-light text-accent flex items-center justify-center mb-5 shadow-sm">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-primary-text mb-2">SM-2 Spaced Retrieval</h3>
            <p className="text-sm text-muted leading-relaxed">
              Calculates optimal review intervals based on the SuperMemo-2 algorithm, interrupting the Ebbinghaus forgetting curve before decay sets in.
            </p>
          </Card>

          {/* Card 4 */}
          <Card>
            <div className="w-12 h-12 rounded-2xl bg-warning-light text-warning flex items-center justify-center mb-5 shadow-sm">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-primary-text mb-2">Concept Dependency Graphs</h3>
            <p className="text-sm text-muted leading-relaxed">
              Visualize prerequisite trees with React Flow. Identify bottlenecks and weak nodes before attempting advanced conceptual problems.
            </p>
          </Card>
        </div>
      </section>

      {/* 4. HOW SYNAPSE WORKS — 4-STEP COGNITIVE RETENTION LOOP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 sm:p-12 rounded-3xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-2">The Learning Loop</span>
            <h2 className="text-3xl font-extrabold text-primary-text">How Synapse Evolves With You</h2>
            <p className="text-muted text-sm mt-2">A closed-loop system from initial document ingestion to long-term memory consolidation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl gradient-accent text-white flex items-center justify-center font-bold text-sm shadow-md">
                1
              </div>
              <h4 className="font-bold text-primary-text">Upload & Synthesize</h4>
              <p className="text-xs text-muted leading-relaxed">
                Add lecture slides, textbook PDFs, or Markdown research notes. Synapse parses text, extracts concepts, and generates vector embeddings.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl gradient-accent text-white flex items-center justify-center font-bold text-sm shadow-md">
                2
              </div>
              <h4 className="font-bold text-primary-text">Graph Extraction</h4>
              <p className="text-xs text-muted leading-relaxed">
                Semantic relationships map into a dynamic prerequisite network, linking foundational theory to complex applications.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl gradient-accent text-white flex items-center justify-center font-bold text-sm shadow-md">
                3
              </div>
              <h4 className="font-bold text-primary-text">Adaptive Practice</h4>
              <p className="text-xs text-muted leading-relaxed">
                Receive auto-generated flashcards and multi-choice quizzes tailored to your weak frontier nodes with instant feedback.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl gradient-accent text-white flex items-center justify-center font-bold text-sm shadow-md">
                4
              </div>
              <h4 className="font-bold text-primary-text">Memory Consolidation</h4>
              <p className="text-xs text-muted leading-relaxed">
                Spaced repetition prompts schedule reviews right before you forget, cementing latent mastery into durable expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRIVACY & SECURITY HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-success/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success-light text-success text-xs font-semibold">
              <Shield className="w-4 h-4" />
              <span>Zero Leakage Architecture</span>
            </div>
            <h3 className="text-2xl font-bold text-primary-text">Your Knowledge, Strictly Private</h3>
            <p className="text-sm text-muted leading-relaxed">
              Every row in our PostgreSQL database is guarded by Row-Level Security (RLS) linked directly to cryptographic Supabase JWT tokens. Your research, study notes, and cognitive states remain 100% inaccessible to anyone else.
            </p>
          </div>
          <Link to="/privacy">
            <Button variant="outline" size="md" className="whitespace-nowrap">
              Review Security Architecture
            </Button>
          </Link>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-2">Common Questions</Badge>
          <h2 className="text-3xl font-extrabold text-primary-text">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 cursor-pointer border border-muted-border/80 transition-all hover:border-primary/40"
                onClick={() => setOpenFaq(isOpen ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-primary-text flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    {faq.q}
                  </h4>
                  <div className="text-muted ml-4">
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </div>
                {isOpen && (
                  <p className="text-sm text-muted mt-4 pl-8 leading-relaxed border-t border-muted-border/40 pt-4">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. BOTTOM CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-8">
        <div className="glass-card p-10 sm:p-14 rounded-3xl gradient-mesh border border-primary/20 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-text tracking-tight">
              Ready to Upgrade How You Learn?
            </h2>
            <p className="text-muted text-base leading-relaxed">
              Join students, researchers, and engineers using Synapse to transform disjointed study materials into an organized cognitive map.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-md shadow-primary/20">
                  Create Your Free Account <ArrowRight className="w-5 h-5 ml-1.5" />
                </Button>
              </Link>
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={handleDemoClick}
                className="w-full sm:w-auto"
              >
                Try Interactive Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
