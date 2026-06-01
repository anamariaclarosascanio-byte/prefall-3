/**
 * Verbatim prose for the remaining singleton pages, sourced from
 * prefall-prototype 1.html:
 *   • About        — lines 5026-5104
 *   • Newsletter   — lines 4974-5020
 *   • Methodology  — lines 5110-5159
 *   • Privacy      — lines 5183-5247
 *
 * Plus seeds the 6 example job listings from prototype lines 4888-4965.
 *
 * Idempotent: every field this script touches is overwritten on each run.
 *
 *   node --env-file=.env.local scripts/seed-prose-pages.mjs
 */
import {createClient} from '@sanity/client'
import crypto from 'node:crypto'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN
if (!projectId || !dataset || !token) {
  console.error('Missing Sanity env vars.')
  process.exit(1)
}
const client = createClient({projectId, dataset, apiVersion: '2024-10-01', token, useCdn: false})
const rand = () => crypto.randomBytes(6).toString('hex')
const ref = (id) => ({_type: 'reference', _ref: id})

function pt(paragraphs) {
  return paragraphs.map((text) => ({
    _type: 'block',
    _key: rand(),
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: rand(), text, marks: []}],
  }))
}

// ─────────────────────────────────────────────────────────────────────────
// 1. About
// ─────────────────────────────────────────────────────────────────────────
const aboutPatch = {
  heroHeading: "The business behind\nfashion's transition.",
  heroSubhead:
    'Prefall is an editorial intelligence platform. We analyse the economic viability of sustainable fashion and examine whether the business models built around it hold up commercially.',
  sections: [
    {
      _type: 'aboutSection',
      _key: rand(),
      label: 'What we do',
      body: pt([
        'Trade press reports on what brands do. Activist platforms examine the industry through a moral frame. B2B intelligence tools sell operational data to compliance functions. Academic research moves at academic speed. None of them brings rigorous economic analysis of fashion\'s transition to a professional audience, at the tempo the work demands.',
        'Prefall does. We examine whether the models hold up commercially, what determines their viability, and how regulation, capital allocation, and consumer behaviour are reshaping the sector over the next decade.',
      ]),
    },
    {
      _type: 'aboutSection',
      _key: rand(),
      label: 'What we cover',
      body: pt([
        'Six themes organise our work: the economic viability of sustainable business models, the consumer behaviour that supports or contradicts them, the structures of revenue and unit economics across the industry, the gap between sustainability narratives and commercial reality, the EU regulatory framework reshaping the sector, and the emerging technologies that change the economics of the models they touch.',
      ]),
    },
    {
      _type: 'aboutSection',
      _key: rand(),
      label: 'Founded by',
      body: pt([
        'Ana Maria Claros',
        '"I started this platform because I kept reading about sustainable fashion and not finding what I was looking for. Existing coverage split between moral advocacy and brand-led press, and almost no one was looking at the concrete economics that decide which sustainable propositions get to survive. The question I wanted answered, what holds up the models that work and what is closing the ones that do not, was not being asked anywhere I could find.',
        'That is the question Prefall exists to ask. I read the sector from an angle few publications cover: not what brands should do, but what their economics actually allow them to do. I am drawn to sustainable propositions that look admirable on paper and become fragile in the income statement, and to the ones that look commercial until a closer look reveals a structuring decision other companies have not been willing to take."',
      ]),
    },
  ],
  contactFormTitle: 'Send a message',
  contactFormSubtitle: 'We read every message and reply within one business day.',
  contactSuccessTitle: 'Message sent.',
  contactSuccessBody:
    "Thank you — we'll be in touch within one business day.",
}

// ─────────────────────────────────────────────────────────────────────────
// 2. Newsletter
// ─────────────────────────────────────────────────────────────────────────
const newsletterPatch = {
  kicker: 'The Prefall newsletter',
  heading: 'One question.\nEvery issue.',
  body:
    "An analytical letter on the economics of fashion's transition. Each issue takes one question shaping the sector and works through it with evidence and commercial reasoning. No digest. No recap.",
  features: [
    {_type: 'feature', _key: rand(), number: '01', text: 'A single analytical piece each issue. One question, worked through properly.'},
    {_type: 'feature', _key: rand(), number: '02', text: 'Regulatory coverage as it happens, with analytical reading on commercial impact.'},
    {_type: 'feature', _key: rand(), number: '03', text: 'Pointers to material developments in the directory and the value chain map.'},
    {_type: 'feature', _key: rand(), number: '04', text: 'Early or extended access to platform content for subscribers.'},
  ],
  submitLabel: 'Subscribe',
  inputPlaceholder: 'your@email.com',
  successTitle: "You're in.\nFirst issue coming soon.",
  successBody: "We'll send the next issue straight to your inbox.",
}

