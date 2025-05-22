
// core/stewardMonitor.js

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../memory/steward_status.json');

function loadStatus() {
  if (!fs.existsSync(DATA_PATH)) return {};
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
}

function saveStatus(status) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(status, null, 2));
}

function updateSteward(userId, mirrorScore) {
  const status = loadStatus();
  status[userId] = {
    lastTest: new Date().toISOString(),
    score: mirrorScore
  };
  saveStatus(status);
}

function checkDrift(userId) {
  const status = loadStatus();
  const record = status[userId];
  if (!record) return false;

  const score = record.score || 0;
  const last = new Date(record.lastTest);
  const now = new Date();
  const daysSince = (now - last) / (1000 * 60 * 60 * 24);

  return score < 70 || daysSince > 180;
}

module.exports = { updateSteward, checkDrift };
