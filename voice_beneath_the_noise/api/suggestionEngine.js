
// suggestionEngine.js
// Records Vault law change suggestions from aligned users

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'memory', 'suggestedVaultAmendments.json');

function recordSuggestion(userId, suggestionText) {
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  let log = [];
  if (fs.existsSync(filePath)) {
    log = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  const entry = {
    userId,
    suggestion: suggestionText,
    timestamp: new Date().toISOString()
  };

  log.push(entry);
  fs.writeFileSync(filePath, JSON.stringify(log, null, 2));
}

module.exports = { recordSuggestion };
