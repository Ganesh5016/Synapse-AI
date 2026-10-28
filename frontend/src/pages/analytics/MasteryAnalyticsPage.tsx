import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Brain,
  Download,
  FileText,
  Sparkles,
  Flame,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const DEFAULT_TRAJECTORY = [
  { day: 'Mon', mastery: 68, retention: 80, cognitive_load: 45, questions: 22, minutes: 45 },
  { day: 'Tue', mastery: 71, retention: 81, cognitive_load: 60, questions: 35, minutes: 65 },
  { day: 'Wed', mastery: 73, retention: 83, cognitive_load: 38, questions: 18, minutes: 40 },
  { day: 'Thu', mastery: 76, retention: 82, cognitive_load: 72, questions: 42, minutes: 80 },
  { day: 'Fri', mastery: 80, retention: 86, cognitive_load: 50, questions: 30, minutes: 55 },
  { day: 'Sat', mastery: 85, retention: 88, cognitive_load: 65, questions: 48, minutes: 90 },
  { day: 'Sun', mastery: 89, retention: 91, cognitive_load: 40, questions: 25, minutes: 50 },
];

const DEFAULT_RADAR = [
  { subject: 'Machine Learning & AI', score: 92, fullMark: 100 },
  { subject: 'Math & Linear Algebra', score: 68, fullMark: 100 },
  { subject: 'Systems & OS', score: 74, fullMark: 100 },
  { subject: 'Algorithms & Data Structures', score: 85, fullMark: 100 },
  { subject: 'Cognitive Science & BKT', score: 94, fullMark: 100 },
];

