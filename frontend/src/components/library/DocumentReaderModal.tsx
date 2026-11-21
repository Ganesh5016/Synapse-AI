import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  Bookmark,
  Share2,
  Download,
  FileText,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LibraryResource, BookChapter } from '../../services/libraryStorage';

interface DocumentReaderModalProps {
  resource: LibraryResource | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentReaderModal: React.FC<DocumentReaderModalProps> = ({
  resource,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen || !resource) return null;

  const chapters = resource.chapters && resource.chapters.length > 0
    ? resource.chapters
    : [
        {
          id: 'default-ch',
          title: 'Document Content',
          pageNumber: 1,
          content: resource.description || 'No readable text available.',
        },
      ];

  const activeChapter: BookChapter = chapters[activeChapterIndex] || chapters[0];

  const handleNextChapter = () => {
    if (activeChapterIndex < chapters.length - 1) {
      setActiveChapterIndex((prev) => prev + 1);
    }
  };

  const handlePrevChapter = () => {
    if (activeChapterIndex > 0) {
      setActiveChapterIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary-text/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Main Reader Container */}
      <div className="relative w-full max-w-5xl h-[92vh] bg-white rounded-3xl shadow-2xl border border-muted-border/80 z-10 flex flex-col overflow-hidden">
        {/* 1. TOP TOOLBAR */}
        <div className="px-5 py-3.5 bg-white/95 border-b border-muted-border flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl gradient-accent text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-primary-text truncate">
                {resource.title}
              </h2>
              <p className="text-[11px] text-muted truncate">
                {resource.author} • {resource.totalPages} Pages • {resource.subject}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Font size toggles */}
            <div className="hidden sm:flex items-center gap-1 p-1 bg-surface-secondary rounded-xl border border-muted-border">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-0.5 text-xs rounded-lg font-bold ${
                  fontSize === 'sm' ? 'bg-white shadow-2xs text-primary' : 'text-muted'
                }`}
                title="Small text"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-0.5 text-xs rounded-lg font-bold ${
                  fontSize === 'base' ? 'bg-white shadow-2xs text-primary' : 'text-muted'
                }`}
                title="Default text"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-0.5 text-xs rounded-lg font-bold ${
                  fontSize === 'lg' ? 'bg-white shadow-2xs text-primary' : 'text-muted'
                }`}
                title="Large text"
              >
                A+
              </button>
            </div>

            {/* AI Assistant shortcut */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                navigate(
                  `/assistant?q=${encodeURIComponent(
                    `Explain key takeaways and synthesize ${resource.title} (${activeChapter.title})`
                  )}`
                );
              }}
              className="text-xs hidden md:flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Ask AI About Book</span>
            </Button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-muted hover:text-primary-text hover:bg-surface-secondary transition-colors"
              title="Close reader"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. BODY LAYOUT: SIDEBAR TABLE OF CONTENTS + READING PANE */}
        <div className="flex-1 flex overflow-hidden">
          {/* Table of Contents Sidebar */}
          <aside className="w-64 border-r border-muted-border/80 bg-surface/50 hidden md:flex flex-col flex-shrink-0">
            <div className="p-3 border-b border-muted-border/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-2">
                Table of Contents ({chapters.length} Chapters)
              </span>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-muted absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter chapters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1 text-xs rounded-xl border border-muted-border bg-white focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {chapters
                .filter(
                  (ch) =>
                    !searchQuery ||
                    ch.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((ch, idx) => {
                  const isActive = idx === activeChapterIndex;
                  return (
                    <button
                      key={ch.id || idx}
                      onClick={() => setActiveChapterIndex(idx)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start justify-between gap-2 ${
                        isActive
                          ? 'bg-primary-light text-primary font-bold shadow-xs'
                          : 'text-secondary-text hover:bg-white hover:text-primary-text'
                      }`}
                    >
                      <span className="line-clamp-2 leading-snug">{ch.title}</span>
                      <span className="text-[10px] text-muted flex-shrink-0 font-normal">
                        p. {ch.pageNumber}
                      </span>
                    </button>
                  );
                })}
            </div>

            <div className="p-3 border-t border-muted-border/60 bg-white/60">
              <div className="flex items-center justify-between text-[11px] text-muted">
                <span>Reading Progress</span>
                <span className="font-bold text-primary">
                  {Math.round(((activeChapterIndex + 1) / chapters.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-surface-secondary h-1.5 rounded-full overflow-hidden mt-1.5">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${((activeChapterIndex + 1) / chapters.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </aside>

          {/* Main Reading Pane */}
          <main className="flex-1 flex flex-col overflow-hidden bg-white">
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 max-w-3xl mx-auto w-full space-y-6">
              {/* Chapter Header */}
              <div className="border-b border-muted-border/80 pb-4">
                <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                  Chapter {activeChapterIndex + 1} of {chapters.length} • Page {activeChapter.pageNumber}
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-primary-text">
                  {activeChapter.title}
                </h1>
              </div>

              {/* Formatted Content */}
              <div
                className={`prose prose-slate max-w-none text-primary-text leading-relaxed whitespace-pre-line ${
                  fontSize === 'sm'
                    ? 'text-xs'
                    : fontSize === 'lg'
                    ? 'text-base leading-loose'
                    : 'text-sm'
                }`}
              >
                {activeChapter.content}
              </div>
            </div>

            {/* 3. BOTTOM CHAPTER NAVIGATION FOOTER */}
            <div className="px-6 py-3 border-t border-muted-border bg-surface/80 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevChapter}
                disabled={activeChapterIndex === 0}
                className="text-xs flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Chapter</span>
              </Button>

              <span className="text-xs text-muted font-medium">
                Chapter {activeChapterIndex + 1} of {chapters.length}
              </span>

              <Button
                variant="primary"
                size="sm"
                onClick={handleNextChapter}
                disabled={activeChapterIndex === chapters.length - 1}
                className="text-xs flex items-center gap-1.5 shadow-xs"
              >
                <span>Next Chapter</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

