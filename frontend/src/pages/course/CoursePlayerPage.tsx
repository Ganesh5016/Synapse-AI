import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Trophy,
  Brain,
  HelpCircle,
  Lightbulb,
  Check,
  Network,
  Clock,
  Layers,
  Flame,
  FileText,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import { getCourseData, CourseData, CourseQuestion } from '../../services/courseContent';
import {
  getUserLearningState,
  recordPracticeAttempt,
  ALL_CONCEPTS,
} from '../../services/userProgress';

type CourseStage = 'learn' | 'quiz' | 'result';

export const CoursePlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Find course content by ID or slug
  const course = useMemo(() => {
    return getCourseData(id || 'c0000000-0000-0000-0000-000000000001');
  }, [id]);

  // Track learner progress state
  const [learningState, setLearningState] = useState(() => getUserLearningState(user?.id));
  const isAlreadyCompleted = Boolean(
    course && learningState.completedConcepts[course.id]?.isCompleted
  );

  // Active Stage: 'learn' -> 'quiz' -> 'result'
  const [stage, setStage] = useState<CourseStage>('learn');

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<
    Array<{ questionId: string; selected: string; isCorrect: boolean }>
  >([]);
  const [showHint, setShowHint] = useState(false);

  // Sync state on user change or updates
  useEffect(() => {
    const handleUpdate = () => {
      setLearningState(getUserLearningState(user?.id));
    };
    window.addEventListener('synapse_progress_updated', handleUpdate);
    return () => window.removeEventListener('synapse_progress_updated', handleUpdate);
  }, [user?.id]);

  if (!course) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-primary-text">Course Not Found</h2>
        <p className="text-sm text-muted">The requested concept course could not be located.</p>
        <Button variant="primary" onClick={() => navigate('/graph')}>
          Return to Knowledge Graph
        </Button>
      </div>
    );
  }

  const questions = course.questions;
  const currentQuestion: CourseQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Calculate score and pass status
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  const accuracyPercentage =
    questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const isPassed = accuracyPercentage >= 75; // Passing requirement: at least 75%

  // Handlers for Quiz
  const handleSubmitAnswer = () => {
    if (!selectedOption || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const isCorrect =
      selectedOption.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();

    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selected: selectedOption,
        isCorrect,
      },
    ]);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Calculate final accuracy with the newly recorded answer
      const finalCorrectCount =
        userAnswers.filter((a) => a.isCorrect).length;
      const finalAccuracy = Math.round((finalCorrectCount / questions.length) * 100);
      const passed = finalAccuracy >= 75;

      // If passed, record and mark completed!
      if (passed) {
        recordPracticeAttempt(user?.id, course.id, questions.length, finalCorrectCount);
        setLearningState(getUserLearningState(user?.id));
      }

      setStage('result');
    } else {
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setShowHint(false);
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleRewriteTest = () => {
    // Reset test state so user can write the test again
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers([]);
    setShowHint(false);
    setStage('quiz');
  };

  const handleBackToLesson = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers([]);
    setShowHint(false);
    setStage('learn');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* 1. TOP HEADER & NAVIGATION */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/graph')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Knowledge Graph</span>
        </button>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-primary border-primary/30">
            {course.subject}
          </Badge>
          <Badge
            variant={
              isAlreadyCompleted || (stage === 'result' && isPassed)
                ? 'success'
                : 'primary'
            }
          >
            {isAlreadyCompleted || (stage === 'result' && isPassed)
              ? 'Completed (Mastered)'
              : 'Not Completed'}
          </Badge>
        </div>
      </div>

      {/* 2. STAGE TABS / PROGRESS STEPPER */}
      <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-surface-secondary/70 border border-muted-border/80">
        <button
          onClick={() => setStage('learn')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            stage === 'learn'
              ? 'bg-white text-primary shadow-sm'
              : 'text-muted hover:text-primary-text'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Step 1: Learn the Concept</span>
        </button>

        <button
          onClick={() => {
            if (stage === 'learn') {
              setStage('quiz');
            }
          }}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            stage === 'quiz' || stage === 'result'
              ? 'bg-white text-primary shadow-sm'
              : 'text-muted hover:text-primary-text'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Step 2: Knowledge Check (MCQ Test)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* STAGE 1: LEARN THE CONCEPT ("SOMETHING TO LEARN")                         */}
      {/* ========================================================================= */}
      {stage === 'learn' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Hero Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-primary-light/40 via-white to-accent-light/30 border border-primary/20 shadow-sm relative overflow-hidden">
            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Clock className="w-3.5 h-3.5" />
                <span>{course.estimatedMinutes} min read</span>
                <span>•</span>
                <span className="capitalize">{course.difficulty} Level</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-text tracking-tight">
                {course.title}
              </h1>

              <p className="text-sm text-muted leading-relaxed">
                {course.overview}
              </p>
            </div>
          </div>

          {/* Current Status Notification */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
              isAlreadyCompleted
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-primary-light/30 border-primary/20 text-primary-text'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isAlreadyCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0" />
              )}
              <div>
                <span className="font-bold block">
                  {isAlreadyCompleted
                    ? 'Course Status: Completed (100% Mastery)'
                    : 'Course Status: Not Completed'}
                </span>
                <span className="text-[11px] opacity-80">
                  {isAlreadyCompleted
                    ? 'You have already verified mastery for this concept. You can review the lesson anytime or retake the assessment.'
                    : 'To complete this course and unlock dependent concepts on your Knowledge Graph, study the material below and pass the MCQ test with at least 75%.'}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                handleRewriteTest();
              }}
              className="flex-shrink-0 whitespace-nowrap shadow-xs"
            >
              <span>{isAlreadyCompleted ? 'Retake Test' : 'Start Test Now'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          {/* Lesson Content Sections */}
          <div className="space-y-5">
            {course.sections.map((section, idx) => (
              <Card key={idx} className="p-6 sm:p-7 space-y-3 bg-white/95">
                <h3 className="text-base sm:text-lg font-bold text-primary-text flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span>{section.title}</span>
                </h3>

                <p className="text-xs sm:text-sm text-secondary-text leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>

                {section.formula && (
                  <div className="p-3.5 rounded-xl bg-surface-secondary/80 border border-muted-border font-mono text-xs text-primary font-semibold text-center overflow-x-auto shadow-2xs">
                    {section.formula}
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Key Takeaways */}
          <Card className="p-6 bg-gradient-to-br from-white to-primary-light/10 border-primary/20 space-y-3">
            <h4 className="text-sm font-bold text-primary-text flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Key Takeaways (Required for Assessment)</span>
            </h4>
            <ul className="space-y-2 text-xs text-secondary-text">
              {course.keyTakeaways.map((takeaway, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Bottom Action: Proceed to Quiz */}
          <div className="p-6 rounded-3xl bg-white border border-muted-border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
              <h4 className="text-sm font-bold text-primary-text">Ready to test your comprehension?</h4>
              <p className="text-xs text-muted">
                Passing with ≥ 75% accuracy marks this course completed and updates your Knowledge Graph.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleRewriteTest}
              className="w-full sm:w-auto shadow-md shadow-primary/25 flex items-center justify-center gap-2 text-sm font-bold"
            >
              <span>Take Knowledge Check ({questions.length} MCQs)</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 2: KNOWLEDGE CHECK (MCQ TEST)                                       */}
      {/* ========================================================================= */}
      {stage === 'quiz' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Quiz Header Bar */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-muted-border shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                {currentQuestionIndex + 1}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <h4 className="text-xs font-bold text-primary-text">{course.title}</h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted font-medium">
                Pass mark: <strong className="text-primary-text">75%</strong>
              </span>
            </div>
          </div>

          {/* Question Card */}
          <Card className="p-6 sm:p-8 space-y-6 bg-white border border-muted-border shadow-sm">
            {/* Prompt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary border-primary/30">
                  Multiple Choice
                </Badge>
                <span className="text-[11px] text-muted">Question {currentQuestionIndex + 1}/{questions.length}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-primary-text leading-snug">
                {currentQuestion.prompt}
              </h2>
            </div>

            {/* Hint */}
            {currentQuestion.hint && (
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
                    <span>{currentQuestion.hint}</span>
                  </div>
                )}
              </div>
            )}

            {/* Options */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                const isCorrectOption =
                  opt.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();

                let style = 'bg-white border-muted-border hover:border-primary/40 text-primary-text';
                if (isAnswerSubmitted) {
                  if (isCorrectOption) {
                    style =
                      'bg-emerald-50 border-emerald-400 text-emerald-900 font-medium ring-1 ring-emerald-400';
                  } else if (isSelected && !isCorrectOption) {
                    style = 'bg-rose-50 border-rose-300 text-rose-900 font-medium';
                  } else {
                    style = 'bg-white/50 border-muted-border/50 text-muted opacity-70';
                  }
                } else if (isSelected) {
                  style = 'bg-primary-light/40 border-primary text-primary font-medium shadow-xs';
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerSubmitted}
                    onClick={() => setSelectedOption(opt)}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm leading-relaxed transition-all flex items-center justify-between ${style}`}
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

            {/* Explanation on Submit */}
            {isAnswerSubmitted && (
              <div className="p-4 rounded-2xl bg-surface-secondary border border-muted-border space-y-1.5 animate-in fade-in duration-200">
                <span className="text-xs font-bold text-primary-text flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Explanation & Scientific Rationale
                </span>
                <p className="text-xs text-secondary-text leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-muted-border flex items-center justify-between">
              <button
                onClick={handleBackToLesson}
                className="text-xs text-muted hover:text-primary transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Lesson
              </button>

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
                  <span>{isLastQuestion ? 'Complete Assessment' : 'Next Question'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 3: RESULT — PASS (COMPLETED) vs FAIL (MUST RETAKE TEST)              */}
      {/* ========================================================================= */}
      {stage === 'result' && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          {isPassed ? (
            /* CASE A: PASSED — COURSE IS COMPLETED */
            <Card className="p-8 sm:p-10 text-center space-y-6 bg-white border border-emerald-300 shadow-lg">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-md">
                <Trophy className="w-10 h-10 fill-current" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Course Successfully Completed</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-text">
                  Congratulations! You Mastered {course.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted max-w-lg mx-auto">
                  You scored <strong className="text-emerald-600 font-bold">{accuracyPercentage}%</strong> ({correctCount} of {questions.length} correct). This course is now marked <strong className="text-emerald-700">Completed</strong> on your Knowledge Graph and your Dashboard metrics have been updated.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                <div className="p-3.5 rounded-2xl bg-surface-secondary border border-muted-border">
                  <span className="text-[10px] font-bold text-muted uppercase block">Accuracy</span>
                  <span className="text-xl font-extrabold text-emerald-600">{accuracyPercentage}%</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-surface-secondary border border-muted-border">
                  <span className="text-[10px] font-bold text-muted uppercase block">Status</span>
                  <span className="text-sm font-extrabold text-primary block mt-1">Mastered</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-surface-secondary border border-muted-border">
                  <span className="text-[10px] font-bold text-muted uppercase block">Bayesian P(L)</span>
                  <span className="text-xl font-extrabold text-accent">1.00</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-muted-border">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/graph')}
                  className="bg-primary hover:bg-primary-hover text-white flex items-center gap-2 shadow-sm"
                >
                  <Network className="w-4 h-4" />
                  <span>View Completed on Knowledge Graph</span>
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </Button>

                <Button
                  variant="ghost"
                  size="md"
                  onClick={handleBackToLesson}
                >
                  <BookOpen className="w-4 h-4 mr-1.5" /> Review Lesson Again
                </Button>
              </div>
            </Card>
          ) : (
            /* CASE B: FAILED — TEST MUST BE RETAKEN ("IF FAIL AGAIN TEST SHOULD BE WRITE") */
            <Card className="p-8 sm:p-10 text-center space-y-6 bg-white border border-rose-300 shadow-md">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
                <AlertTriangle className="w-10 h-10 fill-current" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-xs font-bold text-rose-800">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Assessment Not Passed (Score: {accuracyPercentage}%)</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-text">
                  Course Not Yet Completed
                </h2>
                <p className="text-xs sm:text-sm text-muted max-w-lg mx-auto">
                  To ensure genuine cognitive retention, this course is only marked completed when you achieve at least <strong className="text-primary-text font-bold">75%</strong> accuracy (at least 3 of {questions.length} correct). You scored {accuracyPercentage}%.
                </p>
                <p className="text-xs font-semibold text-rose-600">
                  Please review the missed concepts and rewrite the test to complete this course.
                </p>
              </div>

              {/* Review of Missed Questions */}
              <div className="text-left max-w-xl mx-auto space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
                  Questions to Review Before Retaking:
                </h4>
                {userAnswers
                  .map((ans, idx) => ({ ans, q: questions[idx] }))
                  .filter(({ ans }) => !ans.isCorrect)
                  .map(({ ans, q }, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 text-xs space-y-1.5"
                    >
                      <p className="font-bold text-rose-950">
                        Q: {q.prompt}
                      </p>
                      <p className="text-rose-700">
                        Your answer: <span className="line-through">{ans.selected}</span>
                      </p>
                      <p className="text-emerald-700 font-medium">
                        Correct answer: {q.correctAnswer}
                      </p>
                      <p className="text-[11px] text-muted italic">
                        {q.explanation}
                      </p>
                    </div>
                  ))}
              </div>

              {/* Action Buttons to Retake */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-muted-border">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleRewriteTest}
                  className="bg-primary hover:bg-primary-hover text-white flex items-center gap-2 shadow-md shadow-primary/20 font-bold"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Rewrite Test (Retake Assessment)</span>
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  onClick={handleBackToLesson}
                  className="flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Review Lesson Material</span>
                </Button>

                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => navigate('/graph')}
                >
                  Return to Graph
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

