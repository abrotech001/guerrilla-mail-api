import { ArrowLeft, Trash2, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FullEmail } from '@/hooks/useGuerrillaMail';

interface EmailViewerProps {
  email: FullEmail;
  onBack: () => void;
  onDelete: (ids: string[]) => void;
}

function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

export function EmailViewer({ email, onBack, onDelete }: EmailViewerProps) {
  const isHtml = email.content_type?.includes('text/html');

  return (
    <div className="rounded-lg border border-border bg-card card-shadow flex flex-col overflow-hidden animate-fade-in">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <Button size="sm" variant="ghost" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex-1" />
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete([email.mail_id])}
          className="text-destructive hover:text-destructive gap-1.5"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </div>

      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-border space-y-2">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground leading-tight">
          {decodeHtmlEntities(email.mail_subject)}
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span className="font-mono text-xs">{email.mail_from}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {email.mail_date}
          </span>
        </div>
        {email.mail_recipient && (
          <p className="text-xs text-muted-foreground">
            To: <span className="font-mono">{email.mail_recipient}</span>
          </p>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-h-[60vh]">
        {isHtml ? (
          <div
            className="prose prose-invert prose-sm max-w-none
              [&_a]:text-primary [&_a]:underline
              [&_img]:max-w-full [&_img]:rounded
              [&_table]:border-border [&_td]:p-2 [&_th]:p-2"
            dangerouslySetInnerHTML={{ __html: email.mail_body }}
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
