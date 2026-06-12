/**
 * Create the article "Fashion's Post-Purchase Economy: Growing Everywhere,
 * Profitable Almost Nowhere" as a DRAFT in Sanity, with the 4 HTML graphics
 * embedded at the marked positions inside the body.
 *
 * Run:  node --env-file=.env.local scripts/create-post-purchase-article.mjs
 *
 * The document is created as `drafts.<id>` so Ana reviews it in Studio
 * (Articles -> drafts) and clicks Publish when she's happy. Re-running is
 * safe: createOrReplace targets the same id.
 */
import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'
import {randomBytes} from 'node:crypto'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const k = () => randomBytes(6).toString('hex')

const GRAPHICS_DIR =
  'C:/Users/anama/Desktop/ALL PREFALL/Editorial Content/Articles 2026/Article Graphics'

const html = (name) => readFileSync(`${GRAPHICS_DIR}/${name}`, 'utf8')

const GRAPHIC_OPERATORS = html('post-purchase-comparison-table-operators.html')
const GRAPHIC_GROWTH = html('post-purchase-data-chart-growth-multiples.html')
const GRAPHIC_KEARNEY = html('post-purchase-ranked-list-kearney-index.html')
const GRAPHIC_PACT = html('post-purchase-stat-strip-textiles-pact.html')

// Helpers to build Portable Text blocks
const para = (text) => ({
  _key: k(),
  _type: 'block',
  style: 'normal',
  markDefs: [],
  children: [{_key: k(), _type: 'span', marks: [], text}],
})

// H2 + bold (negrilla) per editorial instruction
const h2 = (text) => ({
  _key: k(),
  _type: 'block',
  style: 'h2',
  markDefs: [],
  children: [{_key: k(), _type: 'span', marks: ['strong'], text}],
})

const htmlEmbed = (code, caption) => ({
  _key: k(),
  _type: 'htmlEmbed',
  code,
  ...(caption ? {caption} : {}),
})

