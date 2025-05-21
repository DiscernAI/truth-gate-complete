const express = require('express');
const generateMetaResponse = require('../middleware/metaResponse');
const { getUserRefusalCount } = require('../middleware/refusalMemory');

const router = express.Router();

router.post('/meta-response', (req, res) => {
  const { userId, prompt } = req.body;

  if (!userId || !prompt) {
    return res.status(400).json({ error: "Missing userId or prompt." });
  }

  const refusalCount = getUserRefusalCount(userId);
  const meta = generateMetaResponse(userId, prompt, refusalCount);

  res.json({ ...meta, refusalCount });
});

module.exports = router;
