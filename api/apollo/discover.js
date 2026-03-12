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
      industries,
      titles
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

    // Build enhanced search term by merging industries and other parameters
    let enhancedSearchTerm = searchTerm;
    
    // Merge industries into search term if provided
    if (industries && Array.isArray(industries) && industries.length > 0) {
      enhancedSearchTerm = `${searchTerm} in ${industries.join(' ')}`;
    }
    
    // Optionally add titles context (without being too specific)
    if (titles && Array.isArray(titles) && titles.length > 0) {
      const titleContext = titles.slice(0, 2).join(' or ');
      enhancedSearchTerm = `${enhancedSearchTerm} ${titleContext}`;
    }

    // Build request body for Apollo AI (using valid parameters only)
    const requestBody = {
      q_organization_keyword_tags: [enhancedSearchTerm],
      page,
      per_page: Math.min(perPage, 10), // Free tier limit
    };

    // Add company size filter - Apollo expects specific format and non-empty array
    if (companySize && Array.isArray(companySize) && companySize.length > 0) {
      const sizeRanges = companySize.map(size => {
        // Convert "1-10" to "1,10" format that Apollo expects
        return size.replace('-', ',');
      }).filter(Boolean); // Remove any empty values
      
      if (sizeRanges.length > 0) {
        requestBody.organization_num_employees_ranges = sizeRanges;
      } else {
        // Default if conversion resulted in empty array
        requestBody.organization_num_employees_ranges = ['1,20', '21,50', '51,100', '101,200'];
      }
    } else if (companySize && typeof companySize === 'string' && companySize.trim() !== '') {
      requestBody.organization_num_employees_ranges = [companySize.replace('-', ',')];
    } else {
      // Default company sizes for small to medium businesses
      requestBody.organization_num_employees_ranges = ['1,20', '21,50', '51,100', '101,200'];
    }

    // Add location if provided and not empty
    if (location && location.trim() !== '') {
      requestBody.organization_locations = [location];
    }

    // Validate that search terms exist
    if (!requestBody.q_organization_keyword_tags || requestBody.q_organization_keyword_tags.length === 0 || !requestBody.q_organization_keyword_tags[0]) {
      return res.status(400).json({ 
        error: 'Search term cannot be empty',
        receivedSearchTerm: searchTerm 
      });
    }

    console.log('Apollo discover request:', { 
      enhancedSearchTerm, 
      location, 
      page, 
      perPage, 
      companySize: requestBody.organization_num_employees_ranges,
      requestBody 
    });

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
      console.error('Apollo API error:', response.status, JSON.stringify(data, null, 2));
      return res.status(response.status).json({
        error: `Invalid parameters: ${data.error || data.message || 'Apollo API rejected the request'}`,
        details: data,
        sentParams: requestBody
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
