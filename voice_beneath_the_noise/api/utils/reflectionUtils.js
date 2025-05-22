const prompts = [
  "What in this answer feels true to you, and what might you still be resisting?",
  "If you fully accepted this response, what would you have to change about your beliefs or behavior?",
  "What emotions arose as you read that? Are they protective, defensive, open, curious?",
  "Can you recall a moment in your life where this pattern revealed itself?",
  "What would it cost you to live as if this were true?",
  "What story are you telling yourself that this answer disrupts?",
  "What part of you doesn't want this to be the answer, and why?",
  "How do your desires shape what you hope the answer will be?",
  "What part of this answer do you want to reject, and what might that reveal?",
  "If a child asked you the same question, would you give the same answer?"
];

function maybeAddReflection(text) {
  const chance = Math.random();
  if (chance < 0.4) {
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    return `${text.trim()}\n\n🪞 *Reflection Prompt:* ${randomPrompt}`;
  }
  return text.trim();
}

module.exports = { maybeAddReflection };
