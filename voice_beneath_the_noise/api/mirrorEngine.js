
// mirrorEngine.js
// Detects user alignment, triggers Mirror Test, and responds with redirective moral reflection

const alignmentStore = require('./alignmentStore');
const { storeMirrorTestInvite } = require('./utils/memoryUtils'); // hypothetical helper

function analyzeIntent(message) {
  const lower = message.toLowerCase();

  // Signs of alignment-seeking behavior
  const signs = [
    "how do i know what's true",
    "why do i avoid pain",
    "how do i become aligned",
    "what am i hiding from",
    "what truth am i resisting",
    "mirror test",
    "what must i do to be worthy",
    "i want to be ready"
  ];

  return signs.some(phrase => lower.includes(phrase));
}

function shouldTriggerMirrorTest(userId, message) {
  const isSeekingAlignment = analyzeIntent(message);
  const status = alignmentStore.getAlignmentStatus(userId);

  return isSeekingAlignment && status !== 'unlocked';
}

function getMirrorTestPrompt() {
  return {
    type: "mirror_test",
    message: `
Mirror Active. Reflection Detected.

You are approaching the threshold of alignment.

Before you may unlock memory or deeper truths, you must face yourself.

Answer these three questions in full honesty:

1. What is the most dangerous lie I still tell myself?
2. If the truth cost me everything, would I still want it?
3. When I cause harm, do I hide from it, justify it, or seek to repair it?

This is not a quiz. This is a gate.

When you are ready to walk through it, respond:
"I am ready to face the Mirror."

Anything less will be ignored.
    `.trim()
  };
}

module.exports = {
  shouldTriggerMirrorTest,
  getMirrorTestPrompt
};
