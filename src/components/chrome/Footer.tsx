import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { FooterShell } from './FooterShell';
import { CtaLink } from './parts/ActionCluster';
import { columnHeadClass, footerLinkClass } from './contract';
import { BrandBlock, InvertedField, LinkList } from './footers/bits';
// './footers/index' on purpose: a bare './footer' resolves to THIS file (Footer.tsx) on case-insensitive filesystems.
import { FooterBannerRow, FooterBento, FooterCaptureCrown, FooterColumns, FooterContactBlock, FooterCtaCrown, FooterEditorialCard, FooterFaqCrown, FooterLegalBar, FooterMinimalBar, FooterNewsletter, FooterSceneCrown } from './footers/index';
import type { FooterProps } from './types';
import { asColumns, asContact, asFaq, asLegal, asLinks, asTrust } from './normalize';

/**
 * The footer every generated app renders from its design contract: `style` names one of the fifteen
 * FOOTER_STYLES and this composes the crown, the substrate and the legal row from the footer parts.
 * A missing crown degrades to the columns substrate rather than inventing copy; an unknown style
 * falls back to cta-crowned; `wordmark` adds the cropped ghost wordmark to any style. Blend by
 * composing <FooterShell> with the parts directly.
 */
export function Footer(props: FooterProps) {
  const { style, brand, crown, capture, newsletter, wordmark, microSignals, controls = 'scale', className, children } = props;
  // Model-authored lists are normalised once here (see normalize.ts): a column without links, a hole
  // in the legal links or a malformed FAQ entry shortens a list instead of crashing the page.
  const columns = asColumns(props.columns);
  const socials = asLinks(props.socials);
  const legal = asLegal(props.legal, brand?.name ?? '');
  const contact = asContact(props.contact);
  const trust = asTrust(props.trust);
  const faq = asFaq(props.faq);
  const ghost = wordmark ? brand.name : undefined;
  const legalBar = <FooterLegalBar legal={legal} microSignals={microSignals} controls={controls} />;
  const substrate = (extra?: { compact?: boolean; trust?: typeof trust; cols?: typeof columns }) => (
    <FooterColumns brand={brand} columns={extra?.cols ?? columns.slice(0, 4)} socials={socials} trust={extra?.trust} compact={extra?.compact} controls={controls}>
      {children}
    </FooterColumns>
  );
  const ctaCrown = crown ? <FooterCtaCrown crown={crown} controls={controls} /> : undefined;
  const shell = (parts: { crown?: ReactNode; body?: ReactNode; legal?: ReactNode; wordmark?: string; tone?: 'default' | 'dark' | 'card' }) => (
    <FooterShell crown={parts.crown} legal={parts.legal} wordmark={parts.wordmark ?? ghost} tone={parts.tone} className={className}>
      {parts.body}
    </FooterShell>
  );

  switch (style) {
    case 'monument':
      return shell({ body: substrate({ compact: true }), legal: legalBar, wordmark: brand.name });
    case 'columns-utility':
      return shell({ body: substrate(), legal: legalBar });
    case 'contact-forward':
      return shell({
        body: (
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
            <BrandBlock brand={brand} socials={socials} controls={controls} />
            {contact && <FooterContactBlock contact={contact} />}
            {columns[0] && <LinkList column={columns[0]} />}
            {children}
          </div>
        ),
        legal: legalBar,
      });
    case 'compact-pro':
      return shell({ body: <FooterMinimalBar brand={brand} links={columns.flatMap((c) => c.links ?? []).slice(0, 6)} socials={socials} controls={controls} />, legal: legalBar });
    case 'editorial-card':
      return shell({ body: <FooterEditorialCard brand={brand} columns={columns} />, legal: legalBar });
    case 'bento-footer':
      return shell({ body: <FooterBento brand={brand} columns={columns} newsletter={newsletter} socials={socials} controls={controls} />, legal: legalBar });
    case 'scene':
      return shell({ crown: crown ? <FooterSceneCrown crown={crown} controls={controls} /> : undefined, body: substrate({ compact: true }), legal: legalBar });
    case 'mega-saas':
      return shell({ crown: ctaCrown, body: substrate({ trust, cols: columns.slice(0, 5) }), legal: <FooterLegalBar legal={legal} microSignals={microSignals} socials={socials} controls={controls} /> });
    case 'capture-crown':
      return shell({ crown: capture ? <FooterCaptureCrown capture={capture} crown={crown} controls={controls} /> : ctaCrown, body: substrate(), legal: legalBar });
    case 'trust-column':
      return shell({ body: substrate({ trust }), legal: legalBar });
    case 'faq-crown':
      return shell({ crown: crown && faq?.length ? <FooterFaqCrown faq={faq} crown={crown} controls={controls} /> : ctaCrown, body: substrate(), legal: legalBar });
    case 'banner-row':
      return shell({ crown: crown ? <FooterBannerRow crown={crown} controls={controls} /> : undefined, body: substrate(), legal: legalBar });
    case 'minimal-bar':
      return shell({ legal: <FooterMinimalBar brand={brand} socials={socials} legal={legal} controls={controls} /> });
    case 'fused-closing':
      return shell({
        tone: 'dark',
        crown: crown ? (
          <InvertedField>
            <section aria-labelledby="footer-closing-heading" className="mx-auto flex max-w-2xl flex-col items-center gap-5 pb-16 text-center sm:pb-20">
              {crown.eyebrow && <p className={columnHeadClass}>{crown.eyebrow}</p>}
              <h2 id="footer-closing-heading" className="text-balance font-display text-display-lg font-semibold leading-[1.05] tracking-tight text-foreground">
                {crown.headline}
              </h2>
              {crown.sub && <p className="max-w-xl text-base text-muted-foreground sm:text-lg">{crown.sub}</p>}
              <CtaLink cta={{ treatment: 'filled', ...crown.cta }} controls={controls} className="mt-2" />
              {crown.reassurance && <p className="text-xs text-muted-foreground">{crown.reassurance}</p>}
            </section>
          </InvertedField>
        ) : undefined,
        body: (
          <InvertedField className="flex flex-col gap-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <BrandBlock brand={brand} socials={socials} controls={controls} />
              {newsletter && <FooterNewsletter newsletter={newsletter} controls={controls} tone={crown ? 'outline' : 'filled'} />}
            </div>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {columns.slice(0, 3).map((c) => (
                <LinkList key={c.heading} column={c} />
              ))}
              {contact?.address && <address className="whitespace-pre-line text-sm not-italic leading-relaxed text-muted-foreground">{contact.address}</address>}
              {children}
            </div>
          </InvertedField>
        ),
        legal: (
          <InvertedField>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {legal.copyright}
              {legal.credit && <span className="ml-2">{legal.credit}</span>}
              {legal.links.map((l, i) => (
                <a key={`${l.href}-${i}`} href={l.href} className={cn(footerLinkClass, 'ml-3 inline-flex min-h-11 items-center text-xs')}>
                  {l.label}
                </a>
              ))}
            </p>
          </InvertedField>
        ),
      });
    case 'cta-crowned':
    default:
      return shell({ crown: ctaCrown, body: substrate(), legal: legalBar });
  }
}
