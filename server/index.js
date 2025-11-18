import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const APOLLO_API_KEY = process.env.APOLLO_API_KEY;
const APOLLO_API_URL = 'https://api.apollo.io/v1';

// Apollo People Search Endpoint
app.post('/api/apollo/search', async (req, res) => {
  try {
    const response = await fetch(`${APOLLO_API_URL}/mixed_people/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': APOLLO_API_KEY || '',
      },
      body: JSON.stringify({
        ...req.body,
        api_key: APOLLO_API_KEY,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({
        error: error.message || 'Failed to search leads',
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Apollo search error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Apollo Contact Enrichment Endpoint
app.post('/api/apollo/enrich', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const response = await fetch(`${APOLLO_API_URL}/people/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': APOLLO_API_KEY || '',
      },
      body: JSON.stringify({
        api_key: APOLLO_API_KEY,
        email,
        reveal_personal_emails: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({
        error: error.message || 'Failed to enrich contact',
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Apollo enrich error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Apollo Organization Enrichment Endpoint
app.get('/api/apollo/organization', async (req, res) => {
  try {
    const { domain } = req.query;

    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    const response = await fetch(
      `${APOLLO_API_URL}/organizations/enrich?domain=${domain}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Api-Key': APOLLO_API_KEY || '',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({
        error: error.message || 'Failed to get organization',
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Apollo organization error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Apollo proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Forwarding requests to ${APOLLO_API_URL}`);
});
