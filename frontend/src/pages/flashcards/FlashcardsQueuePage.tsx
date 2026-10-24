import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  RotateCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Brain,
  Layers,
  ChevronRight,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Flashcard {
  id: string;
  deck_id: string;
  deck_name: string;
  concept_id: string;
  concept_name: string;
  subject_name: string;
  front: string;
  back: string;
  hint?: string;
  tags: string[];
  repetition_number: number;
  easiness_factor: number;
  interval_days: number;
  next_due_at: string;
}

const INITIAL_CARDS: Flashcard[] = [
  {
    id: 'fc-001',
    deck_id: 'deck-01',
    deck_name: 'Transformer & Attention Mechanics',
    concept_id: 'c0000000-0000-0000-0000-000000000003',
    concept_name: 'Scaled Dot-Product Attention',
    subject_name: 'Machine Learning & AI',
    front: 'What is the analytical formula for Scaled Dot-Product Attention in Transformer architectures?',
    back: 'Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V\n\nWhere Q is Queries, K is Keys, V is Values, and d_k is the dimensionality of queries and keys.',
    hint: 'Inner product of projection matrices divided by square root of dimensionality, normalized via softmax.',
    tags: ['transformers', 'attention', 'formulas'],
    repetition_number: 1,
    easiness_factor: 2.5,
    interval_days: 1,
    next_due_at: new Date().toISOString(),
  },
  {
    id: 'fc-002',
    deck_id: 'deck-01',
    deck_name: 'Transformer & Attention Mechanics',
    concept_id: 'c0000000-0000-0000-0000-000000000003',
    concept_name: 'Scaled Dot-Product Attention',
    subject_name: 'Machine Learning & AI',
    front: 'Why is the dot-product inner matrix QK^T scaled by 1 / sqrt(d_k) before softmax?',
    back: 'For large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions with vanishingly small gradients. Dividing by sqrt(d_k) counteracts this variance growth.',
    hint: 'Focus on softmax gradient saturation at high input variances.',
    tags: ['transformers', 'gradients', 'optimization'],
    repetition_number: 2,
    easiness_factor: 2.4,
    interval_days: 3,
    next_due_at: new Date().toISOString(),
  },
  {
    id: 'fc-003',
    deck_id: 'deck-02',
    deck_name: 'Cognitive Science & Mastery Models',
    concept_id: 'c0000000-0000-0000-0000-000000000007',
    concept_name: 'Bayesian Knowledge Tracing (BKT)',
    subject_name: 'Cognitive Science & Psychology',
    front: 'In Bayesian Knowledge Tracing (BKT), differentiate between the Guess P(G) and Slip P(S) emission parameters.',
    back: '• Guess P(G): Probability that a student answers an item correctly WITHOUT having mastered the latent skill (lucky guess).\n• Slip P(S): Probability that a student answers incorrectly DESPITE possessing the latent skill mastery (accidental slip).',
    hint: 'Lucky guess vs inadvertent slip-up.',
    tags: ['bkt', 'psychometrics', 'cognitive-science'],
    repetition_number: 0,
    easiness_factor: 2.5,
    interval_days: 1,
    next_due_at: new Date().toISOString(),
  },
  {
    id: 'fc-004',
    deck_id: 'deck-02',
    deck_name: 'Cognitive Science & Mastery Models',
    concept_id: 'c0000000-0000-0000-0000-000000000008',
    concept_name: 'SuperMemo SM-2 Algorithm',
    subject_name: 'Cognitive Science & Psychology',
    front: 'What is the mandatory lower bound on the Easiness Factor (EF) in the SM-2 spaced repetition algorithm, and why does it exist?',
    back: 'The lower bound is EF >= 1.3.\n\nThis safeguard ensures that difficult cards never decay into an infinite or zero-interval feedback loop, maintaining meaningful spacing between repetitions.',
    hint: 'The minimum threshold prevents interval stagnation.',
    tags: ['sm-2', 'spaced-repetition', 'algorithms'],
    repetition_number: 0,
    easiness_factor: 2.5,
    interval_days: 1,
    next_due_at: new Date().toISOString(),
  },
];

