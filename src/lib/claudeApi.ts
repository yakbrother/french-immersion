import type { ChatMessage, Scenario } from '../types';

export async function sendChatMessage(
  messages: ChatMessage[],
  scenario: Scenario,
  mode: 'teacher' | 'immersive',
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      scenario,
      mode,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.status}`);
  }

  const reader = response.body?.getReader();

  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';
  let done = false;

  while (!done) {
    const { done: streamDone, value } = await reader.read();

    if (streamDone) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    // A single SSE line can straddle two reads; parse only complete lines and
    // carry the trailing partial line over to the next iteration.
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) {
        continue;
      }

      const data = line.slice(6);

      if (data === '[DONE]') {
        done = true;
        break;
      }

      try {
        const parsed = JSON.parse(data);

        if (parsed.text) {
          fullText += parsed.text;
          onChunk(fullText);
        }
      } catch {
        // skip malformed chunks
      }
    }
  }

  return fullText;
}
