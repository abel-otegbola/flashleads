// Simple Web Scraper for Business Directories
// This is a template for scraping business data from public directories

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, selector } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();

    // Basic scraping - extract businesses
    const businesses = extractBusinesses(html, url);

    return res.status(200).json({
      success: true,
      businesses,
      total: businesses.length
    });

  } catch (error) {
    console.error('Scraping error:', error);
    return res.status(500).json({ 
      error: 'Failed to scrape website',
      message: error.message 
    });
  }
}

function extractBusinesses(html, sourceUrl) {
  const businesses = [];

  // Yellow Pages pattern
  if (sourceUrl.includes('yellowpages')) {
    const businessMatches = html.matchAll(/<div[^>]*class="[^"]*result[^"]*"[^>]*>([\s\S]*?)<\/div>/gi);
    
    for (const match of businessMatches) {
      const block = match[1];
      
      const nameMatch = block.match(/<a[^>]*class="[^"]*business-name[^"]*"[^>]*>([^<]+)<\/a>/i);
      const phoneMatch = block.match(/phone[^>]*>([^<]+)</i);
      const addressMatch = block.match(/street-address[^>]*>([^<]+)</i);
      const websiteMatch = block.match(/href="([^"]*)"[^>]*website/i);

      if (nameMatch) {
        businesses.push({
          name: 'Contact',
          company: cleanText(nameMatch[1]),
          email: '',
          phone: phoneMatch ? cleanText(phoneMatch[1]) : '',
          location: addressMatch ? cleanText(addressMatch[1]) : '',
          companyWebsite: websiteMatch ? cleanUrl(websiteMatch[1]) : '',
          industry: 'General',
          score: Math.floor(Math.random() * 40) + 60,
          serviceNeeds: ['Website Design', 'SEO Optimization'],
          value: Math.floor(Math.random() * 15000) + 5000
        });
      }
    }
  }

  // Yelp pattern
  else if (sourceUrl.includes('yelp')) {
    const businessMatches = html.matchAll(/data-biz-name="([^"]+)"/g);
    
    for (const match of businessMatches) {
      businesses.push({
        name: 'Contact',
        company: cleanText(match[1]),
        email: '',
        phone: '',
        location: '',
        companyWebsite: '',
        industry: 'General',
        score: Math.floor(Math.random() * 40) + 60,
        serviceNeeds: ['Website Design', 'SEO Optimization'],
        value: Math.floor(Math.random() * 15000) + 5000
      });
    }
  }

  // Generic pattern - extract any business-like data
  else {
    // Look for common patterns
    const emailMatches = html.matchAll(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
    const phoneMatches = html.matchAll(/(\+?1?\s*\(?[0-9]{3}\)?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4})/g);
    const websiteMatches = html.matchAll(/https?:\/\/([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi);

    const emails = [...new Set([...emailMatches].map(m => m[1]))].slice(0, 10);
    const phones = [...new Set([...phoneMatches].map(m => m[1]))].slice(0, 10);
    const websites = [...new Set([...websiteMatches].map(m => m[0]))].slice(0, 10);

    // Combine into businesses
    const maxItems = Math.max(emails.length, phones.length, websites.length);
    
    for (let i = 0; i < maxItems; i++) {
      businesses.push({
        name: 'Contact',
        company: websites[i] ? extractCompanyName(websites[i]) : `Business ${i + 1}`,
        email: emails[i] || '',
        phone: phones[i] || '',
        location: '',
        companyWebsite: websites[i] || '',
        industry: 'General',
        score: Math.floor(Math.random() * 40) + 60,
        serviceNeeds: ['Website Design', 'SEO Optimization'],
        value: Math.floor(Math.random() * 15000) + 5000
      });
    }
  }

  return businesses;
}

function cleanText(text) {
  return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function cleanUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('//')) return 'https:' + url;
  return 'https://' + url;
}

function extractCompanyName(url) {
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.replace('www.', '').split('.');
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  } catch {
    return 'Unknown Company';
  }
}

/* 
USAGE EXAMPLES:

1. Scrape Yellow Pages:
   POST /api/scrape/directory
   { "url": "https://www.yellowpages.com/search?search_terms=web+design&geo_location_terms=New+York" }

2. Scrape Yelp:
   POST /api/scrape/directory
   { "url": "https://www.yelp.com/search?find_desc=web+design&find_loc=New+York" }

3. Scrape any website:
   POST /api/scrape/directory
   { "url": "https://example.com/businesses" }

IMPORTANT NOTES:
- Respect robots.txt
- Add rate limiting (1-2 seconds between requests)
- Some sites block scrapers - use proxies if needed
- Consider using Puppeteer for JavaScript-heavy sites
- Always check terms of service

BETTER ALTERNATIVES:
- Yellow Pages API: https://www.yellowpages.com/advertise
- Local chamber of commerce directories
- Industry-specific directories (e.g., Clutch for agencies)
- LinkedIn Sales Navigator exports
- Manual CSV imports from research

ADVANCED SCRAPING (requires additional setup):
- Use Puppeteer for JavaScript rendering
- Rotate user agents and proxies
- Add CAPTCHA solving (2captcha, anti-captcha)
- Implement request queuing and retry logic
*/
