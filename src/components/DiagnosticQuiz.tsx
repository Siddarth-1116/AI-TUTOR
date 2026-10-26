import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  RotateCw,
  Lightbulb,
  AlertTriangle,
  Award
} from 'lucide-react';
import { QuizQuestion, StudentProfile } from '../types';

interface DiagnosticQuizProps {
  questions: QuizQuestion[];
  profile: StudentProfile;
  onQuizCompleted: (scorePercentage: number) => void;
  onAskTutorAboutQuestion: (questionContext: string) => void;
  onGenerateQuiz: (topic: string, level: string) => Promise<void>;
  isLoadingQuiz?: boolean;
}

export const DiagnosticQuiz: React.FC<DiagnosticQuizProps> = ({
  questions,
  profile,
  onQuizCompleted,
  onAskTutorAboutQuestion,
  onGenerateQuiz,
  isLoadingQuiz = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const currentQ = questions[currentIndex];
  const hasAnswered = selectedAnswers[currentIndex] !== undefined;
  const isCorrect = selectedAnswers[currentIndex] === currentQ?.correctIndex;

  const handleSelectOption = (index: number) => {
    if (revealed[currentIndex]) return; // lock once answered
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: index }));
    setRevealed((prev) => ({ ...prev, [currentIndex]: true }));

    // Check if all answered
    const updated = { ...selectedAnswers, [currentIndex]: index };
    const answeredCount = Object.keys(updated).length;
    if (answeredCount === questions.length) {
      let correctCount = 0;
      questions.forEach((q, idx) => {
        if (updated[idx] === q.correctIndex) correctCount++;
      });
      const score = Math.round((correctCount / questions.length) * 100);
      onQuizCompleted(score);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerateQuiz(profile.topic, profile.knowledgeLevel);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setRevealed({});
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (!currentQ) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <p className="text-sm text-slate-300">No quiz questions currently available for this topic.</p>
        <button
          onClick={handleGenerate}
          disabled={isGenerating || isLoadingQuiz}
          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
        >
          Generate Adaptive Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quiz Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div>
          <div className="text-xs font-mono text-amber-400 mb-0.5">
            DIAGNOSTIC ASSESSMENT & MISCONCEPTION CHECK
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Target: {profile.topic} ({profile.knowledgeLevel})
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-slate-400">
            Question <span className="text-white font-semibold">{currentIndex + 1}</span> of{' '}
            <span className="text-white font-semibold">{questions.length}</span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || isLoadingQuiz}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
            title="Generate new adaptive questions from Gemini"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Generate New Quiz</span>
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <span>QUESTION {currentIndex + 1}</span>
            <span>·</span>
            <span>CONCEPTUAL RIGOR</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
            {currentQ.question}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentIndex] === idx;
            const isRevealedOption = revealed[currentIndex];
            const isCorrectOption = idx === currentQ.correctIndex;

            let cardStyles = 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-200';
            if (isRevealedOption) {
              if (isCorrectOption) {
                cardStyles = 'bg-emerald-950/40 border-emerald-500/80 text-emerald-100 shadow-xs';
              } else if (isSelected) {
                cardStyles = 'bg-rose-950/40 border-rose-500/80 text-rose-100 shadow-xs';
              } else {
                cardStyles = 'bg-slate-950/40 border-slate-850 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isRevealedOption}
                className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-start justify-between gap-4 ${cardStyles}`}
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-relaxed">{option}</span>
                </div>

                {isRevealedOption && (
                  <div className="shrink-0 mt-0.5">
                    {isCorrectOption ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Misconception Diagnostic Feedback Box */}
        {hasAnswered && (
          <div
            className={`p-5 rounded-xl border space-y-3 animate-in fade-in duration-300 ${
              isCorrect
                ? 'bg-emerald-950/20 border-emerald-500/40'
                : 'bg-amber-950/20 border-amber-500/40'
            }`}
          >
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-300">
                    Accurate Mental Model!
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-bold text-amber-300">
                    Cognitive Misconception Detected
                  </span>
                </>
              )}
            </div>

            {/* Detailed Distractor Analysis */}
            <div className="text-xs text-slate-200 leading-relaxed">
              <span className="font-semibold text-slate-100 block mb-1">
                Diagnostic Analysis of Option {String.fromCharCode(65 + selectedAnswers[currentIndex])}:
              </span>
              <p className="text-slate-300">
                {currentQ.misconceptionAnalysis[selectedAnswers[currentIndex]] || currentQ.explanation}
              </p>
            </div>

            {/* Core Principle Takeaway */}
            <div className="p-3 bg-slate-900/80 rounded-lg text-xs text-slate-300 border border-slate-800">
              <span className="font-semibold text-amber-300 block mb-0.5">
                Mastery Takeaway:
              </span>
              <p>{currentQ.explanation}</p>
            </div>

            {/* Action buttons: Ask tutor about this question */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() =>
                  onAskTutorAboutQuestion(
                    `I just answered this quiz question: "${currentQ.question}". I picked: "${
                      currentQ.options[selectedAnswers[currentIndex]]
                    }". Why do people commonly confuse this, and what is the deepest intuition?`
                  )
                }
                className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Discuss this misconception with AI Tutor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Pagination controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800 transition-colors"
          >
            Previous
          </button>

          <div className="flex gap-1.5">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-7 h-7 rounded text-xs font-mono transition-colors ${
                  currentIndex === i
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : revealed[i]
                    ? selectedAnswers[i] === questions[i].correctIndex
                      ? 'bg-emerald-900/60 text-emerald-300'
                      : 'bg-rose-900/60 text-rose-300'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
