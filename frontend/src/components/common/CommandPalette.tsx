import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  LayoutDashboard, 
  Network, 
  BookOpen, 
  FileText, 
  Layers, 
  Clock, 
  Calendar, 
  BarChart3, 
  Sparkles, 
  User, 
  Settings, 
  HelpCircle, 
  ArrowRight,
  Zap,
  CornerDownLeft,
  FolderKanban
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Concepts' | 'Quick Actions';
  icon: React.ElementType;
  action: () => void;
  badge?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      title: 'Go to Dashboard',
      category: 'Navigation',
      icon: LayoutDashboard,
      action: () => { navigate('/dashboard'); onClose(); },
    },
    {
      id: 'nav-graph',
      title: 'Open Knowledge Graph',
      category: 'Navigation',
      icon: Network,
      badge: 'Visualizer',
      action: () => { navigate('/graph'); onClose(); },
    },
    {
      id: 'nav-practice',
      title: 'Adaptive Practice Center',
      category: 'Navigation',
      icon: Layers,
      badge: 'BKT Engine',
      action: () => { navigate('/practice'); onClose(); },
    },
    {
      id: 'nav-flashcards',
      title: 'Spaced Repetition Flashcards',
      category: 'Navigation',
      icon: Clock,
      badge: 'SM-2',
      action: () => { navigate('/flashcards'); onClose(); },
    },
    {
      id: 'nav-gaps',
      title: 'Knowledge Gaps & Deficits',
      category: 'Navigation',
      icon: Zap,
      badge: 'Root Cause',
      action: () => { navigate('/gaps'); onClose(); },
    },
    {
      id: 'nav-paths',
      title: 'Personalized Learning Paths',
      category: 'Navigation',
      icon: Calendar,
      badge: 'Curriculum',
      action: () => { navigate('/learning-paths'); onClose(); },
    },
    {
      id: 'nav-planner',
      title: 'Study Planner & Revision Calendar',
      category: 'Navigation',
      icon: Calendar,
      badge: 'SM-2',
      action: () => { navigate('/planner'); onClose(); },
    },
    {
      id: 'nav-projects',
      title: 'Project Knowledge Workspaces',
      category: 'Navigation',
      icon: FolderKanban,
      badge: 'Kanban',
      action: () => { navigate('/projects'); onClose(); },
    },
    {
      id: 'nav-analytics',
      title: 'Mastery & Psychometric Analytics',
      category: 'Navigation',
      icon: BarChart3,
      badge: 'BKT Engine',
      action: () => { navigate('/analytics'); onClose(); },
    },
    {
      id: 'nav-profile',
      title: 'My Profile & Mastery',
      category: 'Navigation',
      icon: User,
      action: () => { navigate('/profile'); onClose(); },
    },
    {
      id: 'nav-library',
      title: 'Knowledge Library & Documents',
      category: 'Navigation',
      icon: BookOpen,
      action: () => { navigate('/library'); onClose(); },
    },
    {
      id: 'nav-notes',
      title: 'Research Notes & Insights',
      category: 'Navigation',
      icon: FileText,
      action: () => { navigate('/notes/new'); onClose(); },
    },
    {
      id: 'nav-search',
      title: 'Hybrid Vector Semantic Search',
      category: 'Navigation',
      icon: Search,
      badge: 'Vector 384d',
      action: () => { navigate('/search'); onClose(); },
    },
    {
      id: 'nav-assistant',
      title: 'Grounded AI Assistant & Research Chat',
      category: 'Navigation',
      icon: Sparkles,
      badge: 'RAG Citations',
      action: () => { navigate('/assistant'); onClose(); },
    },
    {
      id: 'nav-settings',
      title: 'Platform Settings & Export',
      category: 'Navigation',
      icon: Settings,
      action: () => { navigate('/settings'); onClose(); },
    },

    // Quick Actions
    {
      id: 'act-ask-ai',
      title: 'Ask AI Grounded Question...',
      category: 'Quick Actions',
      icon: Sparkles,
      badge: 'RAG',
      action: () => { navigate('/assistant'); onClose(); },
    },
    {
      id: 'act-practice',
      title: 'Start Daily Retrieval Practice',
      category: 'Quick Actions',
      icon: Zap,
      badge: 'High Impact',
      action: () => { navigate('/practice'); onClose(); },
    },
    {
      id: 'act-new-note',
      title: 'Draft New Research Note',
      category: 'Quick Actions',
      icon: FileText,
      badge: 'Editor',
      action: () => { navigate('/notes/new'); onClose(); },
    },

    // Concepts
    {
      id: 'c-transformer',
      title: 'Transformer Attention Mechanism',
      category: 'Concepts',
      icon: Sparkles,
      badge: 'ML · 92%',
      action: () => { navigate('/dashboard'); onClose(); },
    },
    {
      id: 'c-bkt',
      title: 'Bayesian Knowledge Tracing (BKT)',
      category: 'Concepts',
      icon: Network,
      badge: 'Math · 74%',
      action: () => { navigate('/dashboard'); onClose(); },
    },
    {
      id: 'c-sm2',
      title: 'SuperMemo-2 Spaced Repetition',
      category: 'Concepts',
      icon: Clock,
      badge: 'CogSci · 88%',
      action: () => { navigate('/dashboard'); onClose(); },
    },
    {
      id: 'c-svd',
      title: 'Singular Value Decomposition (SVD)',
      category: 'Concepts',
      icon: BookOpen,
      badge: 'Math · 65%',
      action: () => { navigate('/dashboard'); onClose(); },
    },
  ];

  const filtered = commands.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled outside or via trigger
        }
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-primary-text/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl glass-card p-0 shadow-2xl border border-primary/20 overflow-hidden rounded-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-muted-border/60 bg-white/90">
          <Search className="w-5 h-5 text-muted mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, concept, or search..."
            className="w-full bg-transparent text-sm text-primary-text placeholder:text-muted focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-semibold text-muted bg-surface-secondary border border-muted-border rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted">
              No results found for "{query}".
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                    isSelected ? 'bg-primary text-white' : 'text-primary-text hover:bg-surface-secondary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-surface-secondary text-primary'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-medium block">{item.title}</span>
                      <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-muted'}`}>
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-primary-light text-primary'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-white/80" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-muted-border/40 bg-surface-secondary/50 flex items-center justify-between text-[11px] text-muted">
          <span>Navigate with <kbd className="font-semibold text-primary-text">↑</kbd> <kbd className="font-semibold text-primary-text">↓</kbd></span>
          <span>Select with <kbd className="font-semibold text-primary-text">↵</kbd></span>
        </div>
      </div>
    </div>
  );
};
