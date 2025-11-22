# FlashLeads - Freelancer & Agency Lead Generation Platform

A modern lead generation platform designed for freelancers, agencies, and small businesses to discover potential clients who need their services.

## 🎯 What Makes FlashLeads Different

FlashLeads helps you **find businesses that need your help** - not just contact information. The platform:
- Discovers businesses with poor websites
- Audits websites for performance, SEO, design issues
- Identifies specific service needs
- Estimates project values
- Tracks leads through a simplified sales pipeline

**Perfect for**: Web designers, developers, SEO specialists, digital agencies, marketing consultants

## ✨ Core Features

### Lead Discovery & Import
- **🔍 Business Discovery**: Find businesses by industry, location, and keywords
- **📤 CSV Import**: Upload prospect lists from LinkedIn, Yellow Pages, your own research ([Guide](CSV_IMPORT_GUIDE.md))
- **✍️ Manual Entry**: Add high-value prospects individually
- **🕷️ Web Scraping**: Template for scraping business directories ([Guide](SCRAPING_GUIDE.md))
- **🤖 Hunter.io Integration**: Find and verify email addresses

### Website Auditing
- **⚡ Performance Score** (0-100): Load time and page size analysis
- **🔍 SEO Score** (0-100): Meta tags, headings, alt text checks
- **🎨 Design Quality** (0-100): Modern frameworks, responsive design
- **📱 Mobile Score** (0-100): Mobile-friendly indicators
- **🔗 Broken Links**: Detect empty or dead links
- **🛠️ Tech Stack Detection**: Identify outdated technologies

### Lead Management
- **📊 Simple Pipeline**: New → Contacted → Conversation → Proposal → Closed
- **💰 Value Tracking**: Estimate project values
- **🏷️ Service Needs**: Tag leads with specific service requirements
- **📝 Notes & Updates**: Track conversations and next steps
- **📈 Dashboard Analytics**: Track conversion rates and revenue

### Client & Project Management
- **👥 Client Management**: Full CRM for converted leads
- **📊 Project Tracking**: Monitor progress, budgets, milestones
- **💸 Invoices & Estimates**: Financial tracking
- **📧 Email Templates**: Communicate with clients
- **🔐 Secure Storage**: Firebase cloud database

## 🚀 Tech Stack

- **Frontend**: React 19.2.0 + TypeScript 5.9.3
- **Serverless**: Vercel Serverless Functions (api/ directory)
- **Database**: Firebase Firestore + Auth
- **Styling**: Tailwind CSS 4.1.17
- **Charts**: Recharts for dashboard visualization
- **APIs**: Hunter.io (email finding), custom audit engine
- **Build**: Vite 7.2.2
- **Forms**: Formik + Yup validation

## 📚 Documentation

- **[FREELANCER_PLATFORM.md](FREELANCER_PLATFORM.md)** - Complete platform overview and API docs
- **[CSV_IMPORT_GUIDE.md](CSV_IMPORT_GUIDE.md)** - How to import business lists
- **[SCRAPING_GUIDE.md](SCRAPING_GUIDE.md)** - Web scraping methods and best practices

## 🏃 Getting Started

### Prerequisites
- Node.js 18+
- Firebase project
- Hunter.io API key (optional, for email finding)

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd flashleads
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:

Create `.env` file:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_HUNTER_API_KEY=your_hunter_api_key
```

4. **Start development server**:
```bash
npm run dev
```

5. **Deploy to Vercel** (optional):
```bash
npm install -g vercel
vercel
```

## 📖 Usage Guide

### Method 1: CSV Import (Easiest)
1. Click "Import CSV" button on Leads page
2. Download the template CSV
3. Fill with your business data or export from LinkedIn
4. Upload and import all at once

See [CSV_IMPORT_GUIDE.md](CSV_IMPORT_GUIDE.md) for detailed instructions.

### Method 2: Business Discovery
1. Click "Discover Businesses" button
2. Filter by industry (Technology, Retail, etc.)
3. Add location (United States, California, etc.)
4. Optional keywords (startup, small business)
5. Select leads to import

### Method 3: Manual Entry
1. Click "Add New Lead" button
2. Enter contact and company details
3. Add website URL for auditing
4. Specify industry and estimated value
5. Save to start tracking

### Website Auditing
1. Open any lead's details
2. Click "Audit Website" button
3. View performance, SEO, design, mobile scores
4. See specific issues and recommendations
5. Use audit data to craft personalized outreach

## 🗂️ Project Structure

```
flashleads/
├── api/                          # Vercel Serverless Functions
│   ├── audit/
│   │   └── website.js           # Website auditing engine
│   ├── discover/
│   │   └── businesses.js        # Business discovery (sample data)
│   ├── import/
│   │   └── csv.js               # CSV parsing and import
│   └── scrape/
│       └── directory.js         # Web scraping template
├── src/
│   ├── components/
│   │   ├── businessDiscovery/   # Business discovery modal
│   │   ├── csvImport/           # CSV upload and import
│   │   ├── leadModal/           # Add/edit leads
│   │   └── ...                  # Other components
│   ├── contexts/
│   │   ├── LeadsContext.tsx     # Lead management state
│   │   ├── ClientsContext.tsx   # Client management state
│   │   └── AuthContext.tsx      # Authentication state
│   ├── pages/
│   │   ├── account/
│   │   │   ├── leads/           # Lead management page
│   │   │   ├── clients/         # Client management page
│   │   │   └── dashboard/       # Analytics dashboard
│   │   ├── auth/                # Login/signup pages
│   │   └── static/              # Marketing pages
│   └── firebase/
│       └── firebase.ts          # Firebase config
├── FREELANCER_PLATFORM.md       # Platform documentation
├── CSV_IMPORT_GUIDE.md          # CSV import guide
├── SCRAPING_GUIDE.md            # Web scraping guide
└── README.md                    # This file
```

## 🌟 Key Benefits

### For Freelancers
✅ Find clients who actually need your services  
✅ Show prospects specific issues with their website  
✅ Data-driven outreach instead of cold calling  
✅ Track every lead through your pipeline  
✅ Estimate project values and track revenue  

### For Agencies
✅ Scale lead generation systematically  
✅ Import leads from multiple sources  
✅ Audit websites in bulk  
✅ Identify high-value opportunities  
✅ Manage team sales pipeline  

### For Service Providers
✅ SEO specialists: Find sites with poor SEO  
✅ Web designers: Find outdated websites  
✅ Developers: Find sites with performance issues  
✅ Marketers: Find businesses without online presence  

## 🔧 API Endpoints

### POST `/api/discover/businesses`
Discover businesses by criteria (currently returns sample data).

### POST `/api/import/csv`
Parse and validate CSV files with flexible column mapping.

### POST `/api/audit/website`
Comprehensive website analysis with scoring.

### POST `/api/scrape/directory`
Template for scraping business directories.

See [FREELANCER_PLATFORM.md](FREELANCER_PLATFORM.md) for complete API documentation.

## 🛣️ Roadmap

- [ ] Integrate real business discovery APIs (Built With, Clearbit)
- [ ] Email outreach templates based on audit results
- [ ] Automated follow-up sequences
- [ ] Chrome extension for quick lead capture
- [ ] Bulk website auditing
- [ ] Team collaboration features
- [ ] Integration with Zapier/Make
- [ ] Mobile app (React Native)

## 📊 Data Privacy & Ethics

- Only collect publicly available business information
- Respect opt-out requests immediately
- Follow GDPR and privacy regulations
- No purchased email lists
- Focus on genuine business relationships

## 🤝 Contributing

Contributions are welcome! This is a practical tool for freelancers and agencies.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support

- **Documentation**: See the guides in this repo
- **Issues**: Open a GitHub issue
- **Questions**: Check FREELANCER_PLATFORM.md

## 🙏 Acknowledgments

Built with:
- React & TypeScript
- Firebase (Auth & Firestore)
- Vercel (Serverless Functions)
- Hunter.io (Email finding)
- Tailwind CSS & Recharts

---

**Pro Tip**: Start with 10-20 high-quality, well-researched leads rather than importing thousands of unqualified contacts. Quality relationships > mass outreach!

Made with ❤️ for freelancers and agencies who want to grow their business.