export const MasteryAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [trajectory, setTrajectory] = useState(DEFAULT_TRAJECTORY);
  const [radarData, setRadarData] = useState(DEFAULT_RADAR);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/analytics/overview', {
          headers: { 'Authorization': 'Bearer demo-token' },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            if (json.data.trajectory_7d) setTrajectory(json.data.trajectory_7d);
            if (json.data.radar_distribution) {
              setRadarData(
                json.data.radar_distribution.map((r: any) => ({
                  subject: r.subject_name,
                  score: Math.round(r.score),
                  fullMark: 100,
                }))
              );
            }
          }
        }
      } catch {
        // Fall back gracefully
      }
    };
    fetchAnalytics();
  }, []);

  const handleOpenReport = async () => {
    setShowReportModal(true);
    setIsLoadingReport(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/analytics/reports/weekly', {
        headers: { 'Authorization': 'Bearer demo-token' },
      });
      if (res.ok) {
        const json = await res.json();
        setReportData(json.data);
      }
    } catch {
      // Local fallback report data
      setReportData({
        week_label: 'Current Week Synthesis',
        study_time_hours: 7.1,
        questions_answered: 220,
        cards_reviewed: 58,
        overall_accuracy: 84.5,
        breakthrough_concepts: [
          'Scaled Dot-Product Attention (Mastered at 92%)',
          'Multi-Head Attention Projections (Advanced to Proficient)',
          'Bayesian Knowledge Tracing Prior & Transition (Mastered at 94%)',
        ],
        urgent_gaps: [
          'Singular Value Decomposition (Retention slipped to 58%)',
          'SuperMemo SM-2 Boundary Constants (Requires review)',
        ],
        recommended_focus: 'Reinforce Linear Algebra foundations (SVD) before progressing to low-rank adaptations (LoRA).',
        summary_ai_narrative:
          'Outstanding velocity this week! You completed 7.1 hours of structured study, achieving an 84.5% first-attempt accuracy across adaptive questions. Your Bayesian posterior on Transformer attention mechanics surpassed the 90% mastery threshold.',
      });
    } finally {
      setIsLoadingReport(false);
    }
  };

  const handleExportCSV = () => {
    // Generate and download CSV
    let csv = 'Day,Mastery,Retention,CognitiveLoad,QuestionsAttempted,MinutesStudied\n';
    trajectory.forEach(d => {
      csv += `${d.day},${d.mastery},${d.retention},${d.cognitive_load},${d.questions},${d.minutes}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synapse_learning_analytics_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-50 border border-indigo-200/60 rounded-xl text-primary">
                <BarChart3 className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-primary-text tracking-tight">
                Mastery Analytics & Psychometrics
              </h1>
              <Badge variant="primary" className="ml-2">BKT Engine</Badge>
            </div>
            <p className="text-sm text-secondary-text mt-1">
              Multidimensional Bayesian mastery distribution, retention decay projections, and cognitive load trajectories.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenReport}
              className="text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Weekly Synthesis Report
            </Button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-md border border-neutral-200/80 rounded-2xl p-4 shadow-xs">
            <span className="text-xs text-secondary-text block">Weekly Study Time</span>
            <div className="text-2xl font-bold text-primary-text mt-0.5">7.1 hrs</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +1.2 hrs vs last week
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-neutral-200/80 rounded-2xl p-4 shadow-xs">
            <span className="text-xs text-secondary-text flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" /> Study Streak
            </span>
            <div className="text-2xl font-bold text-primary-text mt-0.5">14 Days</div>
            <p className="text-[11px] text-secondary-text mt-1">Consistent active recall</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-neutral-200/80 rounded-2xl p-4 shadow-xs">
            <span className="text-xs text-secondary-text block">Retention Average</span>
            <div className="text-2xl font-bold text-emerald-600 mt-0.5">89.2%</div>
            <p className="text-[11px] text-indigo-600 font-medium mt-1">SM-2 Calibrated</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-neutral-200/80 rounded-2xl p-4 shadow-xs">
            <span className="text-xs text-secondary-text block">Latent BKT Posterior</span>
            <div className="text-2xl font-bold text-primary mt-0.5">0.814</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">P(Know) Mastered tier</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 7-Day Evolution Area Chart (2 cols) */}
          <Card className="lg:col-span-2 bg-white/85 backdrop-blur-md border border-neutral-200/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base font-bold">Knowledge Trajectory & Retention</CardTitle>
                <CardDescription className="text-xs">
                  Daily Bayesian posterior mastery growth plotted against estimated SM-2 memory retention.
                </CardDescription>
              </div>
              <Badge variant="primary">7-Day Trajectory</Badge>
            </CardHeader>
            <CardContent className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="analyticsMasteryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7667F5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#7667F5" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="analyticsRetentionGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                  <YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mastery"
                    name="Mastery %"
                    stroke="#7667F5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#analyticsMasteryGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="retention"
                    name="Retention %"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#analyticsRetentionGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Radar Chart (1 col) */}
          <Card className="bg-white/85 backdrop-blur-md border border-neutral-200/80 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Subject Competency</CardTitle>
              <CardDescription className="text-xs">
                Domain mastery balance across disciplines.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-72 w-full flex items-center justify-center pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Mastery"
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

        {/* Practice Activity Bar Chart */}
        <Card className="bg-white/85 backdrop-blur-md border border-neutral-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold">Daily Retrieval Practice & Study Volume</CardTitle>
              <CardDescription className="text-xs">
                Active practice questions completed alongside focused study minutes per day.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/practice')}
                className="text-xs"
              >
                <Layers className="w-3.5 h-3.5 mr-1.5" />
                Practice Center
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trajectory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                  }}
                />
                <Legend />
                <Bar dataKey="questions" name="Questions Solved" fill="#7667F5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="minutes" name="Minutes Studied" fill="#EC4899" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 bg-primary-text/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-neutral-200/80 shadow-2xl space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-indigo-50 text-primary rounded-xl">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-primary-text text-xl">Weekly Learning Synthesis</h3>
                    <p className="text-xs text-secondary-text">AI Cognitive Diagnosis & Progress Audit</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-neutral-400 hover:text-neutral-600 text-sm font-semibold p-1"
                >
                  ✕
                </button>
              </div>

              {isLoadingReport ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  <p className="text-xs text-secondary-text">Generating cognitive synthesis report...</p>
                </div>
              ) : reportData ? (
                <div className="space-y-5">
                  {/* Stats Bar */}
                  <div className="grid grid-cols-4 gap-3 bg-neutral-50 p-3.5 rounded-2xl text-center">
                    <div>
                      <span className="text-[11px] text-secondary-text block">Study Time</span>
                      <span className="text-base font-bold text-primary-text">{reportData.study_time_hours} hrs</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-secondary-text block">Questions</span>
                      <span className="text-base font-bold text-primary-text">{reportData.questions_answered}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-secondary-text block">Cards Done</span>
                      <span className="text-base font-bold text-primary-text">{reportData.cards_reviewed}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-secondary-text block">Accuracy</span>
                      <span className="text-base font-bold text-emerald-600">{reportData.overall_accuracy}%</span>
                    </div>
                  </div>

                  {/* AI Narrative */}
                  <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
                      AI Executive Summary
                    </span>
                    <p className="text-xs sm:text-sm text-primary-text leading-relaxed">
                      {reportData.summary_ai_narrative}
                    </p>
                  </div>

                  {/* Breakthroughs & Gaps */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Breakthrough Concepts</span>
                      </div>
                      <ul className="text-xs text-secondary-text space-y-1.5 list-disc list-inside">
                        {reportData.breakthrough_concepts.map((b: string, i: number) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Urgent Attention Needed</span>
                      </div>
                      <ul className="text-xs text-secondary-text space-y-1.5 list-disc list-inside">
                        {reportData.urgent_gaps.map((g: string, i: number) => (
                          <li key={i}>{g}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recommended Action */}
                  <div className="p-3 bg-neutral-100 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-secondary-text uppercase block">Recommended Next Step</span>
                      <p className="text-xs font-medium text-primary-text">{reportData.recommended_focus}</p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => { setShowReportModal(false); navigate('/gaps'); }}
                      className="text-xs shrink-0"
                    >
                      Remediate Gaps
                    </Button>
                  </div>

                  <div className="pt-2 flex justify-end gap-2 border-t border-neutral-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReportModal(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
