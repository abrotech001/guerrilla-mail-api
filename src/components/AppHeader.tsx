import { Mail } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container max-w-5xl flex items-center justify-between py-3 sm:py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-primary/15 glow-border">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-tight">
              <span className="gradient-text">datempmail</span>
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] leading-none mt-0.5">
              Disposable Email Service
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 rounded-full px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
            <span className="hidden sm:inline">Auto-refreshing</span>
            <span className="sm:hidden">Live</span>
          </div>
        </div>
      </div>
    </header>
  );
}
