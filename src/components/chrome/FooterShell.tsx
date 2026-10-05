import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CONTAINER } from './contract';

/**
 * The footer container: a crown slot (a tinted band, a capture field, a photograph, an accordion),
 * the substrate (brand, columns, contact, trust), and the legal row. The crown and the substrate are
 * two organs with different backgrounds and rhythm; the gap above the substrate is generous (2.5 to
 * 4 times the gap between link rows) and the legal row is separated by a hairline, never a band.
 * `wordmark` renders the brand name at display scale, low opacity, cropped by the bottom edge.
 */
export function FooterShell({ crown, children, legal, wordmark, tone = 'default', className, ...rest }: { crown?: ReactNode; children?: ReactNode; legal?: ReactNode; wordmark?: string; tone?: 'default' | 'dark' | 'card'; className?: string } & React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn('relative overflow-hidden', tone === 'dark' && 'bg-foreground text-background', tone === 'card' && 'bg-card text-card-foreground', className)} {...rest}>
      {crown && <div className={cn(CONTAINER, 'px-8 pt-16 sm:pt-20')}>{crown}</div>}
      {children && <div className={cn(CONTAINER, 'sl-footer-edge px-8 pt-14 sm:pt-16')}>{children}</div>}
      {legal && <div className={cn(CONTAINER, 'sl-footer-edge px-8 pt-10 pb-8')}>{legal}</div>}
      {wordmark && (
        <div aria-hidden className="pointer-events-none select-none overflow-hidden">
          <div className={cn(CONTAINER, 'sl-footer-edge px-8')}>
            <span className="block translate-y-[28%] whitespace-nowrap font-sans text-[clamp(5rem,18vw,16rem)] font-bold uppercase leading-[0.8] tracking-[-0.02em] opacity-[0.08]">{wordmark}</span>
          </div>
        </div>
      )}
    </footer>
  );
}
