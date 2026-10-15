import { 
  Sparkles, 
  Brain, 
  Network, 
  ChevronRight, 
  CheckCircle2, 
  TrendingUp, 
  Flame,
  Clock
} from 'lucide-react';
import { Button } from './components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/Card';

export function App() {
  return (
    <div className="min-h-screen bg-background text-primary-text relative overflow-hidden">
      {/* Ambient background glow meshes */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-success/10 rounded-full blur-3xl pointer-events-none" />

      {/* Glassmorphic Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-muted-border/60 bg-white/75 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center text-white shadow-md shadow-primary/25">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-primary-text flex items-center gap-1.5">
                Synapse <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-light text-primary">v1.0</span>
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <nav className="flex space-x-6 text-sm font-medium text-muted">
              <a href="#features" className="hover:text-primary transition-colors">Features</a>
              <a href="#architecture" className="hover:text-primary transition-colors">Architecture</a>
              <a href="#graph" className="hover:text-primary transition-colors">Knowledge Graph</a>
              <a href="#about" className="hover:text-primary transition-colors">About</a>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm">
              Sign In
            </Button>
            <Button variant="primary" size="sm">
              Start Learning <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-xs font-semibold text-primary mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Knowledge Evolution Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-text tracking-tight leading-tight mb-6">
            Turn What You Learn <br />
            <span className="bg-clip-text text-transparent gradient-accent">
              Into What You Know.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted mb-8 leading-relaxed">
            Personalized, evidence-based knowledge development. Synapse synthesizes personal documents, Bayesian mastery modeling, and interactive knowledge networks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Start Learning Free <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Explore Live Demo
            </Button>
          </div>
        </div>

        {/* Live Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Knowledge Health</span>
              <div className="w-8 h-8 rounded-lg bg-success-light text-success flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary-text">92.4%</div>
            <p className="text-xs text-muted mt-1 flex items-center gap-1">
              <span className="text-success font-medium">+3.8%</span> from last week
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Concepts Mastered</span>
              <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                <Network className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary-text">148</div>
            <p className="text-xs text-muted mt-1">
              Across 5 active subjects
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Learning Streak</span>
              <div className="w-8 h-8 rounded-lg bg-warning-light text-warning flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary-text">14 Days</div>
            <p className="text-xs text-muted mt-1">
              Personal best: 28 days
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Study Time</span>
              <div className="w-8 h-8 rounded-lg bg-surface-secondary text-primary flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary-text">18.5 hrs</div>
            <p className="text-xs text-muted mt-1">
              Target: 20 hrs/week
            </p>
          </Card>
        </div>

        {/* Feature Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center mb-4">
                <Network className="w-6 h-6" />
              </div>
              <CardTitle>Interactive Knowledge Graph</CardTitle>
              <CardDescription>
                Visualize prerequisite relationships, semantic clusters, and mastery states in real-time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 rounded-xl bg-surface-secondary/60 border border-muted-border flex items-center justify-center text-xs text-muted">
                React Flow Network Visualizer
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-accent-light text-accent flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <CardTitle>Grounded AI Assistant</CardTitle>
              <CardDescription>
                Inference powered by Hugging Face models strictly grounded in your personal notes and uploaded PDFs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 rounded-xl bg-surface-secondary/60 border border-muted-border flex items-center justify-center text-xs text-muted">
                RAG Citation Engine
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-success-light text-success flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <CardTitle>Bayesian Mastery Tracking</CardTitle>
              <CardDescription>
                Evidence-based progression using Bayesian Knowledge Tracing and SM-2 spaced repetition.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 rounded-xl bg-surface-secondary/60 border border-muted-border flex items-center justify-center text-xs text-muted">
                Cognitive Decay & Gap Detection
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-muted-border/60 bg-white/50 backdrop-blur-md py-8 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
          <p>© 2026 Synapse — AI Knowledge Evolution Platform. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Security & RLS</a>
            <a href="#" className="hover:text-primary transition-colors">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
