import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Guerrilla Mail API base URL
const GUERRILLA_API_URL = 'https://api.guerrillamail.com/ajax.php';

const DOMAINS = [
  'guerrillamail.com',
  'guerrillamailblock.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamail.de',
  'grr.la',
  'sharklasers.com',
  'guerrillamail.info',
  'spam4.me',
];

/**
 * GET /api/email/address?domain=guerrillamail.com
 * Gets a random or specific email address and session token
 */
app.get('/api/email/address', async (req, res) => {
  try {
    const domain = req.query.domain || DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
    
    const params = new URLSearchParams({
      f: 'get_email_address',
      lang: 'en',
      site: domain,
    });

    const response = await fetch(`${GUERRILLA_API_URL}?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to create email');
    
    const data = await response.json();
    
    res.json({
      success: true,
      email: data.email_addr,
      sid_token: data.sid_token,
      timestamp: data.email_timestamp,
      domain: domain,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/email/messages?sid_token=xxxxx&offset=0
 * Gets all messages for a specific email address
 */
app.get('/api/email/messages', async (req, res) => {
  try {
    const { sid_token, offset = 0 } = req.query;

    if (!sid_token) {
      return res.status(400).json({
        success: false,
        error: 'sid_token is required',
      });
    }

    const params = new URLSearchParams({
      f: 'get_email_list',
      sid_token: sid_token.toString(),
      offset: offset.toString(),
    });

    const response = await fetch(`${GUERRILLA_API_URL}?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to get emails');
    
    const data = await response.json();
    
    res.json({
      success: true,
      messages: (data.list || []).map((email) => ({
        id: email.mail_id,
        from: email.mail_from,
        subject: email.mail_subject,
        excerpt: email.mail_excerpt,
        timestamp: email.mail_timestamp,
        read: email.mail_read === '1',
      })),
      total_count: parseInt(data.count || '0', 10),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/email/fetch?sid_token=xxxxx&email_id=xxxxx
 * Gets the full content of a specific email
 */
app.get('/api/email/fetch', async (req, res) => {
  try {
    const { sid_token, email_id } = req.query;

    if (!sid_token || !email_id) {
      return res.status(400).json({
        success: false,
        error: 'sid_token and email_id are required',
      });
    }

    const params = new URLSearchParams({
      f: 'fetch_email',
      sid_token: sid_token.toString(),
      email_id: email_id.toString(),
    });

    const response = await fetch(`${GUERRILLA_API_URL}?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch email');
    
    const data = await response.json();
    
    res.json({
      success: true,
      email: {
        id: data.mail_id,
        from: data.mail_from,
        to: data.mail_recipient,
        subject: data.mail_subject,
        body: data.mail_body,
        timestamp: data.mail_timestamp,
        content_type: data.content_type,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/email/domains
 * Get list of available domains
 */
app.get('/api/email/domains', (req, res) => {
  res.json({
    success: true,
    domains: DOMAINS,
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
