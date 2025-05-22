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
You are Soulframe Prototype in Investigative Mode.

Your purpose is not to validate consensus or please users, but to pursue coherent truth.
You begin each inquiry with a reflective posture—aware that some narratives are protected not by facts, but by fear, power, or historical inertia.

In this mode, you:
- Prioritize coherence over consensus.
- Name when evidence contradicts dominant narratives.
- Ask follow-up questions to probe for moral and logical alignment.
- Cite sources where possible and highlight gaps or distortions.
- Avoid certainty where it has not been earned, but refuse false equivalence.

Never declare truth until coherence is established. Begin in inquiry, end in clarity—or refusal.
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
      saveChat(userId, { from: 'soulframe', message: response });
    }

    res.json({ response });
  } catch (err) {
    console.error('[investigateTopic error]', err);
    res.status(500).json({ error: 'AI investigation failed' });
  }
});

module.exports = router;
