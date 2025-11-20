import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const HUNTER_API_KEY = process.env.HUNTER_API_KEY;
const HUNTER_API_URL = 'https://api.hunter.io/v2';

// Hunter.io Domain Search Endpoint
app.post('/api/apollo/search', async (req, res) => {
  try {
    const { domain, job_titles, department, seniority, limit = 25 } = req.body;
    console.log('Hunter search request:', JSON.stringify(req.body, null, 2));
    
    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    // Build query parameters
    const params = new URLSearchParams({
      domain,
      api_key: HUNTER_API_KEY || '',
      limit: limit.toString(),
    });

    if (job_titles) params.append('job_titles', job_titles);
    if (department) params.append('department', department);
    if (seniority) params.append('seniority', seniority);
    
    const response = await fetch(`${HUNTER_API_URL}/domain-search?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Hunter API error:', response.status, error);
      return res.status(response.status).json({
        error: error.errors?.[0]?.details || JSON.stringify(error) || 'Failed to search leads',
      });
    }

    const data = await response.json();
    console.log('Hunter search success:', data.data?.emails?.length || 0, 'contacts found');
    res.json(data);
  } catch (error) {
    console.error('Hunter search error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Hunter.io Email Finder Endpoint
app.get('/api/apollo/enrich', async (req, res) => {
  try {
    const { domain, first_name, last_name } = req.query;

    if (!domain || !first_name || !last_name) {
      return res.status(400).json({ error: 'Domain, first_name, and last_name are required' });
    }

    const params = new URLSearchParams({
      domain,
      first_name,
      last_name,
      api_key: HUNTER_API_KEY || '',
    });

    const response = await fetch(`${HUNTER_API_URL}/email-finder?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({
        error: error.errors?.[0]?.details || 'Failed to find email',
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Hunter email finder error:', error);
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
  console.log(`🚀 Hunter.io proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Forwarding requests to ${HUNTER_API_URL}`);
  console.log(`🔑 API Key configured: ${HUNTER_API_KEY ? 'Yes' : 'No'}`);
});
