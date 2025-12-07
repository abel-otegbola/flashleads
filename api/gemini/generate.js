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

  // Build PAS + CTA prompt – proven high-converting format
  // Create a readable lead summary. If `lead` is an object, include important fields
  const leadSummary = (typeof lead === 'string')
    ? lead
    : `Name: ${lead.name || ''}\nCompany: ${lead.company || ''}\nWebsite: ${lead.companyWebsite || ''}\nNotes: ${lead.notes || ''}\nWebsiteAudit: ${typeof lead.websiteAudit === 'string' ? lead.websiteAudit : JSON.stringify(lead.websiteAudit || {}, null, 2)}`;

  if (process.env.DEBUG_GEMINI) console.log('Lead summary for prompt:', leadSummary);

  const prompt = `
    You are an expert cold outreach specialist writing highly converting B2B emails.

    Write a SHORT, personalized outreach email using this proven format:

    **Subject Line**: Write ONE compelling, curiosity-driven subject line (5-8 words max)

    **Email Body** (4-5 sentences ONLY):
    1. HOOK: Open with ONE sentence showing you researched them (mention specific detail about their company/website)
    2. PROBLEM: ONE sentence pointing out a specific issue or missed opportunity you noticed
    3. SOLUTION: ONE sentence stating how you can fix it (be specific, not vague)
    4. PROOF/VALUE: ONE short sentence with a relevant result or benefit
    5. CTA: ONE simple question or soft call-to-action (e.g., "Worth a quick chat?")

    CRITICAL RULES:
    - Keep it under 80 words total
    - NO fluff or corporate jargon
    - Be conversational and direct
    - Focus on THEIR benefit, not your services
    - End with a low-pressure question, NOT "book a call" or "schedule a meeting"
    - Do NOT use phrases like "I hope this email finds you well" or "I wanted to reach out"

    Lead details:
    ${leadSummary}
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

