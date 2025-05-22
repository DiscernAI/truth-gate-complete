const express = require('express');
const fs = require('fs');
const path = './data/vault.json';
const { recordVersionLineage } = require('../middleware/versionManager');
const editAuditCheck = require('../middleware/editAudit');
const { logFingerprint, detectTampering } = require('../middleware/fingerprint');

const router = express.Router();

function loadVault() {
  const rawData = fs.readFileSync(path);
  return JSON.parse(rawData);
}

function saveVault(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

router.post('/vault/edit-fingerprint', async (req, res) => {
  const { oldTruth, newTruth, justification } = req.body;

  if (!oldTruth || !newTruth || !justification) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Tamper check: ensure oldTruth matches hash on record
  const valid = detectTampering(oldTruth);
  if (!valid) {
    return res.status(403).json({ error: "Tampering detected. Original truth hash not found." });
  }

  const auditResult = await editAuditCheck(oldTruth, newTruth, justification);

  if (auditResult !== "Approved.") {
    return res.json({ result: "Edit Denied. Vault truth remains unchanged." });
  }

  const vault = loadVault();
  const index = vault.sacred_truths.indexOf(oldTruth);

  if (index === -1) {
    return res.status(404).json({ error: "Old truth not found in Vault." });
  }

  // Update vault and log version
  vault.sacred_truths[index] = newTruth;
  vault.alignment_log.push({
    timestamp: new Date().toISOString(),
    action: "edit",
    from: oldTruth,
    to: newTruth,
    justification
  });

  saveVault(vault);

  // Record lineage and fingerprint
  recordVersionLineage(oldTruth, newTruth, justification);
  logFingerprint(newTruth);

  res.json({ result: "Vault updated with verified edit. Fingerprint saved." });
});

module.exports = router;
