import { useEffect } from 'react';
import { useGuerrillaMail } from '@/hooks/useGuerrillaMail';
import { AppHeader } from '@/components/AppHeader';
import { EmailHeader } from '@/components/EmailHeader';
import { InboxList } from '@/components/InboxList';
import { EmailViewer } from '@/components/EmailViewer';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const {
    session,
    emails,
    selectedEmail,
    loading,
    checking,
    emailCount,
    initSession,
    checkEmail,
    fetchEmail,
    setEmailUser,
    deleteEmails,
    forgetMe,
    setSelectedEmail,
  } = useGuerrillaMail();

  useEffect(() => {
    initSession();
  }, [initSession]);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Generating your temporary email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />

      <main className="flex-1 container max-w-5xl py-6 space-y-4">
        <EmailHeader
          emailAddr={session.emailAddr}
          onSetUser={setEmailUser}
          onRefresh={checkEmail}
          onForget={forgetMe}
          checking={checking}
          loading={loading}
        />

        {selectedEmail ? (
          <EmailViewer
            email={selectedEmail}
            onBack={() => setSelectedEmail(null)}
            onDelete={(ids) => {
              deleteEmails(ids);
              setSelectedEmail(null);
            }}
          />
        ) : (
          <InboxList
            emails={emails}
            selectedId={null}
            onSelect={fetchEmail}
            onDelete={deleteEmails}
            emailCount={emailCount}
          />
        )}

        <footer className="text-center py-6 text-xs text-muted-foreground">
          <p>Emails auto-refresh every 10 seconds · Powered by Guerrilla Mail API</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
