/**
 * Verbatim company prose from prefall-prototype 1.html. Re-runs override every
 * field this script touches; safe to re-run.
 *
 * What this fills:
 *   • Veja      — tagline, founded (2004 not 2005), ownership, leadership,
 *                 approximateSize, regulatoryExposure (3 items), full
 *                 prefallAnalysis (was missing last sentences).
 *   • Vestiaire — regulatoryExposure (2 items).
 *   • Circulose — tagline, headquarters, founded, ownership, leadership,
 *                 approximateSize, businessModel (was missing last sentence),
 *                 regulatoryExposure (3 items).
 *
 * Run: node --env-file=.env.local scripts/seed-companies-full.mjs
 */
import {createClient} from '@sanity/client'
import crypto from 'node:crypto'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN
if (!projectId || !dataset || !token) {
  console.error('Missing env vars (NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN).')
  process.exit(1)
}

const client = createClient({projectId, dataset, apiVersion: '2024-10-01', token, useCdn: false})
const rand = () => crypto.randomBytes(6).toString('hex')

function pt(paragraphs) {
  return paragraphs.map((text) => ({
    _type: 'block',
    _key: rand(),
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: rand(), text, marks: []}],
  }))
}
const ref = (id) => ({_type: 'reference', _ref: id})

function exposure(items) {
  // items: [{regId, displayLabel, materiality, directionShort?, note}]
  return items.map((i) => ({
    _type: 'exposureItem',
    _key: rand(),
    regulation: ref(i.regId),
    displayLabel: i.displayLabel,
    materiality: i.materiality,
    ...(i.directionShort ? {directionShort: i.directionShort} : {}),
    note: i.note,
  }))
}

// ============================================================
// Veja — full meta + regulatory exposure + corrected prefallAnalysis
// ============================================================
const vejaPatch = {
  tagline:
    'Sneaker brand that routes advertising spend directly into fair-trade raw materials and production. No paid media. Founded Paris, 2004.',
  headquarters: 'Paris, France',
  founded: '2004, by Sébastien Kopp and François-Ghislain Morillion',
  ownership:
    'Privately held by founders. No outside venture or PE ownership disclosed.',
  leadership:
    'Sébastien Kopp and François-Ghislain Morillion, co-founders',
  approximateSize:
    '~600+ employees in Europe and Latin America. ~€250M turnover (2024)',
  website: 'https://www.veja-store.com',
  // Fix prefallAnalysis: prototype has the missing trailing sentences in
  // paragraph 2. Replace verbatim.
  prefallAnalysis: pt([
    "Veja is the inverse of the cases Prefall usually examines. Most sustainability propositions struggle because the green choice adds cost the model cannot recover. Veja found one specific place where a large conventional cost can be removed, advertising, and rerouted into the part of the chain that carries the sustainability claim, arriving at a cost base close to conventional competitors. What makes this work is narrow: footwear marketing budgets are unusually large as a share of product cost, which makes the substitution available in this category in a way it is not in most others.",
    "Two conditions hold the model up. First, demand has to be generated without paid media, which Veja has achieved through editorial coverage, retailer placement and design. That is a function of taste and timing that is hard to manufacture and harder to sustain across cycles. Second, the founders have to be willing to cap growth. A no-advertising model loses its cost advantage the moment it has to buy demand to grow, because the redirected budget is finite and the upstream contracts are fixed commitments. The company states it prioritises profitability over scale. The 2018 figures, €33.9M turnover and €4.2M net profit, show the model can be profitable at small scale. The 2024 figure of ~€250M shows it has scaled sevenfold without abandoning the principle. Whether it holds at the next order of magnitude is the open question.",
  ]),
  regulatoryExposure: exposure([
    {
      regId: 'regulation.gcd',
      displayLabel: 'Green Claims Directive',
      materiality: 'low-medium',
      directionShort: 'net positive',
      note:
        "Veja's documented limitations and verified sourcing position it better than competitors with looser claims. Materiality: low to medium, net positive.",
    },
    {
      regId: 'regulation.espr',
      displayLabel: 'ESPR & Digital Product Passport',
      materiality: 'medium',
      directionShort: 'net positive',
      note:
        'Traceability and material disclosure requirements favour a company already sourcing on documented multi-year contracts. Materiality: medium, net positive.',
    },
    {
      regId: 'regulation.csrd',
      displayLabel: 'CSRD',
      materiality: 'medium',
      note:
        'Direct obligations depend on size thresholds, but supply-chain reporting pressure from larger wholesale partners is the more material channel. Materiality: medium.',
    },
  ]),
}