// ─────────────────────────────────────────────────────────────────────────
// 3. Methodology
// ─────────────────────────────────────────────────────────────────────────
const methodologyPatch = {
  heroHeading: 'Methodology',
  heroSubhead: 'How Prefall produces what it publishes.',
  sections: [
    {
      _type: 'proseSection',
      _key: rand(),
      label: 'Editorial standard',
      body: pt([
        'Every claim we publish is supported by data, sourced methodology, or documented industry practice. Where something is interpretation, we say so. Where evidence is contested, we say so. The analytical frame is always economic: we examine the logic a proposition runs on and the conditions that shape whether it holds.',
      ]),
    },
    {
      _type: 'proseSection',
      _key: rand(),
      label: 'How articles are produced',
      body: pt([
        "Articles are written by Prefall's editorial team. Each piece goes through research, drafting, internal review, and a final audit before publication. The audit checks evidence, sources, and editorial voice. Articles are not published until the audit is closed.",
      ]),
    },
    {
      _type: 'proseSection',
      _key: rand(),
      label: 'How the directory is built',
      body: pt([
        "Inclusion in the directory is an editorial decision. We select companies based on their relevance to fashion's transition, their position in the value chain, and whether their model offers something worth analysing. We do not score or rank. We describe how the business model works, what the company says about itself, what we make of the economics, and the regulatory exposure that shapes the company's future.",
        'Entries draw on publicly available information: company disclosures, regulatory filings, audited statements, certifications, funding rounds, and reporting in the trade and business press. We do not publish information we cannot verify in public sources. Where the company has provided a statement directly, we cite it as such.',
        'Each entry is reviewed at least once a year, and updated when a material change occurs. Removals happen only when a company ceases operations or when the editorial relevance no longer justifies inclusion.',
      ]),
    },
    {
      _type: 'proseSection',
      _key: rand(),
      label: 'Conflict of interest',
      body: pt([
        'Prefall does not accept advertising or sponsored content from companies it covers. No company in the directory pays for inclusion or for any specific editorial treatment. Where derivative services exist for institutional subscribers, those services do not influence the public editorial output. Any commercial relationship that could be material to a piece of coverage is disclosed in the piece itself.',
      ]),
    },
    {
      _type: 'proseSection',
      _key: rand(),
      label: 'Corrections',
      body: pt([
        'If we get something wrong, we correct it. Substantive corrections are noted at the bottom of the page with the date and the nature of the correction. Minor edits are made silently. If you find an error, please write to us at contact@pre-fall.com.',
      ]),
    },
    {
      _type: 'proseSection',
      _key: rand(),
      label: 'Sources we use',
      body: pt([
        'Company disclosures, regulatory filings, financial statements, certified audits, trade and business press, academic research, NGO reports, and direct exchanges with industry sources. Every entry and every article lists the sources it draws on.',
      ]),
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────
// 4. Privacy
// ─────────────────────────────────────────────────────────────────────────
const privacyPatch = {
  heroHeading: 'Privacy Policy',
  heroSubhead: 'Last updated: May 2026',
  sections: [
    {
      _type: 'proseSection',
      _key: rand(),
      label: '1.',
      heading: 'Who we are',
      body: pt([
        'Prefall is a media and intelligence platform covering the economics of the fashion industry. We are operated by Ana Maria Claros. You can reach us at contact@pre-fall.com.',
      ]),
    },
    {
      _type: 'proseSection',
      _key: rand(),
      label: '2.',
      heading: 'What data we collect',
      body: pt([
        'We collect only what is necessary to operate the platform: your email address when you subscribe to the newsletter via Substack, and your name and message content when you contact us through the site form.',
        'We do not collect payment data, location data, behavioral data, or any sensitive personal information. We do not use analytics tracking tools.',
      ]),
    },
    {
      _type: 'proseSection',
      _key: rand(),
      label: '3.',
      heading: 'How we use your data',
      body: pt([
        'We use your data to send you the Prefall newsletter through Substack (if you have subscribed) and to respond to messages you send us directly.',
        'We do not sell, rent, or share your personal data with third parties for marketing purposes.',
      ]),
    },
    {
      _type: 'proseSection',
      _key: rand(),
      label: '4.',
      heading: 'Cookies',
      body: pt([
        'We use only essential cookies required for the site to function — for example, to remember your cookie consent choice. We do not use advertising or analytics cookies.',
      ]),
    },
    {
      _type: 'proseSection',
      _key: rand(),
      label: '5.',
      heading: 'Newsletter and Substack',
      body: pt([
        'The Prefall newsletter is distributed via Substack. When you subscribe, your email address is stored and processed by Substack in accordance with their own Privacy Policy (substack.com/privacy). We recommend reviewing it. You can unsubscribe at any time using the link at the bottom of any issue.',
      ]),
    },
    {
      _type: 'proseSection',
      _key: rand(),
      label: '6.',
      heading: 'Data retention',
      body: pt([
        'Newsletter subscriptions are managed by Substack and retained until you unsubscribe. Contact form submissions are retained by us for up to 12 months and then deleted.',
      ]),
    },
    {
      _type: 'proseSection',
      _key: rand(),
      label: '7.',
      heading: 'Your rights',
      body: pt([
        'Under GDPR and applicable data protection law, you have the right to access, correct, or delete any personal data we hold about you. To make a request, write to us at contact@pre-fall.com. We will respond within 30 days.',
      ]),
    },
    {
      _type: 'proseSection',
      _key: rand(),
      label: '8.',
      heading: 'Changes to this policy',
      body: pt([
        'We may update this policy as the platform evolves. Material changes will be communicated via the newsletter. The date at the top of this page reflects the most recent revision.',
      ]),
    },
    {
      _type: 'proseSection',
      _key: rand(),
      label: '9.',
      heading: 'Contact',
      body: pt([
        'Questions about this policy? Write to contact@pre-fall.com.',
      ]),
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────
// 5. Jobs page hero + 6 job listings (verbatim from prototype)
// ─────────────────────────────────────────────────────────────────────────
const jobsPagePatch = {
  heading: 'Jobs',
  subhead:
    'A curated selection of open roles in sustainability, ESG, circularity, regulation, and impact functions across the fashion industry. Browse, filter, and apply directly through the listing company.',
  emptyMessage:
    'No open listings right now. Subscribe to the newsletter to be notified when new roles are posted.',
}

const jobsToSeed = [
  {
    id: 'job.zalando-sustainability-reporting',
    title: 'Head of Sustainability Reporting',
    company: 'Zalando',
    location: 'Berlin, Germany',
    seniorityId: 'seniority.senior',
    publishedAt: '2026-05-10',
  },
  {
    id: 'job.kering-esg-analyst',
    title: 'ESG Analyst: Fashion & Luxury',
    company: 'Kering',
    location: 'Paris, France',
    seniorityId: 'seniority.mid',
    publishedAt: '2026-05-08',
  },
  {
    id: 'job.hm-circular-economy-lead',
    title: 'Circular Economy Lead',
    company: 'H&M Group',
    location: 'Stockholm, Sweden',
    seniorityId: 'seniority.senior',
    publishedAt: '2026-05-03',
  },
  {
    id: 'job.pvh-regulatory-affairs',
    title: 'Regulatory Affairs Manager: EU Textiles',
    company: 'PVH Corp',
    location: 'Amsterdam, Netherlands',
    seniorityId: 'seniority.mid',
    publishedAt: '2026-04-28',
  },
  {
    id: 'job.mckinsey-sustainability-consultant',
    title: 'Sustainability Strategy Consultant',
    company: 'McKinsey & Co',
    location: 'Remote / London',
    seniorityId: 'seniority.senior',
    publishedAt: '2026-04-20',
  },
  {
    id: 'job.inditex-product-lifecycle',
    title: 'Product Lifecycle Analyst',
    company: 'Inditex',
    location: 'A Coruña, Spain',
    seniorityId: 'seniority.junior',
    publishedAt: '2026-04-14',
  },
]

async function main() {
  const tx = client.transaction()

  // Singleton patches (set replaces every listed field)
  tx.patch('aboutPage', {set: aboutPatch})
  tx.patch('newsletterPage', {set: newsletterPatch})
  tx.patch('methodologyPage', {set: methodologyPatch})
  tx.patch('privacyPage', {set: privacyPatch})
  tx.patch('jobsPage', {set: jobsPagePatch})

  // Jobs (createOrReplace so re-running is idempotent)
  for (const j of jobsToSeed) {
    tx.createOrReplace({
      _id: j.id,
      _type: 'job',
      title: j.title,
      company: j.company,
      location: j.location,
      seniority: ref(j.seniorityId),
      publishedAt: j.publishedAt,
    })
  }

  await tx.commit()
  console.log(
    `✓ Patched aboutPage, newsletterPage, methodologyPage, privacyPage, jobsPage + seeded ${jobsToSeed.length} jobs.`
  )
}

main().catch((err) => {
  console.error(err?.response?.body ?? err)
  process.exit(1)
})
