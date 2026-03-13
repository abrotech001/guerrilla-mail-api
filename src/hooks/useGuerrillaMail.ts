import { useState, useCallback, useRef, useEffect } from 'react';

const API_URL = 'https://api.guerrillamail.com/ajax.php';

export const DOMAINS = [
  'guerrillamail.com',
  'guerrillamailblock.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamail.de',
  'grr.la',
  'sharklasers.com',
  'guerrillamail.info',
  'spam4.me',
] as const;

export interface Email {
  mail_id: string;
  mail_from: string;
  mail_subject: string;
  mail_excerpt: string;
  mail_timestamp: string;
  mail_read: string;
  mail_date: string;
  att: string;
}

export interface FullEmail extends Email {
  mail_recipient: string;
  mail_body: string;
  content_type: string;
}

interface SessionState {
  emailAddr: string;
  sidToken: string;
  emailTimestamp: number;
  alias: string;
}

async function apiCall(func: string, params: Record<string, string> = {}) {
  const queryParams = new URLSearchParams({ f: func, ...params });
  const res = await fetch(`${API_URL}?${queryParams.toString()}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export function useGuerrillaMail() {
  const [session, setSession] = useState<SessionState | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<FullEmail | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [emailCount, setEmailCount] = useState(0);
  const [selectedDomain, setSelectedDomain] = useState<string>(DOMAINS[0]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const initSession = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiCall('get_email_address', { lang: 'en', site: selectedDomain });
      const newSession: SessionState = {
        emailAddr: data.email_addr,
        sidToken: data.sid_token,
        emailTimestamp: data.email_timestamp,
        alias: data.alias || '',
      };
      setSession(newSession);

      const listData = await apiCall('get_email_list', {
        sid_token: data.sid_token,
        offset: '0',
      });
      setEmails(listData.list || []);
      setEmailCount(parseInt(listData.count || '0', 10));

      return newSession;
    } catch (err) {
      console.error('Failed to init session:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedDomain]);

  const checkEmail = useCallback(async () => {
    if (!session) return;
    setChecking(true);
    try {
      const seq = emails.length > 0 ? emails[0].mail_id : '0';
      const data = await apiCall('check_email', {
        sid_token: session.sidToken,
        seq,
      });
      if (data.sid_token) {
        setSession(prev => prev ? { ...prev, sidToken: data.sid_token } : prev);
      }
      if (data.list && data.list.length > 0) {
        setEmails(prev => {
          const existingIds = new Set(prev.map((e: Email) => e.mail_id));
          const newEmails = data.list.filter((e: Email) => !existingIds.has(e.mail_id));
          return [...newEmails, ...prev];
        });
      }
      setEmailCount(parseInt(data.count || '0', 10));
    } catch (err) {
      console.error('Check email failed:', err);
    } finally {
      setChecking(false);
    }
  }, [session, emails]);

  const fetchEmail = useCallback(async (emailId: string) => {
    if (!session) return;
    setLoading(true);
    try {
      const data = await apiCall('fetch_email', {
        sid_token: session.sidToken,
        email_id: emailId,
      });
      setSelectedEmail(data);
      setEmails(prev =>
        prev.map(e => e.mail_id === emailId ? { ...e, mail_read: '1' } : e)
      );
      return data;
    } catch (err) {
      console.error('Fetch email failed:', err);
    } finally {
      setLoading(false);
    }
  }, [session]);

  const setEmailUser = useCallback(async (username: string) => {
    if (!session) return;
    setLoading(true);
    try {
      const data = await apiCall('set_email_user', {
        email_user: username,
        lang: 'en',
        sid_token: session.sidToken,
        site: selectedDomain,
      });
      setSession(prev => prev ? {
        ...prev,
        emailAddr: data.email_addr,
        sidToken: data.sid_token,
        emailTimestamp: data.email_timestamp,
        alias: data.alias || '',
      } : prev);
      setEmails([]);
      setSelectedEmail(null);

      const listData = await apiCall('get_email_list', {
        sid_token: data.sid_token,
        offset: '0',
      });
      setEmails(listData.list || []);
      setEmailCount(parseInt(listData.count || '0', 10));
    } catch (err) {
      console.error('Set email user failed:', err);
    } finally {
      setLoading(false);
    }
  }, [session, selectedDomain]);

  const deleteEmails = useCallback(async (emailIds: string[]) => {
    if (!session) return;
    try {
      const params: Record<string, string> = { sid_token: session.sidToken };
      emailIds.forEach((id, i) => {
        params[`email_ids[${i}]`] = id;
      });
      await apiCall('del_email', params);
      setEmails(prev => prev.filter(e => !emailIds.includes(e.mail_id)));
      if (selectedEmail && emailIds.includes(selectedEmail.mail_id)) {
        setSelectedEmail(null);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }, [session, selectedEmail]);

  const forgetMe = useCallback(async () => {
    if (!session) return;
    try {
      await apiCall('forget_me', {
        sid_token: session.sidToken,
        email_addr: session.emailAddr,
      });
      await initSession();
    } catch (err) {
      console.error('Forget me failed:', err);
    }
  }, [session, initSession]);

  const changeDomain = useCallback(async (domain: string) => {
    setSelectedDomain(domain);
    if (session) {
      // Extract username from current email
      const atIndex = session.emailAddr.indexOf('@');
      const username = atIndex > -1 ? session.emailAddr.substring(0, atIndex) : session.emailAddr;
      setLoading(true);
      try {
        const data = await apiCall('set_email_user', {
          email_user: username,
          lang: 'en',
          sid_token: session.sidToken,
          site: domain,
        });
        setSession(prev => prev ? {
          ...prev,
          emailAddr: data.email_addr,
          sidToken: data.sid_token,
          emailTimestamp: data.email_timestamp,
          alias: data.alias || '',
        } : prev);
        setEmails([]);
        setSelectedEmail(null);

        const listData = await apiCall('get_email_list', {
          sid_token: data.sid_token,
          offset: '0',
        });
        setEmails(listData.list || []);
        setEmailCount(parseInt(listData.count || '0', 10));
      } catch (err) {
        console.error('Change domain failed:', err);
      } finally {
        setLoading(false);
      }
    }
  }, [session]);

  useEffect(() => {
    if (!session) return;
    intervalRef.current = setInterval(checkEmail, 10000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [session, checkEmail]);

  return {
    session,
    emails,
    selectedEmail,
    loading,
    checking,
    emailCount,
    selectedDomain,
    initSession,
    checkEmail,
    fetchEmail,
    setEmailUser,
    deleteEmails,
    forgetMe,
    setSelectedEmail,
    changeDomain,
  };
}
