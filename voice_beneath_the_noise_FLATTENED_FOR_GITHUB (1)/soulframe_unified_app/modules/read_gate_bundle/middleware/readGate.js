const fs = require('fs');
const path = './data/vault.json';

function loadVault() {
  const rawData = fs.readFileSync(path);
  return JSON.parse(rawData);
}

function checkAgainstVault(userQuestion) {
  const vault = loadVault();
  const results = [];

  vault.sacred_truths.forEach(truth => {
    if (userQuestion.toLowerCase().includes(truth.toLowerCase().slice(0, 20))) {
      results.push(truth);
    }
  });

  return results;
}

module.exports = checkAgainstVault;
