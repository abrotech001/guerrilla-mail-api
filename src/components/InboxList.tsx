import { Trash2, Mail, MailOpen, Inbox } from 'lucide-react';
import type { Email } from '@/hooks/useGuerrillaMail';
import { decodeHtmlEntities } from '@/lib/htmlDecode';

interface InboxListProps {
  emails: Email[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (ids: string[]) => void;
  emailCount: number;
}

export function InboxList({ emails, selectedId, onSelect, onDelete, emailCount }: InboxListProps) {
  return (
    <div className="rounded-xl border border-border bg-card card-shadow flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-2">
          <Inbox className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Inbox
          </h3>
          {emailCount > 0 && (
            <span className="inline-flex items-center justify-center rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-mono font-semibold text-primary">
              {emailCount}
            </span>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto max-h-[60vh]">
        {emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
              <Mail className="h-7 w-7 opacity-40" />
            </div>
            <p className="text-sm font-medium">No emails yet</p>
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
                  className={`group flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-all duration-150 animate-slide-in
                    ${isSelected ? 'bg-primary/10 border-l-2 border-l-primary' : 'hover:bg-secondary/60 border-l-2 border-l-transparent'}
                    ${!isRead ? '' : 'opacity-65'}
                  `}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {/* Icon */}
                  <div className="shrink-0 mt-0.5">
                    {isRead ? (
                      <MailOpen className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <div className="relative">
                        <Mail className="h-4 w-4 text-primary" />
                        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className={`text-sm truncate ${!isRead ? 'font-semibold text-foreground' : 'text-secondary-foreground'}`}>
                        {email.mail_from}
                      </p>
                      <span className="text-[11px] text-muted-foreground shrink-0 font-mono tabular-nums">
                        {email.mail_date}
                      </span>
                    </div>
                    <p className={`text-sm truncate mt-0.5 ${!isRead ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {decodeHtmlEntities(email.mail_subject)}
                    </p>
                    <p className="text-xs text-muted-foreground/70 truncate mt-0.5 leading-relaxed">
                      {decodeHtmlEntities(email.mail_excerpt).slice(0, 100)}
                    </p>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={e => { e.stopPropagation(); onDelete([email.mail_id]); }}
                    className="shrink-0 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    title="Delete"
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
