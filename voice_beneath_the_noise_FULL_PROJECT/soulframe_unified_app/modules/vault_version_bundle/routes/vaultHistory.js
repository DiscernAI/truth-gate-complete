const express = require('express');
const { getLineage } = require('../middleware/versionManager');

const router = express.Router();

router.get('/vault/history', (req, res) => {
  const { truth } = req.query;

  if (!truth) {
    return res.status(400).json({ error: "Missing truth parameter" });
  }

  const lineage = getLineage(truth);

  if (!lineage) {
    return res.status(404).json({ message: "No history found for this truth." });
  }

  res.json({ lineage });
});

module.exports = router;
