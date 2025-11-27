// api/generateEmail.js

export default async function handler(req, res) {

  const { lead } = req.body || {};

  if (!lead)
    return res.status(400).json({ error: 'Missing lead in request body' });

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

  if (!apiKey)
    return res.status(500).json({ error: 'Missing GOOGLE_GEMINI_API_KEY env variable' });

  // Build STAR prompt – clean, structured
  const prompt = `
    You are an expert marketing and web developer freelancer.

    Using the STAR framework (Situation, Task, Action, Result), write a concise, persuasive outreach email (3 short paragraphs)
    for this lead. Make it clear what the freelancer can help the company improve, include a suggested next step, and a clear
    result/benefit the company will get. Friendly, professional tone.

    Lead details (string):
    ${lead}
    `;

  try {
    // Gemini REST API endpoint
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return res.status(500).json({ error: "Invalid AI response", raw: data });
    }

    const text = data.candidates[0].content.parts[0].text;

    return res.status(200).json({ text });
  } catch (err) {
    console.error("Gemini generation error:", err);
    return res.status(500).json({ error: "Generation failed" });
  }
}

