# Flashleads - Freelancer & Agency Lead Generation Platform

## Overview
Flashleads is now optimized for freelancers, agencies, and small businesses to discover potential clients who need their services.

## Key Features

### 1. **Automatic Business Discovery**
- Find small businesses and startups automatically
- Filter by industry, location, and keywords
- No need to manually search for company domains
- Discover businesses that need your services

### 2. **Website Auditing**
Each lead can have their website automatically audited to identify:
- **Performance Score** (0-100) - Load time and page size analysis
- **SEO Score** (0-100) - Meta tags, headings, alt text, HTTPS
- **Design Quality** (0-100) - Modern frameworks, responsive design
- **Mobile Score** (0-100) - Mobile-friendly indicators
- **Broken Links** - Count of empty or broken links
- **Tech Stack** - Technologies used (React, WordPress, etc.)
- **Outdated Tech** - Flag for deprecated technologies

### 3. **CSV Import**
- Upload business lists from any source
- Export from LinkedIn Sales Navigator
- Import from local directories or research
- Flexible column mapping (supports various CSV formats)
- Preview before importing
- Download template to get started

### 4. **Service Needs Identification**
Leads come with identified service needs such as:
- Website Design
- Website Redesign
- SEO Optimization
- Speed Optimization
- Mobile Optimization
- E-commerce Setup
- Content Writing
- Logo Design & Branding
- Security Audit

### 5. **Simplified Pipeline**
The new sales pipeline is streamlined for service providers:
1. **New Lead** - Just discovered
2. **Contacted** - Reached out to prospect
3. **In Conversation** - Actively discussing needs
4. **Proposal Sent** - Quote/proposal submitted
5. **Closed** - Deal won or lost

## API Endpoints

### CSV Import
**POST** `/api/import/csv`
```json
{
  "csvData": "name,company,email,phone,location,website,industry\nJohn Doe,Acme Corp,john@acme.com,..."
}
```

Supports flexible column mapping:
- **name** (or contact, contact name)
- **company** (or business, business name)
- **email** (or email address)
- **phone** (or telephone, phone number)
- **location** (or city, address, state)
- **website** (or url, company website)
- **industry** (or category, type)
- **services** (or needs, service needs) - comma-separated
- **value** (or budget)
- **score** (optional)

### Website Audit
**POST** `/api/audit/website`
```json
{
  "url": "https://example.com"
}
```

Returns comprehensive audit data including scores, issues, and recommendations.

## Data Structure

### Lead Object
```typescript
{
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  status: "new" | "contacted" | "conversation" | "proposal" | "closed";
  value: number; // Estimated project value
  industry: string;
  score: number; // Opportunity score (0-100)
  companyWebsite: string;
  websiteAudit?: {
    performanceScore: number;
    seoScore: number;
    designScore: number;
    mobileScore: number;
    brokenLinks: number;
    seoIssues: string[];
    techStack: string[];
    isOutdatedTech: boolean;
    loadTime: number;
    pageSize: number;
    lastAudited: string;
    auditStatus: 'pending' | 'completed' | 'failed';
  };
  serviceNeeds: string[];
  addedDate: string;
}
```

## How to Use

### 1. Import Businesses (3 Methods)

#### Method A: CSV Import (Recommended)
1. Click "Import CSV" button
2. Download the template CSV
3. Fill with your data or export from:
   - LinkedIn Sales Navigator
   - Yellow Pages search results
   - Your own research
   - Chamber of commerce directories
4. Upload the CSV file
5. Preview and import all businesses

#### Method B: Automatic Discovery (Yellow Pages)
1. Click "Discover Businesses" button
2. Select industry (e.g., "Food & Beverage", "Retail")
3. Select location (e.g., "United States", city name)
4. Add optional keywords (e.g., "restaurant", "small business")
5. Click "Discover Businesses"
6. System scrapes Yellow Pages in real-time
7. Review businesses with scores and service needs
8. Select leads to import
9. Click "Import X Leads"

**What you get:**
- Business name and phone number
- Physical address and location
- Website URL (if they have one)
- Industry/category
- Opportunity score (lower = more needs help)
- Suggested service needs

#### Method C: Manual Entry
1. Click "Add New Lead"
2. Enter contact and company details
3. Add website URL
4. Select industry and estimated value
5. Save the lead

### 2. Find Contacts with Hunter.io
If an imported lead has no email:
1. View the leads table
2. Look for "Find Contact" button in the Contact column
3. Click "Find Contact"
4. System uses Hunter.io to search the company domain
5. Automatically updates lead with email and contact name
6. Contact is now ready for outreach

**Requirements:**
- Lead must have a company website
- Hunter.io API key must be configured
- Free tier: 25 searches/month

### 3. Audit Websites
1. View a lead's details
2. Click "Audit Website" button
3. System automatically analyzes the website
4. View audit results showing scores and issues
5. Use audit data to craft your pitch

### 4. Track Pipeline
1. Move leads through the pipeline stages
2. Add notes about conversations
3. Set estimated project value
4. Track which service needs to focus on

## Integration Opportunities

### Free/Easy to Access APIs (Recommended)
- **Yellow Pages** (Already integrated) - Direct frontend scraping for business discovery
- **Hunter.io** (Already integrated) - Email finding and verification
- **Clearbit Logo API** - Free company logos without API key
- **LinkedIn Sales Navigator** - Manual export to CSV for import
- **Built With API** - Detect website technologies (free tier: 200 calls/month)
- **Manual CSV Import** - Upload your own prospect lists

### Premium APIs (Require Billing/Approval)
- **Google Places API** - Find local businesses (requires billing account)
- **Yelp Fusion API** - Business discovery (CAPTCHA issues, requires approval)
- **Crunchbase API** - Startup discovery (requires sales contact)
- **Product Hunt API** - New startups (requires application approval)
- **PageSpeed Insights API** - Advanced performance metrics (requires API key)
- **Lighthouse CI** - Comprehensive audits (requires setup)

## Benefits for Freelancers & Agencies

✅ **No Cold Calling** - Data-driven lead generation
✅ **Qualified Leads** - Find businesses that actually need help
✅ **Audit Reports** - Show prospects exactly what's wrong
✅ **Service Matching** - Know what services each prospect needs
✅ **Value Estimation** - Track potential project values
✅ **Simple Pipeline** - Easy to manage sales process

## Next Steps

1. **Deploy to Vercel** - Set up the serverless functions
2. **Add Real APIs** - Integrate actual business discovery services
3. **Enhance Auditing** - Add more sophisticated website analysis
4. **Email Templates** - Create outreach templates based on audit results
5. **Reporting** - Add analytics and conversion tracking