// ============================================================
// Vestiaire — only regulatoryExposure was missing
// ============================================================
const vestiairePatch = {
  regulatoryExposure: exposure([
    {
      regId: 'regulation.epr',
      displayLabel: 'Waste Framework Directive & EPR',
      materiality: 'medium',
      directionShort: 'net positive',
      note:
        'Extended Producer Responsibility schemes increase the cost of disposal for new goods, reinforcing the value proposition of the secondary market. Medium materiality, net positive.',
    },
    {
      regId: 'regulation.gcd',
      displayLabel: 'Green Claims Directive',
      materiality: 'medium',
      note:
        "Resale's claim that it displaces new production faces substantiation scrutiny under the GCD. The platform's environmental narrative will require evidential support to meet the directive's requirements.",
    },
  ]),
}

// ============================================================
// Circulose — full meta + regulatory exposure + corrected businessModel
// ============================================================
const circulosePatch = {
  tagline:
    'Produces dissolving pulp from cotton-rich textile waste as a substitute for virgin wood pulp in viscose and lyocell production. Formerly Renewcell. Stockholm, 2012.',
  headquarters: 'Stockholm, Sweden. Production in Sundsvall (Ortviken)',
  founded: '2012, by researchers from KTH Royal Institute of Technology',
  ownership:
    'Acquired from bankruptcy by Altor Equity Partners, June 2024. Privately held.',
  leadership:
    'Jonatan Janmark, CEO. Helena Helmersson, Chair (former H&M Group CEO)',
  approximateSize:
    '~130 employees at peak pre-bankruptcy. Current headcount not published.',
  website: 'https://www.circulose.com',
  // Fix businessModel: prototype paragraph 2 ends with an extra sentence
  // that was truncated in the earlier seed. Re-set both paragraphs verbatim.
  businessModel: pt([
    'Circulose recovers cellulose from discarded cotton textiles and production scraps, removes dyes, trims and synthetic content, and processes the material into sheets of pulp that substitute for virgin wood pulp in viscose, lyocell and modal production. Under the original Renewcell model, the pulp was sold into the fibre market and depended on downstream brands and producers choosing to buy it.',
    'After the 2024 relaunch, Altor changed the commercial model. Circulose now operates a split pricing structure that separates the physical cost of the pulp from a licence and service fee. Brands sign volume commitments and pay a licence fee covering integration support, traceability tools and use of the Circulose trademark. The stated purpose is to stop the price premium compounding at each step of the supply chain, which it did under the old model. The company describes the shift as moving from a pulp supplier to a solutions partner.',
  ]),
  regulatoryExposure: exposure([
    {
      regId: 'regulation.espr',
      displayLabel: 'ESPR & Digital Product Passport',
      materiality: 'high',
      directionShort: 'net positive',
      note:
        'As recycled content and traceability move toward product requirements, demand for verified recycled cellulose with chain-of-custody documentation rises. Materiality: high, as a demand driver.',
    },
    {
      regId: 'regulation.epr',
      displayLabel: 'Waste Framework Directive & Textile EPR',
      materiality: 'medium',
      directionShort: 'net positive',
      note:
        'Extended producer responsibility raises the cost of textile waste and improves feedstock economics for textile-to-textile recyclers. Materiality: medium, net positive.',
    },
    {
      regId: 'regulation.gcd',
      displayLabel: 'Green Claims Directive',
      materiality: 'medium',
      directionShort: 'net positive',
      note:
        'Tighter rules on unsubstantiated environmental claims raise the value of independently verifiable materials, which the company offers through its traceability tools. Materiality: medium, as a demand driver.',
    },
  ]),
}

async function main() {
  const tx = client.transaction()
  tx.patch('company.veja', {set: vejaPatch})
  tx.patch('company.vestiaire', {set: vestiairePatch})
  tx.patch('company.circulose', {set: circulosePatch})
  await tx.commit()
  console.log('✓ Patched company.veja, company.vestiaire, company.circulose')
}

main().catch((err) => {
  console.error(err?.response?.body ?? err)
  process.exit(1)
})
