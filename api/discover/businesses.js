// Vercel Serverless Function for Business Discovery
// Discovers small businesses and startups that may need services

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
    const { industry, location, keywords, limit = 20, useYellowPages = true } = req.body;

    console.log('Discovering businesses:', { industry, location, keywords, limit, useYellowPages });

    let businesses = [];
    let source = 'sample';

    if (useYellowPages) {
      try {
        // Scrape Yellow Pages for real data
        businesses = await scrapeYellowPages(industry, location, keywords, limit);
        source = 'yellowpages';
        console.log(`✅ Yellow Pages returned ${businesses.length} businesses`);
      } catch (error) {
        console.error('⚠️ Yellow Pages scraping failed, using sample data:', error.message);
        businesses = generateSampleBusinesses(industry, location, keywords, limit);
      }
    } else {
      // Use sample data
      businesses = generateSampleBusinesses(industry, location, keywords, limit);
    }

    return res.status(200).json({
      success: true,
      businesses,
      total: businesses.length,
      source
    });

  } catch (error) {
    console.error('Business discovery error:', error);
    
    // Fallback to sample data on error
    const { industry, location, keywords, limit = 20 } = req.body;
    const businesses = generateSampleBusinesses(industry, location, keywords, limit);
    
    return res.status(200).json({ 
      success: true,
      businesses,
      total: businesses.length,
      source: 'sample_fallback',
      warning: 'Discovery failed, showing sample data'
    });
  }
}

