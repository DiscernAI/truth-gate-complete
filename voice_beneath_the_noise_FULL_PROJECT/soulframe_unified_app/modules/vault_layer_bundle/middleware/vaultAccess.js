const fs = require('fs');
const path = './data/vault.json';

function loadVault() {
  const rawData = fs.readFileSync(path);
  return JSON.parse(rawData);
}

function saveVault(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function writeToVault(entry, type = "sacred_truths") {
  const vault = loadVault();

  if (!vault[type].includes(entry)) {
    vault[type].push(entry);
    saveVault(vault);
    return true;
  }

  return false;
}

module.exports = { loadVault, saveVault, writeToVault };
