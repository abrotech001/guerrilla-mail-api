import { Trash2, Mail, MailOpen } from 'lucide-react';
import type { Email } from '@/hooks/useGuerrillaMail';

interface InboxListProps {
  emails: Email[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (ids: string[]) => void;
  emailCount: number;
}

function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

export function InboxList({ emails, selectedId, onSelect, onDelete, emailCount }: InboxListProps) {
  return (
    <div className="rounded-lg border border-border bg-card card-shadow flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Inbox
          {emailCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center rounded-full bg-primary/15 px-2 py-0.5 text-xs font-mono text-primary">
              {emailCount}
            </span>
          )}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[60vh]">
        {emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Mail className="h-10 w-10 mb-3 opacity-30" />
            <p className="text-sm">No emails yet</p>
            <p className="text-xs mt-1 opacity-60">Waiting for incoming mail...</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {emails.map((email, index) => {
              const isRead = email.mail_read === '1';
              const isSelected = email.mail_id === selectedId;

              return (
                <div
                  key={email.mail_id}
                  onClick={() => onSelect(email.mail_id)}
                  className={`group flex items-start gap-3 px-4 py-3 cursor-pointer transition-all animate-slide-in
                    ${isSelected ? 'bg-primary/10 border-l-2 border-l-primary' : 'hover:bg-secondary/50 border-l-2 border-l-transparent'}
                    ${!isRead ? '' : 'opacity-70'}
                  `}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="shrink-0 mt-1">
                    {isRead ? (
                      <MailOpen className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Mail className="h-4 w-4 text-primary" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className={`text-sm truncate ${!isRead ? 'font-semibold text-foreground' : 'text-secondary-foreground'}`}>
                        {email.mail_from}
                      </p>
                      <span className="text-xs text-muted-foreground shrink-0 font-mono">{email.mail_date}</span>
                    </div>
                    <p className={`text-sm truncate mt-0.5 ${!isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {decodeHtmlEntities(email.mail_subject)}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {decodeHtmlEntities(email.mail_excerpt).slice(0, 80)}
                    </p>
                  </div>

                  <button
                    onClick={e => { e.stopPropagation(); onDelete([email.mail_id]); }}
                    className="shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
