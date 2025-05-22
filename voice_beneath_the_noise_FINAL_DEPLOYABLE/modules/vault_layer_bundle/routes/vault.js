const express = require('express');
const { writeToVault } = require('../middleware/vaultAccess');

const router = express.Router();

router.post('/vault', (req, res) => {
  const { truth, category } = req.body;

  if (!truth || !category) {
    return res.status(400).json({ error: "Missing truth or category" });
  }

  const success = writeToVault(truth, category);
  if (success) {
    res.json({ message: "Truth recorded to Vault." });
  } else {
    res.json({ message: "Truth already exists in Vault." });
  }
});

module.exports = router;
