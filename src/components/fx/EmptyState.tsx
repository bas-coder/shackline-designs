import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * The canonical empty state: a centered icon + title + line + optional action. Use for ANY section or
 * list that can be empty so a data-less section never renders blank or contentless placeholder cards
 * (the "Upcoming parties shows empty boxes" gap). Landing sections and authed lists use the same shape.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 px-6 py-16 text-center', className)}>
      {icon && (
        <div className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">{icon}</div>
      )}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
        {description && <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}
