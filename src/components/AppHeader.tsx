import { Mail } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container max-w-5xl flex items-center justify-between py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/15 glow-border">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              <span className="gradient-text">datempmail</span>
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none mt-0.5">
              Disposable Email
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
          <span className="hidden sm:inline">Auto-refreshing</span>
        </div>
      </div>
    </header>
  );
}
