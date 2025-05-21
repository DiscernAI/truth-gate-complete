const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

const memory = {}; // simple in-memory store

router.post('/', async (req, res) => {
  try {
    const { userId, input, persona } = req.body;

    if (!userId || !input) {
      return res.status(400).json({ error: 'Missing userId or input.' });
    }

    if (!memory[userId]) memory[userId] = [];
    memory[userId].push({ role: 'user', content: input });

    const messages = [
      { role: 'system', content: `You are a persona named ${persona}. Reply truthfully and clearly.` },
      ...memory[userId].slice(-10)
    ];

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages
    });

    const output = completion.data.choices[0].message.content;
    memory[userId].push({ role: 'assistant', content: output });

    res.json({ output, contextHistory: memory[userId].slice(-10) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;
