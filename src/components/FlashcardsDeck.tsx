import React, { useState } from 'react';
import { 
  RotateCw, 
  Sparkles, 
  Check, 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight,
  Brain,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Flashcard, StudentProfile } from '../types';

interface FlashcardsDeckProps {
  cards: Flashcard[];
  profile: StudentProfile;
  onGenerateCards: (topic: string) => Promise<void>;
  isLoadingCards?: boolean;
}

export const FlashcardsDeck: React.FC<FlashcardsDeckProps> = ({
  cards,
  profile,
  onGenerateCards,
  isLoadingCards = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [reviewedCards, setReviewedCards] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const currentCard = cards[currentIndex];

  const handleRate = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;
    setReviewedCards((prev) => ({ ...prev, [currentCard.id]: rating }));
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerateCards(profile.topic);
      setCurrentIndex(0);
      setIsFlipped(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const masteredCount = Object.values(reviewedCards).filter((r) => r === 'easy' || r === 'good').length;

  if (!currentCard) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <p className="text-sm text-slate-300">No active recall flashcards in this deck.</p>
        <button
          onClick={handleGenerate}
          disabled={isGenerating || isLoadingCards}
          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
        >
          Generate Active Recall Cards
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Deck Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div>
          <div className="text-xs font-mono text-amber-400 mb-0.5">
            SPACED REPETITION & ACTIVE RETRIEVAL
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {profile.topic} Deck
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs font-mono text-slate-400">
            Card <span className="text-white font-semibold">{currentIndex + 1}</span> of{' '}
            <span className="text-white font-semibold">{cards.length}</span>
            <span className="mx-2">·</span>
            Mastered: <span className="text-emerald-400 font-semibold">{masteredCount}</span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || isLoadingCards}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
            title="Generate new active recall cards from Gemini"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Generate New Cards</span>
          </button>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div className="flex justify-center">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full max-w-xl h-80 cursor-pointer perspective-1000 group"
        >
          <div
            className={`relative w-full h-full rounded-2xl border transition-all duration-500 transform-style-3d shadow-xl p-8 flex flex-col justify-between ${
              isFlipped
                ? 'bg-slate-900 border-amber-500/70'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-amber-400 font-semibold uppercase">
                {isFlipped ? 'Concept Answer' : 'Question Prompt'}
              </span>
              <span>{currentCard.category}</span>
            </div>

            {/* Card Content Body */}
            <div className="my-auto text-center py-4">
              {!isFlipped ? (
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                    {currentCard.front}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Click card or press space to reveal underlying mechanics
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                    {currentCard.back}
                  </p>
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80 pt-3">
              <span>Difficulty: {currentCard.difficulty}</span>
              <span className="text-amber-400 font-medium">
                {isFlipped ? 'Rate retention below' : 'Click to flip'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Spaced Repetition Rating Bar (when flipped) */}
      <div className="max-w-xl mx-auto">
        {isFlipped ? (
          <div className="grid grid-cols-4 gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl animate-in fade-in duration-200">
            <button
              onClick={() => handleRate('again')}
              className="p-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors flex flex-col items-center"
            >
              <span>Again</span>
              <span className="text-[10px] text-rose-400/80 font-mono">&lt; 10 min</span>
            </button>
            <button
              onClick={() => handleRate('hard')}
              className="p-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-colors flex flex-col items-center"
            >
              <span>Hard</span>
              <span className="text-[10px] text-amber-400/80 font-mono">2 days</span>
            </button>
            <button
              onClick={() => handleRate('good')}
              className="p-2.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-colors flex flex-col items-center"
            >
              <span>Good</span>
              <span className="text-[10px] text-cyan-400/80 font-mono">4 days</span>
            </button>
            <button
              onClick={() => handleRate('easy')}
              className="p-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors flex flex-col items-center"
            >
              <span>Easy</span>
              <span className="text-[10px] text-emerald-400/80 font-mono">7 days</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between px-2 text-xs text-slate-400">
            <button
              onClick={() => {
                if (currentIndex > 0) {
                  setCurrentIndex((prev) => prev - 1);
                  setIsFlipped(false);
                }
              }}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Card</span>
            </button>

            <span>Tip: Try explaining the answer out loud before flipping</span>

            <button
              onClick={() => {
                if (currentIndex < cards.length - 1) {
                  setCurrentIndex((prev) => prev + 1);
                  setIsFlipped(false);
                }
              }}
              disabled={currentIndex === cards.length - 1}
              className="flex items-center gap-1 hover:text-white disabled:opacity-30 transition-colors"
            >
              <span>Next Card</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
