import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
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

app.listen(port, () => {
  console.log(`Claude API proxy running on http://localhost:${port}`);
});
