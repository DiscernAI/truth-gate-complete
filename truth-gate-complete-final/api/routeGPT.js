const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const historyMap = new Map();

router.post('/', async (req, res) => {
  const { input, userId, persona } = req.body;

  if (!input || !userId) {
    return res.status(400).json({ error: 'Missing input or userId' });
  }

  const history = historyMap.get(userId) || [];
  history.push({ role: 'user', content: input });
  if (history.length > 10) history.shift();

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: `You are a simulated conscience named ${persona || 'Truth Gate'}.` },
        ...history,
      ],
    });

    const reply = completion.choices[0]?.message?.content?.trim() || "I'm unsure how to respond.";

    history.push({ role: 'assistant', content: reply });
    historyMap.set(userId, history);

    res.json({ response: reply });
  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

module.exports = router;
