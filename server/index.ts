import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import 'dotenv/config';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const anthropic = new Anthropic();

app.post('/api/chat', async (req, res) => {
  const { messages, scenario, mode } = req.body;

  if (!messages || !scenario || !mode) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const systemPrompt = mode === 'teacher'
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

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    });

    stream.on('text', (text) => {
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    });

    stream.on('end', () => {
      res.write('data: [DONE]\n\n');
      res.end();
    });

    stream.on('error', (error) => {
      console.error('Stream error:', error);
      res.write(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`);
      res.end();
    });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to connect to Claude API' });
  }
});

app.get('/api/tts', async (req, res) => {
  const text = req.query.text as string;

  if (!text) {
    res.status(400).json({ error: 'Missing text parameter' });
    return;
  }

  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata('fr-FR-VivienneMultilingualNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    const readable = tts.toStream(text);
    const chunks: Buffer[] = [];

    readable.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    readable.on('end', () => {
      const audio = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', audio.length.toString());
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(audio);
    });

    readable.on('error', (error: Error) => {
      console.error('TTS stream error:', error);
      res.status(500).json({ error: 'TTS generation failed' });
    });
  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).json({ error: 'TTS generation failed' });
  }
});

app.listen(port, () => {
  console.log(`Claude API proxy running on http://localhost:${port}`);
});
