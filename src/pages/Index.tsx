import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuerrillaMail } from '@/hooks/useGuerrillaMail';
import { AppHeader } from '@/components/AppHeader';
import { EmailHeader } from '@/components/EmailHeader';
import { InboxList } from '@/components/InboxList';
import { EmailViewer } from '@/components/EmailViewer';
import { Loader2, ShieldCheck, RefreshCw, Zap, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  const {
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
  } = useGuerrillaMail();

  useEffect(() => {
    initSession();
  }, [initSession]);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center glow-border">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground">Generating your temporary email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      
      {/* Top Navigation Bar */}
      <div className="border-b border-border/50 bg-secondary/20 sticky top-0 z-40">
        <div className="container max-w-5xl px-4 sm:px-6 py-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/api-directory')}
            className="gap-2 text-sm"
          >
            <BookOpen className="w-4 h-4" />
            API Directory
          </Button>
        </div>
      </div>

      <main className="flex-1 container max-w-5xl px-4 sm:px-6 py-4 sm:py-6 space-y-4">
        <EmailHeader
          emailAddr={session.emailAddr}
          selectedDomain={selectedDomain}
          onSetUser={setEmailUser}
          onRefresh={checkEmail}
          onForget={forgetMe}
          onChangeDomain={changeDomain}
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

        {/* Features strip */}
        <div className="grid grid-cols-3 gap-3 py-4">
          {[
            { icon: ShieldCheck, label: 'No Sign-up', desc: 'Instant access' },
            { icon: RefreshCw, label: 'Auto-Refresh', desc: 'Every 10 seconds' },
            { icon: Zap, label: 'Disposable', desc: 'Privacy first' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex flex-col items-center text-center p-3 rounded-lg bg-secondary/30 border border-border/50">
              <Icon className="h-5 w-5 text-primary mb-1.5" />
              <span className="text-xs font-medium text-foreground">{label}</span>
              <span className="text-[10px] text-muted-foreground mt-0.5">{desc}</span>
            </div>
          ))}
        </div>

        <footer className="text-center pb-6 pt-2 text-xs text-muted-foreground/60">
          <p>datempmail — Powered by Guerrilla Mail API</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
