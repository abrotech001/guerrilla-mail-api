# Guerrilla Mail API Endpoints

## Overview

This project includes a simple Express.js API server that wraps the Guerrilla Mail API. All endpoints are GET requests and return JSON responses.

**Base URL:** `http://localhost:3001`

## Running the API Server

### Option 1: Run API Server Only
```bash
npm run dev:server
```

### Option 2: Run Frontend + API Server Concurrently
```bash
npm run dev:all
```

This will start both:
- Frontend on `http://localhost:8080` (Vite)
- API Server on `http://localhost:3001` (Express)

## API Endpoints

### 1. Get Email Address
**GET** `/api/email/address`

Get a new random or specific email address with a session token.

#### Query Parameters
- `domain` (optional): Email domain to use. If not specified, a random domain is selected.

#### Example
```bash
curl "http://localhost:3001/api/email/address?domain=guerrillamail.com"
```

#### Response
```json
{
  "success": true,
  "email": "user@guerrillamail.com",
  "sid_token": "abc123def456...",
  "timestamp": 1234567890,
  "domain": "guerrillamail.com"
}
```

---

### 2. Get Messages
**GET** `/api/email/messages`

Get all messages for a specific email address.

#### Query Parameters
- `sid_token` (required): Session token from the address endpoint
- `offset` (optional): Pagination offset (default: 0)

#### Example
```bash
curl "http://localhost:3001/api/email/messages?sid_token=abc123def456&offset=0"
```

#### Response
```json
{
  "success": true,
  "messages": [
    {
      "id": "1234567",
      "from": "sender@example.com",
      "subject": "Email subject line",
      "excerpt": "Email preview text...",
      "timestamp": "1234567890",
      "read": false
    },
    {
      "id": "1234568",
      "from": "another@example.com",
      "subject": "Another email",
      "excerpt": "More preview text...",
      "timestamp": "1234567880",
      "read": true
    }
  ],
  "total_count": 2
}
```

---

### 3. Fetch Email
**GET** `/api/email/fetch`

Get the full content of a specific email.

#### Query Parameters
- `sid_token` (required): Session token
- `email_id` (required): Email ID from the messages list

#### Example
```bash
curl "http://localhost:3001/api/email/fetch?sid_token=abc123def456&email_id=1234567"
```

#### Response
```json
{
  "success": true,
  "email": {
    "id": "1234567",
    "from": "sender@example.com",
    "to": "user@guerrillamail.com",
    "subject": "Email subject",
    "body": "<html><body>Email content...</body></html>",
    "timestamp": "1234567890",
    "content_type": "text/html"
  }
}
```

---

### 4. Get Available Domains
**GET** `/api/email/domains`

Get the list of available email domains.

#### Example
```bash
curl "http://localhost:3001/api/email/domains"
```

#### Response
```json
{
  "success": true,
  "domains": [
    "guerrillamail.com",
    "guerrillamailblock.com",
    "guerrillamail.net",
    "guerrillamail.org",
    "guerrillamail.de",
    "grr.la",
    "sharklasers.com",
    "guerrillamail.info",
    "spam4.me"
  ]
}
```

---

## Available Domains

- guerrillamail.com
- guerrillamailblock.com
- guerrillamail.net
- guerrillamail.org
- guerrillamail.de
- grr.la
- sharklasers.com
- guerrillamail.info
- spam4.me

## Usage Flow

1. **Create an email address**
   ```bash
   curl "http://localhost:3001/api/email/address"
   ```
   Save the `sid_token` from the response.

2. **Check for messages**
   ```bash
   curl "http://localhost:3001/api/email/messages?sid_token=YOUR_TOKEN&offset=0"
   ```

3. **Fetch a specific email**
   ```bash
   curl "http://localhost:3001/api/email/fetch?sid_token=YOUR_TOKEN&email_id=EMAIL_ID"
   ```

## Error Handling

All endpoints return a consistent error format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

Common errors:
- Missing required parameters (400)
- API call failures (500)

## Frontend Integration

You can view the complete API documentation in the app by navigating to the **API Directory** page. Click the "API Directory" button at the top of the main page.

## CORS

The API server has CORS enabled, so you can make requests from any origin.
