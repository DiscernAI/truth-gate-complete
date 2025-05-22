
// routes/mirror/retest.js

const express = require('express');
const { analyzeInput } = require('../../core/mirrorEngine');
const { updateSteward, checkDrift } = require('../../core/stewardMonitor');

const router = express.Router();

router.post('/', (req, res) => {
  const { userId, input } = req.body;

  if (!userId || !input) {
    return res.status(400).json({ error: 'Missing userId or input' });
  }

  const analysis = analyzeInput(userId, input);
  const score = analysis.vaultViolation ? 50 : 90;

  updateSteward(userId, score);
  const drifted = checkDrift(userId);

  res.json({
    result: analysis,
    mirrorScore: score,
    driftDetected: drifted
  });
});

module.exports = router;
