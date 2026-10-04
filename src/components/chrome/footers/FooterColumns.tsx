import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { ChromeBrand, ChromeLink, ControlShape, FooterColumn, FooterTrustBadge } from '../types';
import { BrandBlock, LinkList } from './bits';
import { FooterTrustStack } from './FooterTrustStack';

/**
 * The columns substrate: slot 1 holds the brand block (mark, 2-line mission, 44px social chips and,
 * for trust-column and mega-saas, the vertical trust stack); slots 2 to 5 hold 3 to 4 link columns
 * under quiet small-caps heads, capped at 6 visible items each with the rest under a native "More".
 * The grid is balanced by item count, not column width. Embodies the CRA, AI Suitup, Writesonic and
 * PressMaster substrates; `compact` tightens the rhythm for the monument and scene styles.
 */
export function FooterColumns({ brand, columns = [], socials, trust, slot1, compact, controls = 'scale', className, children }: { brand?: ChromeBrand; columns?: FooterColumn[]; socials?: ChromeLink[]; trust?: FooterTrustBadge[]; /** Replaces the brand block entirely. */ slot1?: ReactNode; compact?: boolean; controls?: ControlShape; className?: string; children?: ReactNode }) {
  const n = Math.max(columns.length, 1);
  const first = slot1 ?? (brand ? (
    <BrandBlock brand={brand} socials={socials} controls={controls}>
      {trust?.length ? <FooterTrustStack trust={trust} className="mt-1" /> : null}
    </BrandBlock>
  ) : null);
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(var(--cols),minmax(0,1fr))]', compact ? 'gap-8 lg:gap-10' : 'gap-10 lg:gap-12', className)} style={{ '--cols': n } as CSSProperties}>
      {first && <div className="sm:col-span-2 lg:col-span-1 lg:pr-8">{first}</div>}
      {columns.map((c) => (
        <LinkList key={c.heading} column={c} />
      ))}
      {children}
    </div>
  );
}