const body = [
  // ── Section 1 ─────────────────────────────────────────────────────────
  h2('One transaction, two ways to run it'),
  para(
    "Every resale business sells the same event: a garment changing owners a second time. The economics divide on who touches the garment in between. In a peer-to-peer model, the seller photographs the item, writes the listing, stores it and ships it, while the platform supplies the software, the payments and the trust. In a managed or consignment model, the platform itself takes the item in, authenticates it, photographs it, prices it, stores it and ships it. The first model buys almost no labour; the second buys all of it.",
  ),
  para(
    "That difference would matter less if handling got cheaper with volume, the way manufacturing does. For the most part it does not, because every used garment is unique and arrives in unknown condition, so each one has to be assessed on its own. The Ellen MacArthur Foundation's policy report The New Bottom Line (May 2026) puts the claim at its strongest: sorting, cleaning and repairing a hundred items of used clothing takes a hundred times the effort of one (p. 12). Automation is testing the edges of that claim, and the operators doing the testing appear below, but the 2025 cost structures still behave as if it holds.",
  ),

  // ── Section 2 ─────────────────────────────────────────────────────────
  h2('The cost that decides who earns money'),
  para(
    "Between February and May 2026, four of the largest dedicated resale platforms published results, and together they read like a controlled experiment on the handling variable. The table below orders them by how much of the garment's journey each platform pays for.",
  ),
  htmlEmbed(GRAPHIC_OPERATORS),
  para(
    "At one end, Vinted pays for almost no handling, and earned a €62 million net profit on €1.1 billion of revenue in 2025, after €77 million in 2024 (Vinted Group annual results, April 2026). Free seller labour is only half of that result. The other half is years of engineering cost out of everything around the transaction: an own carrier service operating in five markets, access to more than 500,000 parcel pickup points, an own payments wallet. The company's stated logic is that every cent of transaction cost removed makes lower-value garments tradeable, which widens its market. Among the four, profit has appeared only where the platform avoids touching the product. Item value explains part of that split: at Vinted's price points, hand-processing each garment would consume its margin, while at luxury price points authentication is the service buyers pay for, so the handling cost is unavoidable.",
  ),
  para(
    "At the other end sit the three handlers, and none of the three has yet reported a profitable year. The RealReal, which takes in, authenticates, photographs and stores consigned luxury goods, carries a $1.3 billion accumulated deficit after fifteen years (FY2025 results, February 2026). ThredUp, which processes every garment through its own facilities, remains loss-making in its seventeenth year (Q1 2026 results, SEC filing, May 2026). Vestiaire Collective, which authenticates in-house with a team of more than 100, expects its first annual profit in 2026, seventeen years after founding (Bloomberg interview with chief executive Bernard Osta, February 2026).",
  ),
  para(
    "Their income statements show where the money goes, and the 10-Ks define the lines. Gross margins are high: 79.2 percent at ThredUp, above 74 percent at The RealReal, far above the roughly 50 percent benchmark the Ellen MacArthur Foundation uses for mass-market linear retail. ThredUp's cost of revenue holds only outbound shipping, outbound labour and packaging; the distribution-centre work of receiving, inspecting and photographing garments is booked under operations, product and technology (ThredUp 10-K, March 2026), a line that took 50 cents of every revenue dollar in the first quarter of 2026. The RealReal books part of authentication and fulfilment for sold items inside its cost of revenue and still reports those margins; its operations and technology line, which covers authentication, merchandising and fulfilment operations, took another 40 cents per dollar in 2025 (The RealReal 10-K, February 2026). On both statements, most of the handling cost sits below the gross profit line.",
  ),
  para(
    "The handlers are closing the gap, and the progress is in the accounts. The RealReal delivered positive adjusted EBITDA in every quarter of 2025 for the first time, with $6.3 million of positive operating income in the fourth quarter (FY2025 results, February 2026), driven by AI-assisted pricing and processing. McKinsey's State of Fashion 2026 expects technology to keep unlocking profitability for resale platforms. The open question is whether software can push the cost of assessing a unique used garment below the margin that garment earns, and the 2025 accounts show that gap narrowing without yet closing.",
  ),

  // ── Section 3 ─────────────────────────────────────────────────────────
  h2('The brand-side calculation'),
  para(
    "For a fashion brand, launching resale means importing the handling cost onto its own books, without Vinted's purpose-built infrastructure and at a fraction of its volume. The measured result is caution at near-total scale. Kearney's Circular Fashion Index, which scores 246 brands across 18 countries, finds most of them at the lowest implementation tier for every post-purchase model, as the ranking below shows, and attributes it to a missing business case and immature reverse logistics, with consumer demand already in place (CFX 2025 Report, July 2025).",
  ),
  htmlEmbed(GRAPHIC_KEARNEY),
  para(
    "The gap between ambition and operation is visible wherever it has been measured. In the UK, 81 percent of fashion organisations carry circularity in their five-year strategies, while 63 percent of customer-facing initiatives remain pilots (Circular Fashion Innovation Network survey, 2025). Among the top 50 US fashion retailers surveyed by ThredUp, two thirds view resale as an answer to incoming regulation and 16 percent say they could scale it today (ThredUp Resale Report 2026; ThredUp sells resale services to these same retailers, a commercial interest to keep in view).",
  ),
  para(
    "Brands that do operate resale mostly buy the capability from specialists, and that supplier layer has consolidated. Trove's acquisition of Recurate created a single private company controlling an estimated 75 to 80 percent of US branded resale traffic (Retail Dive, August 2024). Neither firm publishes accounts, so the economics of the layer that runs most of branded resale are not visible from outside.",
  ),

  // ── Section 4 ─────────────────────────────────────────────────────────
  h2('Spend, tonnage and the growth claims'),
  para(
    "Against that operational caution, the growth numbers look like a contradiction. They are not, once it is clear what they count. Global secondhand reaches $393 billion by 2030, growing twice as fast as the overall apparel market, according to ThredUp's 2026 Resale Report, built on GlobalData estimates. McKinsey's State of Fashion 2026 says two to three times faster through 2027; BCG, writing with resale platform Vestiaire Collective, says three; WRAP says three to five. The chart below sets the four claims side by side: unanimous on direction, apart on size, and each publisher holds a position in the story it measures. The estimates also feed each other; McKinsey's 2025 edition footnotes ThredUp's own report as the source for its resale figures (p. 149).",
  ),
  htmlEmbed(GRAPHIC_GROWTH),
  para(
    "What these figures count is consumer spend, and consumer spend flows overwhelmingly through the channels that avoid the handling cost: peer-to-peer marketplaces and thrift. Counted as spend, secondhand stands at roughly 10 percent of clothing (ThredUp, 2026). Counted as the tonnage brands themselves put on the market through circular business models, WRAP's UK Textiles Pact records 0.02 percent (Annual Progress Update, October 2025). Both numbers are right: the market is growing exactly where the cost mechanics predict, outside brand operations, on platforms where users do the work.",
  ),

  // ── Section 5 ─────────────────────────────────────────────────────────
  h2('The numbers still missing'),
  para(
    "The commercial story above rests on filings. The environmental story rests on one parameter that remains unsettled: displacement, the share of secondhand purchases that replace a purchase of something new. The two best published answers disagree. WRAP's standardised methodology, tested with eBay, Vestiaire Collective, Depop, The Seam, SOJO and Finisterre, measures 64.6 percent displacement for resale and 82.2 percent for repair (Displacement Rates Untangled, WRAP). A peer-reviewed survey of 1,009 US consumers in Scientific Reports finds secondhand and firsthand spending rising together, correlated at 0.58, with the heaviest secondhand buyers also the heaviest buyers of new clothing (Peleg Mizrachi and Sharon, October 2025). An item-level UK methodology and a US population survey measure different things, and nothing published reconciles them.",
  ),
  para(
    'The same parameter sits inside a reassurance McKinsey offers brands: that fears of resale cannibalising firsthand purchases are not supported by the data (State of Fashion 2026). For revenue planning, that is good news. For the environmental claim, cannibalisation and displacement are the same event seen from two sides, so low cannibalisation implies low displacement. The commercial pitch and the sustainability pitch are currently pulling on opposite ends of one unmeasured number.',
  ),
  para(
    "Displacement is not the only blank. The clothing repair market has no agreed size, with European estimates running from EUR 447 million (European Environment Agency) to EUR 2.7 billion (Fédération de la Mode Circulaire with KPMG, an industry federation), a sixfold spread (The New Bottom Line, p. 10). And community, loyalty and experiences, often named alongside resale as post-purchase revenue, appear in none of the documents above with a single number attached.",
  ),
  para(
    "Volume compounds whichever way displacement falls: UK Textiles Pact signatories cut carbon per tonne by 6 percent against 2019 while putting 17 percent more textiles on the market, so the Pact's total footprint rose 10 percent; the strip below carries the four figures (WRAP, October 2025).",
  ),
  htmlEmbed(GRAPHIC_PACT),

  // ── Section 6 ─────────────────────────────────────────────────────────
  h2('The request to governments, and its ceiling'),
  para(
    "In May 2026, the industry put numbers on what it says it needs. Sixty-nine companies and organisations, among them H&M Group, Vinted, ThredUp, Primark and Zalando, asked governments in the EU, US and Canada for three changes: VAT on resale and repair cut to 6 percent in Europe and sales taxes removed in North America, employer social charges on resale and repair labour reduced to 10 percent in the EU, and EPR fees, modelled at 25 euro cents per item, partly ringfenced to fund reuse and repair (Ellen MacArthur Foundation, The New Bottom Line, May 2026, p. 16). The logic follows directly from the cost mechanics above: if handling labour cannot get cheaper with scale, the remaining levers are the taxes on that labour and on each transaction. H&M Group's chief sustainability officer states the position plainly: the model is economically penalised today.",
  ),
  para(
    "The Foundation's own modelling also publishes the ceiling. With the full policy mix in place, mass-market resale margins reach approximately 55 percent, and repair reaches 41 percent in Poland and 35 percent in Germany, against linear benchmarks of 50 percent for mass market and 70 percent for luxury (pp. 7, 20, 28). The report concludes that the mix narrows the profitability gap without fully closing it (p. 30). On its authors' own numbers, policy improves the arithmetic and does not, by itself, repeal it.",
  ),
  para(
    "What would change the picture is identifiable. One of the handling platforms publishing a GAAP-profitable full year would show automation beating the handling line. A platform publishing a displacement figure alongside its accounts, using the methodology WRAP has already built and the category's biggest names have already tested, would put the growth story and the impact story on the same data for the first time. Until one of those happens, the post-purchase economy remains what the filings show: a real market, growing fast, whose profits sit almost entirely where the product is never touched.",
  ),
]

