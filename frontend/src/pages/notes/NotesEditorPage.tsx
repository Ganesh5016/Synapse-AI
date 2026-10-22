import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Pin, 
  Sparkles, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Tag, 
  Plus, 
  X, 
  Layers, 
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

const SAMPLE_MARKDOWN = `# Transformer Attention Mechanisms

Attention mechanisms compute a weighted representation of inputs based on query-key compatibility.

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

## Key Conceptual Pillars
1. **Query ($Q$)**: The token seeking relevant context from previous sequence steps.
2. **Key ($K$)**: The representation of target candidate tokens.
3. **Value ($V$)**: The extracted feature content scaled by attention weights.
4. **Scaling factor $\\frac{1}{\\sqrt{d_k}}$**: Mitigates extremely small gradients in large dimensionality.

\`\`\`python
import torch
import torch.nn.functional as F

def scaled_dot_product_attention(q, k, v, mask=None):
    d_k = q.size(-1)
    scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(d_k)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    weights = F.softmax(scores, dim=-1)
    return torch.matmul(weights, v), weights
\`\`\`

## Prerequisite Dependencies
- Linear Algebra: Matrix Transposition & Dot Products
- Probability: Softmax Normalization
`;

export const NotesEditorPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('Transformer Attention Mechanisms & Scaling');
  const [content, setContent] = useState(SAMPLE_MARKDOWN);
  const [subjectId, setSubjectId] = useState('a0000000-0000-0000-0000-000000000001');
  const [isPinned, setIsPinned] = useState(true);
  const [tags, setTags] = useState<string[]>(['machine-learning', 'transformers', 'attention', 'nlp']);
  const [newTagInput, setNewTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // AI Prompt Modal / Feedback
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  // Compute word count
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  // Simulated autosave on content edit
  useEffect(() => {
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      setSaveStatus('saved');
    }, 800);
    return () => clearTimeout(timer);
  }, [content, title, tags, subjectId, isPinned]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault();
      const clean = newTagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAiAction = (action: string) => {
    setAiMessage(`AI ${action}: Scanning note content and extracting semantic components...`);
    setTimeout(() => {
      if (action === 'Extract Concepts') {
        setAiMessage('Extracted 3 Concepts: "Self-Attention", "Dot-Product Scaling", and "Multi-Head Attention". Linked to your Knowledge Graph!');
      } else if (action === 'Generate Flashcards') {
        setAiMessage('Generated 4 SM-2 Spaced Flashcards targeting your formula derivations. Added to queue!');
      } else {
        setAiMessage('Key Takeaways synthesized: Query-key dot products compute weights; sqrt(d_k) prevents vanishing gradients.');
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-muted-border/60">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard?tab=library"
            className="p-2 rounded-xl text-muted hover:text-primary hover:bg-surface-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-primary">Markdown Research Note</span>
              <span className="text-muted">•</span>
              <span className="text-[11px] text-muted flex items-center gap-1">
                {saveStatus === 'saved' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" /> Autosaved
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-warning animate-spin" /> Saving...
                  </>
                )}
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl sm:text-2xl font-bold text-primary-text bg-transparent border-none focus:outline-none w-full"
              placeholder="Note Title..."
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Pin toggle */}
          <button
            onClick={() => setIsPinned(!isPinned)}
            className={`p-2 rounded-xl border transition-colors ${
              isPinned
                ? 'border-primary bg-primary-light text-primary'
                : 'border-muted-border glass-panel text-muted hover:text-primary'
            }`}
            title={isPinned ? 'Pinned Note' : 'Pin Note'}
          >
            <Pin className="w-4 h-4" />
          </button>

          {/* Toggle Preview Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="hidden md:inline-flex items-center gap-1.5"
          >
            {showPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Editor Only' : 'Split Preview'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/dashboard?tab=library')}
            className="shadow-sm"
          >
            Done
          </Button>
        </div>
      </div>

      {/* Meta Bar: Subject & Tags */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl glass-panel">
        <div className="flex items-center gap-3">
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="glass-input px-3 py-1.5 text-xs text-primary-text font-semibold focus:outline-none"
          >
            <option value="a0000000-0000-0000-0000-000000000001">Machine Learning & AI</option>
            <option value="a0000000-0000-0000-0000-000000000002">Computer Systems & Architecture</option>
            <option value="a0000000-0000-0000-0000-000000000003">Mathematics & Statistics</option>
            <option value="a0000000-0000-0000-0000-000000000004">Data Structures & Algorithms</option>
            <option value="a0000000-0000-0000-0000-000000000005">Cognitive Science & Psychology</option>
          </select>

          {/* Tag List */}
          <div className="flex flex-wrap items-center gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-lg bg-surface-secondary text-primary font-medium border border-muted-border/60"
              >
                #{tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-error text-muted ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="+ add tag (Enter)"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="bg-transparent text-xs text-primary-text placeholder:text-muted/60 focus:outline-none px-2 py-0.5 w-28"
            />
          </div>
        </div>

        <div className="text-xs text-muted">
          <span>{words} Words</span> • <span>{readingTime} min read</span>
        </div>
      </div>

      {/* AI Action Quick Bar */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-primary-light/40 via-white to-accent-light/30 border border-primary/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-accent text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-primary-text">AI Cognitive Actions:</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAiAction('Extract Concepts')}
            className="px-3 py-1 rounded-xl text-xs font-semibold bg-white text-primary border border-primary/30 hover:bg-primary-light/40 transition-colors"
          >
            Extract Concepts
          </button>
          <button
            onClick={() => handleAiAction('Generate Flashcards')}
            className="px-3 py-1 rounded-xl text-xs font-semibold bg-white text-accent border border-accent/30 hover:bg-accent-light/40 transition-colors"
          >
            Generate Flashcards
          </button>
          <button
            onClick={() => handleAiAction('Summarize Key Takeaways')}
            className="px-3 py-1 rounded-xl text-xs font-semibold bg-white text-success border border-success/30 hover:bg-success-light/40 transition-colors"
          >
            Summarize Note
          </button>
          <button
            onClick={() => navigate(`/assistant?q=${encodeURIComponent(`Explain key concepts from note: ${title}`)}`)}
            className="px-3 py-1 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover transition-colors shadow-2xs"
          >
            Chat with AI
          </button>
        </div>
      </div>

      {aiMessage && (
        <div className="p-3 rounded-xl bg-primary-light/50 border border-primary/30 flex items-center justify-between text-xs text-primary font-medium animate-in fade-in">
          <span>{aiMessage}</span>
          <button onClick={() => setAiMessage(null)} className="text-primary hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editor & Live Preview (Split View) */}
      <div className={`grid gap-6 ${showPreview ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Editor Pane */}
        <Card className="p-4 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between pb-2 border-b border-muted-border/60 mb-2 text-xs text-muted font-mono">
            <span>Markdown Input</span>
            <span>Supports LaTeX: $$E=mc^2$$</span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full flex-1 bg-transparent border-none text-sm font-mono text-primary-text leading-relaxed resize-none focus:outline-none"
            placeholder="Type your notes in Markdown..."
          />
        </Card>

        {/* Live Preview Pane */}
        {showPreview && (
          <Card className="p-6 overflow-y-auto max-h-[650px] bg-white/95">
            <div className="flex items-center justify-between pb-2 border-b border-muted-border/60 mb-4 text-xs text-muted">
              <span className="font-semibold text-primary">Formatted Preview</span>
              <span>Rendered with Typography & Math</span>
            </div>

            <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-4">
              {/* Simple rendered blocks demonstration */}
              <h1 className="text-2xl font-bold text-primary-text">{title}</h1>
              <p className="text-muted leading-relaxed">
                Attention mechanisms compute a weighted representation of inputs based on query-key compatibility.
              </p>

              <div className="p-4 rounded-xl bg-surface-secondary/70 border border-muted-border font-mono text-center text-primary text-sm my-4">
                Attention(Q, K, V) = softmax( (QKᵀ) / √dₖ ) V
              </div>

              <h2 className="text-lg font-bold text-primary-text mt-4">Key Conceptual Pillars</h2>
              <ul className="list-disc pl-5 space-y-1 text-primary-text">
                <li><strong>Query (Q)</strong>: The token seeking relevant context from previous sequence steps.</li>
                <li><strong>Key (K)</strong>: The representation of target candidate tokens.</li>
                <li><strong>Value (V)</strong>: The extracted feature content scaled by attention weights.</li>
                <li><strong>Scaling factor 1/√dₖ</strong>: Mitigates vanishing gradients in large dimensionality.</li>
              </ul>

              <h2 className="text-lg font-bold text-primary-text mt-4">PyTorch Implementation Preview</h2>
              <pre className="p-4 rounded-xl bg-surface-secondary border border-muted-border text-xs font-mono overflow-x-auto text-primary-text">
{`import torch
import torch.nn.functional as F

def scaled_dot_product_attention(q, k, v, mask=None):
    d_k = q.size(-1)
    scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(d_k)
    weights = F.softmax(scores, dim=-1)
    return torch.matmul(weights, v), weights`}
              </pre>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
