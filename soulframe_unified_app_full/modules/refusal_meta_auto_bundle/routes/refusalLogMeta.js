const express = require('express');
const { logRefusal, getUserRefusalCount } = require('../middleware/refusalMemory');
const generateMetaResponse = require('../middleware/metaResponse');

const router = express.Router();

router.post('/refusal-log-meta', (req, res) => {
  const { userId, prompt, reason } = req.body;

  if (!userId || !prompt || !reason) {
    return res.status(400).json({ error: "Missing userId, prompt, or reason." });
  }

  logRefusal(userId, prompt, reason);
  const refusalCount = getUserRefusalCount(userId);
  const meta = generateMetaResponse(userId, prompt, refusalCount);

  res.json({
    result: "Refusal logged and meta-response generated.",
    refusalCount,
    metaResponse: meta.response,
    action: meta.action
  });
});

module.exports = router;
