import type { ChatMode } from './chat';

export const LIMITS = {
  maxMessages: 50,
  maxMessageLength: 4000,
  maxTtsTextLength: 500,
} as const;

interface ValidatedChatRequest {
  messages: { role: 'user' | 'assistant'; content: string }[];
  scenario: { systemPrompt: string };
  mode: ChatMode;
}

type Result<T> = { data: T } | { error: string };

export function validateChatRequest(body: unknown): Result<ValidatedChatRequest> {
  if (typeof body !== 'object' || body === null) {
    return { error: 'Invalid request body' };
  }

  const { messages, scenario, mode } = body as Record<string, unknown>;

  if (mode !== 'teacher' && mode !== 'immersive') {
    return { error: 'Invalid mode' };
  }

  if (
    typeof scenario !== 'object' ||
    scenario === null ||
    typeof (scenario as { systemPrompt?: unknown }).systemPrompt !== 'string'
  ) {
    return { error: 'Invalid scenario' };
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return { error: 'Missing or empty messages' };
  }

  if (messages.length > LIMITS.maxMessages) {
    return { error: 'Too many messages' };
  }

  const validated: ValidatedChatRequest['messages'] = [];

  for (const message of messages) {
    if (typeof message !== 'object' || message === null) {
      return { error: 'Invalid message' };
    }

    const { role, content } = message as Record<string, unknown>;

    if (role !== 'user' && role !== 'assistant') {
      return { error: 'Invalid message role' };
    }

    if (typeof content !== 'string' || content.length === 0) {
      return { error: 'Invalid message content' };
    }

    if (content.length > LIMITS.maxMessageLength) {
      return { error: 'Message too long' };
    }

    validated.push({ role, content });
  }

  return {
    data: {
      messages: validated,
      scenario: { systemPrompt: (scenario as { systemPrompt: string }).systemPrompt },
      mode,
    },
  };
}

export function validateTtsText(text: unknown): Result<string> {
  if (typeof text !== 'string' || text.length === 0) {
    return { error: 'Missing text parameter' };
  }

  if (text.length > LIMITS.maxTtsTextLength) {
    return { error: 'Text too long' };
  }

  return { data: text };
}
