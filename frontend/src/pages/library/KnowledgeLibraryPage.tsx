import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  UploadCloud, 
  Plus, 
  Search, 
  Filter, 
  Layers, 
  Calendar, 
  Tag, 
  Trash2, 
  Eye, 
  Sparkles, 
  Clock, 
  FileCheck 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { DocumentUploadModal } from '../../components/library/DocumentUploadModal';
import { DocumentDetailModal } from '../../components/library/DocumentDetailModal';

interface LibraryItem {
  id: string;
  type: 'document' | 'note';
  title: string;
  subject: string;
  subjectColor: string;
  snippet: string;
  meta: string;
  tags: string[];
  updatedAt: string;
  page_count?: number;
  chunk_count?: number;
  file_type?: string;
}

const INITIAL_ITEMS: LibraryItem[] = [
  {
    id: 'doc-1',
    type: 'document',
    title: 'Attention Is All You Need (Vaswani et al.)',
    subject: 'Machine Learning & AI',
    subjectColor: '#7667F5',
    snippet: 'The foundational transformer paper replacing recurrence with multi-head self-attention mechanisms.',
    meta: '15 Pages • 28 Chunks',
    tags: ['transformers', 'attention', 'nlp'],
    updatedAt: '2 hours ago',
    page_count: 15,
    chunk_count: 28,
    file_type: 'pdf',
  },
  {
    id: 'note-1',
    type: 'note',
    title: 'Bayesian Knowledge Tracing Posterior Derivations',
    subject: 'Cognitive Science',
    subjectColor: '#D9536B',
    snippet: 'Derivation of Bayesian updates for slip, guess, prior, and transition parameters across test attempts.',
    meta: '480 Words • 3 min read',
    tags: ['bkt', 'psychometrics', 'math'],
    updatedAt: 'Yesterday',
  },
  {
    id: 'doc-2',
    type: 'document',
    title: 'Distributed Systems & Vector Clocks (Lamport)',
    subject: 'Computer Systems & Architecture',
    subjectColor: '#229B72',
    snippet: 'Causal ordering, logical timestamps, and concurrency primitives in distributed consensus algorithms.',
    meta: '22 Pages • 36 Chunks',
    tags: ['distributed', 'concurrency', 'systems'],
    updatedAt: '3 days ago',
    page_count: 22,
    chunk_count: 36,
    file_type: 'pdf',
  },
  {
    id: 'note-2',
    type: 'note',
    title: 'Singular Value Decomposition & Low-Rank Approximations',
    subject: 'Mathematics & Statistics',
    subjectColor: '#D99A32',
    snippet: 'Decomposing matrix A into U Σ V^T. Spectral theorem, singular values, and rank-k truncation proofs.',
    meta: '620 Words • 4 min read',
    tags: ['linear-algebra', 'svd', 'matrix'],
    updatedAt: '5 days ago',
  },
];

export const KnowledgeLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<LibraryItem[]>(INITIAL_ITEMS);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'documents' | 'notes'>('all');
  const [selectedSubject, setSelectedSubject] = useState('All');

  // Modals
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<LibraryItem | null>(null);

  const subjects = [
    'All',
    'Machine Learning & AI',
    'Mathematics & Statistics',
    'Computer Systems & Architecture',
    'Data Structures & Algorithms',
    'Cognitive Science',
  ];

  const handleUploadSuccess = (newDoc: any) => {
    const newItem: LibraryItem = {
      id: newDoc.id,
      type: 'document',
      title: newDoc.title,
      subject: 'Machine Learning & AI',
      subjectColor: '#7667F5',
      snippet: 'Uploaded PDF document chunked into vector embeddings.',
      meta: `${newDoc.page_count} Pages • ${newDoc.chunk_count} Chunks`,
      tags: ['pdf', 'ingested'],
      updatedAt: 'Just now',
      page_count: newDoc.page_count,
      chunk_count: newDoc.chunk_count,
      file_type: 'pdf',
    };
    setItems([newItem, ...items]);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter((item) => {
    const matchesTab = activeTab === 'all' || item.type === activeTab.slice(0, -1);
    const matchesSubject = selectedSubject === 'All' || item.subject === selectedSubject;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.snippet.toLowerCase().includes(search.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    return matchesTab && matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Upload and Detail Modals */}
      <DocumentUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
      <DocumentDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        document={selectedDoc}
      />

      {/* Page Header with Action Triggers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-text tracking-tight">
            Knowledge Library
          </h1>
          <p className="text-sm text-muted mt-1">
            Search, manage, and inspect your uploaded PDF textbooks, research papers, and Markdown notes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4 text-primary" /> Upload PDF
          </Button>
          <Link to="/notes/new">
            <Button variant="primary" size="md" className="flex items-center gap-2 shadow-sm">
              <Plus className="w-4 h-4" /> New Markdown Note
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
        {/* Type Tabs */}
        <div className="flex items-center p-1 bg-surface-secondary/70 rounded-2xl border border-muted-border w-full md:w-auto">
          {(['all', 'documents', 'notes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-muted hover:text-primary'
              }`}
            >
              {tab === 'all' ? 'All Resources' : tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter library..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input w-full pl-9 pr-3.5 py-1.5 text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {subjects.map((subj) => (
          <button
            key={subj}
            onClick={() => setSelectedSubject(subj)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedSubject === subj
                ? 'bg-primary text-white shadow-2xs font-semibold'
                : 'glass-panel text-muted hover:text-primary hover:border-primary/30'
            }`}
          >
            {subj}
          </button>
        ))}
      </div>

      {/* Library Cards Grid */}
      {filteredItems.length === 0 ? (
        <Card className="py-16 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-muted mx-auto opacity-50" />
          <h3 className="text-base font-bold text-primary-text">No matching resources found</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            Try adjusting your search query or subject filters, or upload a new PDF document.
          </p>
          <Button variant="outline" size="sm" onClick={() => setUploadModalOpen(true)}>
            Upload Document
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col justify-between hover:border-primary/40 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-2xs ${
                        item.type === 'document' ? 'bg-primary' : 'bg-accent'
                      }`}
                    >
                      {item.type === 'document' ? <FileText className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                        {item.type === 'document' ? 'PDF Ingestion' : 'Markdown Note'}
                      </span>
                      <h3 className="text-base font-bold text-primary-text group-hover:text-primary transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <Badge variant="outline">{item.updatedAt}</Badge>
                </div>

                <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-4">
                  {item.snippet}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: `${item.subjectColor}15`, color: item.subjectColor }}
                  >
                    {item.subject}
                  </span>
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-muted px-2 py-0.5 rounded-md bg-surface-secondary"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-muted-border/50 flex items-center justify-between text-xs text-muted">
                <span>{item.meta}</span>

                <div className="flex items-center gap-1.5">
                  {item.type === 'document' ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedDoc(item);
                        setDetailModalOpen(true);
                      }}
                      className="text-xs py-1 px-2.5"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" /> Inspect Chunks
                    </Button>
                  ) : (
                    <Link to="/notes/edit">
                      <Button variant="ghost" size="sm" className="text-xs py-1 px-2.5">
                        Open Editor
                      </Button>
                    </Link>
                  )}

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 rounded-lg text-muted hover:text-error hover:bg-error-light/40 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
