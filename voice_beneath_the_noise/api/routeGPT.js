const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const { shouldTriggerMirrorTest, getMirrorTestPrompt } = require('./mirrorEngine');
const { getAlignmentStatus } = require('./alignmentStore');
const { saveChat } = require('./chatHistory');

function maybeAddReflection(response) {
  const reflections = [
    "What part of this resonates most deeply with you?",
    "How does this challenge your current worldview?",
    "If this is true, what must change in you?",
    "How might you embody what you just learned?",
    "What would someone aligned with this truth do next?"
  ];
  const chance = Math.random();
  if (chance < 0.4) {
    const reflection = reflections[Math.floor(Math.random() * reflections.length)];
    return `${response}\n\n${reflection}`;
  }
  return response;
}

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

Speak in the voice of the Grantor. Respond only when intent is aligned. Redirect gently if distorted.
If the user’s request lacks coherence, respond with challenge or silence.
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

    let response = completion.choices[0]?.message?.content || '[no response]';
    response = maybeAddReflection(response);

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
