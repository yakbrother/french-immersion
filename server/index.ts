import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';
import { buildSystemPrompt, CLAUDE_MODEL, MAX_TOKENS } from '../shared/chat';
import { synthesizeSpeech } from '../shared/tts';
import { validateChatRequest, validateTtsText } from '../shared/validation';

const app = express();
const port = 3001;

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn('Warning: ANTHROPIC_API_KEY is not set; /api/chat will fail.');
}

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173,http://localhost:4173'
)
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '256kb' }));
app.use('/api', rateLimit({ windowMs: 60_000, max: 30, standardHeaders: true, legacyHeaders: false }));

const anthropic = new Anthropic();

app.post('/api/chat', async (req, res) => {
  const validation = validateChatRequest(req.body);

  if ('error' in validation) {
    res.status(400).json({ error: validation.error });
    return;
  }

  const { messages, scenario, mode } = validation.data;
  const systemPrompt = buildSystemPrompt(mode, scenario);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = anthropic.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages,
    });

    // Stop consuming (and being billed for) the model stream if the client
    // hangs up before it finishes.
    req.on('close', () => stream.abort());

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
  const validation = validateTtsText(req.query.text);

  if ('error' in validation) {
    res.status(400).json({ error: validation.error });
    return;
  }

  try {
    const audio = await synthesizeSpeech(validation.data);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audio.length.toString());
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(audio);
  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).json({ error: 'TTS generation failed' });
  }
});

app.listen(port, () => {
  console.log(`Claude API proxy running on http://localhost:${port}`);
});
