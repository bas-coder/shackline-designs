import { useEffect, useRef, useState } from 'react'
import { NavShell, NavLinks, MobileMenu, Footer } from '@/components/chrome'
import { ShacklineLogo } from '@/components/shackline-logo'
import {
  BRAND_NAME,
  BRAND_SUFFIX,
  FOOTER,
  NAV_LINKS,
} from '@/lib/content'

/**
 * Unfilled header sized to Extrafazant's desktop nav.
 * 1em is their fluid root (--ef-nav-size): 16px at a 1920px canvas.
 * The quote control is their button-093: stacked labels, orbiting dots,
 * and a scale grown by 12px wide and 6px tall.
 */

const TRACKED = ['solutions', 'work', 'about', 'merch', 'contact']
const QUOTE_WIDTH_INCREASE = 12
const QUOTE_HEIGHT_INCREASE = 6
const WORDMARK_ON_DARK = '#ffffff'
const WORDMARK_ON_LIGHT = '#000000'
const LIGHT_SURFACE_LUMINANCE = 0.55
const LOGO_VIEWBOX_WIDTH = 1145
const LOGO_WIDTH_EM = 10
const ROUNDED_CAP_RATIO = 0.716
/** The word Shackline inside the logo, measured from the artwork, not the full viewBox. */
const SHACKLINE_LETTER_TOP = 41
const SHACKLINE_LETTER_BOTTOM = 151
const SHACKLINE_LETTER_HEIGHT = SHACKLINE_LETTER_BOTTOM - SHACKLINE_LETTER_TOP
const SUFFIX_FONT_EM = (LOGO_WIDTH_EM * SHACKLINE_LETTER_HEIGHT) / LOGO_VIEWBOX_WIDTH / ROUNDED_CAP_RATIO
const SUFFIX_OPTICAL_NUDGE = '0.06em'
export const SUFFIX_STYLE = {
  fontSize: `${SUFFIX_FONT_EM}em`,
  transform: `translateY(${SUFFIX_OPTICAL_NUDGE})`,
}
const HEADER_SUFFIX_REDUCTION = '3px'
const HEADER_SUFFIX_STYLE = {
  ...SUFFIX_STYLE,
  fontSize: `calc(${SUFFIX_FONT_EM}em - ${HEADER_SUFFIX_REDUCTION})`,
}
const HEADER_BAND_TOP = '1em'
const HEADER_BAND = '3em'
const WORDMARK_LAYER = 50
const WORDMARK_PAD = 'max(2em, env(safe-area-inset-left))'
const WORDMARK_GAP = '0.35em'
const NAV_INK = '#131313'
const NAV_INK_HOVER = '#6b6b6b'
const NAV_PAPER = '#ffffff'

function opaqueRgb(value: string) {
  const match = value.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\s*\)/)
  if (!match) return null
  const alpha = match[4] === undefined ? 1 : Number(match[4])
  if (alpha < 0.5) return null
  return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) }
}

function isLightSurface(red: number, green: number, blue: number) {
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255
  return luminance >= LIGHT_SURFACE_LUMINANCE
}

