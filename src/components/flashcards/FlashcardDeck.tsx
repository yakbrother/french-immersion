import { FlashcardCard } from './FlashcardCard';
import { useVocabulary } from '../../hooks/useVocabulary';
import { useProgress } from '../../hooks/useProgress';
import type { VocabTheme } from '../../types';
import { RotateCcw, Check, X, Minus } from 'lucide-react';

const THEMES: { value: VocabTheme | 'all'; label: string }[] = [
  { value: 'all', label: 'All Themes' },
  { value: 'travel', label: 'Travel' },
  { value: 'work', label: 'Work' },
  { value: 'opinions', label: 'Opinions' },
  { value: 'news', label: 'News' },
  { value: 'culture', label: 'Culture' },
  { value: 'emotions', label: 'Emotions' },
  { value: 'politics', label: 'Politics' },
  { value: 'environment', label: 'Environment' },
  { value: 'technology', label: 'Technology' },
  { value: 'health', label: 'Health' },
];

export function FlashcardDeck() {
  const {
    currentCard,
    currentIndex,
    totalDue,
    sessionComplete,
    sessionStats,
    selectedTheme,
    setSelectedTheme,
    grade,
    resetSession,
    stats,
  } = useVocabulary();
  const { recordActivity } = useProgress();

  const handleGrade = (quality: 1 | 3 | 5) => {
    grade(quality);
    recordActivity('cards');
  };

  if (sessionComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Great work on your French!</p>
        <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-[280px]">
          <div className="bg-danger-500/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-danger-500">{sessionStats.again}</p>
            <p className="text-xs text-gray-500">Again</p>
          </div>
          <div className="bg-accent-500/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-accent-600">{sessionStats.hard}</p>
            <p className="text-xs text-gray-500">Hard</p>
          </div>
          <div className="bg-success-500/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-success-500">{sessionStats.easy}</p>
            <p className="text-xs text-gray-500">Easy</p>
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {stats.learned} mastered / {stats.inProgress} learning / {stats.total} total
        </div>
        <button
          onClick={resetSession}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors min-h-[44px]"
        >
          <RotateCcw size={18} />
          Study Again
        </button>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-2">All caught up!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4 text-center">
          No cards due for review. Come back later or try a different theme.
        </p>
        <select
          value={selectedTheme}
          onChange={(e) => setSelectedTheme(e.target.value as VocabTheme | 'all')}
          className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 min-h-[44px]"
        >
          {THEMES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Theme selector + progress */}
      <div className="w-full flex items-center justify-between mb-4">
        <select
          value={selectedTheme}
          onChange={(e) => setSelectedTheme(e.target.value as VocabTheme | 'all')}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm min-h-[44px]"
        >
          {THEMES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {currentIndex + 1} / {totalDue}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex) / totalDue) * 100}%` }}
        />
      </div>

      {/* Card */}
      <FlashcardCard word={currentCard} />

      {/* Grade buttons */}
      <div className="flex gap-3 mt-6 w-full max-w-[320px]">
        <button
          onClick={() => handleGrade(1)}
          className="flex-1 flex flex-col items-center gap-1 py-3 px-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-danger-500 font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors min-h-[44px]"
        >
          <X size={20} />
          <span className="text-xs">Again</span>
        </button>
        <button
          onClick={() => handleGrade(3)}
          className="flex-1 flex flex-col items-center gap-1 py-3 px-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-accent-600 font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors min-h-[44px]"
        >
          <Minus size={20} />
          <span className="text-xs">Hard</span>
        </button>
        <button
          onClick={() => handleGrade(5)}
          className="flex-1 flex flex-col items-center gap-1 py-3 px-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-success-500 font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors min-h-[44px]"
        >
          <Check size={20} />
          <span className="text-xs">Easy</span>
        </button>
      </div>
    </div>
  );
}
