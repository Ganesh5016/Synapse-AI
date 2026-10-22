import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  FileText, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Compass,
  Quote
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

interface SearchResultItem {
  id: string;
  document_id: string;
  document_title: string;
  chunk_index: number;
  page_number: number;
  content: string;
  similarity: number;
  subject: string;
}

const SAMPLE_RESULTS: SearchResultItem[] = [
  {
    id: 'c1',
    document_id: 'd1',
    document_title: 'Attention Is All You Need (Vaswani et al.)',
    chunk_index: 2,
    page_number: 4,
    content: 'An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key.',
    similarity: 0.942,
    subject: 'Machine Learning & AI',
  },
  {
    id: 'c2',
    document_id: 'd1',
    document_title: 'Attention Is All You Need (Vaswani et al.)',
    chunk_index: 3,
    page_number: 4,
    content: 'We compute the matrix of outputs as: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V. We compute the dot products of the query with all keys, divide each by sqrt(d_k), and apply a softmax function to obtain the weights on the values.',
    similarity: 0.915,
    subject: 'Machine Learning & AI',
  },
  {
    id: 'c3',
    document_id: 'd2',
    document_title: 'Bayesian Knowledge Tracing & Cognitive Mastery',
    chunk_index: 1,
    page_number: 2,
    content: 'Bayesian Knowledge Tracing models student learning as a Hidden Markov Model. The latent state represents whether a skill has been acquired, with transition probabilities P(T), slip parameter P(S), and guess parameter P(G).',
    similarity: 0.812,
    subject: 'Cognitive Science',
  },
  {
    id: 'c4',
    document_id: 'd3',
    document_title: 'Linear Algebra and Learning from Data (Strang)',
    chunk_index: 5,
    page_number: 18,
    content: 'Singular Value Decomposition (SVD) factors any matrix A into U Sigma V^T. The singular values in Sigma reflect the energy distribution along orthogonal principal axes, providing optimal low-rank matrix approximations.',
    similarity: 0.774,
    subject: 'Mathematics & Statistics',
  },
];

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('attention mechanism formula');
  const [threshold, setThreshold] = useState<number>(0.70);
  const [matchCount, setMatchCount] = useState<number>(5);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const subjects = [
    'All',
    'Machine Learning & AI',
    'Mathematics & Statistics',
    'Cognitive Science',
    'Computer Systems & Architecture',
  ];

  const filteredResults = SAMPLE_RESULTS.filter((r) => {
    const matchesSubject = selectedSubject === 'All' || r.subject === selectedSubject;
    const matchesThreshold = r.similarity >= threshold;
    const matchesQuery = query.trim() === '' || 
      r.content.toLowerCase().includes(query.toLowerCase()) ||
      r.document_title.toLowerCase().includes(query.toLowerCase());
    return matchesSubject && matchesThreshold && matchesQuery;
  }).slice(0, matchCount);

  const handleCopyCitation = (item: SearchResultItem) => {
    const citationText = `"[${item.content}]" — ${item.document_title}, Page ${item.page_number} (Chunk #${item.chunk_index})`;
    navigator.clipboard.writeText(citationText);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 300);
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Search Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="w-4 h-4" />
          <span>Vector Semantic Engine</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-primary-text">
          Hybrid Semantic & Citation Search
        </h1>
        <p className="text-sm text-muted max-w-2xl">
          Retrieve vector-indexed document chunks with exact page citations, cosine similarity scores, and zero hallucination risk.
        </p>
      </div>

      {/* Main Search Input Form */}
      <form onSubmit={handleSearchSubmit} className="space-y-4">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-muted absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search concepts, equations, theorems (e.g. attention mechanism, SVD, BKT)..."
            className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white border border-muted-border/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-primary-text transition-all"
          />
          <div className="absolute right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                showFilters
                  ? 'bg-primary-light text-primary border-primary/30'
                  : 'bg-surface-secondary text-muted border-muted-border/60 hover:text-primary-text'
              }`}
              title="Filter Options"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSearching}>
              Search
            </Button>
          </div>
        </div>

        {/* Filter Drawer */}
        {showFilters && (
          <div className="glass-card p-5 rounded-2xl border border-muted-border/60 animate-in fade-in slide-in-from-top-2 duration-150 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Threshold Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-primary-text">Cosine Similarity Threshold</span>
                  <span className="px-2 py-0.5 rounded-md bg-primary-light text-primary font-bold">
                    {(threshold * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.30"
                  max="0.95"
                  step="0.05"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted">
                  <span>Broader (30%)</span>
                  <span>Balanced (70%)</span>
                  <span>Strict Exact (95%)</span>
                </div>
              </div>

              {/* Match Count Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-primary-text">Max Retrieved Chunks</span>
                  <span className="px-2 py-0.5 rounded-md bg-surface-secondary font-bold text-muted">
                    {matchCount} chunks
                  </span>
                </div>
                <div className="flex gap-2">
                  {[3, 5, 10, 15].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setMatchCount(cnt)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        matchCount === cnt
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-white border-muted-border text-muted hover:border-primary/40'
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Subject Filters */}
            <div className="pt-2 border-t border-muted-border/40">
              <span className="text-xs font-semibold text-primary-text block mb-2">Subject Domain</span>
              <div className="flex flex-wrap gap-2">
                {subjects.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubject(sub)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedSubject === sub
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-surface-secondary text-muted hover:text-primary-text'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Suggested Search Queries */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-muted text-[11px] font-medium flex-shrink-0">Try queries:</span>
        {[
          'Self-attention equation',
          'Singular Value Decomposition low-rank',
          'Bayesian Knowledge Tracing slip parameter',
          'SuperMemo-2 spaced interval',
        ].map((suggested) => (
          <button
            key={suggested}
            onClick={() => setQuery(suggested)}
            className="px-2.5 py-1 rounded-lg bg-surface-secondary hover:bg-primary-light hover:text-primary text-muted transition-colors flex-shrink-0 text-[11px]"
          >
            "{suggested}"
          </button>
        ))}
      </div>

      {/* Search Metrics Bar */}
      <div className="flex items-center justify-between text-xs text-muted px-1">
        <div>
          Showing <span className="font-semibold text-primary-text">{filteredResults.length}</span> grounded chunks
          {selectedSubject !== 'All' && <span> in <strong className="text-primary">{selectedSubject}</strong></span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> 18 ms inference latency
          </span>
          <span className="flex items-center gap-1 text-success font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> pgvector 384-dim
          </span>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredResults.length === 0 ? (
          <div className="text-center py-16 bg-white/60 rounded-2xl border border-dashed border-muted-border p-8">
            <div className="w-12 h-12 rounded-2xl bg-surface-secondary text-muted mx-auto flex items-center justify-center mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-primary-text mb-1">No matching chunks above threshold</h3>
            <p className="text-xs text-muted max-w-sm mx-auto mb-4">
              Try lowering the similarity threshold slider or expanding your query scope.
            </p>
            <Button variant="secondary" size="sm" onClick={() => setThreshold(0.40)}>
              Lower Threshold to 40%
            </Button>
          </div>
        ) : (
          filteredResults.map((result) => {
            const similarityPercent = Math.round(result.similarity * 100);
            return (
              <div
                key={result.id}
                className="glass-card p-6 rounded-2xl border border-muted-border/70 hover:border-primary/40 hover:shadow-md transition-all space-y-4"
              >
                {/* Result Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-light text-primary flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      {result.document_title}
                    </span>
                    <Badge variant="outline">Page {result.page_number}</Badge>
                    <Badge variant="outline">Chunk #{result.chunk_index}</Badge>
                  </div>

                  {/* Similarity Score Pill */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted font-medium">Similarity:</span>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-success-light text-success text-xs font-bold">
                      <Sparkles className="w-3 h-3" />
                      {similarityPercent}% match
                    </div>
                  </div>
                </div>

                {/* Chunk Excerpt */}
                <div className="p-4 rounded-xl bg-surface-secondary/50 border border-muted-border/40 text-xs text-primary-text leading-relaxed font-serif relative">
                  <Quote className="w-4 h-4 text-muted/40 absolute -top-2 -left-2 transform -scale-x-100" />
                  "{result.content}"
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-muted-border/40 text-xs">
                  <span className="text-[11px] text-muted">{result.subject}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyCitation(result)}
                    >
                      {copiedId === result.id ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-success mr-1.5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Quote className="w-3.5 h-3.5 mr-1.5 text-muted" />
                          Copy Citation
                        </>
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate('/notes/new')}
                    >
                      <FileText className="w-3.5 h-3.5 mr-1.5 text-primary" />
                      Insert into Note
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/assistant?q=${encodeURIComponent(`Explain this passage from ${result.document_title}: "${result.content.slice(0, 100)}..."`)}`)}
                      className="text-xs text-primary hover:bg-primary-light/40"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5 text-primary" />
                      Ask AI
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
