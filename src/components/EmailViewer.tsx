import { ArrowLeft, Trash2, Clock, User, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { decodeHtmlEntities } from '@/lib/htmlDecode';
import type { FullEmail } from '@/hooks/useGuerrillaMail';

interface EmailViewerProps {
  email: FullEmail;
  onBack: () => void;
  onDelete: (ids: string[]) => void;
}

function unblockImages(html: string): string {
  // Replace guerrillamail blocked image URLs with actual image URLs
  let result = html.replace(
    /"\/res\.php\?r=1&amp;n=[a-z]+&amp;q=([^"&]+)"/g,
    (_str, p1) => `"${decodeURIComponent(p1)}"`
  );
  result = result.replace(
    /&quot;\/res\.php\?r=1&amp;n=[a-z]+&amp;q=([^"]+)&quot;/g,
    (_str, p1) => `&quot;${decodeURIComponent(p1)}&quot;`
  );
  return result;
}

export function EmailViewer({ email, onBack, onDelete }: EmailViewerProps) {
  const isHtml = email.content_type?.includes('text/html');
  const displayBody = isHtml ? unblockImages(email.mail_body) : email.mail_body;

  return (
    <div className="rounded-xl border border-border bg-card card-shadow flex flex-col overflow-hidden animate-fade-in">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-secondary/30">
        <Button size="sm" variant="ghost" onClick={onBack} className="gap-1.5 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Inbox</span>
          <span className="sm:hidden">Back</span>
        </Button>
        <div className="flex-1" />
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete([email.mail_id])}
          className="text-destructive hover:text-destructive gap-1.5"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </div>

      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-border space-y-3">
        <h2 className="text-base sm:text-xl font-semibold text-foreground leading-snug">
          {decodeHtmlEntities(email.mail_subject)}
        </h2>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 mt-0.5 shrink-0 text-primary/60" />
            <div className="min-w-0">
              <span className="font-mono text-xs text-foreground/80 break-all">{email.mail_from}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-primary/60" />
            <span className="text-xs">{email.mail_date}</span>
          </div>
          {email.mail_recipient && (
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 shrink-0 text-primary/60" />
              <span className="text-xs">
                To: <span className="font-mono text-foreground/80">{email.mail_recipient}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-h-[60vh] bg-background/50">
        {isHtml ? (
          <div
            className="prose prose-invert prose-sm max-w-none
              [&_a]:text-primary [&_a]:underline [&_a]:break-all
              [&_img]:max-w-full [&_img]:rounded [&_img]:h-auto
              [&_table]:border-border [&_td]:p-2 [&_th]:p-2
              [&_pre]:bg-secondary [&_pre]:p-3 [&_pre]:rounded-lg
              [&_code]:bg-secondary [&_code]:px-1 [&_code]:rounded
              [&_blockquote]:border-l-primary/50"
            dangerouslySetInnerHTML={{ __html: displayBody }}
          />
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-sm text-secondary-foreground leading-relaxed">
            {email.mail_body}
          </pre>
        )}
      </div>
    </div>
  );
}
