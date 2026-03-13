# Setup Guide for API Integration

## What Was Added

### 1. **Express.js API Server** (`server.js`)
A simple Node.js/Express server that wraps the Guerrilla Mail API with 4 main endpoints:
- `GET /api/email/address` - Create new email address (random or specific domain)
- `GET /api/email/messages` - Fetch all messages for an email
- `GET /api/email/fetch` - Fetch full content of a specific email
- `GET /api/email/domains` - Get list of available domains

### 2. **API Directory Page** (`src/pages/ApiDirectory.tsx`)
A comprehensive documentation page displaying:
- All API endpoints with descriptions
- Query parameters and their types
- Example requests with copy-to-clipboard functionality
- Response format examples
- Available domains list
- Quick start guide

### 3. **Navigation Button**
Added an "API Directory" button at the top of the main page for easy access to the API documentation.

### 4. **Dependencies Added**
- `express` - Web framework for the API server
- `cors` - Cross-Origin Resource Sharing middleware
- `concurrently` - Run multiple npm scripts concurrently

## Installation & Running

### First Time Setup
```bash
# Install dependencies
npm install
```

### Start Development

**Option 1: Run both frontend + API server together**
```bash
npm run dev:all
```

This will start:
- **Frontend**: http://localhost:8080
- **API Server**: http://localhost:3001

**Option 2: Run only the API server**
```bash
npm run dev:server
```

**Option 3: Run only the frontend**
```bash
npm run dev
```

## Quick Start Example

### 1. Get an Email Address
```bash
curl "http://localhost:3001/api/email/address"
```

Response:
```json
{
  "success": true,
  "email": "user@guerrillamail.com",
  "sid_token": "abc123...",
  "timestamp": 1234567890,
  "domain": "guerrillamail.com"
}
```

### 2. Fetch Messages
```bash
curl "http://localhost:3001/api/email/messages?sid_token=abc123&offset=0"
```

### 3. Get Full Email Content
```bash
curl "http://localhost:3001/api/email/fetch?sid_token=abc123&email_id=1234567"
```

## API Documentation

Full API documentation is available in:
1. **In-App**: Visit the "API Directory" page in your app
2. **File**: See `API_ENDPOINTS.md` for complete documentation

## Architecture

```
┌─────────────────────┐
│   React Frontend    │
│  (Vite on :8080)    │
└──────────┬──────────┘
           │
           │ HTTP Requests
           │
┌──────────▼──────────┐
│  Express API Server │
│  (Node on :3001)    │
└──────────┬──────────┘
           │
           │ HTTP Requests
           │
┌──────────▼────────────────────┐
│  Guerrilla Mail API            │
│ (https://api.guerrillamail.com)│
└───────────────────────────────┘
```

## File Structure

```
src/
├── pages/
│   ├── Index.tsx           (Main page with API Directory button)
│   └── ApiDirectory.tsx    (New API documentation page)
├── api/
│   └── tempMailApi.ts      (Existing Guerrilla Mail wrapper)
└── ...

server.js                   (New Express API server)
API_ENDPOINTS.md            (API documentation)
SETUP.md                    (This file)
```

## Troubleshooting

### API Server Not Starting
- Make sure port 3001 is available
- Check that you've installed all dependencies: `npm install`

### CORS Errors
- The API server has CORS enabled, requests from the frontend should work
- If issues persist, verify both servers are running

### Cannot Connect to API
- Frontend runs on http://localhost:8080
- API server runs on http://localhost:3001
- Make sure both are running if using `npm run dev:all`

## Next Steps

1. Start with `npm run dev:all` to run both servers
2. Navigate to http://localhost:8080 in your browser
3. Click "API Directory" at the top to see all available endpoints
4. Start making requests to the API server

Enjoy! 🚀
