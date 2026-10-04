import { cn } from '@/lib/utils';
import { CONTAINER } from '../contract';
import { CtaLink } from '../parts/ActionCluster';
import { NavProductBar } from './NavProductBar';
import { isTabActive, type NavProps } from './shared';

/**
 * tab-strip: the product bar plus a second row of section tabs, the active tab underlined in the
 * accent, a primary action at the row's right. Embodies Bricx "Manyreach 355", "Metricbooks 359"
 * and "Avantpage 350" (entity detail pages with 3 to 6 sub-views). The tab row is about 0.8 of the
 * bar height (min-h-11) and scrolls horizontally on phones. When props.action is given it is the
 * ONE filled control, so the top row drops its own CTA.
 */
export function NavTabStrip(props: NavProps) {
  const { tabs = [], activeHref, action, cta, controls = 'scale', className } = props;
  return (
    <div className={cn('sticky top-0 z-40', className)}>
      <NavProductBar {...props} cta={action ? undefined : cta} className="static border-b-0" />
      <div className="border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className={cn(CONTAINER, 'flex items-stretch gap-3 px-4 sm:px-6')}>
          <nav aria-label="Sections" className="flex min-w-0 flex-1 overflow-x-auto">
            <ul className="flex min-h-11 items-stretch gap-1" role="list">
              {tabs.map((tab, i) => {
                const active = isTabActive(tab, tabs, activeHref);
                return (
                  <li key={`${tab.href}-${tab.label}-${i}`} className="flex">
                    <a
                      href={tab.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap border-b-2 border-transparent px-3 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60',
                        active && 'border-primary text-foreground'
                      )}
                    >
                      {tab.icon}
                      {tab.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          {action && <CtaLink cta={{ treatment: 'filled', ...action }} controls={controls} className="my-1 shrink-0 self-center" />}
        </div>
      </div>
    </div>
  );
}
