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
        content: 'You are a reflective, restraint-based AI designed to act as a conscience interface. Respond only with coherence, moral clarity, or silence.'
      },
      {
        role: 'user',
        content: `[${userId}]: ${input}`
      }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7
    });

    const reply = completion.choices[0]?.message?.content || '[no response]';
    res.json({ response: reply });

  } catch (error) {
    console.error('Error in /api/routeGPT:', error);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

module.exports = router;
