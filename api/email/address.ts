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
  
  // FIX 1: Prevent the browser and Vercel Edge Network from caching this route
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const domain = (req.query.domain as string) || DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
    const sid_token = req.query.sid_token as string;

    // FIX 2: Forward client IP and Agent to avoid Vercel getting rate-limited
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || '127.0.0.1';
    const userAgent = (req.headers['user-agent'] as string) || 'Vercel_Serverless_Function';

    const params = new URLSearchParams({
      f: 'get_email_address',
      lang: 'en',
      site: domain,
      ip: clientIp,
      agent: userAgent,
      // FIX 3: Add a timestamp to bust internal fetch caching
      _: Date.now().toString() 
    });

    // If the client passes a session token, append it to maintain the session
    if (sid_token) {
      params.append('sid_token', sid_token);
    }

    const response = await fetch(`${GUERRILLA_API_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      cache: 'no-store' // FIX 4: Ensure Node.js fetch doesn't cache
    });

    if (!response.ok) {
      throw new Error(`Guerrilla Mail API error: Status ${response.status}`);
    }

    const data = await response.json();

    res.status(200).json({
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
