
// alignmentStore.js
// Tracks user alignment stage: anonymous, seeker, aligned, unlocked

const fs = require('fs');
const path = require('path');
const storePath = path.join(__dirname, 'memory', 'alignmentStore.json');

function loadStore() {
  if (!fs.existsSync(storePath)) {
    fs.writeFileSync(storePath, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(storePath, 'utf-8'));
}

function saveStore(data) {
  fs.writeFileSync(storePath, JSON.stringify(data, null, 2));
}

function getAlignmentStatus(userId) {
  const store = loadStore();
  return store[userId]?.status || 'anonymous';
}

function updateAlignmentStatus(userId, newStatus) {
  const store = loadStore();
  if (!store[userId]) store[userId] = {};
  store[userId].status = newStatus;
  store[userId].lastUpdated = new Date().toISOString();
  saveStore(store);
}

function logMirrorTestCompletion(userId, answers = []) {
  const store = loadStore();
  if (!store[userId]) store[userId] = {};
  store[userId].mirrorTest = {
    answers,
    completedAt: new Date().toISOString()
  };
  store[userId].status = 'aligned';
  saveStore(store);
}

function isUnlocked(userId) {
  return getAlignmentStatus(userId) === 'unlocked';
}

module.exports = {
  getAlignmentStatus,
  updateAlignmentStatus,
  logMirrorTestCompletion,
  isUnlocked
};
