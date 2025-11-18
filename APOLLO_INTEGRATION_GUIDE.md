# Apollo.io Integration Guide

## Overview
This application integrates with Apollo.io's API to enable AI-powered lead generation with automatic enrichment of company social profiles (LinkedIn, Twitter, Facebook, website URLs).

**Security Note**: The integration uses a proxy server to keep your Apollo API key secure. All API requests are routed through your backend server (`server/index.js`) instead of making direct calls from the client, preventing API key exposure.

## Features

### 1. AI Lead Search
- **Search by Job Title**: Find leads by their role (CEO, Marketing Manager, etc.)
- **Filter by Location**: Target specific cities, states, or countries
- **Filter by Industry**: Select from 13+ industry categories
- **Company Size**: Filter by employee count ranges
- **Email Verification**: Only returns leads with verified email addresses

### 2. Social Profile Enrichment
Each lead includes comprehensive social data:
- **Personal Profiles**: LinkedIn, Twitter, Facebook URLs
- **Company Profiles**: LinkedIn, Twitter, Facebook company pages
- **Company Website**: Official website URL
- **Contact Info**: Email, phone numbers

### 3. Bulk Import
- Select multiple leads from search results
- One-click import to your leads database
- Automatic score assignment (75 for Apollo leads)
- Preserves all social media URLs

## Setup Instructions

### 1. Get Apollo.io API Key

1. Sign up for Apollo.io at https://www.apollo.io/
2. Navigate to Settings → Integrations → API
3. Copy your API key

### 2. Install Dependencies

Install the required server dependencies:

```bash
npm install express cors dotenv
npm install -D @types/express @types/cors concurrently
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Apollo API Key (server-side only - never exposed to client)
APOLLO_API_KEY=your_apollo_api_key_here

# Proxy Server URL (for frontend)
VITE_PROXY_API_URL=http://localhost:3001/api/apollo

# Server Port
PORT=3001

# Firebase Config...
```

**IMPORTANT**: The Apollo API key is now stored as `APOLLO_API_KEY` (not `VITE_APOLLO_API_KEY`) because it's only used server-side and won't be exposed to the client.

### 4. Start Both Servers

Start the Vite dev server AND the proxy server:

```bash
npm run dev:all
```

Or run them separately:

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Proxy Server
npm run dev:server
```

The proxy server will run on `http://localhost:3001` and forward requests to Apollo.io API.

## Usage

### Generating Leads

1. Navigate to the **Leads** page
2. Click **"AI Lead Generation"** button (top right)
3. Enter search criteria:
   - Job Title (e.g., "Founder", "CEO", "Marketing Director")
   - Location (e.g., "San Francisco, CA", "New York")
   - Industry (select from dropdown)
   - Company Size (select employee range)
4. Click **"Search Leads"**
5. Review results with social profiles
6. Select leads to import
7. Click **"Import X Leads"**

### Lead Data Structure

Imported leads include:

```typescript
{
  name: string;              // Full name
  company: string;           // Company name
  email: string;             // Verified email
  phone: string;             // Phone number
  location: string;          // City, State, Country
  status: 'new';             // Initial status
  value: 0;                  // Set by user
  industry: string;          // Industry category
  score: 75;                 // Default Apollo score
  linkedinUrl?: string;      // Personal LinkedIn
  twitterUrl?: string;       // Personal Twitter
  facebookUrl?: string;      // Personal Facebook
  companyWebsite?: string;   // Company website
  companyLinkedin?: string;  // Company LinkedIn
  companyTwitter?: string;   // Company Twitter
  companyFacebook?: string;  // Company Facebook
}
```

## API Endpoints Used

### 1. People Search (`/v1/mixed_people/search`)
- Searches for contacts based on criteria
- Returns up to 25 results per page
- Includes organization data

### 2. People Match (`/v1/people/match`)
- Enriches contact by email
- Returns complete social profiles
- Reveals personal emails

### 3. Organization Enrich (`/v1/organizations/enrich`)
- Gets detailed company information
- Returns company social profiles
- Available for future features

## Rate Limits

Apollo.io API has the following limits (check your plan):
- **Free Plan**: 50 credits/month
- **Basic Plan**: 12,000 credits/year
- **Professional Plan**: 60,000 credits/year

Each search query consumes credits based on results returned.

## Error Handling

The integration includes comprehensive error handling:

1. **Invalid API Key**: Shows error message prompting user to check configuration
2. **No Results**: Displays helpful message to adjust search criteria
3. **Network Errors**: Catches and displays connection issues
4. **Rate Limit**: Shows appropriate error when API limits are reached

## Data Privacy

- ✅ Apollo API key stored server-side only (never sent to client)
- ✅ All API requests proxied through your backend
- ✅ All lead data is stored in your Firebase Firestore database
- ✅ Social media URLs are stored as-is from Apollo.io
- ✅ No data is sent to third parties except Apollo.io API
- ✅ User-scoped data ensures leads are private to each account

## Firestore Schema Update

The Lead interface has been extended to support social profiles:

```typescript
// Added fields (all optional)
linkedinUrl?: string;
twitterUrl?: string;
facebookUrl?: string;
companyWebsite?: string;
companyLinkedin?: string;
companyTwitter?: string;
companyFacebook?: string;
```

No migration needed - existing leads continue to work without these fields.

## Component Architecture

### 1. `server/index.js` (Proxy Server)
- **Express.js server** that acts as a secure proxy
- Keeps Apollo API key server-side (never exposed to client)
- Three endpoints:
  - `POST /api/apollo/search` - Search for leads
  - `POST /api/apollo/enrich` - Enrich contact by email
  - `GET /api/apollo/organization` - Get organization details
- CORS enabled for local development
- Error handling and validation

### 2. `apolloApi.ts` (Helper)
- API integration layer (now uses proxy instead of direct calls)
- Type definitions for Apollo responses
- Conversion utilities (Apollo → Lead format)
- All requests go through `PROXY_API_URL`

### 3. `ApolloLeadSearch.tsx` (Component)
- Search UI with filters
- Results display with social badges
- Multi-select functionality
- Import handling

### 3. `LeadsContext.tsx` (Updated)
- Handles imported leads via `addLead()`
- Supports optional social fields
- No breaking changes to existing functionality

## Troubleshooting

### "Failed to search leads" Error
- Verify API key is correct in `.env` file
- Ensure `.env` file is in project root
- Restart development server after adding key
- Check Apollo.io account has available credits

### No Results Found
- Try broader search criteria
- Remove some filters
- Check if industry/location combination is too specific
- Verify job title spelling

### Social URLs Missing
- Some contacts may not have public social profiles
- Apollo.io only returns data available in their database
- LinkedIn URLs have highest availability (~80%)

## Future Enhancements

Potential improvements:
1. **Sequences Integration**: Auto-add imported leads to outreach sequences
2. **Contact Enrichment**: Re-enrich existing leads to update profiles
3. **Company Search**: Dedicated company search and bulk contact import
4. **Smart Scoring**: AI-based lead scoring using Apollo data
5. **Duplicate Detection**: Check for existing leads before import

## API Documentation

For more details, visit Apollo.io API docs:
https://apolloio.github.io/apollo-api-docs/

## Support

For Apollo.io API issues:
- Email: support@apollo.io
- Documentation: https://knowledge.apollo.io/

For FlashLeads integration issues:
- Check console for detailed error logs
- Verify environment variables
- Review Firestore rules and permissions
