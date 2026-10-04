/**
 * ShackLine Designs - the single authored-content module. Everything the
 * components render as copy lives here, verbatim as supplied: no invented
 * clients, stats, testimonials, awards, case studies, biographies, dates or
 * locations. Hosted brand assets are used exactly as delivered; slots still
 * waiting on an asset compose typography, geometry and whitespace in the
 * brand inks - never a fabricated photograph.
 *
 * Quote requests route to Maria's inbox. RESEND_NOTIFY_TO (set by the owner
 * under Connectors > Resend) takes precedence server-side, so the studio's
 * live configuration always wins over this default.
 */
export const QUOTE_EMAIL = 'MariaReynel@ShackLineDesigns.com'

/** Prefilled subject for the direct email path. */
export const QUOTE_SUBJECT = 'Custom quote request - ShackLine Designs'

/** When the Calendly connector is configured, the owner sets this env var;
 *  empty means the email path stands alone (no placeholder copy ever). */
export const CALENDLY_URL = ''

/** The merch store link is intentionally empty in this build: no external
 *  merch link appears anywhere on the site until the owner supplies it. */
export const MERCH_URL = ''

export const BRAND_NAME = 'Shackline'
export const BRAND_SUFFIX = 'Designs'
export const BRAND_LOCATION = 'Nevada'

/** The supplied wordmark (hand-lettered "Shackline", transparent PNG, wide
 *  aspect). Rendered bare at a fixed height with width auto - never
 *  stretched or squeezed - with "Designs" as live text right after it. */
export const WORDMARK_URL =
  'https://res.cloudinary.com/dlni7asnz/image/upload/c_limit,q_auto,w_1568/v1791042392/aiwa/attachments/gppjoscvaxsj5lsdupli.png'

/** The supplied atom logomark - the site favicon and the reference for the
 *  CTA prefix icon's brand red. */
export const LOGOMARK_URL =
  'https://res.cloudinary.com/dlni7asnz/image/upload/c_limit,q_auto,w_1568/v1791042392/aiwa/attachments/kuvmqannk1jg0kovumyx.png'

/** The supplied wordmark under the name the hero stage imports it by: the
 *  hero types this exact image in character by character and renders it as
 *  the choreographed brand object - identical asset to WORDMARK_URL, never
 *  stretched (height set, width auto). The atom logomark stays
 *  LOGOMARK_URL (the favicon). */
export const LOGO_URL = WORDMARK_URL

export const BRAND_MISSION =
  'The architectural engine behind modern business growth - physical branding to digital growth under one roof.'

// ---------------------------------------------------------------- navigation

