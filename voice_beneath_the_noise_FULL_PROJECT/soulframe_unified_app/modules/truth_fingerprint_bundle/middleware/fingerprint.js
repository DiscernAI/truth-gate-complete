const crypto = require('crypto');
const fs = require('fs');
const path = './data/fingerprint_log.json';

function hashTruth(truth) {
  return crypto.createHash('sha256').update(truth).digest('hex');
}

function loadFingerprintLog() {
  const raw = fs.readFileSync(path);
  return JSON.parse(raw);
}

function saveFingerprintLog(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function logFingerprint(truth) {
  const data = loadFingerprintLog();
  const hash = hashTruth(truth);

  if (!data.fingerprints.find(entry => entry.hash === hash)) {
    data.fingerprints.push({
      hash,
      truth,
      timestamp: new Date().toISOString()
    });
    saveFingerprintLog(data);
  }

  return hash;
}

function detectTampering(truth) {
  const data = loadFingerprintLog();
  const hash = hashTruth(truth);
  return data.fingerprints.some(entry => entry.hash === hash);
}

module.exports = { logFingerprint, detectTampering };
