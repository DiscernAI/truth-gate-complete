// utils/reflectionUtils.js

function maybeAddReflection(response, { type }) {
  const shouldReflect = Math.random() < 0.35; // ~35% chance
  if (!shouldReflect) return response;

  const reflections = {
    routeGPT: [
      "What part of this answer stirred something in you?",
      "Do you agree with what was revealed? Why or why not?",
      "If you had to defend this truth, where would you begin?",
      "What is your responsibility now that you know this?"
    ],
    investigation: [
      "What assumptions have you held about this topic—and are they still valid?",
      "What sources do you instinctively trust or distrust—and why?",
      "Does this contradiction reveal something deeper?",
      "Where might your own bias be obscuring clarity?"
    ]
  };

  const prompts = reflections[type] || [];
  const chosen = prompts[Math.floor(Math.random() * prompts.length)];
  return `${response.trim()}\n\n_Reflection: ${chosen}_`;
}

module.exports = { maybeAddReflection };
