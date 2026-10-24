import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  Sparkles, 
  Brain, 
  Network, 
  TrendingUp, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Target, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  Zap, 
  Calendar,
  AlertTriangle,
  Play
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

// Chart Data
const EVOLUTION_DATA = [
  { day: 'Mon', mastery: 64, retention: 80, questions: 22 },
  { day: 'Tue', mastery: 68, retention: 79, questions: 35 },
  { day: 'Wed', mastery: 72, retention: 83, questions: 18 },
  { day: 'Thu', mastery: 76, retention: 82, questions: 42 },
  { day: 'Fri', mastery: 81, retention: 86, questions: 30 },
  { day: 'Sat', mastery: 87, retention: 88, questions: 48 },
  { day: 'Sun', mastery: 92, retention: 89, questions: 25 },
];

const SUBJECT_MASTERY_DATA = [
  { subject: 'Machine Learning', score: 88, fullMark: 100 },
  { subject: 'Math & Stats', score: 78, fullMark: 100 },
  { subject: 'Systems & OS', score: 65, fullMark: 100 },
  { subject: 'Algorithms', score: 82, fullMark: 100 },
  { subject: 'Cognitive Science', score: 94, fullMark: 100 },
];

const CONTINUE_LEARNING_ITEMS = [
  {
    id: 'item-1',
    title: 'Transformer Attention Mechanisms',
    subject: 'Machine Learning & AI',
    type: 'Concept Review',
    mastery: 84,
    urgency: 'Due Today',
    urgencyColor: 'warning',
  },
  {
    id: 'item-2',
    title: 'Bayesian Knowledge Tracing (BKT) Equations',
    subject: 'Cognitive Science',
    type: 'Flashcard Retrieval',
    mastery: 72,
    urgency: 'Scheduled',
    urgencyColor: 'primary',
  },
  {
    id: 'item-3',
    title: 'Singular Value Decomposition (SVD)',
    subject: 'Mathematics & Statistics',
    type: 'Prerequisite Check',
    mastery: 58,
    urgency: 'Knowledge Gap',
    urgencyColor: 'error',
  },
  {
    id: 'item-4',
    title: 'CPU Cache Coherence (MESI Protocol)',
    subject: 'Systems & Architecture',
    type: 'Practice Quiz',
    mastery: 69,
    urgency: 'Due in 2 days',
    urgencyColor: 'secondary',
  },
];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const { profile, goals } = useAuth();
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All');

  const greetingName = profile?.display_name || 'Learner';

  return (
    <div className="space-y-8 pb-12">
      {/* 1. DYNAMIC WELCOME SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary-light/40 via-white to-accent-light/30 p-6 sm:p-8 rounded-3xl border border-primary/20 shadow-sm relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-muted-border/80 text-xs font-semibold text-primary mb-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Optimal Retrieval Window Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-text tracking-tight">
            Welcome back, {greetingName}
          </h1>
          <p className="text-sm text-muted max-w-xl">
            Your Bayesian retention score is trending up. Reviewing 2 due concepts today will prevent an estimated 14% memory decay across Transformer architectures.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/practice')}
            className="shadow-md shadow-primary/20"
          >
            <Play className="w-4 h-4 mr-1.5 fill-current" /> Start Daily Practice
          </Button>
        </div>
      </div>

      {/* 2. SIX METRIC CARDS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Metric 1 */}
        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
            Knowledge Health
          </span>
          <div className="text-2xl font-bold text-primary-text">92.4%</div>
          <p className="text-[11px] text-success font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +3.8% wk
          </p>
        </Card>

        {/* Metric 2 */}
        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
            Mastered Nodes
          </span>
          <div className="text-2xl font-bold text-primary-text">148</div>
          <p className="text-[11px] text-muted mt-1">Across 5 subjects</p>
        </Card>

        {/* Metric 3 */}
        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
            Study Streak
          </span>
          <div className="text-2xl font-bold text-primary-text flex items-center gap-1">
            14 Days <Flame className="w-4 h-4 text-warning" />
          </div>
          <p className="text-[11px] text-muted mt-1">Best: 28 days</p>
        </Card>

        {/* Metric 4 */}
        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
            Retention Est.
          </span>
          <div className="text-2xl font-bold text-primary-text">88.5%</div>
          <p className="text-[11px] text-primary font-medium mt-1">SM-2 Calibrated</p>
        </Card>

        {/* Metric 5 */}
        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
            Study Time
          </span>
          <div className="text-2xl font-bold text-primary-text">18.5 hrs</div>
          <p className="text-[11px] text-muted mt-1">Goal: 20 hrs/wk</p>
        </Card>

        {/* Metric 6 */}
        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
            Practice Accuracy
          </span>
          <div className="text-2xl font-bold text-primary-text">84.2%</div>
          <p className="text-[11px] text-success font-medium mt-1">Slip rate: 6.8%</p>
        </Card>
      </div>

      {/* 3. INTERACTIVE RECHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evolution Chart (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold">Knowledge Evolution Over Time</CardTitle>
              <CardDescription className="text-xs">
                Bayesian posterior mastery and estimated memory retention over the past 7 days.
              </CardDescription>
            </div>
            <Badge variant="primary">7-Day Trajectory</Badge>
          </CardHeader>
          <CardContent className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={EVOLUTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="masteryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7667F5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7667F5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#229B72" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#229B72" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="mastery"
                  name="Mastery (%)"
                  stroke="#7667F5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#masteryGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="retention"
                  name="Retention (%)"
                  stroke="#229B72"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#retentionGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Mastery Radar Chart (1 col) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Mastery by Subject</CardTitle>
            <CardDescription className="text-xs">
              Multivariate proficiency across 5 primary domains.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 w-full pt-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={SUBJECT_MASTERY_DATA} outerRadius="70%">
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#CBD5E1" tick={false} />
                <Radar
                  name="Subject Mastery"
                  dataKey="score"
                  stroke="#7667F5"
                  fill="#7667F5"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 4. AI INSIGHT & STUDY GOALS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AI Contextual Insight Card */}
        <Card className="md:col-span-2 bg-gradient-to-br from-white to-primary-light/20 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl gradient-accent text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-primary-text text-base">Grounded Cognitive Recommendation</h3>
                <Badge variant="primary">High Priority</Badge>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                You recently mastered <strong className="text-primary-text">Self-Attention Mechanism (94%)</strong>. However, prerequisite validation indicates your retention on <strong className="text-primary-text">Singular Value Decomposition (SVD)</strong> has dipped to 58%. Reviewing SVD now will accelerate your comprehension of low-rank adaptation (LoRA) and multi-head projections.
              </p>
              <div className="pt-2 flex gap-3">
                <Button variant="primary" size="sm" onClick={() => navigate('/flashcards')}>
                  Review SVD Flashcards (6 Cards)
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate('/graph')}>
                  View Prerequisite Node
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Primary Learning Goals */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <CardTitle className="text-base font-bold">Active Goal</CardTitle>
              <Target className="w-4 h-4 text-primary" />
            </div>
            {goals.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs font-bold text-primary-text">{goals[0].title}</div>
                <div className="w-full bg-surface-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="gradient-accent h-full rounded-full"
                    style={{ width: `${goals[0].progress_percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-muted">
                  <span>Progress</span>
                  <span className="font-semibold text-primary">{goals[0].progress_percentage}%</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted">Master Transformer Attention and pass ML qualifying exam</p>
            )}
          </div>
          <Link to="/profile" className="text-xs text-primary font-semibold hover:underline pt-4 flex items-center gap-1">
            Manage learning goals <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Card>
      </div>

      {/* 5. CONTINUE LEARNING QUEUE */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold">Continue Learning Queue</CardTitle>
            <CardDescription className="text-xs">
              Prioritized according to Bayesian knowledge decay and upcoming spaced repetition deadlines.
            </CardDescription>
          </div>
          <Link to="/practice">
            <Button variant="outline" size="sm">
              View All Due Items
            </Button>
          </Link>
        </CardHeader>

        <div className="divide-y divide-muted-border/50">
          {CONTINUE_LEARNING_ITEMS.map((item) => (
            <div
              key={item.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-secondary/40 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-surface-secondary flex items-center justify-center text-primary flex-shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-primary-text">{item.title}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-muted mt-0.5">
                    <span>{item.subject}</span>
                    <span>•</span>
                    <span>{item.type}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right sm:block hidden">
                  <div className="text-xs font-bold text-primary-text">{item.mastery}%</div>
                  <div className="text-[10px] text-muted">Estimated Mastery</div>
                </div>

                <Badge
                  variant={
                    item.urgencyColor === 'warning'
                      ? 'warning'
                      : item.urgencyColor === 'error'
                      ? 'error'
                      : 'primary'
                  }
                >
                  {item.urgency}
                </Badge>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(item.type.includes('Flashcard') ? '/flashcards' : '/practice')}
                >
                  Practice
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
