# FlashLeads - CRM for Freelancers

A modern CRM platform designed for freelancers to generate leads, manage clients, track projects, and close more deals.

## Features

- **🔐 Authentication**: Firebase Auth with email/password and Google sign-in
- **🤖 AI Lead Generation**: Powered by Apollo.io API with automatic social profile enrichment
- **👥 Lead Management**: Full CRUD operations for leads with Firebase Firestore
- **�‍💼 Client Management**: Complete CRM system with clients, projects, invoices, and estimates
- **📧 Email Integration**: Send emails to clients with pre-built templates
- **💰 Financial Tracking**: Create and manage invoices and estimates with line items
- **📊 Project Tracking**: Monitor project progress, budgets, and milestones
- **🎯 Milestone Management**: Track project milestones with completion dates
- **📊 Dashboard Stats**: Real-time metrics for clients, revenue, and projects
- **🔍 Advanced Search**: Filter and search across all clients and data
- **🌐 Social Profile Integration**: Automatic capture of LinkedIn, Twitter, Facebook, and company websites
- **📱 Responsive Design**: Built with Tailwind CSS v4 for modern, mobile-friendly UI
- **⚡ Fast Development**: Vite for lightning-fast HMR and builds
- **🔒 Secure API**: Proxy server to protect API keys from client exposure

## Tech Stack

- **Frontend**: React 19.2.0 with TypeScript 5.9.3
- **Build Tool**: Vite 7.2.2
- **Backend**: Express 4.21.2 (Proxy Server) + Firebase 12.6.0 (Auth + Firestore)
- **Styling**: Tailwind CSS 4.1.17
- **Forms**: Formik 2.4.9 + Yup 1.7.1
- **Database**: Firebase Firestore (6 collections: clients, projects, milestones, invoices, estimates, emails)
- **AI Integration**: Apollo.io API (via secure proxy)
- **Icons**: Solar Icons React
- **Routing**: React Router DOM 7.9.6

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project created
- Apollo.io account (for AI lead generation)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd flashleads
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Add your API keys to `.env`:
```env
# Apollo API Key (server-side only - secure)
APOLLO_API_KEY=your_apollo_api_key

# Proxy Server Config
VITE_PROXY_API_URL=http://localhost:3001/api/apollo
PORT=3001

# Firebase Config
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

5. Start development servers:
```bash
# Start both Vite and proxy server
npm run dev:all

# Or run separately:
# Terminal 1: npm run dev
# Terminal 2: npm run dev:server
```

## Documentation

- **[Quick Start Guide](./QUICK_START_APOLLO.md)** - Get started with Apollo in 5 minutes
- **[Apollo Integration Guide](./APOLLO_INTEGRATION_GUIDE.md)** - Complete Apollo.io setup guide
- **[Proxy Setup Guide](./PROXY_SETUP_GUIDE.md)** - Secure proxy server configuration
- **[Leads Context Guide](./LEADS_CONTEXT_GUIDE.md)** - Lead management and Firestore setup

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── apolloLeadSearch/  # AI lead generation modal
│   ├── leadModal/         # Lead create/edit form
│   ├── sidebar/           # Navigation sidebar
│   └── ...
├── contexts/           # React Context providers
│   ├── AuthContext.tsx    # Authentication state
│   └── LeadsContext.tsx   # Leads management
├── pages/              # Route pages
│   ├── auth/             # Login & signup
│   └── account/          # Dashboard & leads
├── helpers/            # Utility functions
│   └── apolloApi.ts      # Apollo.io API integration
├── schema/             # Yup validation schemas
└── firebase/           # Firebase configuration
```

## Available Scripts

- `npm run dev` - Start Vite development server only
- `npm run dev:server` - Start Apollo proxy server only
- `npm run dev:all` - Start both servers concurrently (recommended)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Documentation

- **[Quick Start: Clients System](QUICK_START_CLIENTS.md)** - Get started with client management
- **[Clients Workflow Guide](CLIENTS_WORKFLOW_COMPLETE.md)** - Complete modal documentation
- **[Clients Context Guide](CLIENTS_CONTEXT_GUIDE.md)** - Context API and Firebase setup
- **[Apollo Proxy Setup](PROXY_SETUP_GUIDE.md)** - Secure API proxy configuration
- **[Apollo Integration](APOLLO_INTEGRATION_GUIDE.md)** - Apollo.io API integration

## Features in Development

- � Client details view with tabs
- 💼 Project management pages
- 📄 PDF export for invoices/estimates
- 📧 Email service integration (SendGrid/Mailgun)
- 📈 Analytics dashboard
- 🔗 Third-party integrations
- 💬 In-app notifications

## License

MIT

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
