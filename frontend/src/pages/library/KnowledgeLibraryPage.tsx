import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  UploadCloud, 
  Plus, 
  Search, 
  Layers, 
  Trash2, 
  Eye, 
  Sparkles, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import { DocumentUploadModal } from '../../components/library/DocumentUploadModal';
import { DocumentReaderModal } from '../../components/library/DocumentReaderModal';
import {
  getUserLibrary,
  saveUserDocument,
  deleteUserResource,
  LibraryResource,
} from '../../services/libraryStorage';

export const KnowledgeLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [resources, setResources] = useState<LibraryResource[]>(() =>
    getUserLibrary(user?.id)
  );
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'books' | 'papers' | 'documents'>('all');
  const [selectedSubject, setSelectedSubject] = useState('All');

  // Reader Modal & Upload Modal State
  const [readerOpen, setReaderOpen] = useState(false);
  const [activeResource, setActiveResource] = useState<LibraryResource | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  useEffect(() => {
    setResources(getUserLibrary(user?.id));

    const handleUpdate = () => {
      setResources(getUserLibrary(user?.id));
    };

    window.addEventListener('synapse_library_updated', handleUpdate);
    return () => window.removeEventListener('synapse_library_updated', handleUpdate);
  }, [user?.id]);

  const subjects = [
    'All',
    'Machine Learning & AI',
    'Cognitive Science',
    'Mathematics & Statistics',
    'Computer Systems & Architecture',
  ];

  const handleOpenReader = (res: LibraryResource) => {
    setActiveResource(res);
    setReaderOpen(true);
  };

  const handleUploadSuccess = (newDoc: any) => {
    const saved = saveUserDocument(user?.id, {
      title: newDoc.title,
      subject: 'Machine Learning & AI',
      content: newDoc.content || `### ${newDoc.title}\n\nDocument ingested and indexed for semantic search and neural citation.`,
      pageCount: newDoc.page_count || 10,
      fileType: 'pdf',
      tags: ['uploaded', 'pdf'],
    });

    setResources(getUserLibrary(user?.id));
    handleOpenReader(saved);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteUserResource(user?.id, id);
    setResources(getUserLibrary(user?.id));
  };

  const filteredResources = resources.filter((res) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'books' && res.type === 'book') ||
      (activeTab === 'papers' && res.type === 'paper') ||
      (activeTab === 'documents' && (res.type === 'document' || res.isUserUploaded));

    const matchesSubject = selectedSubject === 'All' || res.subject === selectedSubject;

    const matchesSearch =
      res.title.toLowerCase().includes(search.toLowerCase()) ||
      res.author.toLowerCase().includes(search.toLowerCase()) ||
      res.description.toLowerCase().includes(search.toLowerCase()) ||
      res.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    return matchesTab && matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* 1. DOCUMENT & BOOK READER MODAL */}
      <DocumentReaderModal
        isOpen={readerOpen}
        onClose={() => setReaderOpen(false)}
        resource={activeResource}
      />

      {/* 2. UPLOAD PDF MODAL */}
      <DocumentUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* 3. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-text tracking-tight">
            Documents & Knowledge Library
          </h1>
          <p className="text-sm text-muted mt-1">
            Read canonical textbooks, inspect peer-reviewed research papers, and upload PDF literature.
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
              <Plus className="w-4 h-4" /> New Research Note
            </Button>
          </Link>
        </div>
      </div>

      {/* 4. FILTER TABS & SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
        {/* Type Tabs */}
        <div className="flex items-center p-1 bg-surface-secondary/70 rounded-2xl border border-muted-border w-full md:w-auto">
          {(
            [
              { id: 'all', label: 'All Resources' },
              { id: 'books', label: 'Textbooks' },
              { id: 'papers', label: 'Research Papers' },
              { id: 'documents', label: 'My Uploads' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-muted hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search books, authors, topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input w-full pl-9 pr-3.5 py-1.5 text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* 5. SUBJECT FILTER PILLS */}
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

      {/* 6. RESOURCES GRID */}
      {filteredResources.length === 0 ? (
        <Card className="py-16 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-muted mx-auto opacity-50" />
          <h3 className="text-base font-bold text-primary-text">No matching resources found</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            Try adjusting your search query or subject filters, or upload your own PDF textbook.
          </p>
          <Button variant="outline" size="sm" onClick={() => setUploadModalOpen(true)}>
            Upload Document
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map((item) => (
            <Card
              key={item.id}
              onClick={() => handleOpenReader(item)}
              className="flex flex-col justify-between hover:border-primary/50 transition-all group cursor-pointer shadow-xs hover:shadow-md bg-white/95"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs ${
                        item.type === 'book'
                          ? 'bg-primary'
                          : item.type === 'paper'
                          ? 'bg-accent'
                          : 'bg-emerald-600'
                      }`}
                    >
                      {item.type === 'book' ? (
                        <BookOpen className="w-5 h-5" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                        {item.type === 'book'
                          ? 'Core Textbook'
                          : item.type === 'paper'
                          ? 'Research Paper'
                          : 'Ingested Document'}
                      </span>
                      <h3 className="text-base font-bold text-primary-text group-hover:text-primary transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-muted truncate">{item.author}</p>
                    </div>
                  </div>

                  <Badge variant="outline">{item.totalPages} Pages</Badge>
                </div>

                {/* Description */}
                <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-4">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${item.subjectColor}15`,
                      color: item.subjectColor,
                    }}
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
                <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Full Readable Text
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenReader(item);
                    }}
                    className="text-xs py-1 px-3 shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                    <span>Read Book</span>
                  </Button>

                  <Link
                    to={`/assistant?q=${encodeURIComponent(
                      `Explain key insights and summarize: ${item.title}`
                    )}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs py-1 px-2 text-primary hover:bg-primary-light/40"
                      title="Ask AI about this literature"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1 text-primary" /> Ask AI
                    </Button>
                  </Link>

                  {item.isUserUploaded && (
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1.5 rounded-lg text-muted hover:text-error hover:bg-error-light/40 transition-colors"
                      title="Delete uploaded document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
