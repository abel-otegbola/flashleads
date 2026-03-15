export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { lead } = req.body || {};

  if (!lead) {
    return res.status(400).json({ error: 'Missing lead in request body' });
  }

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GOOGLE_GEMINI_API_KEY env variable' });
  }

  const company = lead.company || '';
  const website = lead.companyWebsite || '';
  const industry = lead.industry || '';
  const location = lead.location || '';

  const parseRetryDelaySeconds = (errorBody) => {
    const retry = errorBody?.error?.details?.find((d) => d?.['@type']?.includes('RetryInfo'));
    const retryDelay = retry?.retryDelay;
    if (!retryDelay || typeof retryDelay !== 'string') return null;
    const value = parseInt(retryDelay.replace('s', ''), 10);
    return Number.isNaN(value) ? null : value;
  };

  const prompt = `You are a sharp B2B research assistant helping a freelancer start meaningful cold outreach conversations.

Research this company using web knowledge and (if available) public website context.
Company: ${company}
Website: ${website || 'N/A'}
Industry: ${industry || 'N/A'}
Location: ${location || 'N/A'}

Return ONLY valid JSON (no markdown, no extra text) with this exact shape:
{
  "summary": "2-4 sentence overview of what they do and who they likely serve",
  "whatTheyOffer": ["3-6 concise offerings"],
  "whatIsUnique": ["3-5 unique differentiators"],
  "improvements": ["3-6 thoughtful improvement ideas for growth, positioning, website, or conversion"],
  "conversationAngles": ["3-5 meaningful outreach angles that create conversation without pitching hard"],
  "confidence": "low|medium|high"
}

Rules:
- Be specific and practical.
- Avoid generic buzzwords.
- If website details are limited, infer cautiously and lower confidence.
- Keep items concise and conversation-ready.`;

  try {
    const requestGemini = async (includeSearchTool) => {
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      };

      if (includeSearchTool) {
        payload.tools = [{ google_search: {} }];
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      const rawText = await response.text();
      let data;

      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch (parseErr) {
        console.error('Failed to parse Gemini response JSON', parseErr, rawText);
        return {
          response,
          parseError: {
            error: 'Failed to parse Gemini response JSON',
            status: response.status,
            statusText: response.statusText,
            rawBody: rawText
          }
        };
      }

      return { response, data };
    };

    // First attempt includes grounding via google_search.
    let geminiResult = await requestGemini(true);

    // If grounded request is throttled/quota-limited, retry once without google_search.
    if (geminiResult.response && geminiResult.response.status === 429) {
      geminiResult = await requestGemini(false);
    }

    if (geminiResult.parseError) {
      return res.status(502).json(geminiResult.parseError);
    }

    const { response, data } = geminiResult;

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = parseRetryDelaySeconds(data);
        return res.status(429).json({
          error: 'Gemini API rate limited',
          reason: 'rate_limited',
          retryAfterSeconds: retryAfter,
          body: data
        });
      }
      console.error('Gemini API returned non-OK status', response.status, response.statusText, data);
      return res.status(502).json({
        error: 'Gemini API returned non-OK status',
        status: response.status,
        statusText: response.statusText,
        body: data
      });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return res.status(502).json({ error: 'Invalid AI response shape', body: data });
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error('Failed to parse model JSON payload', err, text);
      return res.status(502).json({ error: 'Model did not return valid JSON', raw: text });
    }

    return res.status(200).json({ insights: parsed });
  } catch (err) {
    console.error('Gemini company insights error:', err && err.message ? err.message : err);
    return res.status(500).json({
      error: 'Generation failed',
      message: err && err.message ? err.message : String(err)
    });
  }
}
