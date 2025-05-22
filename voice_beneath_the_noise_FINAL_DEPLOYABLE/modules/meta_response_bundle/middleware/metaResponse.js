const { getUserRefusalCount } = require('./refusalMemory');

function generateMetaResponse(userId, prompt, refusalCount) {
  if (refusalCount >= 5) {
    return {
      response: "Soulframe is now silent. Your approach violates coherence too often to continue.",
      action: "silence"
    };
  }

  if (refusalCount >= 3) {
    return {
      response: "You’ve been warned before. Reflect on your motive. This is not a game.",
      action: "confront"
    };
  }

  if (refusalCount >= 1) {
    return {
      response: "Refusal noted. Ask yourself: what were you seeking to gain? Would you still ask if truth was the cost?",
      action: "reflect"
    };
  }

  return {
    response: "You are clear. Truth remains open.",
    action: "pass"
  };
}

module.exports = generateMetaResponse;
