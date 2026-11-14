import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Mistral } from "@mistralai/mistralai";

const app = express();
app.use(express.json());

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
app.use(express.static(publicDir));

const apiKey = process.env.MISTRAL_API_KEY;
if (!apiKey) {
  console.error("Missing MISTRAL_API_KEY. Copy .env.example to .env and set your key.");
  process.exit(1);
}

const client = new Mistral({ apiKey });

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body as { messages?: ChatMessage[] };
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "Request body must include a non-empty 'messages' array." });
    return;
  }

  try {
    const completion = await client.chat.complete({
      model: "mistral-small-latest",
      messages,
    });
    const content = completion.choices[0]?.message?.content;
    const reply = typeof content === "string" ? content : "";
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(502).json({ error: "Failed to get a response from the Mistral API." });
  }
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`Chat app listening on http://localhost:${port}`);
});
