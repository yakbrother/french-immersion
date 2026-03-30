import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../lib/storage';
import type { CardReview, UserProgress } from '../types';
import { vocabulary } from '../data/vocabulary';

const DEFAULT_PROGRESS: UserProgress = {
  wordsLearned: 0,
  wordsInProgress: 0,
  totalReviews: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
  chatSessionCount: 0,
  grammarExercisesCompleted: 0,
  dailyActivity: {},
};

export function useProgress() {
  const [reviews] = useLocalStorage<Record<string, CardReview>>(
    STORAGE_KEYS.CARD_REVIEWS,
    {}
  );
  const [progress, setProgress] = useLocalStorage<UserProgress>(
    STORAGE_KEYS.PROGRESS,
    DEFAULT_PROGRESS
  );
  const [grammarCompleted] = useLocalStorage<string[]>(
    STORAGE_KEYS.GRAMMAR_COMPLETED,
    []
  );

  const computedStats = useMemo(() => {
    const reviewList = Object.values(reviews);
    const learned = reviewList.filter((r) => r.repetitions >= 3).length;
    const inProgress = reviewList.filter(
      (r) => r.repetitions > 0 && r.repetitions < 3
    ).length;
    const totalReviews = reviewList.reduce((sum, r) => sum + r.repetitions, 0);

    return {
      wordsLearned: learned,
      wordsInProgress: inProgress,
      wordsNew: vocabulary.length - learned - inProgress,
      totalReviews,
      totalWords: vocabulary.length,
      grammarCompleted: grammarCompleted.length,
    };
  }, [reviews, grammarCompleted]);

  const recordActivity = (type: 'cards' | 'chat' | 'grammar', count = 1) => {
    const today = new Date().toISOString().split('T')[0];

    setProgress((prev) => {
      const activity = prev.dailyActivity[today] ?? {
        cardsReviewed: 0,
        chatMinutes: 0,
        grammarCompleted: 0,
      };

      if (type === 'cards') {
        activity.cardsReviewed += count;
      } else if (type === 'chat') {
        activity.chatMinutes += count;
      } else {
        activity.grammarCompleted += count;
      }

      let currentStreak = prev.currentStreak;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (prev.lastActiveDate === yesterdayStr || prev.lastActiveDate === today) {
        if (prev.lastActiveDate !== today) {
          currentStreak += 1;
        }
      } else if (prev.lastActiveDate !== today) {
        currentStreak = 1;
      }

      return {
        ...prev,
        currentStreak,
        longestStreak: Math.max(prev.longestStreak, currentStreak),
        lastActiveDate: today,
        dailyActivity: { ...prev.dailyActivity, [today]: activity },
      };
    });
  };

  return {
    progress,
    computedStats,
    recordActivity,
  };
}
