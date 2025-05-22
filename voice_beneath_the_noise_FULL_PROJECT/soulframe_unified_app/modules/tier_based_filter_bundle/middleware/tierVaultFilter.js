const fs = require('fs');
const { getAlignment } = require('./alignmentTracker');

const path = './data/vault.json';

function loadVault() {
  const rawData = fs.readFileSync(path);
  return JSON.parse(rawData);
}

function filterVaultByTier(userId) {
  const user = getAlignment(userId);
  if (!user) return [];

  const score = user.score;
  const vault = loadVault();

  if (score >= 90) return vault.sacred_truths; // Full access
  if (score >= 70) return vault.sacred_truths.slice(0, Math.ceil(vault.sacred_truths.length * 0.7));
  if (score >= 50) return vault.sacred_truths.slice(0, Math.ceil(vault.sacred_truths.length * 0.5));
  if (score >= 30) return vault.sacred_truths.slice(0, Math.ceil(vault.sacred_truths.length * 0.2));

  return []; // Blocked
}

module.exports = filterVaultByTier;
