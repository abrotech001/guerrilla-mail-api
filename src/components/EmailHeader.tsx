import { useState } from 'react';
import { Copy, Check, RefreshCw, Edit3, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface EmailHeaderProps {
  emailAddr: string;
  onSetUser: (username: string) => void;
  onRefresh: () => void;
  onForget: () => void;
  checking: boolean;
  loading: boolean;
}

export function EmailHeader({ emailAddr, onSetUser, onRefresh, onForget, checking, loading }: EmailHeaderProps) {
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(emailAddr);
    setCopied(true);
    toast.success('Email copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSetUser = () => {
    if (username.trim()) {
      onSetUser(username.trim());
      setEditing(false);
      setUsername('');
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 sm:p-6 card-shadow">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-primary" />
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Your Temporary Email</h2>
        <div className={`ml-auto h-2 w-2 rounded-full ${checking ? 'bg-primary animate-pulse-glow' : 'bg-primary/40'}`} />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/50 px-3 py-2.5 sm:px-4 sm:py-3">
          <span className="font-mono text-sm sm:text-lg text-foreground truncate flex-1">{emailAddr}</span>
          <button
            onClick={handleCopy}
            className="shrink-0 p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
          >
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {editing ? (
            <div className="flex gap-2 flex-1 min-w-0">
              <Input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username..."
                className="font-mono text-sm bg-secondary/50"
                onKeyDown={e => e.key === 'Enter' && handleSetUser()}
                maxLength={74}
                autoFocus
              />
              <Button size="sm" onClick={handleSetUser} disabled={!username.trim() || loading}>
                Set
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <Button size="sm" variant="secondary" onClick={() => setEditing(true)} className="gap-1.5">
                <Edit3 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Change</span>
              </Button>
              <Button size="sm" variant="secondary" onClick={onRefresh} disabled={checking} className="gap-1.5">
                <RefreshCw className={`h-3.5 w-3.5 ${checking ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button size="sm" variant="secondary" onClick={onForget} className="gap-1.5 text-destructive hover:text-destructive">
                <span className="hidden sm:inline">New Address</span>
                <span className="sm:hidden">New</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
