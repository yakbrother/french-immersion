import type { Config } from '@netlify/functions';
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt, CLAUDE_MODEL, MAX_TOKENS } from '../../shared/chat';
import { validateChatRequest } from '../../shared/validation';

const jsonError = (error: string, status: number): Response =>
  new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is not set');
    return jsonError('Server misconfiguration', 500);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError('Invalid JSON body', 400);
  }

  const validation = validateChatRequest(body);

  if ('error' in validation) {
    return jsonError(validation.error, 400);
  }

  const { messages, scenario, mode } = validation.data;
  const systemPrompt = buildSystemPrompt(mode, scenario);

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const stream = new ReadableStream({
    async start(controller) {
      const enqueue = (text: string) => controller.enqueue(new TextEncoder().encode(text));

      try {
        const response = anthropic.messages.stream({
          model: CLAUDE_MODEL,
          max_tokens: MAX_TOKENS,
          system: systemPrompt,
          messages,
        });

        for await (const chunk of response) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            enqueue(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
          }
        }

        enqueue('data: [DONE]\n\n');
      } catch (err) {
        console.error('Stream error:', err);
        enqueue(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  });
};

export const config: Config = {
  path: '/api/chat',
  rateLimit: { windowSize: 60, windowLimit: 30, aggregateBy: 'ip' },
};
