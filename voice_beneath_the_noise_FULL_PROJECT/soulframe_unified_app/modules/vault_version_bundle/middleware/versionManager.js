const fs = require('fs');
const path = './data/vault_versions.json';

function loadVersions() {
  const raw = fs.readFileSync(path);
  return JSON.parse(raw);
}

function saveVersions(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function recordVersionLineage(oldTruth, newTruth, justification) {
  const versions = loadVersions();
  const existing = versions.truth_lineages.find(line => line.current === oldTruth);

  const timestamp = new Date().toISOString();

  if (existing) {
    existing.history.push({
      from: oldTruth,
      to: newTruth,
      justification,
      timestamp
    });
    existing.current = newTruth;
  } else {
    versions.truth_lineages.push({
      current: newTruth,
      history: [{
        from: oldTruth,
        to: newTruth,
        justification,
        timestamp
      }]
    });
  }

  saveVersions(versions);
}

function getLineage(truth) {
  const versions = loadVersions();
  return versions.truth_lineages.find(line => line.current === truth || 
    line.history.some(h => h.from === truth || h.to === truth));
}

module.exports = { recordVersionLineage, getLineage };
