import React, { useState } from 'react';
import { Search, HelpCircle, Plus, Minus, BookOpen, Shield, Cpu, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

interface FAQItem {
  q: string;
  a: string;
  category: 'General' | 'Science & Math' | 'Privacy & Security' | 'AI & Inference';
}

export const FAQPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      category: 'General',
      q: 'What formats can I upload to Synapse?',
      a: 'Synapse natively supports PDF textbooks, research papers, Markdown (.md) notes, and plain text files. Uploaded files are automatically processed, chunked, and embedded into pgvector.',
    },
    {
      category: 'General',
      q: 'Can I export my study materials and flashcards?',
      a: 'Yes. You can export your flashcards and mastery telemetry at any time to standard JSON or CSV format from your Settings page.',
    },
    {
      category: 'Science & Math',
      q: 'How does the mastery probability score work?',
      a: 'Your mastery score is not a percentage of correct answers. Instead, it is the posterior probability calculated via Bayesian Knowledge Tracing (BKT) that you have mastered the underlying skill component, accounting for lucky guesses and accidental slips.',
    },
    {
      category: 'Science & Math',
      q: 'What is the SM-2 algorithm?',
      a: 'SM-2 (SuperMemo-2) is a spaced repetition scheduling algorithm that calculates the optimal time interval to review a concept based on difficulty ratings, minimizing time spent while guaranteeing ~90% recall retention.',
    },
    {
      category: 'Privacy & Security',
      q: 'Are my notes used to train public AI models?',
      a: 'Never. Synapse enforces a strict zero-training policy on all user documents and notes. Your private knowledge remains private.',
    },
    {
      category: 'Privacy & Security',
      q: 'How does PostgreSQL Row-Level Security protect my data?',
      a: 'Every database query in Supabase executes with the authenticated user JWT context. Even if a raw SQL query were triggered, the PostgreSQL engine itself blocks access to rows not belonging to your user ID.',
    },
    {
      category: 'AI & Inference',
      q: 'Which AI models power Synapse?',
      a: 'Synapse utilizes top-tier Hugging Face hosted models for vector embeddings (such as all-MiniLM-L6-v2) and causal language modeling for grounded question generation and semantic synthesis.',
    },
    {
      category: 'AI & Inference',
      q: 'What happens if an AI response is questionable?',
      a: 'Every AI response in Synapse includes explicit source citations pointing to the exact document chunk and page. You can click any citation to view the source text and verify the facts immediately.',
    },
  ];

  const categories = ['All', 'General', 'Science & Math', 'Privacy & Security', 'AI & Inference'];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = faq.q.toLowerCase().includes(search.toLowerCase()) || 
                          faq.a.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge variant="primary">Help & Knowledge Base</Badge>
        <h1 className="text-4xl font-extrabold text-primary-text tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-muted text-base max-w-xl mx-auto">
          Everything you need to know about Synapse, our cognitive models, and data security.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl mx-auto">
        <Search className="w-5 h-5 text-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search questions or keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="glass-input w-full pl-12 pr-4 py-3 text-sm focus:outline-none"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-primary text-white shadow-sm'
                : 'glass-panel text-muted hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 text-muted text-sm">
            No questions found matching "{search}". Try another query!
          </div>
        ) : (
          filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="glass-card rounded-2xl p-6 cursor-pointer border border-muted-border/80 transition-all hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-surface-secondary text-primary">
                      {faq.category}
                    </span>
                    <h4 className="text-base font-semibold text-primary-text">{faq.q}</h4>
                  </div>
                  <div className="text-muted ml-4">
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </div>
                {isOpen && (
                  <p className="text-sm text-muted mt-4 pl-2 leading-relaxed border-t border-muted-border/40 pt-4">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