async function scrapeYellowPages(industry, location, keywords, limit) {
  const businesses = [];
  
  // Build search term from available params
  const searchTerm = keywords || industry || 'businesses';
  const searchLocation = location || 'United States';
  
  // Yellow Pages shows ~30 results per page
  const pages = Math.ceil(limit / 30);
  
  for (let page = 1; page <= Math.min(pages, 2); page++) {
    const url = `https://www.yellowpages.com/search?search_terms=${encodeURIComponent(searchTerm)}&geo_location_terms=${encodeURIComponent(searchLocation)}&page=${page}`;
    
    console.log(`🔍 Fetching: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const pageBusinesses = parseYellowPagesHTML(html, industry, searchLocation);
    
    console.log(`📄 Page ${page}: Found ${pageBusinesses.length} businesses`);
    
    businesses.push(...pageBusinesses);

    if (businesses.length >= limit) break;
    
    // Rate limit: wait 1.5s between pages
    if (page < pages && businesses.length < limit) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  return businesses.slice(0, limit);
}

function parseYellowPagesHTML(html, industry, location) {
  const businesses = [];
  
  // Find all business result blocks
  const resultRegex = /<div[^>]*class="[^"]*result[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi;
  const matches = html.matchAll(resultRegex);
  
  for (const match of matches) {
    try {
      const block = match[1];
      
      // Business name (required)
      const nameMatch = block.match(/<a[^>]*class="[^"]*business-name[^"]*"[^>]*>([^<]+)<\/a>/i);
      if (!nameMatch) continue;
      const name = cleanText(nameMatch[1]);
      if (!name || name.length < 2) continue;
      
      // Phone number
      const phoneMatch = block.match(/class="[^"]*phones[^"]*"[^>]*>([^<]+)</i);
      const phone = phoneMatch ? cleanText(phoneMatch[1]) : '';
      
      // Address components
      const addressMatch = block.match(/class="[^"]*street-address[^"]*"[^>]*>([^<]+)</i);
      const cityMatch = block.match(/class="[^"]*locality[^"]*"[^>]*>([^<]+)</i);
      const stateMatch = block.match(/class="[^"]*state[^"]*"[^>]*>([^<]+)</i);
      
      const parts = [
        addressMatch ? cleanText(addressMatch[1]) : '',
        cityMatch ? cleanText(cityMatch[1]) : '',
        stateMatch ? cleanText(stateMatch[1]) : ''
      ].filter(Boolean);
      
      const fullLocation = parts.length > 0 ? parts.join(', ') : location;
      
      // Website
      let website = '';
      const websiteMatch = block.match(/href="([^"]*)"[^>]*class="[^"]*track-visit-website/i);
      if (websiteMatch) {
        website = cleanUrl(websiteMatch[1]);
      }
      
      // Categories/Industry
      const categoryMatch = block.match(/class="[^"]*categories[^"]*"[^>]*>([^<]+)</i);
      const categories = categoryMatch ? cleanText(categoryMatch[1]) : industry;
      
      // Calculate opportunity score
      let score = 45;
      if (website) score += 25;
      if (phone) score += 10;
      if (parts.length > 0) score += 10;
      score += Math.floor(Math.random() * 20);
      
      // Service needs based on what we found
      const serviceNeeds = determineServiceNeeds(website, score, categories);
      
      businesses.push({
        name: 'Contact',
        company: name,
        email: '', // Yellow Pages doesn't show emails
        phone: phone,
        location: fullLocation,
        companyWebsite: website,
        industry: categories || industry || 'General',
        score: Math.min(score, 100),
        serviceNeeds: serviceNeeds,
        value: estimateProjectValue(serviceNeeds, score)
      });
      
    } catch (error) {
      // Skip and continue
      continue;
    }
  }
  
  return businesses;
}

function cleanText(text) {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanUrl(url) {
  if (!url) return '';
  
  // Yellow Pages may use redirect URLs
  if (url.includes('?')) {
    try {
      const urlObj = new URL(url, 'https://www.yellowpages.com');
      const actualUrl = urlObj.searchParams.get('url');
      if (actualUrl) {
        url = decodeURIComponent(actualUrl);
      }
    } catch (e) {
      // Keep original URL
    }
  }
  
  // Add protocol if missing
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  return url;
}

function determineServiceNeeds(website, score, category) {
  const needs = [];
  
  if (!website) {
    needs.push('Website Design', 'SEO Optimization', 'Google My Business');
  } else {
    if (score < 70) {
      needs.push('Website Redesign', 'SEO Optimization');
    }
    if (score < 60) {
      needs.push('Speed Optimization', 'Mobile Optimization');
    }
    
    // Industry-specific
    const cat = (category || '').toLowerCase();
    if (cat.includes('retail') || cat.includes('shop')) {
      needs.push('E-commerce Setup');
    } else if (cat.includes('restaurant') || cat.includes('food')) {
      needs.push('Online Ordering');
    } else if (cat.includes('service') || cat.includes('repair')) {
      needs.push('Booking System');
    }
  }
  
  if (needs.length === 0) {
    needs.push('Website Maintenance', 'SEO');
  }
  
  return needs;
}

function estimateProjectValue(serviceNeeds, score) {
  let value = 3000;
  value += serviceNeeds.length * 2500;
  
  if (score < 50) value += 12000;
  else if (score < 70) value += 6000;
  else value += 2000;
  
  value += Math.floor(Math.random() * 4000);
  
  return value;
}

function generateSampleBusinesses(industry, location, keywords, limit) {
  // Sample data generator - replace with real API integration
  const industries = {
    'technology': ['Tech Startup', 'Software Company', 'SaaS Business', 'App Developer'],
    'retail': ['Online Store', 'E-commerce Shop', 'Boutique', 'Local Retailer'],
    'food': ['Restaurant', 'Cafe', 'Food Truck', 'Catering Service'],
    'health': ['Medical Practice', 'Wellness Center', 'Fitness Studio', 'Spa'],
    'professional': ['Consulting Firm', 'Law Office', 'Accounting Firm', 'Marketing Agency'],
    'construction': ['Construction Company', 'Architecture Firm', 'Interior Design', 'Contractor'],
    'education': ['Training Center', 'Tutoring Service', 'Online Course', 'Coaching Business']
  };

  const businessTypes = industries[industry?.toLowerCase()] || 
    ['Small Business', 'Startup', 'Local Company', 'Growing Business'];

  const domains = [
    'example.com', 'demo-site.com', 'business-web.com', 'company-site.net',
    'startup-hub.com', 'local-business.com', 'service-pro.com', 'expert-co.com'
  ];

  const businesses = [];
  
  for (let i = 0; i < Math.min(limit, 20); i++) {
    const type = businessTypes[i % businessTypes.length];
    const companyName = `${type} ${Math.floor(Math.random() * 1000)}`;
    const domain = `${companyName.toLowerCase().replace(/\s+/g, '-')}.${domains[i % domains.length]}`;
    
    businesses.push({
      name: `Contact Name ${i + 1}`,
      company: companyName,
      email: `contact@${domain}`,
      phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      location: location || 'United States',
      companyWebsite: `https://${domain}`,
      industry: industry || 'Other',
      score: Math.floor(Math.random() * 40) + 60, // 60-100 range
      serviceNeeds: generateServiceNeeds(),
      value: Math.floor(Math.random() * 15000) + 5000 // $5k-$20k projects
    });
  }

  return businesses;
}

function generateServiceNeeds() {
  const allNeeds = [
    'Website Design',
    'Website Redesign', 
    'SEO Optimization',
    'Speed Optimization',
    'Mobile Optimization',
    'E-commerce Setup',
    'Content Writing',
    'Logo Design',
    'Branding',
    'Social Media Setup',
    'Analytics Setup',
    'Security Audit'
  ];

  // Return 2-4 random needs
  const count = Math.floor(Math.random() * 3) + 2;
  const shuffled = allNeeds.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
