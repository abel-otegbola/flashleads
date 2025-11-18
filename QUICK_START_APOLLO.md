# Quick Start: Apollo AI Lead Generation

## 🚀 5-Minute Setup

### Step 1: Get Your Apollo API Key
1. Go to https://www.apollo.io/
2. Sign up for a free account
3. Navigate to: **Settings** → **Integrations** → **API**
4. Copy your API key

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Your App
1. Create `.env` file in your project root:
   ```bash
   # Server-side only (secure - never exposed to client)
   APOLLO_API_KEY=paste_your_key_here
   PORT=3001

   # Client-side (safe to expose)
   VITE_PROXY_API_URL=http://localhost:3001/api/apollo
   ```

2. Start both servers (Vite + Proxy):
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

### Step 4: Start Generating Leads!
1. Open your app → **Leads** page
2. Click **"AI Lead Generation"** button (⭐ icon)
3. Fill in search criteria
4. Click **"Search Leads"**
5. Select leads → **"Import X Leads"**

That's it! 🎉

---

## 📋 Search Criteria Examples

### For Freelancers Finding Tech Clients:
- **Job Title**: "CTO" or "VP Engineering"
- **Location**: "San Francisco, CA"
- **Industry**: "Technology"
- **Company Size**: "11-50 employees"

### For Marketing Agencies:
- **Job Title**: "Marketing Director"
- **Location**: "New York, NY"
- **Industry**: "E-commerce"
- **Company Size**: "51-200 employees"

### For B2B Sales:
- **Job Title**: "CEO"
- **Industry**: "Software"
- **Company Size**: "1-10 employees" (startups)

---

## 📊 What You Get Per Lead

### Personal Info:
- ✅ Full Name
- ✅ Job Title
- ✅ Verified Email
- ✅ Phone Number
- ✅ Location

### Company Info:
- ✅ Company Name
- ✅ Industry
- ✅ Employee Count
- ✅ Location

### Social Profiles (Auto-Captured):
- 🔗 Personal LinkedIn
- 🔗 Personal Twitter
- 🔗 Company Website
- 🔗 Company LinkedIn
- 🔗 Company Twitter
- 🔗 Company Facebook

---

## 💡 Pro Tips

1. **Start Broad, Then Narrow**
   - First search: Just industry + company size
   - Refine based on results

2. **Use Exact Job Titles**
   - ✅ "Founder", "CEO", "Marketing Manager"
   - ❌ "Boss", "Leader", "Person in charge"

3. **Check Social Badges**
   - Green "✓ Email" = verified email address
   - Blue "LinkedIn" = personal LinkedIn profile available
   - Purple "Website" = company website found

4. **Bulk Import Wisely**
   - Import 10-25 leads at once
   - Review before importing
   - Quality > Quantity

5. **Watch Your Credits**
   - Free plan: 50 credits/month
   - Each lead = ~1 credit
   - Plan searches accordingly

---

## 🎯 Common Use Cases

### Use Case 1: Cold Email Campaigns
**Goal**: Find 50 qualified leads for outreach

1. Search for decision-makers (CEO, Founder, VP)
2. Filter by industry matching your service
3. Select leads with verified emails
4. Import to your CRM
5. Create email sequence (coming soon!)

### Use Case 2: LinkedIn Prospecting
**Goal**: Connect with leads on LinkedIn

1. Search with company size filter (easier to reach)
2. Check for "LinkedIn" badge on results
3. Import leads
4. Visit their LinkedIn profiles (stored in lead data)
5. Send personalized connection requests

### Use Case 3: Account-Based Marketing
**Goal**: Target specific companies

1. Search by location (where your target companies are)
2. Filter by industry + company size
3. Import multiple contacts from same company
4. Build company profiles
5. Multi-threaded outreach

---

## ⚠️ Troubleshooting

### "Failed to search leads"
- ✅ Check API key in `.env` file
- ✅ Restart dev server after adding key
- ✅ Verify Apollo account has credits

### "No leads found"
- ✅ Broaden search criteria
- ✅ Try different job title variations
- ✅ Remove location filter
- ✅ Select "Any Size" for company

### Social URLs Missing
- Some contacts don't have public profiles
- LinkedIn has highest availability (~80%)
- Twitter/Facebook less common (~30-40%)
- This is normal - not all data available

---

## 📈 Pricing Plans (Apollo.io)

| Plan | Credits/Year | Best For |
|------|--------------|----------|
| **Free** | 600 | Testing |
| **Basic** | 12,000 | Freelancers |
| **Professional** | 60,000+ | Agencies |

💡 **Tip**: Start with free plan to test, upgrade if needed

---

## 🔐 Security & Privacy

- ✅ API key stored in `.env` (not committed to git)
- ✅ All data stored in your Firebase
- ✅ User-scoped data (private to your account)
- ✅ No data sharing with third parties
- ✅ GDPR compliant (when used properly)

---

## 🆘 Need Help?

1. **Check docs**: `APOLLO_INTEGRATION_GUIDE.md` (detailed setup)
2. **Apollo support**: support@apollo.io
3. **API docs**: https://apolloio.github.io/apollo-api-docs/

---

## ✨ What's Next?

After importing leads, you can:

1. **Edit Lead Details**
   - Add custom notes
   - Set lead value
   - Update status (contacted, qualified, etc.)
   - Adjust lead score

2. **Organize Leads**
   - Filter by status
   - Search by name/company
   - Sort by score/value
   - Track pipeline value

3. **Coming Soon**:
   - 📧 Email sequences
   - 📝 Email templates
   - 📊 Analytics dashboard
   - 🔔 Follow-up reminders

---

**Happy Lead Hunting! 🎯**
