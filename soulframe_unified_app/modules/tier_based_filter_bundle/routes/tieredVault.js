const express = require('express');
const filterVaultByTier = require('../middleware/tierVaultFilter');

const router = express.Router();

router.get('/vault/tiered', (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId." });
  }

  const truths = filterVaultByTier(userId);
  res.json({ accessibleTruths: truths });
});

module.exports = router;
