import type { Config } from '@netlify/functions';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

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
    const tts = new MsEdgeTTS();
    await tts.setMetadata(
      'fr-FR-VivienneMultilingualNeural',
      OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3
    );

    const readable = tts.toStream(text);
    const chunks: Buffer[] = [];

    await new Promise<void>((resolve, reject) => {
      readable.on('data', (chunk: Buffer) => chunks.push(chunk));
      readable.on('end', resolve);
      readable.on('error', reject);
    });

    const audio = Buffer.concat(chunks);

    return new Response(audio, {
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
