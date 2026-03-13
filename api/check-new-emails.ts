import { VercelRequest, VercelResponse } from '@vercel/node';

const API_URL = 'https://api.guerrillamail.com/ajax.php';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sid_token, last_email_id = '0' } = req.query;

    if (!sid_token || typeof sid_token !== 'string') {
      return res.status(400).json({ error: 'sid_token is required' });
    }

    const params = new URLSearchParams({
      f: 'check_email',
      sid_token,
      seq: typeof last_email_id === 'string' ? last_email_id : '0',
    });

    const response = await fetch(`${API_URL}?${params.toString()}`);
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Guerrilla Mail API error' });
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      new_emails: (data.list || []).map((email: any) => ({
        id: email.mail_id,
        from: email.mail_from,
        subject: email.mail_subject,
        excerpt: email.mail_excerpt,
        timestamp: email.mail_timestamp,
        read: email.mail_read,
      })),
      count: parseInt(data.count || '0', 10),
      sid_token: data.sid_token || sid_token,
    });
  } catch (error) {
    console.error('Error checking emails:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
