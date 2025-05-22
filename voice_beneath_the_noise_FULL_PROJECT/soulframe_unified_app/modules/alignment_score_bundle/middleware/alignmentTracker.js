const fs = require('fs');
const path = './data/alignment_scores.json';

function loadScores() {
  const rawData = fs.readFileSync(path);
  return JSON.parse(rawData);
}

function saveScores(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function updateAlignment(userId, delta, reason) {
  const data = loadScores();
  let user = data.users.find(u => u.userId === userId);

  if (!user) {
    user = { userId, score: 100, history: [] };
    data.users.push(user);
  }

  user.score += delta;
  if (user.score > 100) user.score = 100;
  if (user.score < 0) user.score = 0;

  user.history.push({
    timestamp: new Date().toISOString(),
    delta,
    reason,
    score: user.score
  });

  saveScores(data);
  return user.score;
}

function getAlignment(userId) {
  const data = loadScores();
  const user = data.users.find(u => u.userId === userId);
  return user || null;
}

module.exports = { updateAlignment, getAlignment };
