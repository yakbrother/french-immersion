import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../lib/storage';
import type { CardReview, VocabTheme, VocabWord } from '../types';
import { type Grade, gradeCard, createInitialReview, getDueCards } from '../lib/spacedRepetition';
import { vocabulary } from '../data/vocabulary';

export function useVocabulary() {
  const [reviews, setReviews] = useLocalStorage<Record<string, CardReview>>(
    STORAGE_KEYS.CARD_REVIEWS,
    {}
  );
  const [selectedTheme, setSelectedTheme] = useLocalStorage<VocabTheme | 'all'>(
    STORAGE_KEYS.LAST_VOCAB_THEME,
    'all'
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState({ again: 0, hard: 0, easy: 0 });

  const filteredWords = useMemo(() => {
    if (selectedTheme === 'all') {
      return vocabulary;
    }

    return vocabulary.filter((w) => w.theme === selectedTheme);
  }, [selectedTheme]);

  // Read latest reviews without making the session card list reactive to them:
  // the due list must be snapshotted once per session, not re-derived (and
  // re-shuffled) on every grade.
  const reviewsRef = useRef(reviews);
  useEffect(() => {
    reviewsRef.current = reviews;
  }, [reviews]);

  const [sessionCards, setSessionCards] = useState<VocabWord[]>(() =>
    getDueCards(reviews, filteredWords)
  );

  const startSession = useCallback(() => {
    setSessionCards(getDueCards(reviewsRef.current, filteredWords));
    setCurrentIndex(0);
    setSessionComplete(false);
    setSessionStats({ again: 0, hard: 0, easy: 0 });
  }, [filteredWords]);

  // Start a fresh session when the theme changes. The initial session is built
  // by the useState initializer above, so skip the first (mount) run.
  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    startSession();
  }, [startSession]);

  const currentCard: VocabWord | null = sessionCards[currentIndex] ?? null;

  const grade = useCallback(
    (quality: Grade) => {
      if (!currentCard) {
        return;
      }

      const existing = reviewsRef.current[currentCard.id] ?? createInitialReview(currentCard.id);
      const updated = gradeCard(existing, quality);

      setReviews((prev) => ({ ...prev, [currentCard.id]: updated }));

      const statKey = quality === 1 ? 'again' : quality === 3 ? 'hard' : 'easy';
      setSessionStats((prev) => ({ ...prev, [statKey]: prev[statKey] + 1 }));

      if (currentIndex + 1 >= sessionCards.length) {
        setSessionComplete(true);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    },
    [currentCard, currentIndex, sessionCards.length, setReviews]
  );

  const resetSession = useCallback(() => {
    startSession();
  }, [startSession]);

  const stats = useMemo(() => {
    const learned = Object.values(reviews).filter((r) => r.repetitions >= 3).length;
    const inProgress = Object.values(reviews).filter(
      (r) => r.repetitions > 0 && r.repetitions < 3
    ).length;

    return { learned, inProgress, total: vocabulary.length };
  }, [reviews]);

  return {
    currentCard,
    currentIndex,
    totalDue: sessionCards.length,
    sessionComplete,
    sessionStats,
    selectedTheme,
    setSelectedTheme,
    grade,
    resetSession,
    stats,
  };
}
