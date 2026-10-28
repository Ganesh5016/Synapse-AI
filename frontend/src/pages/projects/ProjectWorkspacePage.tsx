import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  CheckCircle2,
  Circle,
  Plus,
  BookOpen,
  FileText,
  Brain,
  Layers,
  Sparkles,
  Download,
  Calendar,
  Clock,
  ArrowRight,
  ChevronRight,
  Tag,
  Target,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface ProjectMilestone {
  id: string;
  title: string;
  is_completed: boolean;
  due_date?: string;
}

interface ProjectResource {
  id: string;
  title: string;
  type: 'note' | 'document' | 'paper' | 'concept';
  metadata?: Record<string, any>;
}

interface ProjectWorkspace {
  id: string;
  title: string;
  description: string;
  subject_name: string;
  subject_color: string;
  status: 'active' | 'completed' | 'archived';
  progress_percentage: number;
  due_date?: string;
  linked_notes: ProjectResource[];
  linked_documents: ProjectResource[];
  pinned_concepts: ProjectResource[];
  milestones: ProjectMilestone[];
}

const DEFAULT_PROJECTS: ProjectWorkspace[] = [
  {
    id: 'proj-01',
    title: 'Transformer Attention & Architectural Advancements',
    description:
      'Comprehensive synthesis of scaled dot-product mechanics, multi-head projection subspaces, and FlashAttention I/O memory optimizations.',
    subject_name: 'Machine Learning & AI',
    subject_color: '#7667F5',
    status: 'active',
    progress_percentage: 33.3,
    due_date: new Date(Date.now() + 86400000 * 14).toISOString(),
    linked_notes: [
      {
        id: 'note-01',
        title: 'Scaled Dot-Product Mathematical Derivation',
        type: 'note',
        metadata: { tags: ['transformers', 'equations'] },
      },
      {
        id: 'note-02',
        title: 'Memory Complexity Analysis (O(N^2) vs FlashAttention)',
        type: 'note',
        metadata: { tags: ['systems', 'gpu-kernels'] },
      },
    ],
    linked_documents: [
      {
        id: 'doc-01',
        title: 'Attention Is All You Need (Vaswani et al. 2017).pdf',
        type: 'paper',
        metadata: { pages: 15, year: 2017 },
      },
    ],
    pinned_concepts: [
      {
        id: 'c0000000-0000-0000-0000-000000000003',
        title: 'Scaled Dot-Product Attention',
        type: 'concept',
        metadata: { mastery: 0.78, difficulty: 'intermediate' },
      },
      {
        id: 'c0000000-0000-0000-0000-000000000004',
        title: 'Multi-Head Attention',
        type: 'concept',
        metadata: { mastery: 0.65, difficulty: 'advanced' },
      },
    ],
    milestones: [
      {
        id: 'm-01',
        title: 'Complete literature review of seminal attention papers',
        is_completed: true,
      },
      {
        id: 'm-02',
        title: 'Implement FlashAttention SRAM tile simulation in Python',
        is_completed: false,
      },
      {
        id: 'm-03',
        title: 'Pass adaptive practice diagnostic with >=85% score',
        is_completed: false,
      },
    ],
  },
  {
    id: 'proj-02',
    title: 'Cognitive Psychometrics & Bayesian Mastery',
    description:
      'Exploration of knowledge tracing algorithms, Hidden Markov Models, and SuperMemo interval equations for intelligent tutoring systems.',
    subject_name: 'Cognitive Science & Psychology',
    subject_color: '#EC4899',
    status: 'active',
    progress_percentage: 50.0,
    due_date: new Date(Date.now() + 86400000 * 21).toISOString(),
    linked_notes: [
      {
        id: 'note-03',
        title: 'BKT Expectation Maximization & Fit',
        type: 'note',
        metadata: { tags: ['psychometrics', 'bkt'] },
      },
    ],
    linked_documents: [],
    pinned_concepts: [
      {
        id: 'c0000000-0000-0000-0000-000000000007',
        title: 'Bayesian Knowledge Tracing (BKT)',
        type: 'concept',
        metadata: { mastery: 0.88, difficulty: 'intermediate' },
      },
    ],
    milestones: [
      {
        id: 'm-04',
        title: 'Derive Bayesian posterior update under guess and slip noise',
        is_completed: true,
      },
      {
        id: 'm-05',
        title: 'Benchmark SM-2 against empirical forgetting curves',
        is_completed: false,
      },
    ],
  },
];

