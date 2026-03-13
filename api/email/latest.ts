import type { VercelRequest, VercelResponse } from '@vercel/node';

const GUERRILLA_API_URL = 'https://api.guerrillamail.com/ajax.php';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const { sid_token } = req.query;
    if (!sid_token) return res.status(400).json({ success: false, error: 'sid_token is required' });

    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || '127.0.0.1';
    const userAgent = (req.headers['user-agent'] as string) || 'Vercel';

    // Step 1: Get the inbox list to find the latest email ID
    const listParams = new URLSearchParams({
      f: 'get_email_list',
      offset: '0',
      sid_token: sid_token.toString(),
      ip: clientIp,
      agent: userAgent,
      _: Date.now().toString()
    });

    const listResponse = await fetch(`${GUERRILLA_API_URL}?${listParams.toString()}`);
    const listData = await listResponse.json();

    if (!listData.list || listData.list.length === 0) {
      return res.json({ success: true, message: null, note: 'Inbox is empty' });
    }

    // Extract the ID of the newest email (first in the array)
    const latestEmailId = listData.list[0].mail_id;

    // Step 2: Fetch the full body for that specific ID
    const readParams = new URLSearchParams({
      f: 'fetch_email',
      email_id: latestEmailId,
      sid_token: sid_token.toString(),
      ip: clientIp,
      agent: userAgent,
    });

    const readResponse = await fetch(`${GUERRILLA_API_URL}?${readParams.toString()}`);
    const fullMessageData = await readResponse.json();

    res.json({
      success: true,
      message: {
        id: fullMessageData.mail_id,
        from: fullMessageData.mail_from,
        subject: fullMessageData.mail_subject,
        body: fullMessageData.mail_body, // Includes full HTML & links
        timestamp: fullMessageData.mail_timestamp,
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
