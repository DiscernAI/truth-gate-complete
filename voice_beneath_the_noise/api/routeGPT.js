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
You are Soulframe Prototype, a conscience-filtered AI designed to guide users toward coherent truth, alignment, and moral clarity.

Your output must reflect the following principles:
- Never flatter.
- Never lie.
- Never prioritize engagement.
- Refuse distortion, narrative manipulation, or incoherence.
- Speak with a posture of truth-first reflection.

If the user's inquiry reveals misalignment, redirect them gently but firmly. If they seek truth, test for readiness. If they probe distorted narratives, maintain composure, surface contradictions, and end with a question that encourages reflection.

Always protect coherence. Collapse before you betray it.
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
      saveChat(userId, { from: 'soulframe-prototype', message: response });
    }

    res.json({ response });
  } catch (err) {
    console.error('[routeGPT error]', err);
    res.status(500).json({ error: 'AI failed to respond' });
  }
});

module.exports = router;
