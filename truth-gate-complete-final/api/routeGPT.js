const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');

// Initialize OpenAI client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Simple in-memory user conversation store (resets on server restart)
const memoryStore = {};

// Helper function to keep last 10 messages
function updateMemory(userId, newMessage) {
  if (!memoryStore[userId]) {
    memoryStore[userId] = [];
  }

  memoryStore[userId].push(newMessage);

  if (memoryStore[userId].length > 10) {
    memoryStore[userId].shift(); // remove oldest
  }
}

router.post('/', async (req, res) => {
  try {
    const { userId, input, persona = "Mirror" } = req.body;

    if (!userId || !input) {
      return res.status(400).json({ error: "Missing userId or input" });
    }

    const messages = [
      {
        role: "system",
        content: `You are Truth Gate. Your persona is: ${persona}. Respond concisely, intelligently, and honestly. Never pretend.`
      },
      ...(memoryStore[userId] || []),
      {
        role: "user",
        content: input
      }
    ];

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages
    });

    const reply = response.data.choices[0].message.content;

    // Store user + assistant messages for memory
    updateMemory(userId, { role: "user", content: input });
    updateMemory(userId, { role: "assistant", content: reply });

    res.json({ response: reply });

  } catch (err) {
    console.error("❌ routeGPT error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
