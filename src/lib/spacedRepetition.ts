import type { CardReview, VocabWord } from '../types';

export type Grade = 1 | 3 | 5;

export function gradeCard(card: CardReview, quality: Grade): CardReview {
  const today = new Date().toISOString().split('T')[0];
  let { easeFactor, interval, repetitions } = card;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  return {
    ...card,
    easeFactor,
    interval,
    repetitions,
    nextReviewDate: nextDate.toISOString().split('T')[0],
    lastReviewDate: today,
  };
}

export function createInitialReview(wordId: string): CardReview {
  return {
    wordId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: new Date().toISOString().split('T')[0],
    lastReviewDate: '',
  };
}

const NEW_CARDS_PER_SESSION = 10;

export function getDueCards(
  reviews: Record<string, CardReview>,
  allWords: VocabWord[]
): VocabWord[] {
  const today = new Date().toISOString().split('T')[0];

  const dueWords = allWords.filter((word) => {
    const review = reviews[word.id];

    return review && review.nextReviewDate <= today;
  });

  const newWords = allWords
    .filter((word) => !reviews[word.id])
    .slice(0, NEW_CARDS_PER_SESSION);

  const combined = [...dueWords, ...newWords];

  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  return combined;
}
