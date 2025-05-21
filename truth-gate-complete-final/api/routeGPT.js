const OpenAI = require('openai');
const { analyzeInput } = require('../core/mirrorEngine');
const { buildSystemPrompt } = require('../core/promptBuilder');
const { enforceRefusalLogic } = require('../core/refusalEngine');

require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ✅ Exported as a function (what Express expects)
module.exports = async (req, res) => {
  try {
    const { userId, input, persona = 'Mirror' } = req.body;

    const mirrorReport = analyzeInput(userId, input);

    // If input violates vault or has contradictions, simulate refusal
    if (mirrorReport.vaultViolation || mirrorReport.contradictions.length) {
      return res.json({
        status: 'rejected',
        reflection: mirrorReport.reflection,
        output: null
      });
    }

    const systemPrompt = buildSystemPrompt(userId, persona);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: input }
      ],
      temperature: 0.5
    });

    const rawResponse = completion.choices[0].message.content;

    const filtered = enforceRefusalLogic(userId, input, rawResponse);

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
