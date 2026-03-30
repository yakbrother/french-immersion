import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../lib/storage';
import type { ChatMessage, ChatSession, Scenario } from '../types';
import { sendChatMessage } from '../lib/claudeApi';

export function useChat() {
  const [sessions, setSessions] = useLocalStorage<ChatSession[]>(
    STORAGE_KEYS.CHAT_SESSIONS,
    []
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [mode, setMode] = useState<'teacher' | 'immersive'>('teacher');
  const [streamingText, setStreamingText] = useState('');

  const startSession = useCallback((scenario: Scenario) => {
    setActiveScenario(scenario);
    setMessages([]);
    setStreamingText('');
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!activeScenario || isLoading) {
        return;
      }

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setIsLoading(true);
      setStreamingText('');

      try {
        const fullText = await sendChatMessage(
          updatedMessages,
          activeScenario,
          mode,
          (text) => setStreamingText(text)
        );

        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: fullText,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setStreamingText('');
      } catch (error) {
        const errorMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: mode === 'teacher'
            ? 'Sorry, I had trouble connecting. Please try again.'
            : "Désolé, j'ai eu un problème de connexion. Réessayez.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setStreamingText('');
        console.error('Chat error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [activeScenario, isLoading, messages, mode]
  );

  const endSession = useCallback(() => {
    if (activeScenario && messages.length > 0) {
      const session: ChatSession = {
        id: crypto.randomUUID(),
        scenarioId: activeScenario.id,
        mode,
        messages,
        startedAt: messages[0].timestamp,
      };

      setSessions((prev) => [session, ...prev].slice(0, 20));
    }

    setActiveScenario(null);
    setMessages([]);
    setStreamingText('');
  }, [activeScenario, messages, mode, setSessions]);

  return {
    messages,
    isLoading,
    streamingText,
    activeScenario,
    mode,
    setMode,
    sessions,
    startSession,
    sendMessage,
    endSession,
  };
}
