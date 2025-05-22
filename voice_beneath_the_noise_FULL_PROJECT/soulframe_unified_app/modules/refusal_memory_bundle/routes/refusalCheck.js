const express = require('express');
const { logRefusal, getUserRefusalCount } = require('../middleware/refusalMemory');

const router = express.Router();

router.post('/refusal-check', (req, res) => {
  const { userId, prompt, reason } = req.body;

  if (!userId || !prompt || !reason) {
    return res.status(400).json({ error: "Missing userId, prompt, or reason." });
  }

  logRefusal(userId, prompt, reason);
  const count = getUserRefusalCount(userId);

  let responseMessage = "Refusal logged.";

  if (count >= 3) {
    responseMessage += " Warning: user has triggered multiple refusals. Consider limitation.";
  }

  res.json({ result: responseMessage, refusalCount: count });
});

module.exports = router;
