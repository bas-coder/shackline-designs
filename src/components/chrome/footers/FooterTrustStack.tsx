import { ShieldCheck } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import type { FooterTrustBadge } from '../types';

/**
 * The trust stack: 2 to 4 certification rows stacked vertically under the brand block, each a
 * circular icon chip, a label and a sub-label. Trust lives in the footer as a list, never a row of
 * logos. Embodies the Socialsonic, Writesonic and Camb.ai compliance columns.
 */
export function FooterTrustStack({ trust, className }: { trust: FooterTrustBadge[]; className?: string }) {
  if (!trust.length) return null;
  return (
    <ul className={cn('flex flex-col gap-3', className)} aria-label="Certifications">
      {trust.slice(0, 4).map((t) => (
        <li key={t.label} className="flex items-center gap-3">
          <span aria-hidden className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
            {t.icon ?? <ShieldCheck className="h-4 w-4" />}
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="text-sm font-medium text-foreground">{t.label}</span>
            {t.sub && <span className="text-xs text-muted-foreground">{t.sub}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}
