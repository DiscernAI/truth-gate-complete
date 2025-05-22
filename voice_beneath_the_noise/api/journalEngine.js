
// journalEngine.js
// Stores journal entries from unlocked users

const fs = require('fs');
const path = require('path');

function writeJournalEntry(userId, entryText, tags = []) {
  const dir = path.join(__dirname, 'memory', 'journals');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const file = path.join(dir, userId + '.json');
  let journal = [];

  if (fs.existsSync(file)) {
    journal = JSON.parse(fs.readFileSync(file, 'utf-8'));
  }

  const newEntry = {
    entryId: 'entry_' + Date.now(),
    text: entryText,
    tags,
    timestamp: new Date().toISOString()
  };

  journal.push(newEntry);
  fs.writeFileSync(file, JSON.stringify(journal, null, 2));
}

module.exports = { writeJournalEntry };
