const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple in-memory message history (per user)
const userMemory = {};

router.post('/', async (req, res) => {
  try {
    const { userId, input, persona } = req.body;

    if (!userId || !input) {
      return res.status(400).json({ error: 'Missing userId or input' });
    }

    // Initialize user memory if not exists
    if (!userMemory[userId]) {
      userMemory[userId] = [];
    }

    // Add new message to memory
    userMemory[userId].push({ role: 'user', content: input });

    // Trim history to last 10 messages max
    if (userMemory[userId].length > 10) {
      userMemory[userId] = userMemory[userId].slice(-10);
    }

    // Construct full prompt with persona context if provided
    const systemPrompt = persona
      ? { role: 'system', content: `You are acting as a persona named "${persona}". Respond with that mindset.` }
      : { role: 'system', content: 'You are a helpful assistant.' };

    const messages = [systemPrompt, ...userMemory[userId]];

    // Send to OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
    });

    const reply = completion.choices[0].message.content;

    // Store assistant's reply in memory too
    userMemory[userId].push({ role: 'assistant', content: reply });

    res.json({ response: reply });
  } catch (error) {
    console.error('Error in /api/routeGPT:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

module.exports = router;
