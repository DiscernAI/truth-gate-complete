const express = require('express');
const fs = require('fs');
const { Configuration, OpenAIApi } = require('openai');
const collapseCheck = require('../middleware/collapseCheck');

const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post('/truth', async (req, res) => {
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
    const finalOutput = collapseCheck(rawOutput);
    res.json({ result: finalOutput });
  } catch (error) {
    res.status(500).json({ error: "Error processing request." });
  }
});

module.exports = router;
