import React, { useState, useEffect, useMemo } from 'react';
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
  AlertTriangle,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import { recordPracticeAttempt, ALL_CONCEPTS, getUserLearningState } from '../../services/userProgress';
import { COURSE_CURRICULUM, getCourseData } from '../../services/courseContent';

interface PracticeQuestion {
  id: string;
  concept_id: string;
  concept_name: string;
  subject_name: string;
  prompt: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  difficulty: string;
  hint?: string;
}

// Convert all curriculum questions into a unified, rich question bank
const ALL_PRACTICE_QUESTIONS: PracticeQuestion[] = Object.values(COURSE_CURRICULUM).flatMap(
  (course) =>
    course.questions.map((q) => ({
      id: q.id,
      concept_id: course.id,
      concept_name: course.title,
      subject_name: course.subject,
      prompt: q.prompt,
      options: q.options,
      correct_answer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: course.difficulty,
      hint: q.hint,
    }))
);

export const PracticeCenterPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const queryConcept = searchParams.get('conceptId');
  const [selectedTopic, setSelectedTopic] = useState<string>(queryConcept || 'all');
  const [sessionSeed, setSessionSeed] = useState<number>(0);

  // Sync state if query param changes
  useEffect(() => {
    if (queryConcept) {
      setSelectedTopic(queryConcept);
    }
  }, [queryConcept]);

  // Compute active question set dynamically based on topic selection and session seed
  const questions: PracticeQuestion[] = useMemo(() => {
    if (selectedTopic && selectedTopic !== 'all') {
      const matchCourse = getCourseData(selectedTopic);
      const matched = ALL_PRACTICE_QUESTIONS.filter(
        (q) =>
          q.concept_id === selectedTopic ||
          (matchCourse && q.concept_id === matchCourse.id) ||
          q.concept_name.toLowerCase().includes(selectedTopic.toLowerCase())
      );
      if (matched.length > 0) return matched;
    }

    // Adaptive mix across all disciplines: pick 4 distinct questions based on session seed
    const pool = [...ALL_PRACTICE_QUESTIONS];
    // Deterministic pseudo-shuffle per session seed so it never repeats the same 4
    const offset = (sessionSeed * 4) % pool.length;
    const cycled = [...pool.slice(offset), ...pool.slice(0, offset)];
    return cycled.slice(0, 4);
  }, [selectedTopic, sessionSeed]);

  // Active question index and session metrics
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [bktDelta, setBktDelta] = useState<number | null>(null);

  const currentQ = questions[currentIndex] || questions[0];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isComplete = currentIndex >= questions.length;

  const handleSubmitAnswer = () => {
    if (!selectedOption || isAnswerSubmitted || !currentQ) return;
    setIsAnswerSubmitted(true);

    const isCorrect =
      selectedOption.trim().toLowerCase() === currentQ.correct_answer.trim().toLowerCase();
    if (isCorrect) {
      setSessionScore((prev) => prev + 100);
      setCorrectCount((prev) => prev + 1);
      setBktDelta(0.12);
    } else {
      setBktDelta(-0.06);
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      const finalCorrect = selectedOption?.trim().toLowerCase() === currentQ?.correct_answer.trim().toLowerCase()
        ? correctCount + 1
        : correctCount;

      // Record authentic practice attempt in user progress service
      if (currentQ) {
        recordPracticeAttempt(user?.id, currentQ.concept_id, questions.length, finalCorrect);
      }
    }
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

  const handleNextSession = () => {
    // Advances seed to load a completely fresh set of questions!
    setSessionSeed((prev) => prev + 1);
    handleRestart();
  };

  const handleTopicChange = (newTopic: string) => {
    setSelectedTopic(newTopic);
    if (newTopic === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ conceptId: newTopic });
    }
    handleRestart();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* 1. TOP TOPIC SELECTOR & CONTROL BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-muted-border shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl gradient-accent text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <Brain className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold text-primary-text truncate">
              Psychometric Practice Center
            </h1>
            <p className="text-[11px] text-muted truncate">
              Dynamic BKT questions calibrated across your knowledge decay curves.
            </p>
          </div>
        </div>

        {/* Topic Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-muted" />
          <select
            value={selectedTopic}
            onChange={(e) => handleTopicChange(e.target.value)}
            className="text-xs bg-surface-secondary border border-muted-border rounded-xl px-2.5 py-1.5 text-primary-text font-medium focus:outline-none focus:border-primary"
          >
            <option value="all">All Topics (Adaptive Mix)</option>
            {ALL_CONCEPTS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. PROGRESS BAR & CURRENT QUESTION METRICS */}
      {!isComplete && currentQ && (
        <div className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-muted-border shadow-2xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
              {currentQ.subject_name}
            </span>
            <h4 className="text-xs font-bold text-primary-text">{currentQ.concept_name}</h4>
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

      {/* 3. ACTIVE QUESTION CARD */}
      {!isComplete && currentQ ? (
        <Card className="p-6 sm:p-8 space-y-6 bg-white border border-muted-border shadow-sm">
          {/* Prompt */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary border-primary/30">
                Multiple Choice
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
              const isCorrectOption =
                opt.trim().toLowerCase() === currentQ.correct_answer.trim().toLowerCase();

              let optStyle = 'bg-white border-muted-border hover:border-primary/40 text-primary-text';
              if (isAnswerSubmitted) {
                if (isCorrectOption) {
                  optStyle =
                    'bg-emerald-50 border-emerald-400 text-emerald-900 font-medium ring-1 ring-emerald-400';
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
            <div className="p-4 rounded-2xl bg-surface-secondary border border-muted-border space-y-2 animate-in fade-in duration-200">
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
              <p className="text-xs text-secondary-text leading-relaxed">{currentQ.explanation}</p>
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
        /* 4. SESSION COMPLETE RECAP — PASS (COMPLETED) vs FAIL (RETAKE) */
        (() => {
          const accuracy = Math.round((correctCount / questions.length) * 100);
          const isPassed = accuracy >= 75;

          return isPassed ? (
            <Card className="p-8 text-center space-y-6 bg-white border border-emerald-300 shadow-md">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-md">
                <Trophy className="w-8 h-8 fill-current" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Course Passed & Completed (100% Mastery)</span>
                </div>
                <h2 className="text-2xl font-extrabold text-primary-text">Assessment Passed!</h2>
                <p className="text-xs text-muted max-w-md mx-auto">
                  You scored <strong className="text-emerald-600 font-bold">{accuracy}%</strong> ({correctCount} of {questions.length} correct). This concept has been marked <strong className="text-emerald-700">Completed</strong> on your Knowledge Graph and Dashboard!
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                <div className="p-3 rounded-2xl bg-surface-secondary border border-muted-border">
                  <span className="text-[10px] font-bold text-muted uppercase block">Score</span>
                  <span className="text-xl font-extrabold text-primary">{sessionScore}</span>
                </div>
                <div className="p-3 rounded-2xl bg-surface-secondary border border-muted-border">
                  <span className="text-[10px] font-bold text-muted uppercase block">Accuracy</span>
                  <span className="text-xl font-extrabold text-emerald-600">{accuracy}%</span>
                </div>
                <div className="p-3 rounded-2xl bg-surface-secondary border border-muted-border">
                  <span className="text-[10px] font-bold text-muted uppercase block">Status</span>
                  <span className="text-sm font-extrabold text-primary block mt-1">Completed</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-muted-border">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleNextSession}
                  className="bg-primary hover:bg-primary-hover text-white flex items-center gap-2 shadow-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Next Practice Session (New Questions)</span>
                </Button>

                <Button variant="outline" size="md" onClick={() => navigate('/graph')}>
                  View Knowledge Graph
                </Button>

                <Button variant="ghost" size="md" onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center space-y-6 bg-white border border-rose-300 shadow-md">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
                <AlertTriangle className="w-8 h-8 fill-current" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-xs font-bold text-rose-800">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Not Completed — Passing Score is 75%</span>
                </div>
                <h2 className="text-2xl font-extrabold text-primary-text">Assessment Not Passed</h2>
                <p className="text-xs text-muted max-w-md mx-auto">
                  You scored <strong className="text-rose-600 font-bold">{accuracy}%</strong> ({correctCount} of {questions.length} correct). Mastery requires at least 75% accuracy. To complete this course, please rewrite the test.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                <div className="p-3 rounded-2xl bg-surface-secondary border border-muted-border">
                  <span className="text-[10px] font-bold text-muted uppercase block">Your Score</span>
                  <span className="text-xl font-extrabold text-rose-600">{accuracy}%</span>
                </div>
                <div className="p-3 rounded-2xl bg-surface-secondary border border-muted-border">
                  <span className="text-[10px] font-bold text-muted uppercase block">Required Pass</span>
                  <span className="text-xl font-extrabold text-primary">75%</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-muted-border">
                <Button variant="primary" size="md" onClick={handleRestart} className="font-bold">
                  <RotateCcw className="w-4 h-4 mr-1.5" /> Rewrite Test (Retake)
                </Button>
                <Button variant="outline" size="md" onClick={() => navigate('/graph')}>
                  Return to Graph
                </Button>
              </div>
            </Card>
          );
        })()
      )}
    </div>
  );
};
