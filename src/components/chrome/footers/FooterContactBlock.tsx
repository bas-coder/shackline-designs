import { Clock, MapPin } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { columnHeadClass, footerLinkClass } from '../contract';
import type { FooterContact } from '../types';

/**
 * The contact block: plain text rows (a glyph, a quiet label, the value as the link), opening hours
 * as a small list, and the address. Micro-signals are text, never widgets. Embodies the contact rows
 * beneath the Performance Partners, Appsecure and Camb.ai newsletter splits and the address slot of
 * the LTV.ai and PressMaster link-only footers; a live local-time signal belongs in the legal bar.
 */
export function FooterContactBlock({ contact, heading = 'Contact', hoursLabel = 'Hours', className }: { contact: FooterContact; heading?: string; hoursLabel?: string; className?: string }) {
  return (
    <address className={cn('flex flex-col gap-6 not-italic', className)}>
      <div>
        <h3 className={cn(columnHeadClass, 'mb-2')}>{heading}</h3>
        <ul className="flex flex-col">
          {contact.rows.map((row) => (
            <li key={row.label} className="flex min-h-11 items-center gap-3">
              {row.icon && (
                <span aria-hidden className="inline-flex size-5 shrink-0 items-center justify-center text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">
                  {row.icon}
                </span>
              )}
              <span className="sr-only">{row.label}</span>
              {row.href ? (
                <a href={row.href} className={cn(footerLinkClass, 'inline-flex min-h-11 items-center')}>
                  {row.value}
                </a>
              ) : (
                <span className="text-sm text-foreground/75">{row.value}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      {contact.hours?.length ? (
        <div>
          <h3 className={cn(columnHeadClass, 'mb-2 inline-flex items-center gap-1.5')}>
            <Clock className="h-3 w-3" aria-hidden />
            {hoursLabel}
          </h3>
          <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
            {contact.hours.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {contact.address && (
        <p className="flex items-start gap-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>{contact.address}</span>
        </p>
      )}
    </address>
  );
}
