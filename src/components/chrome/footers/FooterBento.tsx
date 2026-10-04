import { cn } from '@/lib/utils';
import { columnHeadClass } from '../contract';
import { BrandCluster } from '../parts/BrandCluster';
import { HealthPill } from '../parts/MicroSignals';
import type { ChromeBrand, ChromeLink, ControlShape, FooterCapture, FooterColumn } from '../types';
import { LinkList, SocialChips } from './bits';
import { FooterNewsletter } from './FooterNewsletter';

/**
 * The bento footer: a 3 plus 2 tile grid where every tile is one cluster (brand and mission,
 * newsletter, a link list, a status tile with the live health pill, socials) and all tiles share one
 * radius and one padding. Descends from the Socialsonic promo tile (a card in one cell of the link
 * grid) with its defect removed: no tile out-shouts the others, and the only filled control is the
 * newsletter button.
 */
export function FooterBento({ brand, columns = [], newsletter, socials, statusLabel = 'Status', socialLabel = 'Follow', controls = 'scale', className }: { brand: ChromeBrand; columns?: FooterColumn[]; newsletter?: FooterCapture; socials?: ChromeLink[]; statusLabel?: string; socialLabel?: string; controls?: ControlShape; className?: string }) {
  const tile = 'flex flex-col gap-4 rounded-2xl border border-border bg-card p-6';
  const [first, second, ...rest] = columns;
  return (
    <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6', className)}>
      <div className={cn(tile, 'lg:col-span-2')}>
        <BrandCluster brand={brand} />
        {brand.mission && <p className="text-sm leading-relaxed text-muted-foreground">{brand.mission}</p>}
      </div>
      <div className={cn(tile, 'lg:col-span-2')}>{newsletter ? <FooterNewsletter newsletter={newsletter} controls={controls} className="max-w-none" /> : first ? <LinkList column={first} /> : null}</div>
      <div className={cn(tile, 'lg:col-span-2')}>{newsletter && first ? <LinkList column={first} /> : second ? <LinkList column={second} /> : null}</div>
      <div className={cn(tile, 'lg:col-span-3')}>
        <div className="flex items-center justify-between gap-4">
          <h3 className={columnHeadClass}>{statusLabel}</h3>
          <HealthPill />
        </div>
        <div className="grid grid-cols-2 gap-6">
          {(newsletter ? [second, ...rest] : rest)
            .flatMap((c) => (c ? [c] : []))
            .slice(0, 2)
            .map((c) => <LinkList key={c.heading} column={c} cap={4} />)}
        </div>
      </div>
      <div className={cn(tile, 'lg:col-span-3')}>
        <h3 className={columnHeadClass}>{socialLabel}</h3>
        <SocialChips socials={socials} controls={controls} className="-ml-3" />
        {!socials?.length && <p className="text-sm text-muted-foreground">{brand.name}</p>}
      </div>
    </div>
  );
}
