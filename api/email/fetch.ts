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
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
