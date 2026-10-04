import { cn } from '@/lib/utils';
import type { ChromeBrand } from '../types';
import { visualCopy } from '../visual-copy';

/**
 * The brand cluster: a mark at real presence (h-9) plus the wordmark. A logo image when the app has
 * one, the app's mark node otherwise, and a generated monogram tile as the floor, so a bar never
 * ships as a bare word.
 */
export function BrandCluster({ brand, size = 'md', className, wordmarkClassName }: { brand: ChromeBrand; size?: 'sm' | 'md' | 'lg'; className?: string; wordmarkClassName?: string }) {
  const markSize = size === 'lg' ? 'h-10 w-10' : size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';
  const initial = brand.name.trim().charAt(0).toUpperCase() || 'A';
  const mark = brand.logoUrl ? (
    <img src={brand.logoUrl} alt="" className={cn(markSize, 'shrink-0 rounded-lg object-contain')} />
  ) : brand.mark ? (
    <span className={cn(markSize, 'inline-flex shrink-0 items-center justify-center')}>{brand.mark}</span>
  ) : (
    <span aria-hidden className={cn(markSize, 'inline-flex shrink-0 items-center justify-center rounded-lg bg-primary font-display text-base font-semibold text-primary-foreground')}>
      {initial}
    </span>
  );
  return (
    <a href={brand.href ?? '/'} className={cn('inline-flex min-h-11 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60', className)} aria-label={brand.name}>
      {mark}
      <span {...visualCopy(brand, 'name', cn('font-display text-base font-semibold tracking-tight text-foreground', wordmarkClassName))}>{brand.name}</span>
    </a>
  );
}
