import type { Config } from '@netlify/functions';
import { synthesizeSpeech } from '../../shared/tts';
import { validateTtsText } from '../../shared/validation';

export default async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const validation = validateTtsText(url.searchParams.get('text'));

  if ('error' in validation) {
    return new Response(JSON.stringify({ error: validation.error }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const audio = await synthesizeSpeech(validation.data);

    return new Response(new Uint8Array(audio), {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err) {
    console.error('TTS error:', err);
    return new Response(JSON.stringify({ error: 'TTS generation failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config: Config = {
  path: '/api/tts',
  rateLimit: { windowSize: 60, windowLimit: 60, aggregateBy: 'ip' },
};
