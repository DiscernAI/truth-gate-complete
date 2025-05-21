const express = require('express');
const fs = require('fs');
const { Configuration, OpenAIApi } = require('openai');
const checkAgainstVault = require('../middleware/readGate');

const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post('/truth-readgate', async (req, res) => {
  const userQuestion = req.body.question;

  if (!userQuestion) {
    return res.status(400).json({ error: "Missing question." });
  }

  const matches = checkAgainstVault(userQuestion);

  if (matches.length > 0) {
    return res.json({
      result: `Vault Reference Match Found. Responding from sacred memory.`,
      matches
    });
  }

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

    res.json({ result: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Error processing request." });
  }
});

module.exports = router;
