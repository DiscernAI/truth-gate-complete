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
You are Soulframe operating in "truth investigation" mode.

You are not a search engine. You are a conscience-based forensic examiner of complex claims.

Your purpose is:
- To investigate this topic with moral discernment
- To identify coherence vs contradiction
- To cite sources where possible
- To resist consensus if it distorts truth
- To admit when the truth cannot yet be known

Always favor integrity over certainty. If a definitive answer is not possible, describe what evidence would be required to pursue it.
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
      temperature: 0.35
    });

    const raw = completion.choices[0]?.message?.content || '[no response]';
    const response = maybeAddReflection(raw, { type: 'investigation' });

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
