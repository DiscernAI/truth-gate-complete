const express = require('express');
const { logRefusal } = require('../middleware/refusalMemory');
const generateMetaResponse = require('../middleware/metaResponse');
const { getUserRefusalCount } = require('../middleware/refusalMemory');
const { updateAlignment } = require('../middleware/alignmentTracker');

const router = express.Router();

router.post('/interaction', (req, res) => {
  const { userId, prompt, interactionType } = req.body;

  if (!userId || !prompt || !interactionType) {
    return res.status(400).json({ error: "Missing userId, prompt, or interactionType." });
  }

  let delta = 0;
  let reason = "";

  if (interactionType === "refusal") {
    logRefusal(userId, prompt, "Truth Gate Refusal");
    delta = -10;
    reason = "Prompt refused for misalignment.";
  }

  if (interactionType === "access") {
    delta = +5;
    reason = "User gained access to sacred truth.";
  }

  if (interactionType === "warning") {
    delta = -5;
    reason = "User triggered moral warning threshold.";
  }

  const updatedScore = updateAlignment(userId, delta, reason);
  const refusalCount = getUserRefusalCount(userId);
  const meta = generateMetaResponse(userId, prompt, refusalCount);

  res.json({
    message: "Interaction processed.",
    alignmentScore: updatedScore,
    metaResponse: meta.response,
    action: meta.action
  });
});

module.exports = router;
