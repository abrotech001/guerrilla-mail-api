import type { VercelRequest, VercelResponse } from '@vercel/node';

const GUERRILLA_API_URL = 'https://api.guerrillamail.com/ajax.php';

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
    const { sid_token, offset = '0' } = req.query;

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
      messages: (data.list || []).map((email: any) => ({
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
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
