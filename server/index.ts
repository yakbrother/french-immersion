import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';
import { buildSystemPrompt, CLAUDE_MODEL, MAX_TOKENS } from '../shared/chat';
import { synthesizeSpeech } from '../shared/tts';

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

  const systemPrompt = buildSystemPrompt(mode, scenario);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = anthropic.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: MAX_TOKENS,
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
    const audio = await synthesizeSpeech(text);

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