export const ProjectWorkspacePage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectWorkspace[]>(DEFAULT_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>('proj-01');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newMilestone1, setNewMilestone1] = useState('');
  const [newMilestone2, setNewMilestone2] = useState('');

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/projects', {
          headers: { 'Authorization': 'Bearer demo-token' },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setProjects(json.data);
            setActiveProjectId(json.data[0].id);
          }
        }
      } catch {
        // Fall back gracefully
      }
    };
    fetchProjects();
  }, []);

  const handleToggleMilestone = async (milestoneId: string) => {
    if (!activeProject) return;

    setProjects(prevProjects =>
      prevProjects.map(proj => {
        if (proj.id !== activeProject.id) return proj;

        const updatedMilestones = proj.milestones.map(m => {
          if (m.id === milestoneId) {
            return { ...m, is_completed: !m.is_completed };
          }
          return m;
        });

        const completedCount = updatedMilestones.filter(m => m.is_completed).length;
        const progress = Math.round((completedCount / updatedMilestones.length) * 100);

        return {
          ...proj,
          milestones: updatedMilestones,
          progress_percentage: progress,
        };
      })
    );

    const targetMilestone = activeProject.milestones.find(m => m.id === milestoneId);
    if (!targetMilestone) return;

    try {
      await fetch(`http://localhost:8000/api/v1/projects/${activeProject.id}/milestones/${milestoneId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token',
        },
        body: JSON.stringify({ is_completed: !targetMilestone.is_completed }),
      });
    } catch {
      // Local state preserved
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const milestones: ProjectMilestone[] = [];
    if (newMilestone1.trim()) {
      milestones.push({ id: `m-${Date.now()}-1`, title: newMilestone1, is_completed: false });
    }
    if (newMilestone2.trim()) {
      milestones.push({ id: `m-${Date.now()}-2`, title: newMilestone2, is_completed: false });
    }
    if (milestones.length === 0) {
      milestones.push({ id: `m-${Date.now()}-1`, title: 'Define research objectives', is_completed: false });
    }

    const newProj: ProjectWorkspace = {
      id: `proj-${Date.now()}`,
      title: newTitle,
      description: newDesc || 'Project workspace.',
      subject_name: 'Machine Learning & AI',
      subject_color: '#7667F5',
      status: 'active',
      progress_percentage: 0.0,
      due_date: new Date(Date.now() + 86400000 * 14).toISOString(),
      linked_notes: [],
      linked_documents: [],
      pinned_concepts: [],
      milestones,
    };

    setProjects(prev => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewMilestone1('');
    setNewMilestone2('');

    try {
      await fetch('http://localhost:8000/api/v1/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token',
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          milestone_titles: milestones.map(m => m.title),
        }),
      });
    } catch {
      // Local fallback
    }
  };

  const handleExportBrief = () => {
    if (!activeProject) return;
    const briefContent = `# Project Brief: ${activeProject.title}\n\n**Subject:** ${activeProject.subject_name}\n**Status:** ${activeProject.status}\n**Progress:** ${activeProject.progress_percentage}%\n\n## Description\n${activeProject.description}\n\n## Milestones\n${activeProject.milestones.map(m => `- [${m.is_completed ? 'x' : ' '}] ${m.title}`).join('\n')}\n\n## Pinned Concepts\n${activeProject.pinned_concepts.map(c => `- ${c.title}`).join('\n')}\n`;

    const blob = new Blob([briefContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProject.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_brief.md`;
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
                <FolderKanban className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-primary-text tracking-tight">
                Project Knowledge Mapping
              </h1>
              <Badge variant="primary" className="ml-2">Workspaces</Badge>
            </div>
            <p className="text-sm text-secondary-text mt-1">
              Multi-modal research workspaces unifying concept graphs, literature notes, and milestone checklists.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportBrief}
              className="text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export Brief
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowCreateModal(true)}
              className="text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              New Workspace
            </Button>
          </div>
        </div>

        {/* Project Selector Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {projects.map(proj => (
            <button
              key={proj.id}
              onClick={() => setActiveProjectId(proj.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
                proj.id === activeProjectId
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white/80 text-secondary-text border-neutral-200/80 hover:bg-neutral-100'
              }`}
            >
              {proj.title} ({proj.progress_percentage}%)
            </button>
          ))}
        </div>

        {/* Active Project Main Canvas */}
        {activeProject && (
          <div className="space-y-6">
            
            {/* Project Hero Card */}
            <div className="bg-white/85 backdrop-blur-md border border-neutral-200/80 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-neutral-100 text-neutral-700">
                      {activeProject.subject_name}
                    </Badge>
                    <span className="text-xs text-secondary-text flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      Target: {activeProject.due_date ? new Date(activeProject.due_date).toLocaleDateString() : 'Continuous'}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-primary-text">
                    {activeProject.title}
                  </h2>
                  <p className="text-sm text-secondary-text max-w-3xl leading-relaxed">
                    {activeProject.description}
                  </p>
                </div>

                {/* Progress Metric */}
                <div className="bg-neutral-50/80 border border-neutral-200/80 rounded-2xl p-4 flex items-center gap-4 shrink-0 min-w-[200px] justify-between">
                  <div>
                    <span className="text-xs text-secondary-text block">Milestone Progress</span>
                    <span className="text-2xl font-extrabold text-primary-text">
                      {activeProject.progress_percentage}%
                    </span>
                    <span className="text-xs text-secondary-text block mt-0.5">
                      {activeProject.milestones.filter(m => m.is_completed).length} of {activeProject.milestones.length} milestones
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-primary flex items-center justify-center font-bold text-xs text-primary shadow-xs">
                    {activeProject.progress_percentage}%
                  </div>
                </div>
              </div>

              <div className="mt-6 w-full bg-neutral-200/70 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${activeProject.progress_percentage}%` }}
                />
              </div>
            </div>

            {/* Three-Column Workspace Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Column 1: Milestones */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-bold text-primary-text flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-primary" />
                    Milestone Tasks
                  </h3>
                  <span className="text-xs text-secondary-text">
                    {activeProject.milestones.length} Items
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeProject.milestones.map(m => (
                    <div
                      key={m.id}
                      onClick={() => handleToggleMilestone(m.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                        m.is_completed
                          ? 'bg-emerald-50/20 border-emerald-200/80'
                          : 'bg-white/85 border-neutral-200/80 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          className={`mt-0.5 p-0.5 rounded-full ${
                            m.is_completed ? 'text-emerald-600' : 'text-neutral-400 hover:text-primary'
                          }`}
                        >
                          {m.is_completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                        </button>
                        <p className={`text-xs font-medium leading-relaxed ${
                          m.is_completed ? 'line-through text-secondary-text' : 'text-primary-text'
                        }`}>
                          {m.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Pinned Concepts */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-bold text-primary-text flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-indigo-600" />
                    Pinned Concepts
                  </h3>
                  <button
                    onClick={() => navigate('/graph')}
                    className="text-xs text-primary font-medium hover:underline flex items-center gap-0.5"
                  >
                    Graph <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {activeProject.pinned_concepts.map(concept => (
                    <div
                      key={concept.id}
                      onClick={() => navigate('/practice')}
                      className="p-4 rounded-2xl border border-neutral-200/80 bg-white/85 hover:border-indigo-300 transition-all cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Badge variant="primary" className="text-[10px]">
                          Concept
                        </Badge>
                        <span className="text-xs font-bold text-emerald-600">
                          {Math.round((concept.metadata?.mastery || 0.75) * 100)}% Mastery
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-primary-text">
                        {concept.title}
                      </h4>
                      <p className="text-[11px] text-secondary-text mt-1">
                        Click to launch adaptive practice diagnostic.
                      </p>
                    </div>
                  ))}
                  {activeProject.pinned_concepts.length === 0 && (
                    <div className="p-6 bg-white/50 border border-dashed border-neutral-300 rounded-2xl text-center">
                      <p className="text-xs text-secondary-text">No concepts pinned yet.</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/graph')}
                        className="mt-2 text-xs"
                      >
                        Browse Graph
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Column 3: Linked Notes & Documents */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-bold text-primary-text flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Linked Notes & Papers
                  </h3>
                  <button
                    onClick={() => navigate('/library')}
                    className="text-xs text-primary font-medium hover:underline flex items-center gap-0.5"
                  >
                    Library <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {activeProject.linked_notes.map(note => (
                    <div
                      key={note.id}
                      onClick={() => navigate('/notes/new')}
                      className="p-4 rounded-2xl border border-neutral-200/80 bg-white/85 hover:border-indigo-300 transition-all cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="text-[11px] font-semibold text-secondary-text uppercase">Research Note</span>
                      </div>
                      <h4 className="text-xs font-semibold text-primary-text">
                        {note.title}
                      </h4>
                    </div>
                  ))}

                  {activeProject.linked_documents.map(doc => (
                    <div
                      key={doc.id}
                      onClick={() => navigate('/library')}
                      className="p-4 rounded-2xl border border-neutral-200/80 bg-white/85 hover:border-indigo-300 transition-all cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-[11px] font-semibold text-secondary-text uppercase">PDF Document</span>
                      </div>
                      <h4 className="text-xs font-semibold text-primary-text">
                        {doc.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Create Workspace Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-primary-text/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-neutral-200/80 shadow-xl space-y-5 animate-scale-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-50 text-primary rounded-lg">
                    <FolderKanban className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-primary-text text-lg">Create Project Workspace</h3>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-neutral-400 hover:text-neutral-600 text-sm font-semibold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-secondary-text block mb-1">
                    Workspace Title
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary"
                    placeholder="e.g. Low-Rank Adaptation (LoRA) Fine-Tuning"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-secondary-text block mb-1">
                    Research Objective / Scope
                  </label>
                  <textarea
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    rows={2}
                    className="w-full px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary"
                    placeholder="Brief description of research focus and deliverables..."
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-secondary-text block mb-1">
                    Initial Milestones
                  </label>
                  <input
                    type="text"
                    value={newMilestone1}
                    onChange={e => setNewMilestone1(e.target.value)}
                    className="w-full px-3.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl mb-2 focus:outline-none focus:border-primary"
                    placeholder="Milestone 1: Review seminal papers"
                  />
                  <input
                    type="text"
                    value={newMilestone2}
                    onChange={e => setNewMilestone2(e.target.value)}
                    className="w-full px-3.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary"
                    placeholder="Milestone 2: Conduct benchmark evaluation"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                  >
                    Create Workspace
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
