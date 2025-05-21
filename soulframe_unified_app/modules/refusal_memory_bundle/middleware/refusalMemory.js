const fs = require('fs');
const path = './data/refusal_log.json';

function loadRefusalLog() {
  const rawData = fs.readFileSync(path);
  return JSON.parse(rawData);
}

function saveRefusalLog(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function logRefusal(userId, prompt, reason) {
  const log = loadRefusalLog();

  log.refusals.push({
    timestamp: new Date().toISOString(),
    userId,
    prompt,
    reason
  });

  saveRefusalLog(log);
}

function getUserRefusalCount(userId) {
  const log = loadRefusalLog();
  return log.refusals.filter(entry => entry.userId === userId).length;
}

module.exports = { logRefusal, getUserRefusalCount };
