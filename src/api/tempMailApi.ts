/**
 * Minimal API wrapper for Guerrilla Mail with 3 core endpoints
 */

const BASE_URL = 'https://api.guerrillamail.com/ajax.php';

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

interface ApiResponse {
  [key: string]: any;
}

/**
 * Endpoint 1: Create a new temporary email address
 * GET /api/create-email?domain=guerrillamail.com (or random if not specified)
 */
export async function createEmail(domain?: string): Promise<{
  email: string;
  sid_token: string;
  timestamp: number;
}> {
  const selectedDomain = domain || DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
  
  const params = new URLSearchParams({
    f: 'get_email_address',
    lang: 'en',
    site: selectedDomain,
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to create email');
  
  const data: ApiResponse = await response.json();
  
  return {
    email: data.email_addr,
    sid_token: data.sid_token,
    timestamp: data.email_timestamp,
  };
}

/**
 * Endpoint 2: Get emails for a specific email address
 * GET /api/get-emails?sid_token=xxxxx&offset=0
 */
export async function getEmails(sidToken: string, offset: number = 0): Promise<{
  emails: Array<{
    id: string;
    from: string;
    subject: string;
    excerpt: string;
    timestamp: string;
    read: string;
  }>;
  count: number;
}> {
  const params = new URLSearchParams({
    f: 'get_email_list',
    sid_token: sidToken,
    offset: offset.toString(),
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to get emails');
  
  const data: ApiResponse = await response.json();
  
  return {
    emails: (data.list || []).map((email: any) => ({
      id: email.mail_id,
      from: email.mail_from,
      subject: email.mail_subject,
      excerpt: email.mail_excerpt,
      timestamp: email.mail_timestamp,
      read: email.mail_read,
    })),
    count: parseInt(data.count || '0', 10),
  };
}

/**
 * Endpoint 3: Check for new emails / Refresh inbox
 * POST /api/check-email { sid_token: "xxxxx", last_email_id: "0" }
 */
export async function checkEmail(sidToken: string, lastEmailId: string = '0'): Promise<{
  newEmails: Array<{
    id: string;
    from: string;
    subject: string;
    excerpt: string;
    timestamp: string;
  }>;
  count: number;
  newSidToken?: string;
}> {
  const params = new URLSearchParams({
    f: 'check_email',
    sid_token: sidToken,
    seq: lastEmailId,
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to check emails');
  
  const data: ApiResponse = await response.json();
  
  return {
    newEmails: (data.list || []).map((email: any) => ({
      id: email.mail_id,
      from: email.mail_from,
      subject: email.mail_subject,
      excerpt: email.mail_excerpt,
      timestamp: email.mail_timestamp,
    })),
    count: parseInt(data.count || '0', 10),
    newSidToken: data.sid_token,
  };
}

export const API = {
  createEmail,
  getEmails,
  checkEmail,
  DOMAINS,
};
