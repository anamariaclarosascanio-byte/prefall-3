/**
 * Sanity seed script for prefall-3.
 * Idempotent — uses createOrReplace with stable _ids so re-running updates
 * rather than duplicating.
 *
 * Run with:
 *   node --env-file=.env.local scripts/seed.mjs
 *
 * Requires SANITY_API_TOKEN in .env.local with write permission (Editor).
 */
import {createClient} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01'

if (!projectId || !dataset || !token) {
  console.error(
    'Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN.'
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

const ref = (id) => ({_type: 'reference', _ref: id})
const slug = (current) => ({_type: 'slug', current})

// ----- Regulation statuses -----------------------------------------------
const statuses = [
  {
    _id: 'status.in-force',
    _type: 'regulationStatus',
    title: 'In force',
    slug: slug('in-force'),
    dotColor: '#059669',
    badgeBg: '#D1FAE5',
    badgeText: '#065F46',
    order: 1,
  },
  {
    _id: 'status.in-transposition',
    _type: 'regulationStatus',
    title: 'In transposition',
    slug: slug('transpos'),
    dotColor: '#D97706',
    badgeBg: '#EDE9FE',
    badgeText: '#5B21B6',
    order: 2,
  },
  {
    _id: 'status.in-preparation',
    _type: 'regulationStatus',
    title: 'In preparation',
    slug: slug('preparation'),
    dotColor: '#5B21B6',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    order: 3,
  },
  {
    _id: 'status.withdrawn',
    _type: 'regulationStatus',
    title: 'Withdrawn',
    slug: slug('withdrawn'),
    dotColor: '#991B1B',
    badgeBg: '#FEE2E2',
    badgeText: '#991B1B',
    order: 4,
  },
  {
    _id: 'status.amended',
    _type: 'regulationStatus',
    title: 'Amended',
    slug: slug('amended'),
    dotColor: '#374151',
    badgeBg: '#F3F4F6',
    badgeText: '#374151',
    order: 5,
  },
]

// ----- Job seniorities ---------------------------------------------------
const seniorities = [
  {_id: 'seniority.junior', _type: 'jobSeniority', title: 'Junior', slug: slug('junior'), order: 1},
  {_id: 'seniority.mid', _type: 'jobSeniority', title: 'Mid', slug: slug('mid'), order: 2},
  {_id: 'seniority.senior', _type: 'jobSeniority', title: 'Senior', slug: slug('senior'), order: 3},
]

// ----- Article categories ------------------------------------------------
const categories = [
  ['business-models', 'Business models'],
  ['regulation', 'Regulation'],
  ['consumer-behaviour', 'Consumer behaviour'],
  ['capital', 'Capital'],
  ['manufacturing', 'Manufacturing'],
  ['resale', 'Resale'],
  ['rental', 'Rental'],
  ['new-technologies', 'New technologies'],
  ['brands', 'Brands'],
].map(([s, t], i) => ({
  _id: `cat.${s}`,
  _type: 'articleCategory',
  title: t,
  slug: slug(s),
  order: i + 1,
}))

// ----- Company tags ------------------------------------------------------
const companyTags = [
  ['b-corp', 'B Corp'],
  ['recommerce', 'Re-commerce'],
  ['asset-light', 'Asset-light'],
  ['fair-trade', 'Fair-trade'],
].map(([s, t]) => ({
  _id: `tag.${s}`,
  _type: 'companyTag',
  title: t,
  slug: slug(s),
}))

// ----- Nodes (7 fixed) ---------------------------------------------------
const nodes = [
  {
    slug: 'raw-materials',
    title: 'Raw Materials',
    colorKey: 'raw-materials',
    blurb:
      'Fibres at origin: cotton, wool, cellulosic feedstock, leather, synthetics. The pricing of sustainability begins here.',
  },
  {
    slug: 'yarn-fabric',
    title: 'Yarn & Fabric',
    colorKey: 'yarn-fabric',
    blurb:
      'Spinning, weaving, knitting, dyeing. Where most of the chemical and water footprint sits.',
  },
  {
    slug: 'manufacturing',
    title: 'Manufacturing',
    colorKey: 'manufacturing',
    blurb:
      'Cut, make, trim. Wage structure, working conditions, and lead-time economics define the trade-offs.',
  },
  {
    slug: 'brands',
    title: 'Brands',
    colorKey: 'brands',
    blurb:
      'Design, marketing, distribution. Where consumer perception meets cost-of-goods reality.',
  },
  {
    slug: 'retail',
    title: 'Logistics & Retail',
    colorKey: 'retail',
    blurb:
      'Channels, logistics, returns. The economics of e-commerce, wholesale, and DTC differ sharply.',
  },
  {
    slug: 'consumer',
    title: 'Consumer',
    colorKey: '',
    blurb:
      'Purchase, use, care, disposal. The gap between stated intention and actual behaviour.',
  },
  {
    slug: 'secondary-market',
    title: 'Secondary Market',
    colorKey: 'secondary-market',
    blurb:
      'Resale, rental, repair. The unit economics that determine whether circular models work.',
  },
].map((n, i) => ({
  _id: `node.${n.slug}`,
  _type: 'node',
  order: i + 1,
  title: n.title,
  slug: slug(n.slug),
  colorKey: n.colorKey,
  shortBlurb: n.blurb,
  heroHeading: n.title,
  heroSummary: n.blurb,
}))

// ----- Regulations (14) --------------------------------------------------
const regs = [
  {
    short: 'ECGT',
    full: 'Empowering Consumers for Green Transition Directive',
    slugStr: 'ecgt',
    status: 'in-transposition',
    nodes: ['brands', 'retail'],
    summary:
      'Bans vague environmental claims in consumer communications. Generic terms such as "eco-friendly" or "sustainable" are prohibited without specific, verified evidence. Applies from 27 September 2026.',
  },
  {
    short: 'EUDR',
    full: 'EU Deforestation Regulation',
    slugStr: 'eudr',
    status: 'in-force',
    nodes: ['raw-materials'],
    summary:
      'Requires traceability and deforestation-free evidence for cattle leather and rubber entering the EU market. Large operators must comply from 30 December 2026.',
  },
  {
    short: 'ESPR',
    full: 'Ecodesign for Sustainable Products Regulation',
    slugStr: 'espr',
    status: 'in-force',
    nodes: ['brands', 'manufacturing', 'raw-materials'],
    summary:
      'In force July 2024. Bans destruction of unsold apparel and footwear for large companies from 19 July 2026. Enables Digital Product Passport requirements via delegated acts.',
  },
  {
    short: 'EU Textile EPR',
    full: 'Extended Producer Responsibility — Textiles (Directive 2025/1892)',
    slugStr: 'epr',
    status: 'in-force',
    nodes: ['brands', 'retail', 'secondary-market'],
    summary:
      'Requires producers to fund collection, sorting, and recycling of post-consumer textiles. National EPR schemes must be operational across all member states by April 2028.',
  },
  {
    short: 'PPWR',
    full: 'Packaging and Packaging Waste Regulation',
    slugStr: 'ppwr',
    status: 'in-force',
    nodes: ['retail', 'brands'],
    summary:
      'Applies to all packaging including e-commerce parcels and garment bags. Empty space in parcels must not exceed 40% from 12 August 2026. No exemption for SMEs.',
  },
  {
    short: 'France eco-score',
    full: 'France Textile Environmental Score',
    slugStr: 'france',
    status: 'in-force',
    nodes: ['brands'],
    summary:
      'Voluntary environmental impact scoring for apparel sold in France, mandatory for any brand making environmental claims. Third parties may publish scores without brand consent from October 2026.',
  },
  {
    short: 'California SB 707',
    full: 'California Textile Extended Producer Responsibility Act',
    slugStr: 'sb707',
    status: 'in-force',
    nodes: ['brands', 'retail', 'secondary-market'],
    summary:
      'First US state textile EPR law. Applies to producers with more than $1M global annual turnover selling into California. Producer registration required by July 2026.',
  },
  {
    short: 'CSRD',
    full: 'Corporate Sustainability Reporting Directive',
    slugStr: 'csrd',
    status: 'in-transposition',
    nodes: ['brands', 'manufacturing'],
    summary:
      'Omnibus I (March 2026) narrowed scope to companies with more than 1,000 employees AND more than €450M net turnover, both thresholds required. First mandatory reports due 2028 for FY2027.',
  },
  {
    short: 'CSDDD',
    full: 'Corporate Sustainability Due Diligence Directive',
    slugStr: 'csddd',
    status: 'in-transposition',
    nodes: ['brands', 'manufacturing', 'raw-materials'],
    summary:
      'Omnibus I narrowed scope to companies with more than 5,000 employees AND more than €1.5B worldwide net turnover. Civil liability regime removed. Compliance required from July 2029.',
  },
  {
    short: 'ESRS',
    full: 'European Sustainability Reporting Standards',
    slugStr: 'esrs',
    status: 'in-transposition',
    nodes: ['brands'],
    summary:
      'Defines the content requirements for CSRD reports. A simplified version reducing required datapoints by 61% must be adopted by delegated act by 18 September 2026.',
  },
  {
    short: 'DPP',
    full: 'Digital Product Passport (Textiles)',
    slugStr: 'dpp',
    status: 'in-preparation',
    nodes: ['brands', 'manufacturing', 'secondary-market'],
    summary:
      'Mandatory product-level data disclosure via QR/NFC for all textiles sold in the EU. Textile delegated act expected 2027; enforcement anticipated mid-2028.',
  },
  {
    short: 'Textile labelling revision',
    full: 'EU Textile Labelling Regulation Revision',
    slugStr: 'textile',
    status: 'in-preparation',
    nodes: ['brands', 'raw-materials'],
    summary:
      'Proposal to add sustainability and origin information to physical product labels. Indefinitely delayed; likely to be absorbed into DPP delegated act scope.',
  },
  {
    short: 'Green Claims Directive',
    full: 'EU Green Claims Directive',
    slugStr: 'gcd',
    status: 'withdrawn',
    nodes: ['brands', 'retail'],
    summary:
      'Would have required independent pre-verification of all explicit environmental claims. Legislative process suspended June 2025; no confirmed revival date.',
  },
  {
    short: 'Italy fast fashion bill',
    full: 'Italy DDL S.1690 Fast Fashion Bill',
    slugStr: 'italy',
    status: 'in-preparation',
    nodes: ['brands', 'retail'],
    summary:
      'Proposes eco-score labelling, advertising restrictions on ultra-fast fashion, and a parcel levy. Introduced to the Italian Senate in October 2025; still under parliamentary review.',
  },
].map((r) => ({
  _id: `regulation.${r.slugStr}`,
  _type: 'regulation',
  name: r.short,
  fullName: r.full,
  slug: slug(r.slugStr),
  status: ref(`status.${r.status}`),
  shortSummary: r.summary,
  nodes: r.nodes.map((n) => ({_key: n, ...ref(`node.${n}`)})),
}))

// ----- Companies (3 at launch) -------------------------------------------
const companies = [
  {
    _id: 'company.veja',
    _type: 'company',
    name: 'Veja',
    slug: slug('veja'),
    location: 'Paris, France',
    tagline:
      'Sneaker brand that routes advertising spend directly into fair-trade raw materials. No paid media. Production costs 5–7× conventional competitors at factory stage, offset by the absence of marketing.',
    businessModelSummary:
      'Sneaker brand that routes advertising spend directly into fair-trade raw materials. No paid media. Production costs 5–7× conventional competitors at factory stage, offset by the absence of marketing. ~€250M turnover in 2024.',
    nodes: [{_key: 'brands', ...ref('node.brands')}],
    tags: [{_key: 'fair-trade', ...ref('tag.fair-trade')}],
    headquarters: 'Paris, France',
    founded: '2005, by Sébastien Kopp and François-Ghislain Morillion',
    website: 'https://www.veja-store.com',
  },
  {
    _id: 'company.vestiaire',
    _type: 'company',
    name: 'Vestiaire Collective',
    slug: slug('vestiaire'),
    location: 'Paris, France',
    tagline:
      'Global resale marketplace for pre-owned premium and luxury fashion. Asset-light model: no inventory, no production. Commission and authentication fees. Founded Paris, 2009.',
    businessModelSummary:
      'Global resale marketplace for pre-owned premium and luxury fashion. Asset-light: earns commission and authentication fees without holding inventory. Founded 2009, raised over $700M USD, targeting first annual profit in 2026.',
    nodes: [{_key: 'sm', ...ref('node.secondary-market')}],
    tags: [
      {_key: 'recommerce', ...ref('tag.recommerce')},
      {_key: 'bcorp', ...ref('tag.b-corp')},
      {_key: 'assetlight', ...ref('tag.asset-light')},
    ],
    headquarters: 'Paris, France',
    founded: '2009, by Fanny Moizant and Sophie Hersan',
    ownership:
      'Private. Eurazeo ~25%; Vitruvian, Condé Nast, Bpifrance, SoftBank 5–10% each; Kering ~5%',
    leadership: 'Bernard Osta, CEO (appt. Oct 2025)',
    approximateSize: '~600 employees, 100+ in authentication',
    website: 'https://www.vestiairecollective.com',
  },
  {
    _id: 'company.circulose',
    _type: 'company',
    name: 'Circulose',
    slug: slug('circulose'),
    location: 'Stockholm, Sweden',
    tagline:
      'Produces dissolving pulp from cotton-rich textile waste as a substitute for virgin wood pulp in viscose and lyocell production. Formerly Renewcell, acquired out of bankruptcy in 2024 by Altor Equity Partners.',
    businessModelSummary:
      'Produces dissolving pulp from cotton-rich textile waste as a substitute for virgin wood pulp in viscose and lyocell production. Formerly Renewcell, acquired out of bankruptcy in 2024 by Altor Equity Partners. Production restart Q4 2026.',
    nodes: [{_key: 'yf', ...ref('node.yarn-fabric')}],
    headquarters: 'Stockholm, Sweden',
    founded: '2012 (as Re:newcell)',
    ownership: 'Acquired by Altor Equity Partners, 2024',
    website: 'https://circulose.com',
  },
]

// ----- Singletons --------------------------------------------------------
const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  logoText: 'PREFALL',
  heroLabel: 'Independent editorial intelligence on the business of fashion',
  heroHeading: 'The business behind\nthe next season\nof fashion.',
  heroBody:
    "Prefall analyses the economic viability of fashion's transition toward sustainability. We cover the business models, the regulation, and the consumer behaviour that determine which propositions hold up commercially and which do not.",
  heroPrimaryCtaLabel: 'Read the latest →',
  heroSecondaryCtaLabel: 'Get in touch →',
  readingNowSectionLabel: 'Reading now',
  readingNowIntroBody:
    'Analysis of business models, consumer behaviour, and the economic limits shaping sustainable fashion.',
  fromTheDirectoryLabel: 'From the directory',
  regulationFocusLabel: 'Regulation that matters now',
  valueChainHeroHeading: 'The fashion value chain',
  valueChainHeroSubhead:
    'Seven nodes from raw materials to the secondary market. Click any node to see the companies, regulations, and analysis that touch it.',
  valueChainHeroCaption:
    'The economics of the industry rarely sit inside a single node. The cost of a sustainability decision at one stage is often absorbed, or avoided, at another.',
  footerCtaTitle: "Let's talk about the\nbusiness of {{accent}}fashion's{{/accent}}\nnext chapter.",
  footerNewsletterCtaLabel: 'Subscribe to the newsletter',
  footerContactCtaLabel: 'Get in touch →',
  footerTagline:
    'The business behind the next season of fashion. Editorial intelligence on sustainable fashion economics.',
  socialLinks: [
    {_key: 's1', _type: 'socialLink', label: 'LinkedIn', url: 'https://www.linkedin.com/in/ana-claros/'},
    {_key: 's2', _type: 'socialLink', label: 'Twitter/X', url: 'https://x.com'},
    {_key: 's3', _type: 'socialLink', label: 'Substack', url: 'https://substack.com'},
  ],
  footerCopyright: '© 2026 Prefall. All rights reserved.',
  cookieBannerText:
    'Prefall uses essential cookies to operate the site and optional analytics cookies to understand how the platform is used. We do not run advertising trackers.',
  cookieAcceptLabel: 'Accept analytics',
  cookieEssentialLabel: 'Essential only',
  emptyNodeCompaniesMessage:
    'Prefall has not yet profiled companies operating at this node.',
  emptyArticlesMessage: 'New analysis is being prepared. Check back soon.',
  emptyJobsMessage: 'No open positions at the moment. Check back soon.',
}

const articlesPage = {
  _id: 'articlesPage',
  _type: 'articlesPage',
  heading: 'Articles',
  subhead:
    "Long-form analytical work on the economics of fashion's transition. Each piece applies the same lens: whether the proposition under examination holds up commercially, and what determines that.",
  emptyMessage: 'New analysis is being prepared. Check back soon.',
}

const companiesPage = {
  _id: 'companiesPage',
  _type: 'companiesPage',
  heading: 'Companies',
  subhead:
    'An analytical directory of companies operating across the fashion value chain. Each entry describes the business model, sets out the economic logic it runs on, and maps the regulatory exposure that shapes its future.',
  methodNoteHeading: 'How this directory works',
  methodNoteBody:
    "Inclusion is an editorial decision based on a company's relevance to the transition of the fashion industry. We do not score, rank, or rate companies on sustainability performance. We describe how their business model works, what the company says about itself, what we make of the economics of the model, and the publicly verifiable signals available. Each entry is updated when material changes happen.",
}

const regulationPage = {
  _id: 'regulationPage',
  _type: 'regulationPage',
  heading: 'Regulation',
  subhead:
    "A live tracker of the EU and major national rules reshaping fashion's economics. Each entry notes status, scope, and what it actually requires.",
  trackerTitle: 'Tracker — EU sustainability rules',
  trackerSubtitle:
    'The fourteen rules below shape compliance costs, reporting burden, and product-level disclosure across the industry.',
  trackerCtaLabel: 'Read the latest analysis',
  trackerCtaSubLabel: 'Editorial coverage of each rule and its commercial impact',
}

const valueChainPage = {
  _id: 'valueChainPage',
  _type: 'valueChainPage',
  heading: 'The fashion value chain',
  subhead:
    "Seven nodes from raw materials to the secondary market. The economics rarely sit inside a single node. A sustainability decision absorbed at one stage is often avoided at another.",
  mapHintLabel: 'Click a layer to filter the map',
  mapFooterNote:
    'Regulatory pills overlay shows which rules apply at each node. Hover for detail.',
}

const jobsPage = {
  _id: 'jobsPage',
  _type: 'jobsPage',
  heading: 'Jobs',
  subhead: 'Open positions in sustainable fashion across the value chain.',
  emptyMessage: 'No open positions at the moment. Check back soon.',
}

const newsletterPage = {
  _id: 'newsletterPage',
  _type: 'newsletterPage',
  kicker: 'NEWSLETTER',
  heading: 'The business behind the next season of fashion, in your inbox.',
  body:
    'Weekly analysis on the economics of sustainable fashion. Business models, regulation, consumer behaviour, and capital flows.',
  features: [
    {_key: 'f1', number: '01', text: 'Long-form analysis weekly. No press releases, no recycled news.'},
    {_key: 'f2', number: '02', text: 'Regulatory tracker updates flagged when material changes happen.'},
    {_key: 'f3', number: '03', text: 'Company directory updates with editorial context.'},
    {_key: 'f4', number: '04', text: 'No advertising, no sponsorship, no editorial influence.'},
  ],
  submitLabel: 'Subscribe',
  inputPlaceholder: 'Your email address',
  successTitle: "You're in.",
  successBody: 'Welcome. The next issue lands Friday.',
}

const aboutPage = {
  _id: 'aboutPage',
  _type: 'aboutPage',
  heroHeading: 'About Prefall',
  heroSubhead:
    'Prefall is an independent editorial platform analysing the economic viability of sustainable fashion business models, regulation, and consumer behaviour.',
  sections: [
    {
      _key: 'sec1',
      _type: 'aboutSection',
      label: 'Mission',
      heading: 'What Prefall does',
      body: [
        {
          _type: 'block',
          _key: 'b1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 's1',
              text: "Prefall analyses the business behind sustainable fashion. Not advocacy, not promotion: the economics of which propositions hold up commercially and which do not.",
            },
          ],
        },
      ],
    },
    {
      _key: 'sec2',
      _type: 'aboutSection',
      label: 'Author',
      heading: 'Ana Maria Claros',
      body: [
        {
          _type: 'block',
          _key: 'b2',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 's2',
              text: 'Ana Maria Claros writes Prefall. Edit this section in Studio to add your biography.',
            },
          ],
        },
      ],
    },
  ],
  contactFormTitle: 'Get in touch',
  contactFormSubtitle: 'For editorial, partnerships, or feedback.',
  contactSuccessTitle: 'Thank you.',
  contactSuccessBody: "Your message has reached Prefall. We'll respond soon.",
}

