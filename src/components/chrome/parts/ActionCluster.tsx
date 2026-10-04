import type { ReactNode } from 'react';
import { AuthCTA, ShimmerButton } from '@/components/fx';
import { cn } from '@/lib/utils';
import { SPLIT_PRIMARY, SplitPrimaryParts, splitPrimaryStyle } from '@/components/split-primary';
import { filledCtaClass, ghostCtaClass, outlineCtaClass, radiusClass, CONTROL_H } from '../contract';
import type { ChromeCta, ControlShape } from '../types';
import { visualCopy } from '../visual-copy';

/** One CTA rendered by its treatment; `auth` routes it through AuthCTA so a signed-in visitor sees the app. */
export function CtaLink({ cta, controls = 'scale', className }: { cta: ChromeCta; controls?: ControlShape; className?: string }) {
  const treatment = cta.treatment ?? 'filled';
  if (cta.auth) {
    return <AuthCTA signedOutLabel={cta.label} signedOutAppearance={visualCopy(cta, 'label')} signInHref={cta.href} className={cn(treatment === 'outline' ? outlineCtaClass(controls) : treatment === 'ghost' ? ghostCtaClass(controls) : filledCtaClass(controls), 'shadow-none', className)} />;
  }
  if (treatment === 'shimmer') {
    return (
      <ShimmerButton className={cn(CONTROL_H, radiusClass(controls), 'px-5 text-sm font-medium', className)}>
        <a href={cta.href} {...visualCopy(cta, 'label', 'inline-flex items-center gap-2')}>
          {cta.icon}
          {cta.label}
        </a>
      </ShimmerButton>
    );
  }
  const filled = treatment !== 'outline' && treatment !== 'ghost';
  const cls = treatment === 'outline' ? outlineCtaClass(controls) : treatment === 'ghost' ? ghostCtaClass(controls) : filledCtaClass(controls);
  const look = cn(cls, className);
  if (!filled) {
    return (
      <a href={cta.href} {...visualCopy(cta, 'label', look)}>
        {cta.icon}
        {cta.label}
      </a>
    );
  }
  return (
    <a href={cta.href} {...visualCopy(cta, 'label', cn(SPLIT_PRIMARY, look))} style={splitPrimaryStyle(look)}>
      <SplitPrimaryParts>
        {cta.icon}
        {cta.label}
      </SplitPrimaryParts>
    </a>
  );
}

/**
 * The action cluster: a subordinate control (sign in as a text link, search, bell, avatar) and then
 * the ONE filled CTA of the bar. A vertical hairline groups the subordinate control away from the CTA.
 */
export function ActionCluster({ cta, secondary, controls = 'scale', divider = true, className }: { cta?: ChromeCta; secondary?: ReactNode; controls?: ControlShape; divider?: boolean; className?: string }) {
  if (!cta && !secondary) return null;
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {secondary}
      {secondary && cta && divider && <span aria-hidden className="mx-1 hidden h-6 w-px bg-border sm:block" />}
      {cta && <CtaLink cta={{ treatment: 'filled', ...cta }} controls={controls} />}
    </div>
  );
}
