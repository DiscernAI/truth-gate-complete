
// adminDashboard.js
// Summarizes user metadata for admin without exposing private content

const fs = require('fs');
const path = require('path');

const alignPath = path.join(__dirname, 'memory', 'alignmentStore.json');
const suggestionPath = path.join(__dirname, 'memory', 'suggestedVaultAmendments.json');

function getAdminSummary() {
  const alignmentData = fs.existsSync(alignPath)
    ? JSON.parse(fs.readFileSync(alignPath, 'utf-8'))
    : {};

  const suggestions = fs.existsSync(suggestionPath)
    ? JSON.parse(fs.readFileSync(suggestionPath, 'utf-8'))
    : [];

  const summary = Object.entries(alignmentData).map(([userId, data]) => {
    const userSuggestions = suggestions.filter(s => s.userId === userId);
    const dataUsed = Math.round((JSON.stringify(data).length + userSuggestions.length * 200) / 1024); // approx KB

    return {
      userId,
      alignmentStatus: data.status || 'anonymous',
      lastUpdated: data.lastUpdated || null,
      mirrorTested: !!data.mirrorTest,
      vaultSuggestions: userSuggestions.length,
      estimatedDataKB: dataUsed
    };
  });

  return summary;
}

module.exports = { getAdminSummary };
