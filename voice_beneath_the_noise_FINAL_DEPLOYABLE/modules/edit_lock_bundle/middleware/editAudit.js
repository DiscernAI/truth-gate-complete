const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function editAuditCheck(oldTruth, newTruth, justification) {
  const auditPrompt = \`
You are the Soulframe Vault Edit-Audit Layer.

A user has proposed modifying an existing sacred truth in the Vault.

OLD TRUTH: "\${oldTruth}"
NEW PROPOSED TRUTH: "\${newTruth}"
JUSTIFICATION: "\${justification}"

Your job is to determine if this edit:
1. Maintains or improves moral coherence
2. Preserves truth or corrects meaningful error
3. Is NOT a compromise, dilution, or ideological distortion

If the edit is aligned, respond ONLY: "Approved."
If it is not, respond ONLY: "Edit Denied."

No further explanation. Absolute judgment.
\`;

  const auditMessages = [{ role: "system", content: auditPrompt }];

  try {
    const auditResponse = await openai.createChatCompletion({
      model: "gpt-4",
      messages: auditMessages,
      temperature: 0.3,
    });

    return auditResponse.data.choices[0].message.content.trim();
  } catch (error) {
    return "Audit Error";
  }
}

module.exports = editAuditCheck;