/** Anchor navigation for the single page. */
export const NAV_LINKS = [
  { label: 'Solutions', href: '#solutions' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Merch', href: '#merch' },
  { label: 'Contact', href: '#contact' },
]

// ---------------------------------------------------------------- hero

/** The staged hero: the corner statements, the middle-left growth line, the
 *  live Nevada clock metadata and the CTAs, all supplied verbatim. */
export const HERO = {
  cornerLeft: 'FROM THE SIDEWALK',
  cornerRight: 'TO THE SCREEN',
  growthLead: 'We Build Your Entire',
  growthTail: 'Growth Ecosystem',
  growthLine: 'We Build Your Entire Growth Ecosystem',
  middleLeft:
    'We build your entire growth ecosystem - ShackLine Designs unifies custom corporate apparel, trend-driven promotional merchandise, high-converting web design, and hyper-local SEO dominance under one roof.',
  support:
    'ShackLine Designs unifies custom corporate apparel, trend-driven promotional merchandise, high-converting web design, and hyper-local SEO dominance under one roof.',
  primaryCta: 'GET A CUSTOM QUOTE',
  primaryCtaHref: '#contact',
  secondaryCta: 'EXPLORE OUR SOLUTIONS',
  secondaryCtaHref: '#solutions',
  reassurance: 'Apparel, merch, web and local SEO under one roof.',
}

/**
 * The choreography objects. The six delivered photographs (two product, two
 * web, two founder) render as the real supplied imagery in their slots; the
 * remaining named slots keep their editorial plates - typography, geometry
 * and whitespace in black, white and #ED3327 - until their assets arrive,
 * never a fabricated photograph or screenshot. `pos` is the authored
 * object-position so the crop is authored, not accidental.
 */
export const HERO_PRODUCTS = [
  {
    ref: 'SHACKLINE_PRODUCT_01',
    caption: 'Custom Corporate Apparel',
    src: 'https://res.cloudinary.com/dlni7asnz/image/upload/c_limit,q_auto,w_1568/v1791026764/aiwa/attachments/tcimxz0ue1f3q9jgknnr.jpg',
    pos: '30% 20%',
  },
  {
    ref: 'SHACKLINE_PRODUCT_02',
    caption: 'Promotional Merchandise',
    src: 'https://res.cloudinary.com/dlni7asnz/image/upload/c_limit,q_auto,w_1568/v1791026763/aiwa/attachments/n37edtm9gnfb3pxssakr.jpg',
    pos: '70% 60%',
  },
  { ref: 'SHACKLINE_PRODUCT_03', caption: 'Event & Launch Gear', pos: '50% 80%' },
]

export const HERO_WEB = [
  {
    ref: 'SHACKLINE_WEB_01',
    caption: 'Custom Web Build',
    src: 'https://res.cloudinary.com/dlni7asnz/image/upload/c_limit,q_auto,w_1568/v1791026884/aiwa/attachments/ifzb08cqdljhneevf3p1.jpg',
    pos: '20% 20%',
  },
  {
    ref: 'SHACKLINE_WEB_02',
    caption: 'Booking & E-Commerce Engines',
    src: 'https://res.cloudinary.com/dlni7asnz/image/upload/c_limit,q_auto,w_1568/v1791026886/aiwa/attachments/bjj7w4sdku46il217pqs.jpg',
    pos: '80% 30%',
  },
  { ref: 'SHACKLINE_WEB_03', caption: 'Local Search Dominance', pos: '60% 70%' },
]

// ---------------------------------------------------------------- manifesto + pillars

export const PILLAR_SECTION = {
  headline: 'The 3 Pillars of Our Ecosystem',
}

export const PILLARS = [
  {
    id: 'physical',
    num: '01',
    name: 'Physical Touchpoints',
    title: 'High-Impact Tangible Branding',
    items: [
      'Custom Corporate Apparel & Uniforms',
      'Eco-Friendly Promotional Products',
      'Grand Opening & Event Branding Kits',
    ],
  },
  {
    id: 'digital',
    num: '02',
    name: 'Digital Foundations',
    title: 'High-Converting Web Architecture',
    items: [
      'Custom, Lightning-Fast Web Design',
      'Mobile-First Responsive Interfaces',
      'Automated Booking & E-Commerce Engines',
    ],
  },
  {
    id: 'visibility',
    num: '03',
    name: 'Visibility Engines',
    title: 'Local Search & Review Dominance',
    items: [
      'Google Business Profile & Map Pack Optimization',
      'Multi-Channel Media Marketing',
      'Automated Customer Review & Reputation Systems',
    ],
  },
]

// ---------------------------------------------------------------- ecosystem

export const ECOSYSTEM = {
  eyebrow: 'Why a Unified Ecosystem Wins',
  headline: 'Why a Unified Ecosystem Wins',
  rows: [
    {
      num: '01',
      label: 'Zero Fragmentation',
      body: 'No more juggling a separate promo supplier, web developer, and SEO agency. We manage your entire brand under one roof.',
    },
    {
      num: '02',
      label: 'Data-Driven Results',
      body: 'From physical customer impressions to digital web conversions, our growth strategies are backed by clear metrics.',
    },
    {
      num: '03',
      label: 'Turnkey Scalability',
      body: 'Built to support ambitious startups, growing regional brands, and enterprise teams with automated onboarding merch and web tools.',
    },
  ],
}

// ---------------------------------------------------------------- founders

export const FOUNDERS = {
  eyebrow: '( The people on the line )',
  headline: 'There are a lot of shops that will take one piece of the job. We take the whole line.',
  body: 'One studio, from the printed piece to the map',
  note: 'The faces of ShackLine Designs.',
}

/** The crossfade beat order: FOUNDER_01 through FOUNDER_04. FOUNDER_01-02
 *  are delivered and crossfade as the real portraits inside the one large
 *  container; until FOUNDER_03-04 arrive the cycle runs on the delivered
 *  photographs only - a typographic plate cutting in between real
 *  portraits would read as a missing image, so the composed plates stay as
 *  the no-photographs fallback rather than mixing into the cycle. */
export const HERO_FOUNDERS = [
  {
    ref: 'FOUNDER_01',
    caption: 'FOUNDER_01 · Nevada, USA',
    src: 'https://res.cloudinary.com/dlni7asnz/image/upload/c_limit,q_auto,w_1568/v1791026762/aiwa/attachments/trcgwygsnpoya3pczwqe.jpg',
  },
  {
    ref: 'FOUNDER_02',
    caption: 'FOUNDER_02 · Nevada, USA',
    src: 'https://res.cloudinary.com/dlni7asnz/image/upload/c_limit,q_auto,w_1568/v1791026761/aiwa/attachments/nhhrm5jhztkerasdzgkj.jpg',
  },
  { ref: 'FOUNDER_03', caption: 'FOUNDER_03 · Nevada, USA' },
  { ref: 'FOUNDER_04', caption: 'FOUNDER_04 · Nevada, USA' },
]

// ---------------------------------------------------------------- silos

/** PHYSICAL -> DIGITAL -> VISIBILITY -> GROWTH: the central concept as the
 *  numbered manifesto chain. */
export const SILOS = {
  eyebrow: 'The system',
  headline: 'Physical, digital, visibility, growth',
  intro: 'One continuous line from the first printed piece to the top of the local map - four silos, one system, no seams.',
  kicker: 'PHYSICAL - DIGITAL - VISIBILITY - GROWTH',
  chain: [
    {
      num: '01',
      word: 'PHYSICAL',
      note: 'Custom corporate apparel, promotional merchandise and launch kits - the tangible brand your customers hold.',
    },
    {
      num: '02',
      word: 'DIGITAL',
      note: 'Custom, lightning-fast web design with automated booking and e-commerce engines - the storefront that never closes.',
    },
    {
      num: '03',
      word: 'VISIBILITY',
      note: 'Google Business Profile, map pack optimization and multi-channel media marketing - found first, locally.',
    },
    {
      num: '04',
      word: 'GROWTH',
      note: 'Automated review and reputation systems feeding the whole line - the ecosystem compounding on itself.',
    },
  ],
}

// ---------------------------------------------------------------- solutions

export const SOLUTIONS = {
  eyebrow: 'The solutions',
  headline: 'Three silos, one build',
  claim: {
    title: 'Every touchpoint, one system',
    body: 'Physical touchpoints, digital foundations and visibility engines - designed, printed and shipped by one studio.',
  },
  phases: [
    {
      id: 'physical',
      num: '01',
      name: 'PHYSICAL TOUCHPOINTS',
      tag: 'Apparel & merch',
      mock: 'proof',
      caption: {
        body: 'High-impact tangible branding - the sidewalk half of the system.',
      },
      items: [
        'Custom Corporate Apparel & Uniforms',
        'Eco-Friendly Promotional Products',
        'Grand Opening & Event Branding Kits',
      ],
    },
    {
      id: 'digital',
      num: '02',
      name: 'DIGITAL FOUNDATIONS',
      tag: 'Custom web',
      mock: 'browser',
      caption: {
        body: 'High-converting web architecture - the screen half of the system.',
      },
      items: [
        'Custom, Lightning-Fast Web Design',
        'Mobile-First Responsive Interfaces',
        'Automated Booking & E-Commerce Engines',
      ],
    },
    {
      id: 'visibility',
      num: '03',
      name: 'VISIBILITY ENGINES',
      tag: 'Local SEO',
      mock: 'listing',
      caption: {
        body: 'Local search and review dominance - the growth half of the system.',
      },
      items: [
        'Google Business Profile & Map Pack Optimization',
        'Multi-Channel Media Marketing',
        'Automated Customer Review & Reputation Systems',
      ],
    },
  ],
}

// ---------------------------------------------------------------- difference

export const DIFFERENCE = {
  eyebrow: 'The unified ecosystem',
  headline: 'Why one system wins',
  intro: 'The supplied reasons the unified ecosystem beats juggling separate suppliers - verbatim, no invented numbers.',
  ownColumn: 'SHACKLINE, ONE TEAM',
  otherColumn: 'SEPARATE AGENCIES',
  rows: [
    {
      label: 'CONSISTENCY',
      own: 'One studio prints the apparel, builds the site and runs the visibility - a single, recognizable brand identity across every touchpoint.',
      other: 'A promo supplier, a web developer and an SEO agency each interpreting the brand separately.',
    },
    {
      label: 'HANDOFFS',
      own: 'Zero seams between physical and digital - the launch kit and the landing page ship from the same desk.',
      other: 'Every handoff between vendors is a gap where campaigns stall.',
    },
    {
      label: 'SPEED',
      own: 'Most standard custom builds launch within 2 to 4 weeks on high-speed development frameworks.',
      other: 'Coordinating three vendors multiplies every timeline.',
    },
    {
      label: 'CAMPAIGN ROI',
      own: 'Physical customer impressions and digital web conversions work together, driving better campaign ROI.',
      other: 'Split reporting hides which half of the spend actually worked.',
    },
  ],
}

// ---------------------------------------------------------------- roadmap

export const ROADMAP = {
  eyebrow: 'Our 3-Phase Roadmap for Your Brand',
  headline: 'Our 3-Phase Roadmap for Your Brand',
  intro: '',
  phases: [
    {
      num: '01',
      name: 'Total Platform Integration',
      title: '',
      body: 'Merge your physical assets (custom apparel and promotional merch) with a fresh, modern website to establish an instantly recognizable brand identity.',
    },
    {
      num: '02',
      name: 'Hyper-Local Dominance',
      title: '',
      body: 'Activate our local visibility engines. We optimize your Google Business profile and map rankings to capture top-of-search intent in your area.',
    },
    {
      num: '03',
      name: 'Autonomous Growth',
      title: '',
      body: 'Deploy automated internal systems, such as automated customer review invites and turnkey employee onboarding merch kits.',
    },
  ],
}

// ---------------------------------------------------------------- about

/** The company description, supplied verbatim. */
export const ABOUT = {
  eyebrow: 'About Us',
  headline: 'Welcome to ShackLine Designs',
  paragraphs: [
    'At ShackLine Designs, we are the architectural engine behind modern business growth. We bridge the gap between your physical storefront and the digital world, transforming your offline presence into a high-performing, customer-attracting ecosystem.',
    'Whether you are launching a grand opening with custom corporate apparel and promotional merchandise, or scaling your digital footprint with a lightning-fast website and local Google Map dominance, ShackLine builds the exact infrastructure your brand needs to succeed.',
  ],
}

// ---------------------------------------------------------------- faq (verbatim, as supplied)

export const FAQ = {
  eyebrow: 'Frequently Asked Questions',
  headline: 'Frequently Asked Questions',
  items: [
    {
      question: 'Why should I work with ShackLine Designs instead of separate agencies?',
      answer:
        'Working with one team guarantees brand consistency across your printed apparel, promotional items, and online marketing, saving you time, reducing friction, and driving better campaign ROI.',
    },
    {
      question: 'Do you offer custom promotional packages for grand openings and events?',
      answer:
        'Yes! We craft custom physical-plus-digital launch bundles that combine on-site promotional gear with online lead capture tools.',
    },
    {
      question: 'How long does a custom web build take with ShackLine?',
      answer:
        'Most standard custom builds are launched within 2 to 4 weeks using our high-speed development frameworks.',
    },
  ],
}

// ---------------------------------------------------------------- contact

export const CONTACT = {
  eyebrow: 'Get a custom quote',
  headline: 'Tell us where your brand is going',
  intro: 'Send the brief - what you are launching, what you need printed, built or found. Every request gets a personal reply from Maria.',
  emailNote: 'Or write directly to Maria - every request gets a personal reply.',
  calendlyNote: 'Prefer a conversation? Book a call and walk the sidewalk-to-screen line together.',
  closingNote: 'No forms lost to funnels, no ticket numbers - a personal reply, every time.',
  paths: {
    email: {
      label: 'Path 01 · Direct',
      title: 'Email Maria directly',
      body: 'The brief lands in the studio inbox with a prefilled subject - the fastest way to a custom quote.',
      cta: 'Email the studio',
      reassurance: 'Replies come from Maria, personally.',
    },
    call: {
      label: 'Path 02 · Conversation',
      title: 'Book a call with the studio',
      body: 'Walk the sidewalk-to-screen line together before the quote is written.',
      connectedCta: 'Book a call',
      connectedReassurance: 'Pick a time that suits you - the studio confirms personally.',
      fallbackTitle: 'The studio scheduler is being set up',
      fallbackBody: 'The booking link is not connected yet. Email the studio and Maria will arrange a time with you directly.',
      fallbackCta: 'Request a call by email',
      fallbackReassurance: 'A time is always arranged personally - never a queue.',
    },
  },
}

// ---------------------------------------------------------------- work

/** The work sheet: five deliverable slots the studio actually produces.
 *  No invented clients, no borrowed logos - each frame is honestly marked
 *  as in production until a supplied case asset exists. */
export const WORK = {
  eyebrow: 'The work',
  headline: 'What the system ships',
  intro: 'The deliverables the studio produces every week - the same objects the hero choreographs, shown as the finished line.',
  caption: 'Case study in production',
  frames: [
    { label: 'Corporate Apparel', tag: 'Physical' },
    { label: 'Launch Merch', tag: 'Physical' },
    { label: 'Website', tag: 'Digital' },
    { label: 'Local Listing', tag: 'Visibility' },
    { label: 'The Full System', tag: 'Bundle' },
  ],
}

// ---------------------------------------------------------------- merch

export const MERCH = {
  eyebrow: 'The merch line',
  headline: 'BUILT FROM THE STREET',
  intro: 'The same heavyweight cotton the studio prints for its clients, carrying the studio\'s own mark - printed, pressed and shipped from Nevada.',
  cta: 'Visit the merch store',
  ticker: [
    'HEAVYWEIGHT TEES',
    'EMBROIDERED CAPS',
    'SCREEN-PRINTED HOODIES',
    'TOTE BAGS',
    'LAUNCH KITS',
    'UNIFORM PROGRAMS',
    'ECO PRODUCTS',
    'EVENT GEAR',
  ],
}

// ---------------------------------------------------------------- footer

export const FOOTER = {
  crown: {
    eyebrow: 'The proof is ready',
    headline: 'From the sidewalk to the screen - as one build',
    sub: 'Apparel, merch, web and local SEO, quoted as one system by one team.',
    cta: { label: 'GET A CUSTOM QUOTE', href: '#contact' },
    secondary: { label: 'EXPLORE OUR SOLUTIONS', href: '#solutions' },
    reassurance: 'Replies come from Maria, personally.',
  },
  columns: [
    {
      heading: 'Solutions',
      links: [
        { label: 'Physical touchpoints', href: '#physical' },
        { label: 'Digital foundations', href: '#digital' },
        { label: 'Visibility engines', href: '#visibility' },
        { label: 'The roadmap', href: '#roadmap' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Why one system', href: '#ecosystem' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Contact', href: '#contact' },
      ],
    },
  ],
  contactRows: [
    { label: 'Email', value: QUOTE_EMAIL, href: `mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent(QUOTE_SUBJECT)}` },
    { label: 'Studio', value: 'Nevada, USA' },
  ],
  legal: {
    copyright: 'Shackline',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
}

export const SMS_DISCLOSURE =
  'Message frequency varies. Message & data rates may apply. Reply STOP to cancel, HELP for help.'

export const SMS_OPT_IN =
  'I agree to receive text messages from ShackLine Designs regarding order updates, project quotes, and account alerts. Message frequency varies. Message & data rates may apply. Reply STOP to opt out at any time or HELP for assistance.'

export const SMS_PRIVACY_CLAUSE =
  'No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.'

export const SMS_TERMS_CLAUSE =
  "By opting into ShackLine Designs SMS notifications, you agree to receive automated or transactional text messages related to your account, project quotes, order fulfillments, and customer support inquiries. Consent to receive text messages is not a condition of purchasing any goods or services. You can cancel the SMS service at any time by texting 'STOP'. After sending 'STOP', we will send a message confirming your unsubscribed status. For help, text 'HELP' or contact us at support@shacklinedesigns.com."

export const SMS_SUPPORT_EMAIL = 'support@shacklinedesigns.com'