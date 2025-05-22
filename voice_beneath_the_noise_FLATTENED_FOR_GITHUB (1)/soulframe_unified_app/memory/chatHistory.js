
// memory/chatHistory.js

const historyStore = new Map();

function getHistory(userId) {
  return historyStore.get(userId) || [];
}

function addMessage(userId, role, content) {
  const history = getHistory(userId);
  history.push({ role, content });

  // Cap history to last 10 messages
  const trimmed = history.slice(-10);
  historyStore.set(userId, trimmed);
}

function clearHistory(userId) {
  historyStore.delete(userId);
}

module.exports = {
  getHistory,
  addMessage,
  clearHistory
};
