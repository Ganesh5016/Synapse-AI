import React from 'react';
import { FileText, Layers, X, Calendar, Database, Shield, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface DocumentDetailModalProps {
  document: any;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  document,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !document) return null;

  // Mock chunks if viewing offline
  const sampleChunks = [
    {
      index: 0,
      page: 1,
      tokens: 64,
      content: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. We propose the Transformer, based solely on attention mechanisms.",
    },
    {
      index: 1,
      page: 3,
      tokens: 72,
      content: "An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values.",
    },
    {
      index: 2,
      page: 4,
      tokens: 58,
      content: "Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions. MultiHead(Q, K, V) = Concat(head_1, ..., head_h)W^O.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-primary-text/25 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl glass-card p-6 sm:p-8 rounded-3xl shadow-2xl border border-primary/20 z-10 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-muted-border/60 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-accent text-white flex items-center justify-center shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary-text">{document.title}</h3>
              <p className="text-xs text-muted">
                {document.page_count} Pages • {document.chunk_count || 12} Vector Chunks • {document.file_type?.toUpperCase()}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted hover:text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata info */}
        <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
          <div className="glass-panel p-2.5 rounded-xl text-center">
            <span className="text-muted block text-[10px] uppercase">Storage Status</span>
            <span className="font-semibold text-success flex items-center justify-center gap-1 mt-0.5">
              <Shield className="w-3 h-3" /> RLS Verified
            </span>
          </div>
          <div className="glass-panel p-2.5 rounded-xl text-center">
            <span className="text-muted block text-[10px] uppercase">Embedding Model</span>
            <span className="font-semibold text-primary mt-0.5 block truncate">all-MiniLM-L6-v2</span>
          </div>
          <div className="glass-panel p-2.5 rounded-xl text-center">
            <span className="text-muted block text-[10px] uppercase">Vector Dimension</span>
            <span className="font-semibold text-primary mt-0.5 block">384 Dimensions</span>
          </div>
        </div>

        {/* Chunks Explorer */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          <span className="text-xs font-bold text-primary uppercase tracking-wider block">
            Extracted Semantic Chunks & Citations
          </span>

          {sampleChunks.map((chunk) => (
            <div
              key={chunk.index}
              className="p-3.5 rounded-xl bg-white/90 border border-muted-border/70 text-xs space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between text-muted text-[11px]">
                <span className="font-semibold text-primary">Chunk #{chunk.index + 1}</span>
                <span>Page {chunk.page} • ~{chunk.tokens} Tokens</span>
              </div>
              <p className="text-primary-text leading-relaxed font-sans">{chunk.content}</p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-muted-border/60 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Inspector
          </Button>
        </div>
      </div>
    </div>
  );
};
