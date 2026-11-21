import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
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
import { getRealDashboardMetrics } from '../../services/userProgress';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const { user, profile, goals } = useAuth();
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All');

  const [metrics, setMetrics] = useState(() => getRealDashboardMetrics(user?.id));

  useEffect(() => {
    setMetrics(getRealDashboardMetrics(user?.id));

    const handleProgressUpdate = () => {
      setMetrics(getRealDashboardMetrics(user?.id));
    };

    window.addEventListener('synapse_progress_updated', handleProgressUpdate);
    return () => window.removeEventListener('synapse_progress_updated', handleProgressUpdate);
  }, [user?.id]);

  const rawName = profile?.display_name || 
                  user?.user_metadata?.display_name || 
                  user?.user_metadata?.full_name || 
                  (user?.email ? user.email.split('@')[0] : '');

  const greetingName = (rawName && rawName !== 'Alex Chen' && rawName !== 'Learner')
    ? (rawName.charAt(0).toUpperCase() + rawName.slice(1))
    : 'Scholar';

  const hasMastery = metrics.masteredNodesCount > 0;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. DYNAMIC AUTHENTIC WELCOME SECTION */}
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
            {hasMastery
              ? `You have mastered ${metrics.masteredNodesCount} of ${metrics.totalConceptsCount} core concepts (${metrics.knowledgeHealth}%). Active recall and spaced reviews maintain your optimal retention.`
              : 'Welcome to Synapse. Ground your mastery with cognitive science. Explore the interactive Knowledge Graph or start a practice drill to calibrate your Bayesian knowledge baseline.'}
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

      {/* 2. SIX AUTHENTIC METRIC CARDS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Metric 1: Real Knowledge Health */}
        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
            Knowledge Health
          </span>
          <div className="text-2xl font-bold text-primary-text">{metrics.knowledgeHealth}%</div>
          <p className="text-[11px] text-success font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {hasMastery ? `+${metrics.knowledgeHealth}% active` : '0% baseline'}
          </p>
        </Card>

        {/* Metric 2: Real Mastered Nodes */}
        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
            Mastered Nodes
          </span>
          <div className="text-2xl font-bold text-primary-text">
            {metrics.masteredNodesCount} <span className="text-sm text-muted font-normal">/ {metrics.totalConceptsCount}</span>
          </div>
          <p className="text-[11px] text-muted mt-1">Across 5 subjects</p>
        </Card>

        {/* Metric 3: Real Study Streak */}
        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
            Study Streak
          </span>
          <div className="text-2xl font-bold text-primary-text flex items-center gap-1">
            {metrics.studyStreakDays} {metrics.studyStreakDays === 1 ? 'Day' : 'Days'} <Flame className="w-4 h-4 text-warning" />
          </div>
          <p className="text-[11px] text-muted mt-1">Daily active recall</p>
        </Card>

        {/* Metric 4: Real Retention Estimate */}
        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
            Retention Est.
          </span>
          <div className="text-2xl font-bold text-primary-text">{metrics.retentionEstimate}%</div>
          <p className="text-[11px] text-primary font-medium mt-1">SM-2 Calibrated</p>
        </Card>

        {/* Metric 5: Real Study Time */}
        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
            Study Time
          </span>
          <div className="text-2xl font-bold text-primary-text">{metrics.studyTimeHours} hrs</div>
          <p className="text-[11px] text-muted mt-1">{metrics.studyTimeHours > 0 ? 'Recorded practice' : 'Start learning'}</p>
        </Card>

        {/* Metric 6: Real Practice Accuracy */}
        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
            Practice Accuracy
          </span>
          <div className="text-2xl font-bold text-primary-text">{metrics.practiceAccuracy}%</div>
          <p className="text-[11px] text-success font-medium mt-1">
            {hasMastery ? 'Empirical precision' : 'No drills taken'}
          </p>
        </Card>
      </div>

      {/* 3. REAL RECHARTS SECTION */}
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
              <AreaChart data={metrics.evolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[0, 100]} />
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
              <RadarChart data={metrics.subjectRadarData} outerRadius="70%">
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
                <Badge variant={hasMastery ? 'primary' : 'secondary'}>
                  {hasMastery ? 'High Priority' : 'Getting Started'}
                </Badge>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                {hasMastery ? (
                  <>
                    You have mastered <strong className="text-primary-text">{metrics.masteredNodesCount} of {metrics.totalConceptsCount} concepts ({metrics.knowledgeHealth}%)</strong>. To continue advancing, review the next unmastered topics in your learning queue to prevent memory decay.
                  </>
                ) : (
                  <>
                    Begin by exploring the foundational concepts in <strong className="text-primary-text">Linear Algebra Foundations</strong> and <strong className="text-primary-text">Gradient Descent</strong> on the interactive Knowledge Graph. Completing a concept course will automatically unlock dependent advanced nodes.
                  </>
                )}
              </p>
              <div className="pt-2 flex gap-3">
                <Button variant="primary" size="sm" onClick={() => navigate('/graph')}>
                  Explore Knowledge Graph
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate('/practice')}>
                  Take Practice Drill
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
              <p className="text-xs text-muted">
                No active learning goals configured. Set your target milestones in your profile.
              </p>
            )}
          </div>
          <Link to="/profile" className="text-xs text-primary font-semibold hover:underline pt-4 flex items-center gap-1">
            Manage learning goals <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Card>
      </div>

      {/* 5. AUTHENTIC CONTINUE LEARNING QUEUE */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold">Continue Learning Queue</CardTitle>
            <CardDescription className="text-xs">
              Prioritized according to real concept completion and spaced repetition schedules.
            </CardDescription>
          </div>
          <Link to="/graph">
            <Button variant="outline" size="sm">
              View Knowledge Graph
            </Button>
          </Link>
        </CardHeader>

        <div className="divide-y divide-muted-border/50">
          {metrics.continueLearningItems.map((item) => (
            <div
              key={item.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-secondary/40 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  item.isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-surface-secondary text-primary'
                }`}>
                  {item.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
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
                  variant={item.isCompleted ? 'success' : 'primary'}
                >
                  {item.isCompleted ? 'Completed' : 'Not Completed'}
                </Badge>

                <Button
                  variant={item.isCompleted ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => navigate(`/course/${item.id}`)}
                >
                  {item.isCompleted ? 'Review Course' : 'Start Course'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};