# Proxy Server Setup for Apollo.io API

## Why Use a Proxy?

Using a proxy server for Apollo.io API requests provides several critical benefits:

### 🔐 Security Benefits

1. **API Key Protection**: Your Apollo API key stays on the server, never exposed to the client
2. **No Client-Side Exposure**: Keys aren't visible in browser DevTools or source code
3. **Rate Limiting**: Centralized control over API usage
4. **Request Validation**: Server validates requests before forwarding to Apollo

### 🏗️ Architecture

```
Client (React) → Proxy Server (Express) → Apollo.io API
     ↓                    ↓                      ↓
  Port 5173          Port 3001            api.apollo.io
```

## Setup Guide

### 1. Install Dependencies

```bash
npm install express cors dotenv
npm install -D @types/express @types/cors concurrently
```

### 2. Configure Environment

Create `.env` file:

```env
# Server-side only (secure)
APOLLO_API_KEY=your_actual_apollo_key_here
PORT=3001

# Client-side (safe to expose)
VITE_PROXY_API_URL=http://localhost:3001/api/apollo
```

### 3. Start Servers

**Option A: Run both together (recommended)**
```bash
npm run dev:all
```

**Option B: Run separately**
```bash
# Terminal 1
npm run dev

# Terminal 2
npm run dev:server
```

## Proxy Endpoints

### 1. Search Leads
```
POST http://localhost:3001/api/apollo/search
Content-Type: application/json

{
  "page": 1,
  "perPage": 25,
  "personTitles": ["CEO"],
  "organizationLocations": ["San Francisco, CA"]
}
```

### 2. Enrich Contact
```
POST http://localhost:3001/api/apollo/enrich
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### 3. Get Organization
```
GET http://localhost:3001/api/apollo/organization?domain=example.com
```

### 4. Health Check
```
GET http://localhost:3001/health
```

## How It Works

### Client-Side (apolloApi.ts)
```typescript
// ❌ OLD: Direct API call with exposed key
const response = await fetch('https://api.apollo.io/v1/...', {
  headers: {
    'X-Api-Key': APOLLO_API_KEY  // Exposed in client!
  }
});

// ✅ NEW: Proxy call (no key needed)
const response = await fetch('http://localhost:3001/api/apollo/search', {
  headers: {
    'Content-Type': 'application/json'  // No API key!
  },
  body: JSON.stringify(params)
});
```

### Server-Side (server/index.js)
```javascript
app.post('/api/apollo/search', async (req, res) => {
  // Server adds the API key securely
  const response = await fetch('https://api.apollo.io/v1/...', {
    headers: {
      'X-Api-Key': process.env.APOLLO_API_KEY  // Secure!
    },
    body: JSON.stringify(req.body)
  });
  
  const data = await response.json();
  res.json(data);
});
```

## Security Best Practices

### ✅ DO:
- Keep `APOLLO_API_KEY` in `.env` (never commit)
- Use `VITE_` prefix only for client-safe variables
- Validate requests on the server
- Add rate limiting in production
- Use HTTPS in production

### ❌ DON'T:
- Never use `VITE_APOLLO_API_KEY` (exposes to client)
- Don't commit `.env` file to git
- Don't log API keys in console
- Don't expose raw Apollo responses (sanitize if needed)

## Production Deployment

### Environment Variables

**Server (.env or hosting platform):**
```env
APOLLO_API_KEY=prod_apollo_key_here
PORT=3001
NODE_ENV=production
```

**Client (.env.production):**
```env
VITE_PROXY_API_URL=https://your-api-domain.com/api/apollo
```

### Deployment Options

**Option 1: Same Server (Recommended for small apps)**
- Deploy Express server and serve Vite build
- Single domain, no CORS issues

**Option 2: Separate Servers**
- Frontend: Vercel, Netlify
- Backend: Railway, Render, Heroku
- Update `VITE_PROXY_API_URL` to backend URL
- Configure CORS for production domain

**Option 3: Serverless Functions**
- Convert Express endpoints to serverless functions
- Deploy on Vercel/Netlify Functions
- Lower cost, auto-scaling

### Example: Vercel Deployment

**Frontend (Vercel):**
1. Deploy Vite app normally
2. Set `VITE_PROXY_API_URL` to API URL

**Backend (Vercel API Routes):**
Create `api/apollo/search.js`:
```javascript
export default async function handler(req, res) {
  const response = await fetch('https://api.apollo.io/v1/...', {
    headers: { 'X-Api-Key': process.env.APOLLO_API_KEY }
  });
  const data = await response.json();
  res.json(data);
}
```

## Testing the Proxy

### 1. Check Server Health
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-15T..."
}
```

### 2. Test Search Endpoint
```bash
curl -X POST http://localhost:3001/api/apollo/search \
  -H "Content-Type: application/json" \
  -d '{
    "page": 1,
    "perPage": 5,
    "personTitles": ["CEO"]
  }'
```

### 3. Check for Errors
Monitor server terminal for:
- ✅ "Apollo proxy server running on http://localhost:3001"
- ✅ "Forwarding requests to https://api.apollo.io/v1"
- ❌ Any error messages

## Troubleshooting

### Port 3001 Already in Use
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <process_id> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

Or change port in `.env`:
```env
PORT=3002
VITE_PROXY_API_URL=http://localhost:3002/api/apollo
```

### CORS Errors
Add your production domain to CORS config:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-domain.com']
}));
```

### API Key Not Found
Check server console for:
```
APOLLO_API_KEY: undefined  // ❌ Bad
APOLLO_API_KEY: sk_xxx...  // ✅ Good
```

## Performance Optimization

### 1. Add Caching
```javascript
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 600 }); // 10 min

app.post('/api/apollo/search', async (req, res) => {
  const cacheKey = JSON.stringify(req.body);
  const cached = cache.get(cacheKey);
  
  if (cached) return res.json(cached);
  
  const data = await fetchFromApollo(req.body);
  cache.set(cacheKey, data);
  res.json(data);
});
```

### 2. Add Rate Limiting
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/apollo', limiter);
```

### 3. Request Timeout
```javascript
app.post('/api/apollo/search', async (req, res) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s
  
  try {
    const response = await fetch(APOLLO_URL, {
      signal: controller.signal,
      ...options
    });
    clearTimeout(timeout);
    res.json(await response.json());
  } catch (err) {
    res.status(504).json({ error: 'Request timeout' });
  }
});
```

## Files Structure

```
flashleads/
├── server/
│   └── index.js          # Proxy server
├── src/
│   └── helpers/
│       └── apolloApi.ts  # Client API wrapper
├── .env                  # Environment variables (not committed)
├── .env.example          # Template
└── package.json          # Scripts and dependencies
```

## Benefits Summary

| Aspect | Without Proxy | With Proxy |
|--------|---------------|------------|
| **Security** | ❌ API key exposed | ✅ API key hidden |
| **Control** | ❌ No server validation | ✅ Server validates requests |
| **Rate Limiting** | ❌ Client-side only | ✅ Centralized control |
| **Caching** | ❌ Limited | ✅ Server-side caching |
| **Debugging** | ❌ Browser only | ✅ Server logs |
| **Cost Control** | ❌ Hard to track | ✅ Easy monitoring |

## Next Steps

1. ✅ Install dependencies (`npm install`)
2. ✅ Add `APOLLO_API_KEY` to `.env`
3. ✅ Start both servers (`npm run dev:all`)
4. ✅ Test search in your app
5. 🔲 Add caching for production
6. 🔲 Set up rate limiting
7. 🔲 Deploy to production
