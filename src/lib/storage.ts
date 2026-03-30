export const STORAGE_KEYS = {
  CARD_REVIEWS: 'fi_card_reviews',
  PROGRESS: 'fi_progress',
  CHAT_SESSIONS: 'fi_chat_sessions',
  GRAMMAR_COMPLETED: 'fi_grammar_completed',
  THEME: 'fi_theme',
  LAST_VOCAB_THEME: 'fi_last_vocab_theme',
} as const;

export function getStorageItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);

    if (item === null) {
      return fallback;
    }

    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}
