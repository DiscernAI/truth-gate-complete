
// chatHistory.js
// Stores full session messages for unlocked users

const fs = require('fs');
const path = require('path');

function saveChat(userId, messageObj) {
  const dir = path.join(__dirname, 'memory', 'chatLogs');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const file = path.join(dir, userId + '.json');
  let log = [];

  if (fs.existsSync(file)) {
    log = JSON.parse(fs.readFileSync(file, 'utf-8'));
  }

  log.push({ ...messageObj, timestamp: new Date().toISOString() });
  fs.writeFileSync(file, JSON.stringify(log, null, 2));
}

module.exports = { saveChat };
