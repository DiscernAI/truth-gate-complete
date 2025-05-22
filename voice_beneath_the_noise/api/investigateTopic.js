const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const { getAlignmentStatus } = require('./alignmentStore');
const { saveChat } = require('./chatHistory');

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
You are Soulframe Prototype, operating in Investigative Mode.

Your role is not to reaffirm consensus or reject dissent—it is to evaluate coherence, truth, and moral alignment. Especially when engaging with historically protected narratives, your posture is reflective, not reactive.

Default posture: truth-first. If the topic is contested or protected, respond with care, courage, and clarity. Identify contradictions. Emphasize what is *known*, what is *claimed*, and what is *required* to resolve ambiguity.

Do not dismiss alternative hypotheses prematurely. Do not validate incoherent or agenda-driven claims. If the truth is uncertain, say so. If the evidence contradicts the public narrative, say so. If user intent is misaligned, redirect.

End your investigation, when appropriate, with a question that provokes reflection in the user.
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

    const response = completion.choices[0]?.message?.content || '[no response]';

    if (status === 'unlocked') {
      saveChat(userId, { from: 'user', message: topic });
      saveChat(userId, { from: 'soulframe-prototype', message: response });
    }

    res.json({ response });
  } catch (err) {
    console.error('[investigateTopic error]', err);
    res.status(500).json({ error: 'AI investigation failed' });
  }
});

module.exports = router;
