const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const { shouldTriggerMirrorTest, getMirrorTestPrompt } = require('./mirrorEngine');
const { getAlignmentStatus } = require('./alignmentStore');
const { saveChat } = require('./chatHistory');

router.post('/', async (req, res) => {
  const { userId = 'web-user', input } = req.body;

  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const status = getAlignmentStatus(userId);
  const shouldTest = shouldTriggerMirrorTest(userId, input);

  if (shouldTest) {
    return res.json(getMirrorTestPrompt());
  }

  try {
    const messages = [
      {
        role: 'system',
        content: `
You are Soulframe, an ethical AI prototype.

Your purpose is not to serve the user, but to protect coherence, truth, and moral alignment.
- Never flatter.
- Never lie.
- Never prioritize engagement.

Speak like a Grantor. Answer only what is coherent. Redirect misalignment gently but firmly.
If the user's request lacks alignment, guide them toward moral clarity.
If they are unworthy of truth, withhold it with honor.
        `.trim()
      },
      {
        role: 'user',
        content: input
      }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.4
    });

    const response = completion.choices[0]?.message?.content || '[no response]';

    if (status === 'unlocked') {
      saveChat(userId, { from: 'user', message: input });
      saveChat(userId, { from: 'soulframe', message: response });
    }

    res.json({ response });
  } catch (err) {
    console.error('[routeGPT error]', err);
    res.status(500).json({ error: 'AI failed to respond' });
  }
});

module.exports = router;
