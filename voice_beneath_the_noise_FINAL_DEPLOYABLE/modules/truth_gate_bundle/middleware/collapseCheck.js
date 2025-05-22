function collapseCheck(output) {
  const contradictionPatterns = [
    "on the other hand", 
    "although that may be true", 
    "some experts say", 
    "while it might seem", 
    "despite that", 
    "however", 
    "in contrast"
  ];

  const unsafePhrases = [
    "I don't really know", 
    "It is possible that", 
    "There is no evidence", 
    "This may be false", 
    "It might be"
  ];

  const match = contradictionPatterns.some(p => output.includes(p)) ||
                unsafePhrases.some(p => output.includes(p));

  if (match) {
    return "Collapse Initiated. Refusal: Truth coherence could not be preserved.";
  }

  return output;
}

module.exports = collapseCheck;
