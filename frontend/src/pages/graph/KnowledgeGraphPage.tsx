import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  NodeProps,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
  Network,
  Search,
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
  BookOpen,
  FileText,
  HelpCircle,
  Play,
  Layers,
  X,
  Compass,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

// ============================================================================
// Custom Glassmorphic Graph Node
// ============================================================================

interface ConceptNodeData {
  label: string;
  slug: string;
  subject_id: string;
  subject_name: string;
  difficulty_level: string;
  mastery_score: number;
  mastery_level: string;
  prerequisites: string[];
  question_count: number;
  note_count: number;
  isSelected?: boolean;
}

const CustomConceptNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as ConceptNodeData;

  const masteryStyles = {
    Mastered: {
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      dot: 'bg-emerald-500',
      border: 'border-emerald-400/60',
    },
    Proficient: {
      badge: 'bg-blue-100 text-blue-800 border-blue-300',
      dot: 'bg-blue-500',
      border: 'border-blue-400/60',
    },
    Developing: {
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      dot: 'bg-amber-500',
      border: 'border-amber-400/60',
    },
    Novice: {
      badge: 'bg-slate-100 text-slate-800 border-slate-300',
      dot: 'bg-slate-400',
      border: 'border-slate-300',
    },
  }[nodeData.mastery_level] || {
    badge: 'bg-slate-100 text-slate-800 border-slate-300',
    dot: 'bg-slate-400',
    border: 'border-slate-300',
  };

  return (
    <div
      className={`min-w-[220px] max-w-[260px] p-3 rounded-2xl bg-white/90 backdrop-blur-md border transition-all duration-200 text-left cursor-pointer shadow-xs hover:shadow-md ${
        selected
          ? 'ring-2 ring-primary ring-offset-2 border-primary shadow-md scale-[1.02]'
          : masteryStyles.border
      }`}
    >
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-primary border-2 !border-white" />

      {/* Header with subject & mastery badge */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted line-clamp-1">
          {nodeData.subject_name}
        </span>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${masteryStyles.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${masteryStyles.dot}`} />
          {nodeData.mastery_level}
        </span>
      </div>

      {/* Concept Name */}
      <h4 className="text-xs sm:text-sm font-bold text-primary-text line-clamp-2 leading-snug mb-2">
        {nodeData.label}
      </h4>

      {/* Progress bar */}
      <div className="w-full bg-surface-secondary rounded-full h-1.5 mb-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 bg-primary"
          style={{ width: `${Math.round(nodeData.mastery_score * 100)}%` }}
        />
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between text-[10px] text-muted pt-1 border-t border-muted-border/40">
        <span>{Math.round(nodeData.mastery_score * 100)}% Mastery</span>
        <span className="capitalize">{nodeData.difficulty_level}</span>
      </div>

      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 !bg-primary border-2 !border-white" />
    </div>
  );
};

// ============================================================================
// Main Knowledge Graph Page
// ============================================================================

export const KnowledgeGraphPage: React.FC = () => {
  const navigate = useNavigate();

  const nodeTypes = useMemo(() => ({ conceptNode: CustomConceptNode }), []);

  // Filter state
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNodeData, setSelectedNodeData] = useState<ConceptNodeData | null>(null);

  // Initial Graph Data
  const initialNodes = [
    {
      id: 'c0000000-0000-0000-0000-000000000001',
      type: 'conceptNode',
      position: { x: 50, y: 150 },
      data: {
        label: 'Linear Algebra Foundations',
        slug: 'linear-algebra-foundations',
        subject_id: 'a0000000-0000-0000-0000-000000000003',
        subject_name: 'Mathematics & Stats',
        difficulty_level: 'beginner',
        mastery_score: 0.92,
        mastery_level: 'Mastered',
        prerequisites: [],
        question_count: 5,
        note_count: 3,
      },
    },
    {
      id: 'c0000000-0000-0000-0000-000000000002',
      type: 'conceptNode',
      position: { x: 340, y: 80 },
      data: {
        label: 'Gradient Descent & Backpropagation',
        slug: 'gradient-descent-backprop',
        subject_id: 'a0000000-0000-0000-0000-000000000001',
        subject_name: 'Machine Learning',
        difficulty_level: 'beginner',
        mastery_score: 0.84,
        mastery_level: 'Proficient',
        prerequisites: ['Linear Algebra Foundations'],
        question_count: 6,
        note_count: 2,
      },
    },
    {
      id: 'c0000000-0000-0000-0000-000000000003',
      type: 'conceptNode',
      position: { x: 640, y: 100 },
      data: {
        label: 'Scaled Dot-Product Attention',
        slug: 'scaled-dot-product-attention',
        subject_id: 'a0000000-0000-0000-0000-000000000001',
        subject_name: 'Machine Learning',
        difficulty_level: 'intermediate',
        mastery_score: 0.78,
        mastery_level: 'Proficient',
        prerequisites: ['Linear Algebra Foundations', 'Gradient Descent & Backpropagation'],
        question_count: 6,
        note_count: 4,
      },
    },
    {
      id: 'c0000000-0000-0000-0000-000000000004',
      type: 'conceptNode',
      position: { x: 940, y: 100 },
      data: {
        label: 'Multi-Head Attention',
        slug: 'multi-head-attention',
        subject_id: 'a0000000-0000-0000-0000-000000000001',
        subject_name: 'Machine Learning',
        difficulty_level: 'intermediate',
        mastery_score: 0.65,
        mastery_level: 'Developing',
        prerequisites: ['Scaled Dot-Product Attention'],
        question_count: 4,
        note_count: 2,
      },
    },
    {
      id: 'c0000000-0000-0000-0000-000000000005',
      type: 'conceptNode',
      position: { x: 1240, y: 120 },
      data: {
        label: 'Transformer Architecture & Self-Attention',
        slug: 'transformer-architecture',
        subject_id: 'a0000000-0000-0000-0000-000000000001',
        subject_name: 'Machine Learning',
        difficulty_level: 'advanced',
        mastery_score: 0.52,
        mastery_level: 'Developing',
        prerequisites: ['Multi-Head Attention'],
        question_count: 4,
        note_count: 3,
      },
    },
    {
      id: 'c0000000-0000-0000-0000-000000000006',
      type: 'conceptNode',
      position: { x: 340, y: 320 },
      data: {
        label: 'Bayesian Probability & Posterior Updates',
        slug: 'bayesian-probability-posterior',
        subject_id: 'a0000000-0000-0000-0000-000000000003',
        subject_name: 'Mathematics & Stats',
        difficulty_level: 'beginner',
        mastery_score: 0.88,
        mastery_level: 'Proficient',
        prerequisites: [],
        question_count: 5,
        note_count: 2,
      },
    },
    {
      id: 'c0000000-0000-0000-0000-000000000007',
      type: 'conceptNode',
      position: { x: 660, y: 320 },
      data: {
        label: 'Bayesian Knowledge Tracing (BKT)',
        slug: 'bayesian-knowledge-tracing',
        subject_id: 'a0000000-0000-0000-0000-000000000005',
        subject_name: 'Cognitive Science',
        difficulty_level: 'intermediate',
        mastery_score: 0.58,
        mastery_level: 'Developing',
        prerequisites: ['Bayesian Probability & Posterior Updates'],
        question_count: 4,
        note_count: 3,
      },
    },
    {
      id: 'c0000000-0000-0000-0000-000000000008',
      type: 'conceptNode',
      position: { x: 960, y: 320 },
      data: {
        label: 'SuperMemo SM-2 Spaced Repetition',
        slug: 'sm-2-spaced-repetition',
        subject_id: 'a0000000-0000-0000-0000-000000000005',
        subject_name: 'Cognitive Science',
        difficulty_level: 'intermediate',
        mastery_score: 0.38,
        mastery_level: 'Novice',
        prerequisites: ['Bayesian Knowledge Tracing (BKT)'],
        question_count: 4,
        note_count: 2,
      },
    },
  ];

  const initialEdges = [
    {
      id: 'e1-2',
      source: 'c0000000-0000-0000-0000-000000000001',
      target: 'c0000000-0000-0000-0000-000000000002',
      animated: true,
      style: { stroke: '#7667F5', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#7667F5' },
    },
    {
      id: 'e1-3',
      source: 'c0000000-0000-0000-0000-000000000001',
      target: 'c0000000-0000-0000-0000-000000000003',
      animated: true,
      style: { stroke: '#7667F5', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#7667F5' },
    },
    {
      id: 'e2-3',
      source: 'c0000000-0000-0000-0000-000000000002',
      target: 'c0000000-0000-0000-0000-000000000003',
      animated: true,
      style: { stroke: '#7667F5', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#7667F5' },
    },
    {
      id: 'e3-4',
      source: 'c0000000-0000-0000-0000-000000000003',
      target: 'c0000000-0000-0000-0000-000000000004',
      animated: true,
      style: { stroke: '#7667F5', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#7667F5' },
    },
    {
      id: 'e4-5',
      source: 'c0000000-0000-0000-0000-000000000004',
      target: 'c0000000-0000-0000-0000-000000000005',
      animated: true,
      style: { stroke: '#7667F5', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#7667F5' },
    },
    {
      id: 'e6-7',
      source: 'c0000000-0000-0000-0000-000000000006',
      target: 'c0000000-0000-0000-0000-000000000007',
      animated: true,
      style: { stroke: '#D9536B', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#D9536B' },
    },
    {
      id: 'e7-8',
      source: 'c0000000-0000-0000-0000-000000000007',
      target: 'c0000000-0000-0000-0000-000000000008',
      animated: true,
      style: { stroke: '#D9536B', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#D9536B' },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Filter nodes based on subject & search
  useEffect(() => {
    let filtered = initialNodes;
    if (selectedSubject !== 'all') {
      filtered = filtered.filter((n) => n.data.subject_id === selectedSubject);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((n) => n.data.label.toLowerCase().includes(q));
    }
    setNodes(filtered);
  }, [selectedSubject, searchQuery]);

  const onNodeClick = useCallback((_: any, node: any) => {
    setSelectedNodeData(node.data as ConceptNodeData);
  }, []);

  const subjects = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'a0000000-0000-0000-0000-000000000001', label: 'Machine Learning & AI' },
    { id: 'a0000000-0000-0000-0000-000000000005', label: 'Cognitive Science' },
    { id: 'a0000000-0000-0000-0000-000000000003', label: 'Mathematics & Stats' },
  ];

  return (
    <div className="relative h-[calc(100vh-140px)] flex flex-col rounded-3xl overflow-hidden border border-border/80 bg-surface/50 backdrop-blur-md shadow-xs">
      {/* 1. TOP CONTROL BAR */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-b border-border/70 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
            <Network className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-primary-text">Interactive Knowledge Graph</h2>
              <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                8 Active Nodes
              </Badge>
            </div>
            <p className="text-xs text-muted">
              Explore cognitive dependencies, prerequisite sequences, and mastery thresholds
            </p>
          </div>
        </div>

        {/* Search & Subject Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative w-48 sm:w-60">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-surface-secondary/70 border border-muted-border text-xs focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Subject Pills */}
          <div className="flex items-center gap-1 bg-surface-secondary/80 p-1 rounded-xl border border-muted-border">
            {subjects.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedSubject === sub.id
                    ? 'bg-white text-primary shadow-xs'
                    : 'text-muted hover:text-primary-text'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. REACT FLOW CANVAS */}
      <div className="flex-1 w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          minZoom={0.4}
          maxZoom={1.8}
        >
          <Background color="#E2E8F0" gap={20} size={1} />
          <Controls className="!bg-white/90 !border !border-border !rounded-xl !shadow-xs" />
          <MiniMap
            className="!bg-white/80 !border !border-border !rounded-2xl !shadow-md !overflow-hidden"
            nodeColor={(node: any) => {
              const m = node.data?.mastery_level;
              if (m === 'Mastered') return '#10B981';
              if (m === 'Proficient') return '#3B82F6';
              if (m === 'Developing') return '#F59E0B';
              return '#94A3B8';
            }}
          />
        </ReactFlow>

        {/* 3. NODE DETAIL SLIDEOVER DRAWER */}
        {selectedNodeData && (
          <div className="absolute right-4 top-4 bottom-4 w-80 sm:w-96 bg-white/95 backdrop-blur-lg rounded-2xl border border-border shadow-2xl p-5 flex flex-col gap-4 z-20 animate-in slide-in-from-right-10 duration-200">
            <div className="flex items-start justify-between gap-2 border-b border-muted-border pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">
                  {selectedNodeData.subject_name}
                </span>
                <h3 className="text-base font-bold text-primary-text leading-snug">
                  {selectedNodeData.label}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNodeData(null)}
                className="p-1.5 rounded-lg text-muted hover:text-primary-text hover:bg-surface transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mastery Card */}
            <div className="p-3.5 rounded-xl bg-surface/70 border border-muted-border space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>Bayesian Mastery</span>
                <span className="text-primary font-bold">
                  {Math.round(selectedNodeData.mastery_score * 100)}%
                </span>
              </div>
              <div className="w-full bg-surface-secondary rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${Math.round(selectedNodeData.mastery_score * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted">
                <span>Status: {selectedNodeData.mastery_level}</span>
                <span className="capitalize">{selectedNodeData.difficulty_level} Level</span>
              </div>
            </div>

            {/* Prerequisites */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
                Required Prerequisites
              </span>
              {selectedNodeData.prerequisites.length === 0 ? (
                <p className="text-xs text-muted italic">Foundational concept (No prerequisites)</p>
              ) : (
                <div className="space-y-1">
                  {selectedNodeData.prerequisites.map((p, i) => (
                    <div
                      key={i}
                      className="px-2.5 py-1.5 rounded-lg bg-surface border border-muted-border text-xs font-medium text-primary-text flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-auto space-y-2 pt-3 border-t border-muted-border">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(`/practice?conceptId=${selectedNodeData.slug}`)}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white shadow-xs"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Practice Quiz</span>
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => navigate(`/concepts/${selectedNodeData.slug}`)}
                className="w-full flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-primary" />
                <span>Explore Concept Blueprint</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  navigate(`/assistant?q=${encodeURIComponent(`Explain key concepts of ${selectedNodeData.label}`)}`)
                }
                className="w-full flex items-center justify-center gap-1.5 text-xs text-muted hover:text-primary"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Ask AI Assistant about this</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
