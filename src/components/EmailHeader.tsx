import { useState } from 'react';
import { Copy, Check, RefreshCw, Edit3, Shield, Globe, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { DOMAINS } from '@/hooks/useGuerrillaMail';

interface EmailHeaderProps {
  emailAddr: string;
  selectedDomain: string;
  onSetUser: (username: string) => void;
  onRefresh: () => void;
  onForget: () => void;
  onChangeDomain: (domain: string) => void;
  checking: boolean;
  loading: boolean;
}

export function EmailHeader({
  emailAddr,
  selectedDomain,
  onSetUser,
  onRefresh,
  onForget,
  onChangeDomain,
  checking,
  loading,
}: EmailHeaderProps) {
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
    const usernameDisplay = emailAddr ? emailAddr.split('@')[0] : 'loading...';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(emailAddr);
    setCopied(true);
    toast.success('Email address copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSetUser = () => {
    if (username.trim()) {
      onSetUser(username.trim());
      setEditing(false);
      setUsername('');
    }
  };

  const handleRandomDomain = () => {
    const otherDomains = DOMAINS.filter(d => d !== selectedDomain);
    const random = otherDomains[Math.floor(Math.random() * otherDomains.length)];
    onChangeDomain(random);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6 card-shadow space-y-4">
      {/* Title row */}
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Your Temporary Email
        </h2>
        <div className="ml-auto flex items-center gap-1.5">
          <div className={`h-2 w-2 rounded-full ${checking ? 'bg-primary animate-pulse-glow' : 'bg-primary/40'}`} />
          <span className="text-[10px] text-muted-foreground hidden sm:inline">
            {checking ? 'Checking...' : 'Live'}
          </span>
        </div>
      </div>

            {/* Email display */}
      <div
        onClick={handleCopy}
        className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-3 sm:px-4 sm:py-3.5 cursor-pointer hover:border-primary/40 transition-colors group"
      >
        <span className="font-mono text-sm sm:text-lg text-foreground truncate flex-1 select-all">
          {usernameDisplay} <span className="text-muted-foreground font-sans px-1">+</span> @{selectedDomain}
        </span>
        <span className="shrink-0 p-1.5 rounded-md text-muted-foreground group-hover:text-primary transition-colors">
          {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
        </span>
      </div>


      {/* Domain selector */}
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
        <Select value={selectedDomain} onValueChange={onChangeDomain}>
          <SelectTrigger className="flex-1 h-9 text-xs font-mono bg-secondary/50 border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DOMAINS.map(domain => (
              <SelectItem key={domain} value={domain} className="text-xs font-mono">
                @{domain}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline" onClick={handleRandomDomain} className="h-9 gap-1.5 shrink-0" title="Random domain">
          <Shuffle className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-xs">Random</span>
        </Button>
      </div>

      {/* Actions */}
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
              Change
            </Button>
            <Button size="sm" variant="secondary" onClick={onRefresh} disabled={checking} className="gap-1.5">
              <RefreshCw className={`h-3.5 w-3.5 ${checking ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={onForget}
              className="gap-1.5 text-destructive hover:text-destructive"
            >
              New Address
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
