import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Layers,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Trophy,
  Brain,
  Clock,
  Play,
  Lightbulb,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface PracticeQuestion {
  id: string;
  concept_id: string;
  concept_name: string;
  subject_name: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  prompt: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
  difficulty: string;
  hint?: string;
}

export const PracticeCenterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const conceptFilter = searchParams.get('conceptId');

  const questions: PracticeQuestion[] = [
    {
      id: 'q-001',
      concept_id: 'c0000000-0000-0000-0000-000000000003',
      concept_name: 'Scaled Dot-Product Attention',
      subject_name: 'Machine Learning & AI',
      question_type: 'multiple_choice',
      prompt: 'Why is the dot-product inner matrix QK^T scaled by 1/sqrt(d_k) in Transformer self-attention?',
      options: [
        'To prevent dot products from pushing softmax into vanishingly small gradient regions',
        'To reduce computational complexity from quadratic to linear time',
        'To normalize the positional encodings across variable sequence lengths',
        'To enforce strict orthogonality between Query and Value projections',
      ],
      correct_answer: 'To prevent dot products from pushing softmax into vanishingly small gradient regions',
      explanation:
        'When projection dimension d_k is large, the dot products grow large in magnitude, driving the softmax function into saturated regions where gradients approach zero. Dividing by sqrt(d_k) scales the dot-product variance to 1.',
      difficulty: 'intermediate',
      hint: 'Consider what happens to the slope/derivative of the softmax function when inputs become extremely large.',
    },
    {
      id: 'q-002',
      concept_id: 'c0000000-0000-0000-0000-000000000007',
      concept_name: 'Bayesian Knowledge Tracing (BKT)',
      subject_name: 'Cognitive Science & Psychology',
      question_type: 'multiple_choice',
      prompt: 'In standard Bayesian Knowledge Tracing (BKT), which parameter denotes the probability of answering correctly without having mastered the latent skill?',
      options: [
        'Guess parameter P(G)',
        'Slip parameter P(S)',
        'Transit parameter P(T)',
        'Prior parameter P(L0)',
      ],
      correct_answer: 'Guess parameter P(G)',
      explanation:
        'P(G) represents the probability that a student gets an item correct by guessing, despite not possessing the latent mastery. P(S) represents slipping on a mastered skill.',
      difficulty: 'beginner',
      hint: 'This accounts for lucky guessing on multiple-choice assessments.',
    },
    {
      id: 'q-003',
      concept_id: 'c0000000-0000-0000-0000-000000000008',
      concept_name: 'SuperMemo SM-2 Spaced Repetition',
      subject_name: 'Cognitive Science & Psychology',
      question_type: 'multiple_choice',
      prompt: 'What is the minimum lower bound enforced on the Easiness Factor (EF) in the SM-2 algorithm?',
      options: ['1.3', '1.0', '2.5', '0.5'],
      correct_answer: '1.3',
      explanation:
        'In SM-2, EF is bounded from below at 1.3 to prevent intervals from permanently collapsing into infinite stagnation for difficult items.',
      difficulty: 'intermediate',
      hint: 'The standard formula clamps the multiplier so it never drops below this value greater than 1.0.',
    },
    {
      id: 'q-004',
      concept_id: 'c0000000-0000-0000-0000-000000000002',
      concept_name: 'Gradient Descent & Backpropagation',
      subject_name: 'Machine Learning & AI',
      question_type: 'true_false',
      prompt: 'True or False: In stochastic gradient descent, setting an excessively high learning rate can cause the optimization trajectory to diverge and overshoot the minimum.',
      options: ['True', 'False'],
      correct_answer: 'True',
      explanation:
        'Large step sizes cause parameter updates to oscillate across steep ravines, failing to converge and potentially diverging to infinity.',
      difficulty: 'beginner',
      hint: 'Think about taking huge jumps on a steep loss surface.',
    },
  ];

  // Active question index
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [bktDelta, setBktDelta] = useState<number | null>(null);

  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isComplete = currentIndex >= questions.length;

  const handleSubmitAnswer = () => {
    if (!selectedOption || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOption.trim().toLowerCase() === currentQ.correct_answer.trim().toLowerCase();
    if (isCorrect) {
      setSessionScore((prev) => prev + 100);
      setCorrectCount((prev) => prev + 1);
      setBktDelta(0.12);
    } else {
      setBktDelta(-0.06);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowHint(false);
    setIsAnswerSubmitted(false);
    setBktDelta(null);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowHint(false);
    setIsAnswerSubmitted(false);
    setSessionScore(0);
    setCorrectCount(0);
    setBktDelta(null);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* 1. TOP PROGRESS BAR & STATS */}
      {!isComplete && (
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                {currentQ.subject_name}
              </span>
              <h4 className="text-xs font-bold text-primary-text">{currentQ.concept_name}</h4>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold text-muted">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <Badge variant="outline" className="text-primary border-primary/30 font-bold">
              {sessionScore} pts
            </Badge>
          </div>
        </div>
      )}

      {/* 2. QUESTION CARD */}
      {!isComplete ? (
        <Card className="p-6 sm:p-8 space-y-6 bg-white/90 backdrop-blur-md border border-border shadow-sm">
          {/* Prompt */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted">
                {currentQ.question_type.replace('_', ' ')}
              </Badge>
              <span className="text-[11px] text-muted capitalize font-medium">
                {currentQ.difficulty} Difficulty
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-primary-text leading-snug">
              {currentQ.prompt}
            </h2>
          </div>

          {/* Hint Disclosure */}
          {currentQ.hint && (
            <div>
              {!showHint ? (
                <button
                  onClick={() => setShowHint(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-primary" />
                  <span>Need a hint?</span>
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>{currentQ.hint}</span>
                </div>
              )}
            </div>
          )}

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options?.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrectOption = opt.trim().toLowerCase() === currentQ.correct_answer.trim().toLowerCase();

              let optStyle = 'bg-white border-muted-border hover:border-primary/40 text-primary-text';
              if (isAnswerSubmitted) {
                if (isCorrectOption) {
                  optStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-medium ring-1 ring-emerald-400';
                } else if (isSelected && !isCorrectOption) {
                  optStyle = 'bg-rose-50 border-rose-300 text-rose-900 font-medium';
                } else {
                  optStyle = 'bg-white/50 border-muted-border/50 text-muted opacity-70';
                }
              } else if (isSelected) {
                optStyle = 'bg-primary-light/40 border-primary text-primary font-medium shadow-xs';
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswerSubmitted}
                  onClick={() => setSelectedOption(opt)}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm leading-relaxed transition-all flex items-center justify-between ${optStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswerSubmitted && isCorrectOption && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 ml-2" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectOption && (
                    <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner on Submit */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-2xl bg-surface/80 border border-muted-border space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary-text flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Scientific Explanation & Rationale
                </span>
                {bktDelta && (
                  <Badge variant={bktDelta > 0 ? 'success' : 'outline'} className="text-[10px]">
                    BKT Mastery {bktDelta > 0 ? `+${Math.round(bktDelta * 100)}%` : `${Math.round(bktDelta * 100)}%`}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Action Bar */}
          <div className="pt-4 border-t border-muted-border flex items-center justify-between">
            <span className="text-xs text-muted">
              {!isAnswerSubmitted ? 'Select an answer to proceed' : 'Review explanation before next'}
            </span>

            {!isAnswerSubmitted ? (
              <Button
                variant="primary"
                size="md"
                disabled={!selectedOption}
                onClick={handleSubmitAnswer}
                className="bg-primary hover:bg-primary-hover text-white shadow-xs"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleNextQuestion}
                className="bg-primary hover:bg-primary-hover text-white flex items-center gap-1.5 shadow-xs"
              >
                <span>{isLastQuestion ? 'Complete Session' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>
      ) : (
        /* 3. SESSION COMPLETE RECAP */
        <Card className="p-8 text-center space-y-6 bg-white/95 backdrop-blur-md border border-border shadow-md">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center mx-auto shadow-md">
            <Trophy className="w-8 h-8 fill-current" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-primary-text">Practice Drill Complete!</h2>
            <p className="text-xs text-muted max-w-md mx-auto">
              Your responses have been processed through the Bayesian Knowledge Tracing engine, updating latent skill probabilities.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            <div className="p-3 rounded-2xl bg-surface border border-muted-border">
              <span className="text-[10px] font-bold text-muted uppercase block">Score</span>
              <span className="text-xl font-extrabold text-primary">{sessionScore}</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface border border-muted-border">
              <span className="text-[10px] font-bold text-muted uppercase block">Accuracy</span>
              <span className="text-xl font-extrabold text-success">
                {Math.round((correctCount / questions.length) * 100)}%
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-surface border border-muted-border">
              <span className="text-[10px] font-bold text-muted uppercase block">Mastery Gain</span>
              <span className="text-xl font-extrabold text-accent">+8%</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Button variant="primary" size="md" onClick={() => navigate('/graph')}>
              View Knowledge Graph
            </Button>
            <Button variant="outline" size="md" onClick={() => navigate('/flashcards')}>
              Review Flashcards
            </Button>
            <Button variant="ghost" size="md" onClick={handleRestart}>
              <RotateCcw className="w-4 h-4 mr-1.5" /> Practice Again
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
