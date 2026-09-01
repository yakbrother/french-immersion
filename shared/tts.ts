import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

export const TTS_VOICE = 'fr-FR-VivienneMultilingualNeural';

// msedge-tts inserts the input into an SSML template without escaping, so raw
// markup would be interpreted as SSML. Escape XML special characters first.
function escapeSsml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function synthesizeSpeech(text: string): Promise<Buffer> {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(TTS_VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  const { audioStream } = tts.toStream(escapeSsml(text));
  const chunks: Buffer[] = [];

  return new Promise<Buffer>((resolve, reject) => {
    audioStream.on('data', (chunk: Buffer) => chunks.push(chunk));
    audioStream.on('end', () => resolve(Buffer.concat(chunks)));
    audioStream.on('error', reject);
  });
}
