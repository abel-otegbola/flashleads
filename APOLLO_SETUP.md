# Apollo.io Integration Summary

## What Was Built

### 1. API Integration Layer (`src/helpers/apolloApi.ts`)
- **searchLeads()**: Search for contacts by job title, location, industry, company size
- **enrichContact()**: Enrich individual contacts by email
- **getOrganization()**: Get company details by domain
- **apolloContactToLead()**: Convert Apollo data to FlashLeads format

### 2. UI Component (`src/components/apolloLeadSearch/ApolloLeadSearch.tsx`)
- Search form with filters (job title, location, industry, company size)
- Results list with social profile badges
- Multi-select checkbox functionality
- Bulk import capability
- Error handling and loading states

### 3. Extended Lead Schema (`src/contexts/LeadsContextValue.ts`)
Added optional social media fields:
- `linkedinUrl` - Personal LinkedIn profile
- `twitterUrl` - Personal Twitter profile
- `facebookUrl` - Personal Facebook profile
- `companyWebsite` - Company website URL
- `companyLinkedin` - Company LinkedIn page
- `companyTwitter` - Company Twitter handle
- `companyFacebook` - Company Facebook page

### 4. Integration in Leads Page (`src/pages/account/leads/index.tsx`)
- "AI Lead Generation" button in header
- Modal integration for Apollo search
- Bulk import handler to add multiple leads at once

### 5. Documentation
- **APOLLO_INTEGRATION_GUIDE.md**: Complete setup and usage guide
- **.env.example**: Environment variable template
- **README.md**: Updated with Apollo features

## Setup Required

1. **Get Apollo.io API Key**:
   - Sign up at https://www.apollo.io/
   - Go to Settings → Integrations → API
   - Copy your API key

2. **Create .env file**:
   ```bash
   cp .env.example .env
   ```

3. **Add API key to .env**:
   ```env
   VITE_APOLLO_API_KEY=your_apollo_api_key_here
   ```

4. **Restart development server**:
   ```bash
   npm run dev
   ```

## How to Use

1. Navigate to **Leads** page in the app
2. Click **"AI Lead Generation"** button (star icon)
3. Enter search criteria:
   - Job Title (e.g., "CEO", "Founder", "Marketing Manager")
   - Location (e.g., "San Francisco, CA")
   - Industry (select from dropdown)
   - Company Size (select employee range)
4. Click **"Search Leads"**
5. Review results - each shows:
   - Name and job title
   - Company name and location
   - Email verification badge
   - LinkedIn/Website availability badges
6. Select leads to import (checkbox or "Select All")
7. Click **"Import X Leads"**
8. Leads are automatically added to your database with all social profiles

## Data Structure

Each imported lead includes:

```typescript
{
  // Basic Info
  name: "John Smith"
  company: "Acme Corp"
  email: "john@acme.com"
  phone: "+1-555-0123"
  location: "San Francisco, CA, United States"
  
  // CRM Fields
  status: "new"
  value: 0
  industry: "Technology"
  score: 75  // Default for Apollo leads
  
  // Social Profiles (auto-populated from Apollo)
  linkedinUrl: "https://linkedin.com/in/johnsmith"
  twitterUrl: "https://twitter.com/johnsmith"
  companyWebsite: "https://acme.com"
  companyLinkedin: "https://linkedin.com/company/acme"
  companyTwitter: "https://twitter.com/acmecorp"
  // ... etc
}
```

## Key Features

✅ **AI-Powered Search**: Apollo's database of 275M+ contacts
✅ **Email Verification**: Only returns leads with verified emails
✅ **Social Enrichment**: Automatic LinkedIn, Twitter, Facebook URLs
✅ **Company Data**: Website, social profiles, employee count
✅ **Bulk Import**: Select and import multiple leads at once
✅ **Smart Filtering**: Job title, location, industry, company size
✅ **Error Handling**: Clear messages for API errors, no results, etc.

## Rate Limits

Apollo.io has credit-based pricing:
- **Free**: 50 credits/month
- **Basic**: 12,000 credits/year
- **Professional**: 60,000+ credits/year

Each search consumes credits based on results returned (typically 1 credit per contact).

## Next Steps

1. **Get API Key**: Sign up for Apollo.io and get your API key
2. **Configure .env**: Add `VITE_APOLLO_API_KEY` to your .env file
3. **Test Search**: Try searching for leads in your target market
4. **Import Leads**: Select and import high-quality leads to your CRM
5. **Enrich Existing**: Consider adding enrich functionality for existing leads

## Technical Notes

- All API calls use POST method with JSON payloads
- API key sent in `X-Api-Key` header
- Results limited to 25 per page (can be adjusted)
- Only searches for contacts with email addresses
- Social URLs stored as-is from Apollo database
- Backward compatible (existing leads work without social fields)

## Files Modified

1. `src/helpers/apolloApi.ts` - NEW
2. `src/components/apolloLeadSearch/ApolloLeadSearch.tsx` - NEW
3. `src/contexts/LeadsContextValue.ts` - UPDATED (added social fields)
4. `src/pages/account/leads/index.tsx` - UPDATED (added AI button + modal)
5. `.env.example` - NEW
6. `APOLLO_INTEGRATION_GUIDE.md` - NEW
7. `README.md` - UPDATED

## Support

For detailed documentation, see:
- **[APOLLO_INTEGRATION_GUIDE.md](./APOLLO_INTEGRATION_GUIDE.md)** - Full setup guide
- **Apollo API Docs**: https://apolloio.github.io/apollo-api-docs/
- **Apollo Support**: support@apollo.io
