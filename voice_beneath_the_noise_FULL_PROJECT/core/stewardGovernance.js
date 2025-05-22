
// core/stewardGovernance.js

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const STEWARD_FILE = path.join(__dirname, '../data/stewards.json');
const THRESHOLD = 3; // 3 of 5 required

function loadStewards() {
  if (!fs.existsSync(STEWARD_FILE)) return [];
  return JSON.parse(fs.readFileSync(STEWARD_FILE, 'utf8'));
}

function verifySignatures(editId, providedSignatures) {
  const stewards = loadStewards();
  const validStewards = stewards.filter(s => providedSignatures.includes(s.signature));
  return validStewards.length >= THRESHOLD;
}

function recordVote(editId, userId, signature) {
  const votePath = path.join(__dirname, '../data/votes.json');
  const votes = fs.existsSync(votePath) ? JSON.parse(fs.readFileSync(votePath)) : {};
  votes[editId] = votes[editId] || [];
  votes[editId].push({ userId, signature });
  fs.writeFileSync(votePath, JSON.stringify(votes, null, 2));
}

module.exports = { verifySignatures, recordVote };
