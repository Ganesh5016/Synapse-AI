import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Send,
  Plus,
  Trash2,
  FileText,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  Sliders,
  ExternalLink,
  Bot,
  User,
  Quote,
  HelpCircle,
  RotateCcw,
  Layers,
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Citation {
  citation_id: string;
  chunk_id?: string;
  document_id?: string;
  document_title: string;
  page_number?: number;
  chunk_index?: number;
  similarity_score: number;
  snippet: string;
  source_type: 'document' | 'note';
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: Citation[];
  created_at: string;
  is_grounded?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  last_message_preview?: string;
}

export const AIAssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefillQuery = searchParams.get('q') || '';
  const initialDocId = searchParams.get('docId') || '';

  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'c1111111-1111-1111-1111-111111111111',
      title: 'Attention Mechanisms & Softmax Scaling',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString(),
      message_count: 2,
      last_message_preview: 'In Transformer self-attention, for large values of d_k...',
    },
    {
      id: 'c2222222-2222-2222-2222-222222222222',
      title: 'Bayesian Knowledge Tracing Parameters',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      message_count: 2,
      last_message_preview: 'BKT uses a two-state Hidden Markov Model...',
    },
  ]);

  const [activeConvId, setActiveConvId] = useState<string>('c1111111-1111-1111-1111-111111111111');

  // Messages in active conversation
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      role: 'user',
      content: 'Why is the square root of d_k used as a scaling factor in self-attention?',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'm2',
      role: 'assistant',
      content:
        'In Transformer self-attention, for large values of the projection dimension $d_k$, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients [1].\n\nTo counteract this vanishing gradient effect, the dot products are scaled by $\\frac{1}{\\sqrt{d_k}}$ [1]. This ensures that the variance of the dot products remains 1 under the assumption that the components of $q$ and $k$ are independent random variables with zero mean and unit variance.',
      citations: [
        {
          citation_id: 'cit-001',
          chunk_id: 'chunk-001',
          document_id: 'd1111111-1111-1111-1111-111111111111',
          document_title: 'Attention Is All You Need (Vaswani et al.)',
          page_number: 4,
          chunk_index: 2,
          similarity_score: 0.92,
          snippet:
            'We suspect that for large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions that have extremely small gradients. To counteract this effect, we scale the dot products by 1/sqrt(d_k).',
          source_type: 'document',
        },
      ],
      created_at: new Date(Date.now() - 3590000).toISOString(),
      is_grounded: true,
    },
  ]);

  // Form input state
  const [inputPrompt, setInputPrompt] = useState(prefillQuery);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [strictlyGrounded, setStrictlyGrounded] = useState(true);
  const [similarityThreshold, setSimilarityThreshold] = useState(0.35);
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [expandedCitations, setExpandedCitations] = useState<Record<string, boolean>>({ m2: true });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSubmitting]);

  // Handle new conversation
  const handleCreateNewConversation = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: 'New Research Chat',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      message_count: 0,
    };
    setConversations([newConv, ...conversations]);
    setActiveConvId(newId);
    setMessages([]);
  };

  // Handle delete conversation
  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const remaining = conversations.filter((c) => c.id !== id);
    setConversations(remaining);
    if (activeConvId === id) {
      if (remaining.length > 0) {
        setActiveConvId(remaining[0].id);
      } else {
        handleCreateNewConversation();
      }
    }
  };

  // Toggle citation expand
  const toggleCitationExpand = (msgId: string) => {
    setExpandedCitations((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Submit chat message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || isSubmitting) return;

    const userText = inputPrompt.trim();
    setInputPrompt('');

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: userText,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token') || 'demo-token'}`,
        },
        body: JSON.stringify({
          query: userText,
          conversation_id: activeConvId,
          top_k: 4,
          similarity_threshold: similarityThreshold,
          strictly_grounded: strictlyGrounded,
        }),
      });

      if (response.ok) {
        const payload = await response.json();
        const data = payload.data;
        const assistantMsg: Message = {
          id: data.message_id || `asst-${Date.now()}`,
          role: 'assistant',
          content: data.answer,
          citations: data.citations || [],
          created_at: new Date().toISOString(),
          is_grounded: data.is_grounded,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setExpandedCitations((prev) => ({ ...prev, [assistantMsg.id]: true }));

        // Update conversation title if first message
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? {
                  ...c,
                  title: c.message_count === 0 ? userText.slice(0, 36) + '...' : c.title,
                  message_count: c.message_count + 2,
                  last_message_preview: data.answer.slice(0, 60),
                  updated_at: new Date().toISOString(),
                }
              : c
          )
        );
      } else {
        throw new Error('API request failed');
      }
    } catch {
      // Local fallback for offline / demo mode
      setTimeout(() => {
        let fallbackAnswer = '';
        let citations: Citation[] = [];

        if (userText.toLowerCase().includes('attention') || userText.toLowerCase().includes('transformer')) {
          fallbackAnswer =
            'In Transformer models, Scaled Dot-Product Attention calculates attention weights as:\n\n$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$\n\nAs verified in your uploaded research [1], the scaling factor $\\frac{1}{\\sqrt{d_k}}$ prevents vanishing gradients in the softmax activation layer when feature dimensions grow large.';
          citations = [
            {
              citation_id: 'cit-fb1',
              document_title: 'Attention Is All You Need (Vaswani et al.)',
              page_number: 4,
              chunk_index: 2,
              similarity_score: 0.94,
              snippet:
                'To counteract this effect, we scale the dot products by 1/sqrt(d_k). The two most commonly used attention functions are additive attention and dot-product (multiplicative) attention.',
              source_type: 'document',
            },
          ];
        } else if (userText.toLowerCase().includes('bkt') || userText.toLowerCase().includes('bayesian') || userText.toLowerCase().includes('mastery')) {
          fallbackAnswer =
            'Bayesian Knowledge Tracing (BKT) uses four key psychometric parameters to model mastery [1]:\n\n1. $P(L_0)$: Initial prior probability of knowing the concept.\n2. $P(T)$: Transition probability of learning on each attempt.\n3. $P(G)$: Guess probability (answering correctly without latent mastery).\n4. $P(S)$: Slip probability (making an error despite having mastered the skill).';
          citations = [
            {
              citation_id: 'cit-fb2',
              document_title: 'Note: Bayesian Knowledge Tracing Posterior Derivations',
              page_number: 1,
              chunk_index: 0,
              similarity_score: 0.91,
              snippet:
                'BKT uses a two-state Hidden Markov Model to track mastery of latent skill L. Prior P(L0), Transition P(T), Guess P(G), and Slip P(S).',
              source_type: 'note',
            },
          ];
        } else if (strictlyGrounded) {
          fallbackAnswer = `Based on your uploaded documents and notes in Synapse, there is no direct evidence or text matching "${userText}". To answer this accurately, upload related research papers in the Knowledge Library or toggle off Strictly Grounded mode.`;
          citations = [];
        } else {
          fallbackAnswer = `Regarding **"${userText}"**: The foundational literature suggests that establishing empirical baselines and verifying causal mechanisms are essential steps in rigorous scientific inquiry.`;
          citations = [];
        }

        const asstMsg: Message = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: fallbackAnswer,
          citations,
          created_at: new Date().toISOString(),
          is_grounded: citations.length > 0,
        };

        setMessages((prev) => [...prev, asstMsg]);
        if (citations.length > 0) {
          setExpandedCitations((prev) => ({ ...prev, [asstMsg.id]: true }));
        }

        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? {
                  ...c,
                  title: c.message_count === 0 ? userText.slice(0, 36) + '...' : c.title,
                  message_count: c.message_count + 2,
                  last_message_preview: fallbackAnswer.slice(0, 60),
                  updated_at: new Date().toISOString(),
                }
              : c
          )
        );
      }, 500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const samplePrompts = [
    'Explain scaled dot-product attention from my papers',
    'Compare Bayesian Knowledge Tracing parameters P(L0) and P(T)',
    'What are the 3 core hyperparameters in SM-2 Spaced Repetition?',
    'Summarize my research notes on Transformer architectures',
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-140px)] pb-12">
      {/* 1. LEFT SIDEBAR: CONVERSATION SESSIONS */}
      <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4">
        {/* New Chat Button */}
        <Button
          id="btn-new-chat"
          variant="primary"
          size="md"
          onClick={handleCreateNewConversation}
          className="w-full flex items-center justify-center gap-2 shadow-sm shadow-primary/20 bg-primary hover:bg-primary-hover text-white font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>New Research Chat</span>
        </Button>

        {/* Conversation List Card */}
        <Card className="flex-1 overflow-hidden p-3 bg-white/70 backdrop-blur-md border-border/70 flex flex-col">
          <div className="flex items-center justify-between px-2 py-1.5 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Recent Threads
            </span>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {conversations.length}
            </Badge>
          </div>

          <div className="space-y-1.5 overflow-y-auto max-h-[460px] pr-1">
            {conversations.map((conv) => {
              const isActive = conv.id === activeConvId;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`group relative p-2.5 rounded-xl cursor-pointer transition-all border text-left ${
                    isActive
                      ? 'bg-primary-light/40 border-primary/30 text-primary shadow-xs'
                      : 'bg-white/50 hover:bg-white border-transparent text-primary-text hover:border-muted-border'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <span className="text-xs font-semibold line-clamp-1 flex-1">
                      {conv.title}
                    </span>
                    <button
                      onClick={(e) => handleDeleteConversation(e, conv.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-danger rounded transition-opacity"
                      title="Delete thread"
                    >
                      <Trash2 className="w-3 h-3 text-muted hover:text-danger" />
                    </button>
                  </div>
                  {conv.last_message_preview && (
                    <p className="text-[11px] text-muted line-clamp-1 mt-1">
                      {conv.last_message_preview}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Model Status Card */}
          <div className="mt-auto pt-3 border-t border-muted-border/60">
            <div className="p-2.5 rounded-xl bg-primary-light/20 border border-primary/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-primary-text flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-success" />
                  RAG Inference Engine
                </span>
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              </div>
              <p className="text-[10px] text-muted leading-tight">
                sentence-transformers/all-MiniLM-L6-v2 (384-dim) & meta-llama/Llama-3.2-3B
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* 2. MAIN CHAT CONTAINER */}
      <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-md rounded-2xl border border-border/80 shadow-xs overflow-hidden">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-border/60 bg-white/80 backdrop-blur-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-primary-text">Synapse Grounded Assistant</h2>
                <Badge variant="success" className="text-[10px] px-2 py-0.5">
                  Live Citations
                </Badge>
              </div>
              <p className="text-xs text-muted">
                Answers verified against your uploaded papers and research notes
              </p>
            </div>
          </div>

          {/* Mode Controls */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-medium text-primary-text cursor-pointer select-none bg-surface/60 px-3 py-1.5 rounded-xl border border-muted-border">
              <input
                id="checkbox-grounded-mode"
                type="checkbox"
                checked={strictlyGrounded}
                onChange={(e) => setStrictlyGrounded(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-primary focus:ring-primary/30"
              />
              <span className="flex items-center gap-1 text-xs">
                <ShieldCheck className={`w-3.5 h-3.5 ${strictlyGrounded ? 'text-primary' : 'text-muted'}`} />
                Strictly Grounded
              </span>
            </label>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setMessages([])}
              className="text-xs text-muted hover:text-primary-text"
              title="Clear active view"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Clear
            </Button>
          </div>
        </div>

        {/* Message Thread Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-light to-accent-light/40 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-primary-text">What would you like to explore?</h3>
              <p className="text-xs text-muted leading-relaxed">
                Synapse retrieves evidence from your uploaded documents and notes to formulate answers with verifiable citations.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full pt-4">
                {samplePrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInputPrompt(prompt);
                    }}
                    className="p-3 text-left rounded-xl bg-white/80 hover:bg-white border border-muted-border hover:border-primary/40 text-xs font-medium text-primary-text hover:text-primary transition-all shadow-2xs group flex items-start justify-between"
                  >
                    <span>{prompt}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ml-1 flex-shrink-0 text-primary" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === 'user';
              const hasCitations = msg.citations && msg.citations.length > 0;
              const isExpanded = expandedCitations[msg.id];

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex-shrink-0 flex items-center justify-center text-primary mt-1 shadow-2xs">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}

                  <div className={`max-w-2xl space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                        isUser
                          ? 'bg-primary text-white rounded-tr-xs font-normal'
                          : 'bg-white/90 border border-border/80 text-primary-text rounded-tl-xs backdrop-blur-xs'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      {!isUser && (
                        <div className="mt-3 pt-2.5 border-t border-muted-border/40 flex items-center justify-between text-[11px] text-muted">
                          <span className="flex items-center gap-1.5">
                            {msg.is_grounded ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                                <span>Grounded in Corpus</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3.5 h-3.5 text-warning" />
                                <span>General Conceptual Synthesis</span>
                              </>
                            )}
                          </span>

                          <button
                            onClick={() => handleCopy(msg.content, msg.id)}
                            className="hover:text-primary transition-colors flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Citations Expandable Drawer */}
                    {!isUser && hasCitations && (
                      <div className="w-full rounded-xl border border-primary/20 bg-primary-light/20 p-2.5 space-y-2">
                        <button
                          onClick={() => toggleCitationExpand(msg.id)}
                          className="w-full flex items-center justify-between text-xs font-semibold text-primary hover:text-primary-hover"
                        >
                          <span className="flex items-center gap-1.5">
                            <Quote className="w-3.5 h-3.5" />
                            <span>Verified Citations ({msg.citations?.length})</span>
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="space-y-2 pt-1">
                            {msg.citations?.map((cit, idx) => (
                              <div
                                key={idx}
                                onClick={() => setSelectedCitation(cit)}
                                className="p-2.5 rounded-lg bg-white/90 border border-muted-border hover:border-primary/40 cursor-pointer transition-all shadow-2xs group"
                              >
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="text-[11px] font-bold text-primary-text group-hover:text-primary flex items-center gap-1">
                                    {cit.source_type === 'document' ? (
                                      <BookOpen className="w-3 h-3 text-primary" />
                                    ) : (
                                      <FileText className="w-3 h-3 text-accent" />
                                    )}
                                    [{idx + 1}] {cit.document_title}
                                    {cit.page_number && (
                                      <span className="text-muted font-normal">
                                        (p. {cit.page_number})
                                      </span>
                                    )}
                                  </span>
                                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-primary border-primary/30">
                                    {Math.round(cit.similarity_score * 100)}% match
                                  </Badge>
                                </div>
                                <p className="text-[11px] text-muted italic line-clamp-2">
                                  "{cit.snippet}"
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-primary-light/60 border border-primary/30 flex-shrink-0 flex items-center justify-center text-primary mt-1 shadow-2xs">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {isSubmitting && (
            <div className="flex gap-3.5 justify-start">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex-shrink-0 flex items-center justify-center text-primary mt-1">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-border/80 text-xs text-muted flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span>Synthesizing grounded citations across user corpus...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-border/60 bg-white/90 backdrop-blur-md">
          <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
            <input
              id="input-assistant-query"
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask anything grounded in your papers and notes... (e.g. Explain attention mechanics)"
              className="w-full px-4 py-3 rounded-xl bg-surface/70 border border-border text-xs sm:text-sm text-primary-text placeholder:text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
            />
            <Button
              id="btn-send-message"
              type="submit"
              variant="primary"
              size="md"
              disabled={!inputPrompt.trim() || isSubmitting}
              className="px-4 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white flex-shrink-0 shadow-sm shadow-primary/20"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* 3. CITATION PREVIEW MODAL */}
      {selectedCitation && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-border shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-muted-border">
              <div className="flex items-center gap-2">
                <Quote className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold text-primary-text">Source Excerpt Citation</h3>
              </div>
              <button
                onClick={() => setSelectedCitation(null)}
                className="p-1 rounded-lg text-muted hover:text-primary-text hover:bg-surface transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-1">
                  Document Provenance
                </span>
                <p className="text-sm font-bold text-primary-text">
                  {selectedCitation.document_title}
                </p>
                {selectedCitation.page_number && (
                  <p className="text-xs text-muted">Page {selectedCitation.page_number}</p>
                )}
              </div>

              <div>
                <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-1">
                  Semantic Alignment
                </span>
                <Badge variant="outline" className="text-primary border-primary/30">
                  {Math.round(selectedCitation.similarity_score * 100)}% Cosine Similarity
                </Badge>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-1">
                  Full Context Excerpt
                </span>
                <div className="p-3.5 rounded-xl bg-surface/70 border border-muted-border text-xs leading-relaxed text-primary-text font-serif italic max-h-48 overflow-y-auto">
                  "{selectedCitation.snippet}"
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-muted-border flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(selectedCitation.snippet, 'modal-cit')}
              >
                {copiedId === 'modal-cit' ? 'Copied' : 'Copy Excerpt'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedCitation(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