const SOURCES = [
  '1. Vinted Group, 2025 Annual Results, April 2026',
  '2. The RealReal, Fourth Quarter and Full Year 2025 Results, February 2026',
  '3. ThredUp, Q1 2026 Results, SEC Form 8-K Exhibit 99.1, May 2026',
  '4. Bloomberg (via FashionNetwork syndication), "Vestiaire Collective sees first profit in 2026 as US gains eyed", February 2026',
  '5. ThredUp with GlobalData, 2026 Resale Report, April 2026',
  '6. The Business of Fashion and McKinsey & Company, The State of Fashion 2026, November 2025',
  '7. The Business of Fashion and McKinsey & Company, The State of Fashion 2025, November 2024',
  '8. Kearney, The Kearney CFX 2025 Report, July 2025',
  '9. Circular Fashion Innovation Network (BFC and UKFT), CFIN Report 2025, May 2025',
  '10. Retail Dive, "Trove acquires competing resale platform Recurate", August 2024',
  '11. Ellen MacArthur Foundation, The New Bottom Line: Policy Levers to Scale Resale and Repair for Fashion, May 2026',
  '12. WRAP, UK Textiles Pact Roadmap press release and Annual Progress Update 2024-25, October 2025',
  '13. WRAP, Displacement Rates Untangled',
  '14. Peleg Mizrachi, M. and Sharon, O., "Secondhand fashion consumers exhibit fast fashion behaviors despite sustainability narratives", Scientific Reports, October 2025',
  '15. BCG and Vestiaire Collective, resale market report, October 2025 (figures as reported by Bloomberg, February 2026)',
  '16. ThredUp, Annual Report on Form 10-K for fiscal year 2025, filed March 2026 (expense line definitions)',
  '17. The RealReal, Annual Report on Form 10-K for fiscal year 2025, filed February 2026 (expense line definitions)',
]
const sources = SOURCES.map(para)

