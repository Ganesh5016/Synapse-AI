import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Layers, 
  ShieldCheck, 
  FileSearch, 
  ChevronRight, 
  CheckCircle2, 
  BookOpen 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="primary">Cognitive Science & Algorithms</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-text tracking-tight">
          The Science Behind Synapse
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          Synapse replaces subjective guesswork with peer-reviewed mathematical models of human memory, learning rates, and information retrieval.
        </p>
      </div>

      {/* 1. BKT Section */}
      <Card className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
            1
          </div>
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Psychometric Modeling</span>
            <CardTitle className="text-2xl">Bayesian Knowledge Tracing (BKT)</CardTitle>
          </div>
        </div>

        <p className="text-sm text-muted leading-relaxed">
          Developed by Corbett & Anderson (1995), Bayesian Knowledge Tracing is a Hidden Markov Model that models a student's latent understanding of a specific knowledge component over consecutive practice opportunities.
        </p>

        <div className="bg-surface-secondary/70 p-5 rounded-2xl border border-muted-border font-mono text-xs space-y-3">
          <div className="text-primary font-semibold">// Posterior Knowledge State Update Formula:</div>
          <div className="p-3 bg-white/80 rounded-xl border border-muted-border/60">
            {'P(L_t | Correct) = [ P(L_{t-1}) · (1 - P(S)) ] / [ P(L_{t-1}) · (1 - P(S)) + (1 - P(L_{t-1})) · P(G) ]'}
          </div>
          <div className="p-3 bg-white/80 rounded-xl border border-muted-border/60">
            {'P(L_t | Incorrect) = [ P(L_{t-1}) · P(S) ] / [ P(L_{t-1}) · P(S) + (1 - P(L_{t-1})) · (1 - P(G)) ]'}
          </div>
          <div className="p-3 bg-white/80 rounded-xl border border-muted-border/60">
            {'P(L_{t+1}) = P(L_t | Action) + (1 - P(L_t | Action)) · P(T)'}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl glass-panel">
            <span className="font-bold text-primary-text block mb-1">P(L₀) — Prior</span>
            <span className="text-muted">Initial probability student already knew the concept before study.</span>
          </div>
          <div className="p-3 rounded-xl glass-panel">
            <span className="font-bold text-primary-text block mb-1">P(T) — Transition</span>
            <span className="text-muted">Probability of transitioning from unmastered to mastered on practice.</span>
          </div>
          <div className="p-3 rounded-xl glass-panel">
            <span className="font-bold text-primary-text block mb-1">P(G) — Guess</span>
            <span className="text-muted">Probability student answers correctly despite not knowing the skill.</span>
          </div>
          <div className="p-3 rounded-xl glass-panel">
            <span className="font-bold text-primary-text block mb-1">P(S) — Slip</span>
            <span className="text-muted">Probability student makes a careless error despite knowing the skill.</span>
          </div>
        </div>
      </Card>

      {/* 2. SM-2 Spaced Repetition */}
      <Card className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-light text-accent flex items-center justify-center font-bold">
            2
          </div>
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Memory Decay Prevention</span>
            <CardTitle className="text-2xl">SuperMemo-2 (SM-2) Spaced Repetition</CardTitle>
          </div>
        </div>

        <p className="text-sm text-muted leading-relaxed">
          Hermann Ebbinghaus discovered in 1885 that human retention drops exponentially over time. The SM-2 algorithm dynamically calculates review intervals based on learner difficulty ratings (0 to 5) so you review immediately prior to the retention threshold.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-primary space-y-2">
            <h4 className="font-bold text-primary-text">Interval Scaling: I(n)</h4>
            <p className="text-muted">I(1) = 1 day, I(2) = 6 days, then I(n) = I(n-1) × EF for all n &gt; 2.</p>
          </div>
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-accent space-y-2">
            <h4 className="font-bold text-primary-text">Easiness Factor: EF</h4>
            <p className="text-muted">EF' = EF + (0.1 - (5 - q) × (0.08 + (5 - q) × 0.02)), clamped at minimum 1.3.</p>
          </div>
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-success space-y-2">
            <h4 className="font-bold text-primary-text">Lapse Handling</h4>
            <p className="text-muted">If user response quality q &lt; 3, repetition resets to 1 day for reinforcement.</p>
          </div>
        </div>
      </Card>

      {/* 3. Active Retrieval Practice */}
      <Card className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success-light text-success flex items-center justify-center font-bold">
            3
          </div>
          <div>
            <span className="text-xs font-bold text-success uppercase tracking-wider">The Testing Effect</span>
            <CardTitle className="text-2xl">Active Retrieval vs Passive Re-Reading</CardTitle>
          </div>
        </div>

        <p className="text-sm text-muted leading-relaxed">
          Landmark research by Roediger & Karpicke (2006) showed that testing produces vastly superior long-term retention compared to repeated studying or highlighting. Synapse structures learning around effortful retrieval opportunities.
        </p>

        <div className="p-4 rounded-xl bg-surface-secondary/60 border border-muted-border text-xs text-primary-text flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
          <span>Synapse automatically generates diagnostic questions targeting your specific cognitive boundary nodes, forcing active retrieval rather than passive skimming.</span>
        </div>
      </Card>

      {/* Call to action */}
      <div className="text-center pt-8">
        <Link to="/signup">
          <Button variant="primary" size="lg">
            Start Learning With Synapse <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
