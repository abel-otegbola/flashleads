# CSV Import Feature - Quick Start Guide

## Overview
The CSV Import feature allows you to upload business lists from any source and import them as leads into Flashleads.

## Getting Started

### 1. Download Template
Click "Import CSV" → "Download CSV Template" to get a pre-formatted template.

### 2. Fill Your Data
Add your business data to the template. You can:
- Export from LinkedIn Sales Navigator
- Copy from Yellow Pages search results
- Use your own research
- Export from CRM tools
- Use chamber of commerce directories

### 3. Upload & Import
Upload your CSV file, preview the data, and import all businesses with one click.

## Supported CSV Formats

The importer is flexible and supports various column names:

| Field | Alternative Column Names |
|-------|-------------------------|
| **name** | contact, contact name |
| **company** | business, business name |
| **email** | email address |
| **phone** | telephone, phone number |
| **location** | city, address, state |
| **website** | url, company website |
| **industry** | category, type |
| **services** | needs, service needs (comma-separated) |
| **value** | budget |
| **score** | (optional, 0-100) |

## Example CSV

```csv
name,company,email,phone,location,website,industry,services,value
John Doe,Acme Corp,john@acme.com,555-1234,New York NY,acme.com,Retail,"Website Design,SEO",10000
Jane Smith,Tech Startup,jane@techstartup.com,555-5678,San Francisco CA,techstartup.com,Technology,"Mobile App,Branding",25000
Bob Wilson,Local Cafe,bob@localcafe.com,555-9012,Austin TX,localcafe.com,Food & Beverage,"Website Redesign,Social Media",5000
```

## Tips for Best Results

### Data Quality
- ✅ Remove duplicate entries
- ✅ Validate email formats
- ✅ Clean phone numbers (any format works)
- ✅ Add http:// or https:// to websites (or we'll add it)
- ✅ Use proper industry names

### Service Needs
Separate multiple services with commas:
```
"Website Design,SEO Optimization,Speed Optimization"
```

Common service needs:
- Website Design
- Website Redesign
- SEO Optimization
- Speed Optimization
- Mobile Optimization
- E-commerce Setup
- Content Writing
- Logo Design & Branding
- Security Audit

### Value Estimation
Estimate the project value in dollars:
- Small projects: $2,000 - $5,000
- Medium projects: $5,000 - $15,000
- Large projects: $15,000+

## Data Sources

### LinkedIn Sales Navigator
1. Search for prospects by industry/location
2. Click "Export" (if available)
3. Or manually copy data into CSV

### Yellow Pages
1. Search for businesses: yellowpages.com
2. Copy results to spreadsheet
3. Add website URLs manually
4. Export as CSV

### Chamber of Commerce
1. Find local chamber websites
2. Look for member directories
3. Many offer downloadable lists
4. Convert to CSV format

### Manual Research
1. Google search for businesses
2. Add to spreadsheet as you research
3. Use Hunter.io to find emails
4. Export when complete

### Industry Directories
- **Clutch** - Agencies and service providers
- **GoodFirms** - Tech companies  
- **Built With** - Companies using specific technologies
- **Product Hunt** - New startups

## Troubleshooting

### "Failed to parse CSV"
- Check file is saved as CSV (not Excel)
- Ensure UTF-8 encoding
- Remove special characters if needed
- Verify commas separate columns

### "Some rows skipped"
- Check column count matches header
- Verify no extra commas in data
- Use quotes around values with commas: `"Value, with comma"`

### Missing Data
- **Email/Phone empty**: That's okay, you can add later
- **Website required**: All leads need a website for auditing
- **Name/Company required**: Must have at least these

## After Import

1. **Review Leads**: Check all imported correctly
2. **Audit Websites**: Run audits on high-priority leads
3. **Add Notes**: Enhance with research notes
4. **Update Status**: Move through pipeline as you contact

## Privacy & Compliance

- ✅ Only import publicly available business data
- ✅ Respect opt-out requests
- ✅ Follow GDPR/privacy regulations
- ✅ Don't buy email lists from shady sources
- ✅ Build relationships, not spam lists

## Examples

### LinkedIn Export
```csv
name,company,email,location,industry,website
Sarah Johnson,Digital Agency Inc,sarah@digitalagency.com,"Los Angeles, CA",Marketing,digitalagency.com
Mike Chen,E-commerce Store,mike@store.com,"Seattle, WA",Retail,store.com
```

### Yellow Pages Scrape
```csv
company,phone,location,website,industry
Pizza Place,555-1234,"123 Main St, Boston MA",pizzaplace.com,Food
Law Firm,555-5678,"456 Oak Ave, Boston MA",lawfirm.com,Legal
```

### Manual Research
```csv
company,website,email,services,value,industry
Startup Co,startup.co,hello@startup.co,"Website Design,Branding",12000,Technology
Local Shop,localshop.com,info@localshop.com,"SEO,Website Redesign",7500,Retail
```

## Need Help?

- Check SCRAPING_GUIDE.md for data collection methods
- See FREELANCER_PLATFORM.md for full platform docs
- Test with 5-10 records before importing large lists
- Contact support if you encounter issues

---

**Pro Tip**: Start with 10-20 high-quality leads rather than importing thousands of unqualified prospects. Quality > Quantity!
