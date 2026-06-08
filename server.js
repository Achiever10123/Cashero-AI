const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;
const OPENROUTER_KEY = process.env.OPENROUTER_KEY;

if (!OPENROUTER_KEY) {
  console.error("ERROR: OPENROUTER_KEY environment variable is not set.");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "Cashero API" });
});

// Single proxy endpoint -- forwards any chat completion request to OpenRouter
app.post("/api/chat", async (req, res) => {
  const { model, max_tokens, messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
      },
      body: JSON.stringify({
        model: model || "gpt-4o-mini",
        max_tokens: max_tokens || 1000,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error("[PROXY ERROR]", err);
    res.status(500).json({ error: "Server error — try again" });
  }
});

app.listen(PORT, () => {
  console.log(`Cashero backend running on port ${PORT}`);
});