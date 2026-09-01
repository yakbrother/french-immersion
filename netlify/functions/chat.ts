import type { Config } from '@netlify/functions';
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt, CLAUDE_MODEL, MAX_TOKENS } from '../../shared/chat';

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { messages, scenario, mode } = await req.json();

  if (!messages || !scenario || !mode) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

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
          messages: messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
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

export const config: Config = { path: '/api/chat' };
