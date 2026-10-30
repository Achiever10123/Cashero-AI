const ZENQUOTES_URL = "https://zenquotes.io/api/random";

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(ZENQUOTES_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      throw new Error(`ZenQuotes returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const quote = Array.isArray(data) ? data[0] : null;
    if (
      !quote ||
      typeof quote.q !== "string" ||
      !quote.q.trim() ||
      typeof quote.a !== "string"
    ) {
      throw new Error("ZenQuotes returned an invalid response");
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Could not fetch a random quote from ZenQuotes", error);
    return res.status(502).json({ error: "Quote service unavailable" });
  }
};
