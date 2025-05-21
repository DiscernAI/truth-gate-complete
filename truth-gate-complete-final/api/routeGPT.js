const OpenAI = require('openai');
const { analyzeInput } = require('../core/mirrorEngine');
const { buildSystemPrompt } = require('../core/promptBuilder');
const { enforceRefusalLogic } = require('../core/refusalEngine');
const memory = require('../memory/chatHistory');

require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = async (req, res) => {
  try {
    const { userId, input, persona = 'Mirror' } = req.body;

    const mirrorReport = analyzeInput(userId, input);

    if (mirrorReport.vaultViolation || mirrorReport.contradictions.length) {
      return res.json({
        status: 'rejected',
        reflection: mirrorReport.reflection,
        output: null
      });
    }

    // 🧠 Load prior memory
    const history = memory.getHistory(userId);

    // 🧱 Build message array for OpenAI
    const systemPrompt = buildSystemPrompt(userId, persona);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: input }
    ];

    // 🔁 Save user input
    memory.addMessage(userId, 'user', input);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.5
    });

    const assistantReply = completion.choices[0].message.content;

    // 🛡️ Refusal filter
    const filtered = enforceRefusalLogic(userId, input, assistantReply);

    // 💾 Save assistant reply to memory
    if (filtered.status === 'ok') {
      memory.addMessage(userId, 'assistant', filtered.output);
    }

    return res.json({
      status: filtered.status,
      reason: filtered.reason,
      reflection: mirrorReport.reflection,
      output: filtered.output
    });

  } catch (error) {
    console.error('[routeGPT ERROR]', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