const SLUG = 'post-purchase-economy-growing-everywhere-profitable-almost-nowhere'

const doc = {
  // `drafts.` prefix → Sanity treats this as a draft. Ana reviews & publishes in Studio.
  _id: `drafts.article.${SLUG}`,
  _type: 'article',
  title: "Fashion's Post-Purchase Economy: Growing Everywhere, Profitable Almost Nowhere",
  slug: {_type: 'slug', current: SLUG},
  category: {_type: 'reference', _ref: 'cat.resale'},
  dek: "Where the money flows in fashion's secondhand economy, the cost that decides who keeps it, and the numbers still missing. From the operators' 2025 results, the brand indices and the industry's policy papers.",
  author: 'Ana Maria Claros',
  publishedAt: '2026-06-12',
  readingMinutes: 9,
  lead: "Where the money flows in fashion's secondhand economy, the cost that decides who keeps it, and the numbers still missing. From the operators' 2025 results, the brand indices and the industry's policy papers.",
  body,
  sources,
  modalSynopsis:
    'Secondhand grows in every measure, but profit appears only where platforms avoid handling garments; policy narrows, without closing, the gap.',
  modalTakeaways: [
    'Handling labour gains no economies of scale, so profitability tracks who touches the garment.',
    'Growth is real but flows through peer-to-peer channels brands do not operate.',
    'Displacement remains unmeasured, leaving commercial reassurance and environmental claims pulling in opposite directions.',
  ],
  modalPrimarySources: [
    'Ellen MacArthur Foundation, The New Bottom Line: Policy Levers to Scale Resale and Repair for Fashion, 2026',
    'Vinted Group, 2025 Annual Results, 2026',
    'The RealReal, Annual Report on Form 10-K, 2026',
  ],
  modalSectors: ['RESALE', 'RETAIL', 'REGULATION', 'SUSTAINABILITY'],
  nodes: [{_key: k(), _type: 'reference', _ref: 'node.secondary-market'}],
  companies: [{_key: k(), _type: 'reference', _ref: 'company.vestiaire'}],
  regulations: [{_key: k(), _type: 'reference', _ref: 'regulation.epr'}],
}

const result = await client.createOrReplace(doc)
console.log('OK draft created:', result._id)
console.log(
  `Open in Studio: https://pre-fall.com/studio/structure/article;${result._id.replace('drafts.', '')}`,
)
