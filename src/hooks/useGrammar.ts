import { useState, useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../lib/storage';
import type { GrammarExercise, GrammarTopic } from '../types';
import { grammarExercises } from '../data/grammarExercises';

export function useGrammar() {
  const [completed, setCompleted] = useLocalStorage<string[]>(
    STORAGE_KEYS.GRAMMAR_COMPLETED,
    []
  );
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const topicExercises = useMemo(() => {
    if (!selectedTopic) {
      return [];
    }

    return grammarExercises.filter((e) => e.topic === selectedTopic);
  }, [selectedTopic]);

  const currentExercise: GrammarExercise | null = topicExercises[currentIndex] ?? null;

  const topics = useMemo(() => {
    const topicSet = new Set(grammarExercises.map((e) => e.topic));

    return Array.from(topicSet).map((topic) => {
      const exercises = grammarExercises.filter((e) => e.topic === topic);
      const completedCount = exercises.filter((e) => completed.includes(e.id)).length;

      return { topic, total: exercises.length, completed: completedCount };
    });
  }, [completed]);

  const checkAnswer = useCallback(
    (answer: string) => {
      if (!currentExercise) {
        return;
      }

      const correct = answer.trim().toLowerCase() === currentExercise.correctAnswer.toLowerCase();
      setIsCorrect(correct);
      setShowAnswer(true);

      if (correct && !completed.includes(currentExercise.id)) {
        setCompleted((prev) => [...prev, currentExercise.id]);
      }
    },
    [currentExercise, completed, setCompleted]
  );

  const nextExercise = useCallback(() => {
    setShowAnswer(false);
    setUserAnswer('');
    setIsCorrect(null);

    if (currentIndex + 1 < topicExercises.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setSelectedTopic(null);
      setCurrentIndex(0);
    }
  }, [currentIndex, topicExercises.length]);

  const selectTopic = useCallback((topic: GrammarTopic) => {
    setSelectedTopic(topic);
    setCurrentIndex(0);
    setShowAnswer(false);
    setUserAnswer('');
    setIsCorrect(null);
  }, []);

  return {
    topics,
    selectedTopic,
    selectTopic,
    currentExercise,
    currentIndex,
    totalInTopic: topicExercises.length,
    showAnswer,
    userAnswer,
    setUserAnswer,
    isCorrect,
    checkAnswer,
    nextExercise,
  };
}
