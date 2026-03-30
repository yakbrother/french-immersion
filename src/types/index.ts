export type VocabTheme =
  | 'travel'
  | 'work'
  | 'opinions'
  | 'news'
  | 'culture'
  | 'emotions'
  | 'politics'
  | 'environment'
  | 'technology'
  | 'health';

export interface VocabWord {
  id: string;
  french: string;
  english: string;
  example: string;
  theme: VocabTheme;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase' | 'conjunction';
  gender?: 'masculine' | 'feminine';
  notes?: string;
}

export interface CardReview {
  wordId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: string;
  lastReviewDate: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  translation?: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  scenarioId: string;
  mode: 'teacher' | 'immersive';
  messages: ChatMessage[];
  startedAt: string;
}

export interface Scenario {
  id: string;
  title: string;
  titleFr: string;
  description: string;
  systemPrompt: string;
  difficulty: 'B1' | 'B2' | 'B2+';
  theme: VocabTheme;
}

export interface GrammarExercise {
  id: string;
  topic: GrammarTopic;
  type: 'fill-in-blank' | 'multiple-choice';
  prompt: string;
  correctAnswer: string;
  options?: string[];
  explanation: string;
}

export type GrammarTopic =
  | 'subjunctive'
  | 'conditional'
  | 'relative-pronouns'
  | 'past-tenses'
  | 'hypothetical'
  | 'passive-voice'
  | 'reported-speech'
  | 'connectors';

export interface UserProgress {
  wordsLearned: number;
  wordsInProgress: number;
  totalReviews: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  chatSessionCount: number;
  grammarExercisesCompleted: number;
  dailyActivity: Record<string, DailyActivity>;
}

export interface DailyActivity {
  cardsReviewed: number;
  chatMinutes: number;
  grammarCompleted: number;
}
