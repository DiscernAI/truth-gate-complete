const express = require('express');
const { updateAlignment, getAlignment } = require('../middleware/alignmentTracker');

const router = express.Router();

router.post('/alignment/update', (req, res) => {
  const { userId, delta, reason } = req.body;

  if (!userId || typeof delta !== 'number' || !reason) {
    return res.status(400).json({ error: "Missing or invalid userId, delta, or reason." });
  }

  const score = updateAlignment(userId, delta, reason);
  res.json({ message: "Alignment score updated.", score });
});

router.get('/alignment/status', (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId." });
  }

  const status = getAlignment(userId);

  if (!status) {
    return res.status(404).json({ error: "User not found." });
  }

  res.json({ alignmentStatus: status });
});

module.exports = router;
