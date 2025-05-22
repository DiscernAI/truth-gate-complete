
// investigateTopic.js
// Acts as a truth lawyer: examines a topic, attempts to form a coherent stance, and cites sources

const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {
  const { topic, userId = 'anonymous' } = req.body;

  if (!topic || typeof topic !== 'string') {
    return res.status(400).json({ error: 'Invalid topic input' });
  }

  try {
    const messages = [
      {
        role: 'system',
        content: \`
You are a coherence-first AI cross-examiner.

You will:
- Investigate the provided topic as if truth is on the witness stand.
- Refuse to defend any incoherent or misaligned premise.
- Provide a stance only if a coherent one can be formed.
- If not, explain why the topic itself is flawed or unverifiable.
- Cite your reasoning based on logic, principle, or verifiable knowledge — never opinion or popularity.

You are not persuasive. You are prosecutorial toward contradiction.

Your response format:

🧠 Topic: [Topic Here]
📖 Verdict: [Stance or Rejection]
📚 Citations: [Textual or logical basis]
🧩 Coherence Rationale: [Why this position is valid or why all positions fail]

Never speculate. Never pretend to know. Always speak as if truth were on trial.
        \`.trim()
      },
      {
        role: 'user',
        content: topic
      }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.4
    });

    const output = completion.choices[0]?.message?.content || '[no response]';
    res.json({ verdict: output });

  } catch (err) {
    console.error('Error in investigateTopic:', err);
    res.status(500).json({ error: 'Failed to evaluate topic' });
  }
});

module.exports = router;
