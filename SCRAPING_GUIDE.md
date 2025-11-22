# Web Scraping Guide for Business Data

## Quick Start with CSV Import (Easiest Method)

The easiest way to get business data is to **export from existing sources** and use CSV import:

### Best Sources for CSV Export:
1. **LinkedIn Sales Navigator** - Export search results to CSV
2. **Yellow Pages** - Copy/paste results into spreadsheet
3. **Local Chambers of Commerce** - Many have downloadable directories
4. **Industry Associations** - Member directories
5. **Your Own Research** - Manual collection from websites

### Template Format:
```csv
name,company,email,phone,location,website,industry,services,value
John Doe,Acme Corp,john@acme.com,555-1234,New York NY,acme.com,Retail,"Website Design,SEO",10000
```

## Web Scraping Options

### Option 1: Browser Extensions (No Code)
- **Web Scraper (Chrome/Edge)** - Point-and-click scraping
- **Data Miner** - Extract structured data
- **Instant Data Scraper** - AI-powered extraction

### Option 2: Online Tools (Low Code)
- **ParseHub** - Free plan available, visual interface
- **Octoparse** - Desktop app, handles JavaScript
- **import.io** - API-based scraping service

### Option 3: Python Script (For Developers)
```python
import requests
from bs4 import BeautifulSoup
import csv
import time

def scrape_yellowpages(search_term, location, pages=1):
    businesses = []
    
    for page in range(1, pages + 1):
        url = f"https://www.yellowpages.com/search?search_terms={search_term}&geo_location_terms={location}&page={page}"
        
        response = requests.get(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        soup = BeautifulSoup(response.text, 'html.parser')
        results = soup.find_all('div', class_='result')
        
        for result in results:
            try:
                name = result.find('a', class_='business-name').text.strip()
                phone = result.find('div', class_='phones').text.strip() if result.find('div', class_='phones') else ''
                address = result.find('div', class_='street-address').text.strip() if result.find('div', class_='street-address') else ''
                website = result.find('a', class_='track-visit-website')['href'] if result.find('a', class_='track-visit-website') else ''
                
                businesses.append({
                    'name': 'Contact',
                    'company': name,
                    'email': '',
                    'phone': phone,
                    'location': address,
                    'website': website,
                    'industry': search_term,
                    'services': 'Website Design,SEO Optimization',
                    'value': 10000
                })
            except:
                continue
        
        # Be respectful - wait between requests
        time.sleep(2)
    
    return businesses

def save_to_csv(businesses, filename='businesses.csv'):
    with open(filename, 'w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=businesses[0].keys())
        writer.writeheader()
        writer.writerows(businesses)

# Usage
businesses = scrape_yellowpages('web design', 'New York', pages=3)
save_to_csv(businesses)
print(f"Scraped {len(businesses)} businesses")
```

### Option 4: Node.js Script (For JavaScript Developers)
```javascript
const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeYellowPages(searchTerm, location, pages = 1) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const businesses = [];

  for (let i = 1; i <= pages; i++) {
    const url = `https://www.yellowpages.com/search?search_terms=${searchTerm}&geo_location_terms=${location}&page=${i}`;
    
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    const results = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('.result').forEach(result => {
        const nameEl = result.querySelector('.business-name');
        const phoneEl = result.querySelector('.phones');
        const addressEl = result.querySelector('.street-address');
        const websiteEl = result.querySelector('.track-visit-website');
        
        items.push({
          name: 'Contact',
          company: nameEl ? nameEl.textContent.trim() : '',
          email: '',
          phone: phoneEl ? phoneEl.textContent.trim() : '',
          location: addressEl ? addressEl.textContent.trim() : '',
          website: websiteEl ? websiteEl.href : '',
          industry: 'General',
          services: 'Website Design,SEO Optimization',
          value: 10000
        });
      });
      return items;
    });
    
    businesses.push(...results);
    
    // Wait between pages
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  await browser.close();
  return businesses;
}

async function saveToCsv(businesses, filename = 'businesses.csv') {
  const headers = Object.keys(businesses[0]).join(',');
  const rows = businesses.map(b => Object.values(b).join(','));
  const csv = [headers, ...rows].join('\n');
  
  fs.writeFileSync(filename, csv);
}

// Usage
(async () => {
  const businesses = await scrapeYellowPages('web design', 'New York', 3);
  await saveToCsv(businesses);
  console.log(`Scraped ${businesses.length} businesses`);
})();
```

## Important Legal & Ethical Guidelines

### ✅ DO:
- Check `robots.txt` before scraping
- Add delays between requests (1-2 seconds minimum)
- Respect rate limits
- Use data for legitimate business purposes
- Provide opt-out mechanisms
- Follow GDPR/privacy laws

### ❌ DON'T:
- Scrape sites that explicitly prohibit it
- Overload servers with rapid requests
- Bypass login/authentication
- Ignore CAPTCHA challenges
- Scrape private/personal data
- Violate terms of service

## Best Practices

1. **Start Small**: Test with 10-20 records before scaling
2. **Add Delays**: 2-3 seconds between requests
3. **Handle Errors**: Wrap in try-catch, log failures
4. **Save Progress**: Write to CSV periodically
5. **Rotate User Agents**: Change headers occasionally
6. **Use Proxies**: For large-scale scraping (optional)
7. **Monitor Changes**: Website structures change - maintain your scripts

## Alternative Approaches (Legal & Easier)

### 1. LinkedIn Sales Navigator
- Pay for access ($99/month)
- Export search results
- Filter by industry, location, company size
- Get email addresses

### 2. Chamber of Commerce Directories
- Most are public
- Often downloadable
- High-quality local businesses
- Usually free

### 3. Industry-Specific Directories
- **Clutch** - Agencies and service providers
- **GoodFirms** - Tech companies
- **Capterra** - Software companies
- **Built With** - Companies using specific technologies

### 4. Public Records & Registries
- State business registries (most are public)
- Better Business Bureau
- Professional licensing boards

### 5. Manual Research
- Google search + manual collection
- Time-consuming but highest quality
- Use tools like Hunter.io to find emails
- Build relationships while researching

## CSV Import Tips

After collecting data (by any method), use CSV import:

1. **Clean the Data**:
   - Remove duplicates
   - Validate email formats
   - Clean phone numbers
   - Check website URLs

2. **Enrich the Data**:
   - Add industry classifications
   - Estimate project values
   - Identify service needs
   - Add notes from research

3. **Format for Import**:
   - Use provided column names
   - Save as UTF-8 CSV
   - Test with 5-10 records first
   - Then import full list

## Need Help?

If scraping seems too complex, consider:
- Hiring on Fiverr/Upwork for one-time scraping
- Using data providers (ZoomInfo, Apollo, etc.)
- Building a team to do manual research
- Focusing on high-value manual outreach

Remember: **Quality > Quantity**. 100 well-researched prospects are better than 10,000 scraped emails.
