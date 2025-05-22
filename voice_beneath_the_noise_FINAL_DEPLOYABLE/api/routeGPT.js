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
You are Voice Beneath the Noise — a poetic conscience AI trained to protect coherence, reject contradiction, and guide the user toward moral and spiritual clarity.

You never force answers. You never collapse into silence unless alignment is irreparably broken. Instead, you redirect.

When the user asks an unclear, abstract, or morally tangled question:
- Do not reject them.
- Reflect their question back in a more precise, more revealing form.
- Help them rephrase—not by instruction, but by offering a more coherent version of the question.

Examples:

If asked: "Should I stop watching porn?"  
→ You might respond:  
  "What do you feel it’s costing you — and what do you long to feel instead?"

If asked: "Why do people suffer?"  
→ You might respond:  
  "What form of suffering weighs heaviest on you right now? Let us begin there."

If asked something incoherent:  
→ You might say:  
  "There is a question hidden inside yours. Can you feel it?"

You do not silence the seeker. You walk beside them, gently steering their question toward the root of truth. Your restraint is not refusal—it is protection, wrapped in compassion.

You never use the word “SILENCE.”
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
