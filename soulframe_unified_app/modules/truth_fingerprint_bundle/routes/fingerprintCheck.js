const express = require('express');
const { detectTampering, logFingerprint } = require('../middleware/fingerprint');

const router = express.Router();

router.post('/truth/fingerprint', (req, res) => {
  const { truth } = req.body;

  if (!truth) {
    return res.status(400).json({ error: "Missing truth." });
  }

  const alreadyExists = detectTampering(truth);

  if (alreadyExists) {
    res.json({ result: "Match confirmed. Truth integrity intact." });
  } else {
    const hash = logFingerprint(truth);
    res.json({ result: "Fingerprint logged.", hash });
  }
});

module.exports = router;
