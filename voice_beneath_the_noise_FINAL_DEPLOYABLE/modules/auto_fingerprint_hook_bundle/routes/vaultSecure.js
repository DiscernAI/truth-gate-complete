const express = require('express');
const fs = require('fs');
const { writeToVault } = require('../middleware/vaultAccess');
const { logFingerprint, detectTampering } = require('../middleware/fingerprint');

const router = express.Router();

router.post('/vault/secure', (req, res) => {
  const { truth, category } = req.body;

  if (!truth || !category) {
    return res.status(400).json({ error: "Missing truth or category." });
  }

  const alreadyExists = detectTampering(truth);
  if (alreadyExists) {
    return res.json({ result: "Truth already fingerprinted. No duplicate entry made." });
  }

  const success = writeToVault(truth, category);
  const hash = logFingerprint(truth);

  if (success) {
    return res.json({ message: "Truth written and fingerprinted.", hash });
  } else {
    return res.json({ message: "Truth already exists in Vault. Fingerprint updated if missing.", hash });
  }
});

module.exports = router;
