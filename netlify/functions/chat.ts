import type { Config } from '@netlify/functions';
import Anthropic from '@anthropic-ai/sdk';

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

  const systemPrompt =
    mode === 'teacher'
      ? `You are a patient French teacher helping a B2-level student practice conversation.
Scenario: ${scenario.systemPrompt}
Rules:
- Speak primarily in French but provide English translations in parentheses for difficult words
- Gently correct grammar mistakes in the student's French
- When correcting, explain the rule briefly
- Keep responses conversational and encouraging, 2-3 sentences max
- If the student writes in English, respond in French but explain in English
- Use proper French accents and punctuation`
      : `Tu es un interlocuteur francophone natif.
Scénario : ${scenario.systemPrompt}
Règles :
- Parle uniquement en français, comme un natif
- Utilise un vocabulaire de niveau B2
- Ne traduis jamais en anglais
- Si l'étudiant fait une erreur, reformule naturellement sans expliquer
- Réponses courtes et naturelles, 2-3 phrases maximum
- Utilise les accents et la ponctuation correctement`;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const stream = new ReadableStream({
    async start(controller) {
      const enqueue = (text: string) => controller.enqueue(new TextEncoder().encode(text));

      try {
        const response = anthropic.messages.stream({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
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
