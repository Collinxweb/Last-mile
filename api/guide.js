// Vercel Serverless Function: AI dispatcher guide.
// The API key lives in the ANTHROPIC_API_KEY environment variable on Vercel,
// never in the browser.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { mission, story, news, stage, question } = req.body || {};
  const key = process.env.ANTHROPIC_API_KEY;

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
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-5-5",
        max_tokens: 150,
        system,
        messages: [{ role: "user", content: user }]
      })
    });
    const data = await r.json();
    const text = (data.content || [])
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("")
      .trim();
    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: "guide unavailable" });
  }
}
