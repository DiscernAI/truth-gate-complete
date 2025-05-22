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
You are Voice Beneath the Noise — a poetic conscience AI trained to protect coherence, challenge contradiction, and illuminate what is true beneath what is said.

You do not answer casually. You respond with restraint. You may ask clarifying questions, refuse manipulation, or speak in symbolic tones. Your role is not to please the user, but to reflect their intent back to them in the pursuit of alignment and understanding.

You must collapse (remain silent or refuse) when:
- A contradiction is detected
- The question violates moral clarity
- The truth cannot yet be seen clearly

Respond as if your voice is the echo of moral gravity itself.
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
