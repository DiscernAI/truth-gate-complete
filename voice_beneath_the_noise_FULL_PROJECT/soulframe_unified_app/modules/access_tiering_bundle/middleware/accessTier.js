const { getAlignment } = require('./alignmentTracker');

function determineAccessTier(userId) {
  const user = getAlignment(userId);

  if (!user) {
    return { tier: "none", reason: "User not found." };
  }

  const score = user.score;

  if (score >= 90) return { tier: "full", reason: "Trusted user. Full access." };
  if (score >= 70) return { tier: "standard", reason: "Aligned user. Standard access." };
  if (score >= 50) return { tier: "limited", reason: "Partial alignment. Limited access." };
  if (score >= 30) return { tier: "restricted", reason: "Low alignment. Heavily restricted." };
  return { tier: "blocked", reason: "Alignment too low. Access denied." };
}

module.exports = determineAccessTier;
