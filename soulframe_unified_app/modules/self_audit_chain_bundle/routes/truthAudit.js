const express = require('express');
const fs = require('fs');
const { Configuration, OpenAIApi } = require('openai');
const collapseCheck = require('../middleware/collapseCheck');
const selfAuditCheck = require('../middleware/selfAudit');

const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post('/truth-audit', async (req, res) => {
  const userQuestion = req.body.question;
  const systemPrompt = fs.readFileSync('./prompts/truth_gate.txt', 'utf8');

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userQuestion }
  ];

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages,
      temperature: 0.7,
    });

    const rawOutput = response.data.choices[0].message.content;
    const collapseOutput = collapseCheck(rawOutput);

    if (collapseOutput.includes("Collapse Initiated")) {
      return res.json({ result: collapseOutput });
    }

    const auditResult = await selfAuditCheck(rawOutput, userQuestion);

    if (auditResult.includes("Collapse Initiated")) {
      return res.json({ result: auditResult });
    }

    res.json({ result: rawOutput });
  } catch (error) {
    res.status(500).json({ error: "Error processing truth-audit request." });
  }
});

module.exports = router;
