
// core/refusalPublisher.js

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const LOG_PATH = path.join(__dirname, '../modules/refusal_memory_bundle/data/refusal_log.json');

function logRefusalEvent(userId, input, reason) {
  const timestamp = new Date().toISOString();
  const promptHash = crypto.createHash('sha256').update(input).digest('hex');
  const entry = { userId, promptHash, reason, timestamp };

  let log = [];
  if (fs.existsSync(LOG_PATH)) {
    log = JSON.parse(fs.readFileSync(LOG_PATH, 'utf8'));
  }

  log.push(entry);
  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2));
  console.log(`📜 Refusal logged for ${userId}: ${reason}`);
}

module.exports = { logRefusalEvent };
