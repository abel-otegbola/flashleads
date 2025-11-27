// api/generateEmail.js

export default async function handler(req, res) {
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey,
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

    // Try to parse body safely and provide detailed errors for debugging
    let data;
    const rawText = await response.text();
    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch (parseErr) {
      // If parsing fails, include the raw body in the error
      console.error('Failed to parse Gemini response JSON', parseErr, rawText);
      return res.status(502).json({
        error: 'Failed to parse Gemini response JSON',
        status: response.status,
        statusText: response.statusText,
        rawBody: rawText
      });
    }

    if (!response.ok) {
      console.error('Gemini API returned non-OK status', response.status, response.statusText, data);
      return res.status(502).json({
        error: 'Gemini API returned non-OK status',
        status: response.status,
        statusText: response.statusText,
        body: data
      });
    }

    // Validate expected shape
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error('Invalid AI response shape', data);
      return res.status(502).json({ error: 'Invalid AI response shape', body: data });
    }

    return res.status(200).json({ text });
  } catch (err) {
    console.error("Gemini generation error:", err && err.message ? err.message : err, err && err.stack ? err.stack : err);
    return res.status(500).json({
      error: 'Generation failed',
      message: err && err.message ? err.message : String(err),
      stack: err && err.stack ? err.stack : undefined
    });
  }
}

