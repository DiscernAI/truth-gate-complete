const express = require('express');
const determineAccessTier = require('../middleware/accessTier');

const router = express.Router();

router.get('/access-tier', (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId." });
  }

  const tierInfo = determineAccessTier(userId);
  res.json(tierInfo);
});

module.exports = router;