const methodologyPage = {
  _id: 'methodologyPage',
  _type: 'methodologyPage',
  heroHeading: 'Methodology',
  heroSubhead:
    'How Prefall selects, analyses, and updates content. Edit in Studio.',
  sections: [],
}

const privacyPage = {
  _id: 'privacyPage',
  _type: 'privacyPage',
  heroHeading: 'Privacy Policy',
  heroSubhead: 'How Prefall handles your data. Edit in Studio.',
  sections: [],
}

// ----- Seed --------------------------------------------------------------
async function seed() {
  // Order matters: dependencies first.
  const groups = [
    ['Regulation statuses', statuses],
    ['Job seniorities', seniorities],
    ['Article categories', categories],
    ['Company tags', companyTags],
    ['Nodes', nodes],
    ['Regulations', regs],
    ['Companies', companies],
    [
      'Singletons',
      [
        siteSettings,
        articlesPage,
        companiesPage,
        regulationPage,
        valueChainPage,
        jobsPage,
        newsletterPage,
        aboutPage,
        methodologyPage,
        privacyPage,
      ],
    ],
  ]

  for (const [label, docs] of groups) {
    const tx = client.transaction()
    for (const doc of docs) tx.createOrReplace(doc)
    await tx.commit()
    console.log(`✓ ${label}: ${docs.length}`)
  }

  console.log('\nSeeding complete.')
}

seed().catch((err) => {
  console.error('Seed failed:', err.message)
  if (err.response?.body) console.error(err.response.body)
  process.exit(1)
})
