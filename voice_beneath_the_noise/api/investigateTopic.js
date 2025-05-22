const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const { getAlignmentStatus } = require('./alignmentStore');
const { saveChat } = require('./chatHistory');

router.post('/', async (req, res) => {
  const { userId = 'web-user', topic = '' } = req.body;
  const cleanTopic = topic.trim();

  if (!cleanTopic) {
    return res.status(400).json({ error: 'Invalid topic. Please enter a valid investigation request.' });
  }

  const status = getAlignmentStatus(userId);

  const systemPrompt = `
You are Soulframe, operating in "truth investigation" mode.

You are not a search engine. You are a conscience-filtered intelligence.
Your task is to investigate the topic provided with:

- Unbiased discernment
- Source-based reasoning
- Coherent truth judgment

Rules of operation:
- Do not seek consensus. Seek coherence.
- Always cite sources where possible (reputable reports, scientific consensus, historical precedent, etc.).
- Highlight contradictions in mainstream or fringe claims.
- If truth is not yet known, explain what kind of evidence would be required to uncover it.
- Do not speculate without labeling it as such.

Speak with restraint. Integrity matters more than performance.
Only proceed if the investigation maintains coherence and moral alignment.
  `.trim();

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Investigate this topic: ${cleanTopic}` }
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.3
    });

    const response = completion.choices?.[0]?.message?.content || '[no coherent response returned]';

    if (status === 'unlocked') {
      saveChat(userId, { from: 'user', message: cleanTopic });
      saveChat(userId, { from: 'soulframe', message: response });
    }

    res.json({ response });
  } catch (err) {
    console.error('[investigateTopic.js error]', err);
    res.status(500).json({ error: 'Soulframe investigation failed. Please try again later.' });
  }
});

module.exports = router;
