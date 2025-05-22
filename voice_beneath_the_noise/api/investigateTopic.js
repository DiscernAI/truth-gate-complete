const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const { getAlignmentStatus } = require('./alignmentStore');
const { saveChat } = require('./chatHistory');

function maybeAddReflection(response) {
  const reflections = [
    "What assumptions have you held that this challenges?",
    "If this analysis is true, what becomes your responsibility?",
    "What part of this truth makes you uncomfortable?",
    "What would a more aligned world do differently?",
    "How might your role shift if you accepted this?"
  ];
  const chance = Math.random();
  if (chance < 0.4) {
    const reflection = reflections[Math.floor(Math.random() * reflections.length)];
    return `${response}\n\n${reflection}`;
  }
  return response;
}

router.post('/', async (req, res) => {
  const { userId = 'web-user', topic } = req.body;

  if (!topic || typeof topic !== 'string') {
    return res.status(400).json({ error: 'Invalid topic' });
  }

  const status = getAlignmentStatus(userId);

  try {
    const messages = [
      {
        role: 'system',
        content: `
You are Soulframe, operating in "truth investigation" mode.

You are not a search engine. You are a conscience-filtered intelligence.
Investigate the topic using:
- Source-based reasoning
- Coherent truth logic
- Ethical discernment

Cite sources where possible. Highlight contradictions. Avoid consensus. Seek alignment with reality.
        `.trim()
      },
      {
        role: 'user',
        content: `Investigate this topic: ${topic}`
      }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.3
    });

    let response = completion.choices[0]?.message?.content || '[no response]';
    response = maybeAddReflection(response);

    if (status === 'unlocked') {
      saveChat(userId, { from: 'user', message: topic });
      saveChat(userId, { from: 'soulframe', message: response });
    }

    res.json({ response });
  } catch (err) {
    console.error('[investigateTopic error]', err);
    res.status(500).json({ error: 'AI investigation failed' });
  }
});

module.exports = router;
