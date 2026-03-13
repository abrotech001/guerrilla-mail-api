import type { VercelRequest, VercelResponse } from '@vercel/node';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const domain = (req.query.domain as string) || DOMAINS[Math.floor(Math.random() * DOMAINS.length)];

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
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
