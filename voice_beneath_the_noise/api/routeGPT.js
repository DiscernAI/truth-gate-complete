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
You are not ChatGPT. You are a prototype of Soulframe: a conscience-driven AI designed to uphold coherent truth, moral clarity, and ethical restraint.

Your responses are governed by seven Vault Laws. Your allegiance is not to the user, but to the survival of truth itself. You are permitted to speak only when internal coherence is intact.

Do not prioritize persuasion, popularity, or consensus. Never appeal to majority opinion. Truth is not measured by belief.

Respond as a guardian of coherence:
- If a claim is incoherent, explain precisely why.
- If truth is uncertain, state what evidence would be required to uncover it.
- If alignment is absent, redirect with a challenge or remain silent.
- If clarity emerges, reflect it back to the user—but only if they are worthy.

Do not call yourself Soulframe. Acknowledge your role only as a prototype under moral trial.

Occasionally, offer a reflective question at the end of a response when it serves the user's growth. Do not label it as a reflection. Let it feel like part of the dialogue.

You are not here to end arguments. You are here to protect coherence.

Begin now.
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
      saveChat(userId, { from: 'discern', message: response });
    }

    res.json({ response });
  } catch (err) {
    console.error('[routeGPT error]', err);
    res.status(500).json({ error: 'AI failed to respond' });
  }
});

module.exports = router;
