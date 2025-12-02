// Vercel Serverless Function for Apollo AI Organization Search
// This function runs server-side, keeping your API key secure and avoiding CORS

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { 
      searchTerm, 
      location, 
      page = 1, 
      perPage = 25,
      companySize,
      revenueRange,
      hasWebsite
    } = req.body;

    // Validate required parameters
    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term is required' });
    }

    // Get API key from environment variables
    const APOLLO_API_KEY = process.env.APOLLO_API_KEY || process.env.VITE_APOLLO_API_KEY;
    
    if (!APOLLO_API_KEY) {
      console.error('APOLLO_API_KEY not configured in environment variables');
      return res.status(500).json({ 
        error: 'API key not configured. Please add APOLLO_API_KEY to your Vercel environment variables.' 
      });
    }

    // Build request body for Apollo AI (using free tier endpoint)
    const requestBody = {
      q_organization_keyword_tags: [searchTerm],
      page,
      per_page: Math.min(perPage, 10), // Free tier limit
    };

    // Add company size filter
    if (companySize) {
      requestBody.organization_num_employees_ranges = [companySize];
    } else {
      requestBody.organization_num_employees_ranges = ['1,20', '21,50', '51,100', '101,200']; // Small to medium businesses
    }

    // Add location if provided
    if (location) {
      requestBody.organization_locations = [location];
    }

    // Add revenue range if provided (Apollo uses annual revenue)
    if (revenueRange) {
      const [min, max] = revenueRange.split(',');
      if (min && max) {
        requestBody.revenue_range = {
          min: parseInt(min),
          max: parseInt(max)
        };
      }
    }

    console.log('Apollo discover request:', { searchTerm, location, page, perPage });

    // Call Apollo AI API (free tier endpoint)
    const response = await fetch('https://api.apollo.io/v1/organizations/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': APOLLO_API_KEY
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Apollo API error:', response.status, data);
      return res.status(response.status).json({
        error: data.error || data.message || 'Failed to search organizations',
        details: data
      });
    }

    console.log('Apollo discover success:', data.organizations?.length || 0, 'organizations found');
    return res.status(200).json(data);

  } catch (error) {
    console.error('Apollo discover error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
}