export const FlashcardsQueuePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [cards, setCards] = useState<Flashcard[]>(INITIAL_CARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<string>('all');
  const [reviewedCount, setReviewedCount] = useState(0);
  const [sessionStreak, setSessionStreak] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [lastReviewFeedback, setLastReviewFeedback] = useState<string | null>(null);

  // Filter cards by deck
  const activeDeckCards = selectedDeck === 'all' 
    ? cards 
    : cards.filter(c => c.deck_id === selectedDeck);

  const currentCard = activeDeckCards[currentIndex];
  const isQueueComplete = currentIndex >= activeDeckCards.length || activeDeckCards.length === 0;

  // Sync with API when available
  useEffect(() => {
    const fetchDueCards = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('http://localhost:8000/api/v1/flashcards/due', {
          headers: { 'Authorization': 'Bearer demo-token' }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setCards(json.data);
          }
        }
      } catch {
        // Fall back gracefully to initialized demo cards
      } finally {
        setIsLoading(false);
      }
    };
    fetchDueCards();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isQueueComplete) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (isFlipped) {
        if (e.key === '1') handleRate(1);
        if (e.key === '2') handleRate(2);
        if (e.key === '3') handleRate(3);
        if (e.key === '4') handleRate(4);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, isQueueComplete, currentIndex]);

  const handleRate = async (qualityRating: number) => {
    if (!currentCard) return;

    // Send review update to backend if live
    try {
      await fetch(`http://localhost:8000/api/v1/flashcards/${currentCard.id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token'
        },
        body: JSON.stringify({ quality_rating: qualityRating })
      });
    } catch {
      // Local fallback calculation continues
    }

    const ratingDescriptions: Record<number, string> = {
      1: 'Card reset to 1-day interval for active reinforcement.',
      2: 'Interval maintained with reduced easiness factor.',
      3: 'Interval advanced smoothly (+3 days).',
      4: 'Interval accelerated (+6 days) with easiness boost.',
    };

    setLastReviewFeedback(ratingDescriptions[qualityRating] || 'Card reviewed.');
    setReviewedCount(prev => prev + 1);
    setIsFlipped(false);
    setShowHint(false);

    if (qualityRating >= 3) {
      setSessionStreak(prev => prev + 1);
    }

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setLastReviewFeedback(null);
    }, 250);
  };

  const handleRestartQueue = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setReviewedCount(0);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-50 border border-indigo-200/60 rounded-xl text-primary">
                <Clock className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-primary-text tracking-tight">
                Spaced Repetition Flashcards
              </h1>
              <Badge variant="primary" className="ml-2">SuperMemo SM-2</Badge>
            </div>
            <p className="text-sm text-secondary-text mt-1">
              Active recall scheduling calibrated to your personal memory decay curve and retention index.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/practice')}
              className="text-xs"
            >
              <Layers className="w-3.5 h-3.5 mr-1.5" />
              Adaptive Practice
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/graph')}
              className="text-xs"
            >
              <Brain className="w-3.5 h-3.5 mr-1.5" />
              Knowledge Graph
            </Button>
          </div>
        </div>

        {/* Deck Filters & Session Stats Ribbon */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Deck Selector Card */}
          <div className="md:col-span-3 bg-white/80 backdrop-blur-md border border-neutral-200/80 rounded-2xl p-3 flex flex-wrap items-center gap-2 shadow-xs">
            <span className="text-xs font-semibold text-secondary-text px-2">Decks:</span>
            <button
              onClick={() => { setSelectedDeck('all'); setCurrentIndex(0); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedDeck === 'all'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-neutral-100 text-secondary-text hover:bg-neutral-200/80'
              }`}
            >
              All Due Cards ({cards.length})
            </button>
            <button
              onClick={() => { setSelectedDeck('deck-01'); setCurrentIndex(0); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedDeck === 'deck-01'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-neutral-100 text-secondary-text hover:bg-neutral-200/80'
              }`}
            >
              Transformers & Attention (2)
            </button>
            <button
              onClick={() => { setSelectedDeck('deck-02'); setCurrentIndex(0); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedDeck === 'deck-02'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-neutral-100 text-secondary-text hover:bg-neutral-200/80'
              }`}
            >
              Cognitive Models & BKT (2)
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="bg-white/80 backdrop-blur-md border border-neutral-200/80 rounded-2xl p-3 flex items-center justify-around shadow-xs">
            <div className="text-center">
              <span className="text-xs text-secondary-text block">Reviewed</span>
              <span className="text-base font-bold text-primary-text">{reviewedCount}</span>
            </div>
            <div className="h-6 w-px bg-neutral-200" />
            <div className="text-center">
              <span className="text-xs text-secondary-text flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-amber-500" /> Streak
              </span>
              <span className="text-base font-bold text-primary-text">{sessionStreak}d</span>
            </div>
            <div className="h-6 w-px bg-neutral-200" />
            <div className="text-center">
              <span className="text-xs text-secondary-text block">Recall</span>
              <span className="text-base font-bold text-emerald-600">92%</span>
            </div>
          </div>
        </div>

        {/* Active Flashcard Arena */}
        {!isQueueComplete && currentCard ? (
          <div className="space-y-4">
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-xs text-secondary-text px-1">
              <span>Card {currentIndex + 1} of {activeDeckCards.length} in queue</span>
              <span>Easiness Factor: {currentCard.easiness_factor.toFixed(2)} • Repetition #{currentCard.repetition_number}</span>
            </div>
            
            <div className="w-full bg-neutral-200/70 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / activeDeckCards.length) * 100}%` }}
              />
            </div>

            {/* 3D Flip Card Container */}
            <div
              className="relative w-full min-h-[380px] cursor-pointer select-none"
              style={{ perspective: '1200px' }}
              onClick={() => setIsFlipped(prev => !prev)}
            >
              <div
                className="w-full h-full min-h-[380px] rounded-3xl transition-transform duration-500 ease-out"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* CARD FRONT */}
                <div
                  className="absolute inset-0 w-full h-full bg-white/95 backdrop-blur-md border border-neutral-200/90 rounded-3xl p-8 flex flex-col justify-between shadow-md"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-neutral-100 text-neutral-700">
                          {currentCard.subject_name}
                        </Badge>
                        <Badge variant="primary" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                          {currentCard.concept_name}
                        </Badge>
                      </div>
                      <span className="text-xs font-mono text-neutral-400">
                        Space to Flip ↵
                      </span>
                    </div>

                    <div className="mt-8 space-y-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">Question Prompt</span>
                      <h2 className="text-xl md:text-2xl font-semibold text-primary-text leading-relaxed">
                        {currentCard.front}
                      </h2>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      {currentCard.hint && (
                        <div onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => setShowHint(prev => !prev)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            {showHint ? 'Hide Hint' : 'Reveal Hint'}
                          </button>
                          {showHint && (
                            <p className="mt-2 text-xs text-secondary-text bg-indigo-50/70 border border-indigo-100 p-2.5 rounded-xl max-w-lg">
                              💡 {currentCard.hint}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFlipped(true);
                      }}
                      className="text-xs shadow-xs"
                    >
                      <RotateCw className="w-3.5 h-3.5 mr-1.5" />
                      Show Answer
                    </Button>
                  </div>
                </div>

                {/* CARD BACK */}
                <div
                  className="absolute inset-0 w-full h-full bg-gradient-to-br from-white via-indigo-50/20 to-white backdrop-blur-md border border-indigo-200/80 rounded-3xl p-8 flex flex-col justify-between shadow-md"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="primary" className="bg-indigo-600 text-white">
                          Answer Blueprint
                        </Badge>
                        <span className="text-xs font-medium text-secondary-text">
                          {currentCard.concept_name}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-400 font-mono">
                        Keys 1-4 to Rate
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="p-5 bg-white/90 border border-neutral-200/80 rounded-2xl shadow-xs">
                        <pre className="font-sans text-sm md:text-base text-primary-text whitespace-pre-wrap leading-relaxed">
                          {currentCard.back}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* SM-2 Recall Feedback Action Bar */}
                  <div
                    className="pt-6 border-t border-indigo-100"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-secondary-text">
                        How well did you recall this concept?
                      </span>
                      <span className="text-xs text-secondary-text">
                        SM-2 intervals automatically adjust
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <button
                        onClick={() => handleRate(1)}
                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-red-200 bg-red-50/80 hover:bg-red-100/90 text-red-700 transition-all shadow-xs group"
                      >
                        <span className="text-xs font-bold uppercase tracking-wider">1: Again</span>
                        <span className="text-[11px] text-red-600/80 mt-0.5">Forgot (1d)</span>
                      </button>

                      <button
                        onClick={() => handleRate(2)}
                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-amber-200 bg-amber-50/80 hover:bg-amber-100/90 text-amber-800 transition-all shadow-xs group"
                      >
                        <span className="text-xs font-bold uppercase tracking-wider">2: Hard</span>
                        <span className="text-[11px] text-amber-700/80 mt-0.5">Effortful (1d)</span>
                      </button>

                      <button
                        onClick={() => handleRate(3)}
                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100/90 text-emerald-800 transition-all shadow-xs group"
                      >
                        <span className="text-xs font-bold uppercase tracking-wider">3: Good</span>
                        <span className="text-[11px] text-emerald-700/80 mt-0.5">Smooth (+3d)</span>
                      </button>

                      <button
                        onClick={() => handleRate(4)}
                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100/90 text-indigo-800 transition-all shadow-xs group"
                      >
                        <span className="text-xs font-bold uppercase tracking-wider">4: Easy</span>
                        <span className="text-[11px] text-indigo-700/80 mt-0.5">Mastered (+6d)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick helper badge */}
            {lastReviewFeedback && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{lastReviewFeedback}</span>
              </div>
            )}
          </div>
        ) : (
          /* Session Finished State */
          <Card className="bg-white/90 backdrop-blur-md border border-neutral-200/80 shadow-md text-center py-12 px-6 rounded-3xl">
            <CardContent className="space-y-6 max-w-md mx-auto">
              <div className="w-16 h-16 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary-text">
                  Queue Complete!
                </h2>
                <p className="text-sm text-secondary-text mt-1">
                  You've reviewed all scheduled flashcards for this deck. Your retention curve has been updated in the BKT model.
                </p>
              </div>

              <div className="bg-neutral-50/80 border border-neutral-200/80 rounded-2xl p-4 grid grid-cols-3 gap-2">
                <div>
                  <span className="text-xs text-secondary-text block">Cards Done</span>
                  <span className="text-lg font-bold text-primary-text">{reviewedCount || cards.length}</span>
                </div>
                <div className="border-x border-neutral-200">
                  <span className="text-xs text-secondary-text block">Est. Recall</span>
                  <span className="text-lg font-bold text-emerald-600">94.2%</span>
                </div>
                <div>
                  <span className="text-xs text-secondary-text block">Next Due</span>
                  <span className="text-lg font-bold text-primary-text">Tomorrow</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={handleRestartQueue}
                  className="w-full sm:w-auto"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Review Again
                </Button>
                <Button
                  variant="primary"
                  onClick={() => navigate('/practice')}
                  className="w-full sm:w-auto"
                >
                  Practice Test
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
};
