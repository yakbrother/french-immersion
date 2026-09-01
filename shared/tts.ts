import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

export const TTS_VOICE = 'fr-FR-VivienneMultilingualNeural';

export async function synthesizeSpeech(text: string): Promise<Buffer> {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(TTS_VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  const { audioStream } = tts.toStream(text);
  const chunks: Buffer[] = [];

  return new Promise<Buffer>((resolve, reject) => {
    audioStream.on('data', (chunk: Buffer) => chunks.push(chunk));
    audioStream.on('end', () => resolve(Buffer.concat(chunks)));
    audioStream.on('error', reject);
  });
}
