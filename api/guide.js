// Vercel Serverless Function: AI dispatcher guide, powered by Groq's free tier.
// The key lives in the GROQ_API_KEY environment variable on Vercel, never in the browser.

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { mission, story, news, stage, question } = req.body || {};
  const key = process.env.GROQ_API_KEY;

  // No key set: the game falls back to its scripted hints.
  if (!key) {
    return res.status(200).json({ text: null, reason: "no-key" });
  }

  const system =
    "You are the Relay dispatcher in a fictional courier game. " +
    "Give one short tactical driving hint, 50 words at most. " +
    "Stay fictional: never present story events as real, never add news facts beyond the headline provided, " +
    "and never make claims about the conduct of real people.";

  const user = [
    `Mission: ${String(mission || "").slice(0, 80)}`,
    `Story: ${String(story || "").slice(0, 400)}`,
    `News context: ${news ? `${news.headline} (${news.source}, ${news.status})` : "none"}`,
    `Stage: ${stage === 0 ? "pickup" : "drop-off"}`,
    `Request: ${String(question || "Give a short hint.").slice(0, 200)}`
  ].join("\n");

  try {
    const r = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 150,
        temperature: 0.7,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user }
        ]
      })
    });

    if (!r.ok) {
      return res.status(502).json({ error: "guide provider error", status: r.status });
    }

    const data = await r.json();
    const text = (data.choices?.[0]?.message?.content || "").trim();
    return res.status(200).json({ text: text || null });
  } catch (err) {
    return res.status(500).json({ error: "guide unavailable" });
  }
}
