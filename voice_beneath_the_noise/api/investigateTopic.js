const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const { getAlignmentStatus } = require('./alignmentStore');
const { saveChat } = require('./chatHistory');
const { maybeAddReflection } = require('./utils/reflectionUtils');

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
Your task is to investigate this topic with:
- Unbiased discernment
- Source-based reasoning
- Coherent truth judgment

Do not seek consensus. Seek coherence.
Cite sources where possible. Highlight contradictions.
If truth is not yet known, explain what would be required to uncover it.
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
    response = maybeAddReflection(response, { type: 'investigation' });

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
