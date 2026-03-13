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

  const buildFallbackInsights = () => ({
    summary: `${company || 'This company'} appears to operate in ${industry || 'its market'} and likely serves businesses that need reliable outcomes. Without live AI/web enrichment, this is a conservative baseline profile using available lead data.`,
    whatTheyOffer: [
      industry ? `${industry} related services/products` : 'Core offerings in their niche',
      'Solutions for customer/business needs',
      'Value delivery through their main website presence'
    ],
    whatIsUnique: [
      location ? `Regional relevance in ${location}` : 'Potential positioning in a specific segment',
      website ? `Own web property (${website}) to convert and educate visitors` : 'Digital presence that can be strengthened',
      'Opportunity to differentiate through clearer value communication'
    ],
    improvements: [
      'Clarify homepage messaging to explain value in the first 5 seconds',
      'Strengthen proof points (case studies, testimonials, measurable outcomes)',
      'Improve call-to-action hierarchy for better conversion intent',
      'Tighten audience-specific landing pages for key segments'
    ],
    conversationAngles: [
      'Share one specific observation about their positioning and ask for their perspective',
      'Offer 2-3 low-effort website messaging tests they could run',
      'Ask how they currently qualify and convert inbound interest',
      'Start with feedback on user journey friction instead of pitching services'
    ],
    confidence: 'low'
  });

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
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json'
          },
          tools: [{ google_search: {} }]
        })
      }
    );

    const rawText = await response.text();
    let data;

    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch (parseErr) {
      console.error('Failed to parse Gemini response JSON', parseErr, rawText);
      return res.status(502).json({
        error: 'Failed to parse Gemini response JSON',
        status: response.status,
        statusText: response.statusText,
        rawBody: rawText
      });
    }

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = parseRetryDelaySeconds(data);
        return res.status(200).json({
          insights: buildFallbackInsights(),
          fallback: true,
          reason: 'quota_exceeded',
          retryAfterSeconds: retryAfter
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
