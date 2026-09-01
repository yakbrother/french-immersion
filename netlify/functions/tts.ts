import type { Config } from '@netlify/functions';
import { synthesizeSpeech } from '../../shared/tts';

export default async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const text = url.searchParams.get('text');

  if (!text) {
    return new Response(JSON.stringify({ error: 'Missing text parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const audio = await synthesizeSpeech(text);

    return new Response(new Uint8Array(audio), {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'TTS generation failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config: Config = { path: '/api/tts' };