function inkForSurface(x: number, y: number) {
  const stack = document.elementsFromPoint(x, y)
  for (const node of stack) {
    if (!(node instanceof Element) || node.closest('[data-site-wordmark]')) continue
    const color = opaqueRgb(getComputedStyle(node).backgroundColor)
    if (!color) continue
    return isLightSurface(color.r, color.g, color.b) ? WORDMARK_ON_LIGHT : WORDMARK_ON_DARK
  }
  return WORDMARK_ON_DARK
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const quoteRef = useRef<HTMLAnchorElement>(null)
  const wordmarkRef = useRef<HTMLAnchorElement>(null)
  const [activeHash, setActiveHash] = useState<string | undefined>(undefined)
  const [barInk, setBarInk] = useState(WORDMARK_ON_DARK)

  useEffect(() => {
    const mark = wordmarkRef.current
    if (!mark) return
    let frame = 0
    let current = WORDMARK_ON_DARK
    const apply = () => {
      frame = 0
      const rect = mark.getBoundingClientRect()
      const ink = inkForSurface(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5)
      if (ink === current) return
      current = ink
      mark.style.color = ink
      setBarInk(ink)
    }
    const schedule = () => {
      if (frame) return
      frame = window.requestAnimationFrame(apply)
    }
    apply()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const theme = new MutationObserver(schedule)
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] })
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      theme.disconnect()
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const probe = window.scrollY + window.innerHeight * 0.38
      let current: string | undefined
      for (const id of TRACKED) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= probe) current = `#${id}`
      }
      setActiveHash(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const button = quoteRef.current
    if (!button) return
    const dots = button.querySelectorAll<HTMLElement>('.ef-quote__dot')
    dots.forEach((dot, index) => dot.style.setProperty('--index', String(index)))
    const update = () => {
      const width = button.offsetWidth
      const height = button.offsetHeight
      if (!width || !height) return
      button.style.setProperty('--button-093-scale-x', String((width + QUOTE_WIDTH_INCREASE) / width))
      button.style.setProperty('--button-093-scale-y', String((height + QUOTE_HEIGHT_INCREASE) / height))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(button)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="sl-paper flex min-h-screen flex-col font-sans text-foreground antialiased">
      <NavShell
        surface="transparent"
        sticky={false}
        data-site-header=""
        className="fixed inset-x-0 top-0"
        style={{
          fontSize: 'var(--ef-nav-size)',
          '--nav-ink': NAV_INK,
          '--nav-ink-hover': NAV_INK_HOVER,
        } as React.CSSProperties}
        innerClassName="sl-header-pad !h-[4em] !max-w-none !items-center !gap-0 !pt-[1em] !pb-0"
      >
        <nav
          aria-label="Sections"
          className="pointer-events-none absolute top-[1.25em] left-1/2 z-10 hidden -translate-x-1/2 lg:block"
        >
          <div
            className="pointer-events-auto flex h-[3em] items-center px-[1.25em]"
            style={{ backgroundColor: NAV_PAPER }}
          >
            <NavLinks
              links={NAV_LINKS}
              activeHref={activeHash}
              indicator="none"
              className="ef-nav-face !gap-[1.5em] [&_a]:!h-auto [&_a]:!min-h-0 [&_a]:!rounded-none [&_a]:!bg-transparent [&_a]:!px-0 [&_a]:!py-0 [&_a]:!font-bold [&_a]:!text-[length:1em] [&_a]:!uppercase [&_a]:!tracking-normal [&_a]:![font-stretch:75%]"
            />
          </div>
        </nav>

        <div className="relative z-10 ml-auto flex items-center">
          <a
            ref={quoteRef}
            href="#contact"
            className="ef-quote ef-nav-face hidden lg:inline-grid"
            style={{ color: NAV_INK }}
          >
            <span className="ef-quote__bg" />
            <span className="ef-quote__inner">
              <span className="ef-quote__dots">
                <span className="ef-quote__dot" />
                <span className="ef-quote__dot is-a" />
                <span className="ef-quote__dot is-b" />
                <span className="ef-quote__dot is-c" />
              </span>
              <span className="ef-quote__text-wrap">
                <span className="ef-quote__text is-default">Get a Quote</span>
                <span className="ef-quote__text is-hover" aria-hidden="true">
                  Get a Quote
                </span>
              </span>
            </span>
          </a>
          <MobileMenu links={NAV_LINKS} activeHref={activeHash} ink={barInk} cta={{ label: 'Get a Custom Quote', href: '#contact' }} />
        </div>
      </NavShell>
      <a
        ref={wordmarkRef}
        href="#top"
        data-site-wordmark=""
        aria-label={`${BRAND_NAME} ${BRAND_SUFFIX}`}
        className="fixed top-0 left-0 inline-flex items-center"
        style={{
          zIndex: WORDMARK_LAYER,
          color: WORDMARK_ON_DARK,
          fontSize: 'var(--ef-nav-size)',
          height: '4em',
          paddingTop: HEADER_BAND_TOP,
          paddingLeft: WORDMARK_PAD,
          boxSizing: 'border-box',
          transition: 'none',
        }}
      >
        <ShacklineLogo />
      </a>
      <a
        href="#top"
        tabIndex={-1}
        aria-hidden="true"
        data-site-wordmark=""
        className="pointer-events-auto fixed flex items-center mix-blend-difference"
        style={{
          zIndex: WORDMARK_LAYER,
          color: WORDMARK_ON_DARK,
          fontSize: 'var(--ef-nav-size)',
          top: HEADER_BAND_TOP,
          left: `calc(${WORDMARK_PAD} + var(--ef-logo-width) + ${WORDMARK_GAP})`,
          height: HEADER_BAND,
        }}
      >
        <span className="ef-designs" style={HEADER_SUFFIX_STYLE}>
          {BRAND_SUFFIX}
        </span>
      </a>

      <main id="top" className="flex-1">
        {children}
      </main>

      <Footer
        style="cta-crowned"
        className="sl-footer-dark"
        brand={{
          name: `${BRAND_NAME} ${BRAND_SUFFIX}`,
          href: '#top',
          lockup: (
            <span className="inline-flex items-center gap-[0.35em]">
              <ShacklineLogo />
              <span className="ef-designs" style={SUFFIX_STYLE}>
                {BRAND_SUFFIX}
              </span>
            </span>
          ),
        }}
        columns={FOOTER.columns}
        crown={{
          eyebrow: FOOTER.crown.eyebrow,
          headline: FOOTER.crown.headline,
          sub: FOOTER.crown.sub,
          cta: FOOTER.crown.cta,
          secondary: FOOTER.crown.secondary,
          reassurance: FOOTER.crown.reassurance,
        }}
        contact={{ rows: FOOTER.contactRows }}
        microSignals={['local-time', 'theme-toggle']}
        legal={FOOTER.legal}
      />
    </div>
  )
}
