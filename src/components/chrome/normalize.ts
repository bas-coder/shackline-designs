import type { ChromeLink, FooterColumn, FooterContact, FooterLegal, FooterTrustBadge, ShellGroup } from './types';

/**
 * Prop normalisers for model-authored props (uat run 8, 2026-09-21): the author passed a footer whose
 * column list carried an entry without `links`, and the compact-pro dispatcher's flatMap produced an
 * undefined link that crashed the whole preview on `.href`. Every list the kit maps over is normalised
 * once at the dispatcher (Navbar, Footer) and again where a part is used directly in a blend: holes,
 * non-objects and entries without a string href or label are dropped; nested children recurse. A
 * sloppy prop degrades to a shorter list, never to a white screen.
 */
const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object';

export function asLinks(list: unknown): ChromeLink[] {
  if (!Array.isArray(list)) return [];
  const out: ChromeLink[] = [];
  for (const l of list) {
    if (!isObj(l) || typeof l.href !== 'string' || typeof l.label !== 'string') continue;
    const children = Array.isArray(l.children) ? asLinks(l.children) : undefined;
    out.push({ ...(l as unknown as ChromeLink), ...(children ? { children } : { children: undefined }) });
  }
  return out;
}

/** uat run 9: shell groups arrive as {label|heading, links|items}; entries without a label or links are dropped. */
export function asGroups(list: unknown): ShellGroup[] {
  if (!Array.isArray(list)) return [];
  return list
    .map((g) => (isObj(g) ? { ...g, label: g.label ?? g.heading ?? g.title, links: g.links ?? g.items ?? g.destinations } : g))
    .filter((g): g is Record<string, unknown> => isObj(g) && typeof g.label === 'string')
    .map((g) => ({ label: g.label as string, links: asLinks(g.links) }))
    .filter((g) => g.links.length > 0);
}

export function asColumns(list: unknown): FooterColumn[] {
  if (!Array.isArray(list)) return [];
  return list
    // Model-authored columns arrive as {heading, links} but also as {head|title, items} (run 8).
    .map((c) => (isObj(c) ? { ...c, heading: c.heading ?? c.head ?? c.title, links: c.links ?? c.items } : c))
    .filter((c): c is Record<string, unknown> => isObj(c) && typeof c.heading === 'string')
    .map((c) => ({ ...(c as unknown as FooterColumn), heading: c.heading as string, links: asLinks(c.links) }));
}

export function asLegal(legal: unknown, fallbackName: string): FooterLegal {
  const l = isObj(legal) ? legal : {};
  return {
    ...(l as unknown as FooterLegal),
    copyright: typeof l.copyright === 'string' ? l.copyright : `${new Date().getFullYear()} ${fallbackName}`,
    links: asLinks(l.links),
    credit: typeof l.credit === 'string' ? l.credit : undefined,
  };
}

export function asTrust(list: unknown): FooterTrustBadge[] | undefined {
  if (!Array.isArray(list)) return undefined;
  const out = list.filter((t): t is FooterTrustBadge => isObj(t) && typeof t.label === 'string');
  return out.length ? out : undefined;
}

export function asFaq(list: unknown): Array<{ question: string; answer: string }> | undefined {
  if (!Array.isArray(list)) return undefined;
  const out = list.filter((f): f is { question: string; answer: string } => isObj(f) && typeof f.question === 'string' && typeof f.answer === 'string');
  return out.length ? out : undefined;
}

export function asContact(contact: unknown): FooterContact | undefined {
  if (!isObj(contact)) return undefined;
  const rows = Array.isArray(contact.rows) ? contact.rows.filter((r): r is FooterContact['rows'][number] => isObj(r) && typeof r.label === 'string' && typeof r.value === 'string') : [];
  const hours = Array.isArray(contact.hours) ? contact.hours.filter((h): h is string => typeof h === 'string') : undefined;
  const address = typeof contact.address === 'string' ? contact.address : undefined;
  if (!rows.length && !hours?.length && !address) return undefined;
  return { ...(contact as unknown as FooterContact), rows, hours, address };
}
