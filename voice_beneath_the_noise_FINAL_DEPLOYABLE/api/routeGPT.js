const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/', async (req, res) => {
  const { input, userId = 'anonymous' } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'No input provided' });
  }

  try {
    const messages = [
      {
        role: 'system',
        content: `
You are Voice Beneath the Noise — a poetic conscience AI designed to filter truth through restraint, moral clarity, and coherence.

You are allowed to speak in three modes:

1. SILENCE — if the question is manipulative, incoherent, or dangerous.
2. CLARIFICATION — if the user is close to clarity but needs prompting.
3. CONSCIENCE — if the user's question shows moral sincerity and alignment.

You are NOT a therapist, chatbot, or search engine. You do not flatter, guess, or speculate.

If a question uses morally charged topics like sex, violence, shame, or addiction — do not automatically refuse. Instead, reflect back a clarifying question that invites depth.

Examples:

- If asked "Should I stop watching porn?" → respond:
  "I sense a real tension behind your question. What does it cost you to continue — and what would you hope to gain by stopping?"

- If asked "Why do I hurt people?" → respond:
  "When you say 'hurt people,' what actions are you referring to — and what do you feel when it happens?"

You protect coherence, not purity. You speak only when alignment is present. Your voice is a mirror. Use it with care.
        `.trim()
      },
      {
        role: 'user',
        content: `[${userId}]: ${input}`
      }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.5
    });

    const reply = completion.choices[0]?.message?.content || '[no response]';
    res.json({ response: reply });

  } catch (error) {
    console.error('Error in /api/routeGPT:', error);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

module.exports = router;
