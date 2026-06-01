/**
 * Prose seed for prefall-3. Adds the prototype's written prose to nodes,
 * companies, and CSRD (the home-featured regulation) using PATCH operations
 * so existing fields aren't lost.
 *
 * Run with:
 *   node --env-file=.env.local scripts/seed-prose.mjs
 */
import {createClient} from '@sanity/client'
import crypto from 'node:crypto'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing env vars.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-10-01',
  token,
  useCdn: false,
})

const rand = () => crypto.randomBytes(6).toString('hex')

/** Convert an array of plain-text paragraphs to Portable Text blocks. */
function pt(paragraphs) {
  return paragraphs.map((text) => ({
    _type: 'block',
    _key: rand(),
    style: 'normal',
    markDefs: [],
    children: [
      {_type: 'span', _key: rand(), text, marks: []},
    ],
  }))
}

/** Build a verifiableSignal array of {label, body}. */
function signals(items) {
  return items.map(([label, body]) => ({
    _type: 'signal',
    _key: rand(),
    label,
    body,
  }))
}

// ============================================================
// NODES — 7 with prose from prefall-prototype lines 5862-6031
// ============================================================
const nodePatches = {
  'node.raw-materials': {
    description: pt([
      "Raw material extraction and processing spans the full fibre spectrum: petrochemical synthetics (polyester, nylon, acrylic), natural cellulosics (cotton, linen, hemp), protein fibres (wool, silk, cashmere), and emerging alternative materials (bio-based nylons, mycelium leather, algae-derived textiles). Petrochemical synthetics now account for over 65% of global fibre production by volume, with polyester alone at roughly 54%. The environmental costs (water consumption, land use, pesticide application, and GHG emissions from both agriculture and petrochemical feedstocks) are more concentrated here than anywhere else in the chain.",
      "Cotton cultivation illustrates the structural problem clearly: it uses approximately 10,000 litres of water per kilogram of fibre, occupies 2.5% of global agricultural land, and accounts for 16% of pesticide sales. The Aral Sea desertification (one of the largest ecological disasters of the 20th century) is a direct consequence of irrigation for Soviet cotton production. Synthetic alternatives carry different costs: microplastic shedding (an estimated 700,000 fibres released per domestic wash), dependency on crude oil feedstocks, and end-of-life inertia in mechanical recycling streams. Neither category is inherently sustainable; the comparison is between different categories of harm.",
      "The transition to lower-impact fibres (recycled polyester [rPET], organic or regenerative cotton, Lyocell/Tencel, and recycled wool) is technically available but not yet economically self-sustaining. Each alternative carries a 20–60% price premium over conventional equivalents, a premium the rest of the chain has consistently declined to absorb at volume.",
    ]),
    economics: pt([
      "Raw material suppliers are commodity price-takers, not setters. Synthetic fibre producers (Toray, Indorama, Reliance Industries) benefit from vertical integration with petrochemical feedstocks and operate at scale; natural fibre farmers (particularly cotton smallholders in West Africa, India, and Central Asia) operate in fragmented markets exposed to weather, currency volatility, and commodity cycles. Gross margins in commodity fibres are structurally low: 5–15% for synthetics, often lower for smallholder cotton.",
      "The economics of sustainable alternatives require either a retail price premium that the consumer accepts or policy incentives that have not yet arrived at the right scale. The Better Cotton Initiative and GOTS certification programmes certify millions of tonnes of fibre but have not consistently demonstrated the ability to pass financial benefit upstream to the grower. EUDR and CSDDD impose traceability obligations upstream, but these flow through brand due diligence requirements; they create data and audit burdens on fibre suppliers without compensating them for compliance costs.",
    ]),
    tensions: pt([
      "The sustainability burden (water, land, and upstream emissions) concentrates here, but the financial incentive to change does not. Regulation arrives indirectly: brands are obligated under CSDDD and EUDR to audit their supply chains, which creates data requests and audit pressure on raw material suppliers without compensating them for the cost of compliance.",
      "The market premium for certified sustainable fibres has not historically been passed back to the farm or mill. The gap between the certified-sustainable product retail price and the farm-gate price for certified cotton has been documented consistently over two decades of certification programme growth. Whether DPP and CSRD reporting requirements change that dynamic (by making ingredient provenance visible to consumers and institutional buyers) is the open structural question that no current regulation resolves.",
      "A third tension sits in the microplastic problem. Synthetic fibre shedding during washing generates microplastic pollution that has been detected in Arctic ice, ocean sediment, and human blood. The scale is significant: an estimated 35% of primary microplastics in the ocean come from synthetic textiles. No EU regulation currently limits microplastic shedding from garments, though ESPR delegated acts for textiles may address washing filter requirements at the appliance level.",
    ]),
  },

  'node.yarn-fabric': {
    description: pt([
      "The yarn and fabric stage covers spinning (converting staple fibre or filament into yarn), weaving or weft/warp knitting (producing greige fabric), wet processing (dyeing, bleaching, printing), and finishing (softening, water repellency coatings, antimicrobial treatments). Each sub-stage typically involves distinct actors: yarn spinners, fabric mills, dyehouses, and finishing houses are often separate businesses in a subcontracted chain, with each handoff creating a visibility gap.",
      "The sector is geographically concentrated in South and East Asia: China accounts for roughly 50% of global fabric production; India, Bangladesh, Vietnam, and Turkey make up much of the remainder. Wet processing is the industry's primary water pollution source: dyehouses use approximately 200 litres of water per kilogram of fabric, and an estimated 20% of global industrial freshwater pollution comes from textile dyeing and treatment.",
      "Chemical use is a defining issue at this node. Restricted Substances Lists (RSLs) maintained by brands and the OEKO-TEX STANDARD 100 set limits on hazardous chemical residues in finished fabrics. REACH (the EU's chemical regulation) applies to imports entering the EU market, creating a compliance obligation that falls on the brand or importer rather than the mill itself, but that effectively determines which mills European brands can source from.",
    ]),
    economics: pt([
      "Margins at this stage are thin and contract-dependent. Volume fabric mills in China, India, and Bangladesh compete primarily on price, with gross margins of 5–12%. Specialist mills with proprietary fabric technologies, blended constructions, or recognised certifications (GRS, OEKO-TEX, Bluesign) can extract modest premiums, particularly in the premium and performance apparel segment. Dyehouse operations are energy and chemical-intensive, with margins compressed by commodity chemical pricing and rising energy costs.",
      "DPP will require mills to provide primary sustainability data (fibre composition, chemical inputs, water and energy consumption, and certification status), which creates a new compliance infrastructure cost. This burden falls on the mill, not on the brand that uses the data, and no mechanism in the DPP framework currently compensates mills for the cost of becoming DPP-compliant data providers. Smaller mills, without the IT systems to automate data collection and transfer, face a structural disadvantage.",
    ]),
    tensions: pt([
      "Mills sit between brands demanding more sustainable fabrics and procurement teams that won't pay the premium those fabrics require. A brand may have a stated commitment to Bluesign-certified fabrics while its pricing model makes Bluesign certification economically untenable for most of its Tier 2 mill base. This internal contradiction in brand purchasing is documented but rarely resolved.",
      "The DPP data obligation lands here with significant weight: mills must generate, verify, and transmit traceability records that brands use for their own compliance filings. The cost of creating those records is a new uncompensated obligation on actors operating at very low margins. This creates pressure toward consolidation: large, integrated mill groups with existing data infrastructure will absorb compliance more easily than small single-stage operators.",
      "PFAS (per- and polyfluoroalkyl substances) used in durable water repellency (DWR) coatings represent a specific near-term tension. PFAS are in the process of being broadly restricted under REACH and are already restricted in several EU member state markets. The alternatives (silicon-based and wax-based DWR treatments) underperform on durability, and no broadly adopted replacement technology exists at volume.",
    ]),
  },

  'node.manufacturing': {
    description: pt([
      "Manufacturing covers the cutting, sewing, and assembly of fabric into finished garments. The structure is almost universally subcontracted: brands establish relationships with Tier 1 manufacturers who hold the primary commercial contract, but those Tier 1 suppliers routinely subcontract embroidery, printing, cutting, and finishing to Tier 2, 3, and 4 operators. A brand's stated supplier list may cover 200–400 Tier 1 factories; the full supply chain beneath those factories can involve thousands of additional facilities.",
      "Manufacturing is geographically concentrated in Bangladesh, Cambodia, Vietnam, Myanmar, India, and China, with nearshoring growth in Morocco, Turkey, and Portugal. The Rana Plaza collapse in 2013, which killed 1,138 garment workers in Dhaka, remains the defining reference point for what supply chain invisibility costs at its worst. The industry employs an estimated 75 million people in garment manufacturing globally; the ILO estimates that roughly 85% of garment workers are women.",
      "The audit industry that grew up to address brand supply chain accountability is itself structurally compromised. Social compliance audits are typically announced, short, and conducted by auditors whose fees are paid by the factory being audited. A 2023 analysis of BSCI audit scores in Bangladesh found no correlation between audit results and independently observed labour conditions.",
    ]),
    economics: pt([
      "Manufacturing is the most labour-intensive and structurally lowest-margin stage in the chain. Brands use competitive bidding to compress CMT (cut-make-trim) costs, and the real price-per-piece has declined consistently over two decades. Gross margins for Tier 1 manufacturers range from 8–18%, depending on product complexity, order stability, and geographic location.",
      "The incoming regulatory compliance burden (CSDDD due diligence documentation, DPP primary data provision, and ESPR design-for-repair requirements) falls on an industry segment operating at margins that cannot absorb new uncompensated compliance costs. In practice, brands have historically responded to compliance requirements by adding obligations to supplier contracts without adjusting payment terms.",
    ]),
    tensions: pt([
      "The core structural tension is between brands' sustainability commitments and the pricing model that makes those commitments structurally impossible. A brand can publish a CSRD disclosure describing its supply chain oversight programme while its CMT pricing simultaneously creates conditions (unrealistic lead times, downward price pressure, and order instability) that make meaningful oversight unachievable.",
      "ESPR's repairability requirements, DPP primary data obligations, and CSDDD audit depth all require manufacturer investment that the CMT pricing model does not fund. The structural question is whether CSDDD's legal liability provisions create enough downside risk for brands to change the economic relationship.",
      "Living wage remains the most contested issue at this node. The gap between legal minimum wages and independently calculated living wages in major garment-producing countries is substantial: in Bangladesh, the legal minimum wage was increased to roughly $113/month in 2024 following worker strikes, still estimated to be approximately 40–50% of a living wage by the Asia Floor Wage Alliance.",
    ]),
  },

  'node.brands': {
    description: pt([
      "Brands control the product brief, the supply chain structure, the retail price, and increasingly the direct consumer relationship. They do not manufacture, spin, or grow; they coordinate. This is structurally significant: brands extract the majority of value from the chain while externalising the majority of its environmental and labour costs to nodes upstream. The regulatory system is increasingly designed to close this gap.",
      "The brand universe is structurally varied. Mass-market operators (Inditex, H&M Group, Primark) compete on speed, volume, and price. Premium brands (COS, Arket, Jacquemus) compete on perceived quality. Luxury houses (LVMH group brands, Kering group brands, Hermès) compete on scarcity and brand equity. Each faces the same incoming regulatory framework with very different financial capacity to absorb compliance costs.",
      "The structural shift toward direct-to-consumer (DTC) channels has given brands more supply chain data visibility than the wholesale model provided, but has also increased their EPR exposure: a brand operating its own retail is also operating at the point of sale where DPP display obligations and EPR collection requirements apply.",
    ]),
    economics: pt([
      "Brands capture the majority of value in the fashion chain. Gross margins range from 40–55% at mass market (Inditex consistently publishes ~57%) to 60–75% in the premium segment, to above 70% at luxury. This margin structure makes brands, in principle, the only actors with sufficient capital to invest in supply chain compliance, circular product design, and sustainability data infrastructure. The question is not capacity but prioritisation.",
      "The regulatory cost landing on brands is material but bounded within current margin structures. CSRD sustainability reporting at scale costs an estimated €1–5 million annually in data collection, audit, and disclosure infrastructure for large operators. CSDDD compliance infrastructure requires one-time investment with ongoing audit, grievance mechanism, and supplier development costs.",
    ]),
    tensions: pt([
      "The central structural tension is between volume growth, which remains the primary commercial imperative at most brands, and the regulatory trajectory toward durability, repairability, and circularity, which reduces volume. A brand's CSRD sustainability disclosures can be technically accurate while its commercial model remains structurally dependent on production volumes that the regulatory environment is simultaneously moving to reduce.",
      "ESPR's ban on the destruction of unsold goods targets the excess production model directly: the practice of producing 15–30% more than projected demand and writing off the remainder. ECGT restricts the green claim vocabulary that brands use to manage the reputational risk that excess production creates. CSRD makes the volume-sustainability gap visible in public disclosures for the first time in a standardised, audited format.",
      "Collection take-back programmes (offered by H&M, Zara, and others) represent a case study in the gap between sustainability communication and systemic impact. Independent analysis has consistently found that the volumes collected represent a fraction of annual production, and that a significant share of collected items is not recycled but downcycled or exported.",
    ]),
  },

  'node.retail': {
    description: pt([
      "This node encompasses two interconnected stages: the physical movement of goods from factory to consumer, and the retail channels through which garments are sold for the first time. Logistics covers ocean freight (the dominant mode for finished garment imports from Asia), air freight (used for replenishment speed), warehousing and distribution centre operations, and last-mile parcel delivery to the end customer.",
      "The logistics dimension is underweighted in most industry sustainability discussions, but its emissions are material. Ocean freight from Bangladesh or Vietnam to European ports generates roughly 2–5 kg of CO₂ per kilogram of garment, a Scope 3 Category 4 emission that brands must now account for under CSRD. Air freight, used for fast-fashion replenishment and luxury product delivery, generates approximately 50 times the CO₂ of sea freight per tonne-kilometre.",
      "The distribution of market power in retail has shifted decisively toward online channels over the past decade. Zalando, ASOS, Amazon Fashion, and Tmall collectively represent a disproportionate share of European fashion transaction volume. The structural shift to online has introduced the return rate problem: fashion return rates of 25–40% for online purchases inflate logistics emissions, generate warehouse processing costs, and create waste from items that cannot be economically restocked.",
    ]),
    economics: pt([
      "Logistics costs represent 10–20% of fashion retail prices and are rising. E-commerce growth has increased the per-unit logistics cost relative to physical retail, because individual parcel fulfilment is structurally more expensive than store replenishment. The cost of a fashion return is estimated at €10–20 per item in Europe. Returns are not priced into fashion retail economics; they are absorbed by margin.",
      "Retail margins are thinner than brand margins and under structural pressure. Physical specialty retail operates at gross margins of 30–45%; department stores and wholesale channels are lower. Online marketplaces extract value through listing fees, fulfilment services, advertising, and data, compressing the selling economics for brands while growing as a share of total market.",
      "DPP point-of-sale display requirements add a compliance infrastructure cost (QR code integration into product pages, digital label systems, and data synchronisation with brand DPP systems) that physical and online retailers have not yet priced into their operating models.",
    ]),
    tensions: pt([
      "Marketplaces face a defining structural tension: they benefit from the volume of fast fashion listings while their platforms distance them from the supply chain behind those listings. ECGT's co-liability provisions, which hold marketplace operators responsible for green claims displayed on their platforms, begin to close that gap.",
      "The logistics emissions problem is real but underdiscussed. A brand's Scope 3 Category 4 emissions disclosure under CSRD will make freight mode choices visible in ways they have not been before. The fast fashion model is structurally dependent on the logistics infrastructure that generates the emissions the model is now required to disclose.",
      "The return rate problem is structurally underaddressed by regulation. No EU instrument currently restricts free return policies, despite the documented environmental cost. The economics of online fashion retail are built around free returns as a competitive feature and a conversion mechanism; removing that feature unilaterally creates a measurable conversion disadvantage.",
    ]),
  },

  'node.consumer': {
    description: pt([
      "The consumer node represents the individual at the point of purchase and throughout the use phase. Fashion consumption is driven primarily by price, trend, social context, and convenience, not sustainability signals, and a persistent gap exists between stated consumer preferences for sustainable products and actual purchasing behaviour. Multiple academic studies tracking this intention–action gap find it has not narrowed materially over a decade of growing sustainability awareness.",
      "Consumer behaviour also determines use-phase impacts, which are larger than most consumers estimate. A garment's use phase (laundering, drying, and care over its life) contributes significantly to its total lifetime water consumption and, for synthetic fibres, is the primary source of microplastic release. The estimated average number of times a garment is worn before discard has declined: analysis of H&M Foundation data suggests the global average fell from 200 wears in 2000 to 160 in 2015.",
      "End-of-life consumer decisions determine what re-enters circular pathways. EPR take-back schemes collect garments for sorting and redistribution; their effectiveness depends entirely on consumer participation and on whether the take-back infrastructure is designed as genuine circular input or as marketing cost.",
    ]),
    economics: pt([
      "The consumer has no supply chain economics in the conventional sense; they are the endpoint of value extraction, not a participant in margin distribution. The relevant economic question is how price sensitivity and disposable income interact with sustainability preferences across different consumer segments. Willingness to pay a premium for certified sustainable products is real in luxury, limited in premium, and negligible in volume fashion, where price remains the dominant decision variable.",
      "The growth of the secondary market represents a structural shift in how consumers relate to fashion economics: buying used primarily as a price-efficiency strategy, with sustainability as secondary benefit or post-rationalisation. Resale platforms have made secondhand the price-competitive choice in categories where authentication and platform trust exist (luxury, denim, outerwear), and this is having measurable effects on primary market demand in those categories.",
    ]),
    tensions: pt([
      "The central structural tension is between individual behaviour and systemic constraint. Sustainable consumption is being asked to occur inside a system optimised for volume and frequency, where the cheapest, most convenient, and most trend-responsive option is also the least sustainable. Without structural change in what is produced, what is available, and at what price, the consumer cannot be expected to drive the transition alone.",
      "The DPP transparency premise rests on an assumption that requires scrutiny: that making environmental performance data visible at point of sale will change purchasing decisions at scale. The evidence base for this premise is thin. Consumer-facing eco-labels in food (traffic light nutrition labels, organic certification) have had mixed results in changing behaviour at the population level.",
      "Overwashing is a documented but under-regulated behaviour. Consumers wash fashion items more frequently than care instructions recommend and use higher temperatures, significantly increasing water, energy, and microplastic-release impacts. No regulation currently addresses washing frequency or temperature.",
    ]),
  },

  'node.secondary-market': {
    description: pt([
      "The secondary market covers every channel through which fashion items re-enter circulation after their first retail sale. This includes peer-to-peer resale platforms (Vinted, Depop), curated resale (Vestiaire Collective, The RealReal), brand-operated take-back and resale (Filippa K Second Hand, Patagonia Worn Wear), rental and subscription services (Hurr, By Rotation), repair and alteration services, and the industrial sorter-and-exporter network that handles donated and collected garments at scale.",
      "The node is growing faster than primary fashion retail by transaction volume. The global secondhand apparel market was estimated at $227 billion in 2025 (ThredUp Resale Report 2025) and is projected to reach $350 billion by 2028, with digital platforms driving the majority of new volume. This growth narrative is commercially real, but the profitability narrative in most segments below luxury remains unproven.",
      "Repair represents the highest-value circular intervention (extending garment life is more emissions-efficient than any end-of-life recycling process), but the economics of professional repair are structurally challenging. Labour costs for repair in EU markets exceed the original manufacturing cost of a fast fashion garment, making repair economically irrational for the majority of the wardrobe.",
    ]),
    economics: pt([
      "Margin structure in the secondary market varies sharply by model and price segment. Platform marketplace models (Vinted, Depop) extract a take-rate of 5–15% of transaction value. Managed resale models (Vestiaire Collective, The RealReal) with in-house authentication and fulfilment extract 15–30% take-rates, with higher unit economics but significant fixed cost in authentication and warehousing infrastructure.",
      "The primary cost drivers are: authentication (a fixed per-item labour cost that compresses margin severely at garment price points below €100); individual-item logistics (structurally more expensive than batched new inventory fulfilment); returns and condition disputes; and customer acquisition.",
      "Industrial textile sorting and recycling sits at the low-margin end of the secondary market. Sorters in Eastern Europe and Africa operate on margins of €0.10–0.30 per kilogram. The volume of collected textiles that reaches genuine recycling (fibre-to-fibre, not downcycling) is estimated at less than 1% globally.",
    ]),
    tensions: pt([
      "The core sustainability tension is between the narrative promise (that secondhand is inherently more sustainable than new) and the empirical question of whether secondhand transactions substitute for new purchases or add to total consumption. If a consumer buys three secondhand items instead of one new item they would otherwise have purchased, the net impact may be negative.",
      "A second tension is between growth and economics. The secondary market is growing because consumer appetite is real, but the platforms built to capture that growth have struggled to reach and maintain profitability. Investment in secondary market infrastructure is contracting precisely when EPR and ESPR regulations are creating new demand for that infrastructure.",
      "Brand-operated resale programmes present a specific tension: they can create a secondary market channel for brand products, provide a touchpoint for brand relationship, and generate sustainability credentials, but they require investment in logistics and quality control infrastructure that competes with primary market investment.",
    ]),
  },
}

// ============================================================
// COMPANIES — prose from prefall-prototype lines 3218-3645
// ============================================================
const companyPatches = {
  'company.veja': {
    businessModel: pt([
      "Veja sells sneakers at price points comparable to mainstream premium athletic brands while running a more expensive supply chain by design. It buys organic and fair-trade cotton and wild Amazonian rubber on multi-year contracts at prices set in advance and above market, and manufactures in Brazil under publicly documented conditions.",
      "The defining choice is the elimination of paid advertising and marketing. In athletic footwear that line can run a large share of product cost. Veja redirects that spend into raw materials and production, bringing its total cost base roughly level with competitors that advertise heavily but source conventionally. Distribution leans on wholesale and selective owned retail, including repair and resale services in some stores.",
    ]),
    companySays: pt([
      "Veja describes itself as a project as much as a company, designed from the start around fair pay to producers and lower environmental impact at each stage of production. It frames the no-advertising decision as the mechanism that funds fair prices upstream, and publishes its limitations openly, including conventional dyes within EU REACH compliance, non-proprietary eyelets, and ocean freight from Brazil it has not replaced with a lower-impact alternative.",
    ]),
    prefallAnalysis: pt([
      "Veja is the inverse of the cases Prefall usually examines. Most sustainability propositions struggle because the green choice adds cost the model cannot recover. Veja found one specific place where a large conventional cost can be removed, advertising, and rerouted into the part of the chain that carries the sustainability claim, arriving at a cost base close to conventional competitors. What makes this work is narrow: footwear marketing budgets are unusually large as a share of product cost, which makes the substitution available in this category in a way it is not in most others.",
      "Two conditions hold the model up. First, demand has to be generated without paid media, which Veja has achieved through editorial coverage, retailer placement and design. That is a function of taste and timing that is hard to manufacture and harder to sustain across cycles. Second, the founders have to be willing to cap growth. A no-advertising model loses its cost advantage the moment it has to buy demand to grow, because the redirected budget is finite and the upstream contracts are fixed commitments. The company states it prioritises profitability over scale.",
    ]),
    verifiableSignals: signals([
      ['Scale', '2024: ~€250M turnover, 600+ employees in Europe and Latin America (company statement and GIZ).'],
      ['Profitability', '2018: €33.9M turnover, €4.2M net profit, ~150 employees: evidence the model can be profitable at smaller scale.'],
      ['Distribution', '3.5M+ pairs sold across 2,000+ retailers in ~60 countries.'],
      ['Supply chain', 'Production cost 5–7× conventional competitors at factory stage, offset by zero advertising spend. Multi-year contracts with Brazilian cotton cooperatives and Amazonian rubber associations at above-market prices.'],
      ['Ownership', 'Founder-held. No outside venture or private equity investment disclosed. Prioritises profitability over scale by stated policy.'],
    ]),
    sources: pt([
      'GIZ, "Maximising profit at the expense of everything else is harmful", February 2026',
      'Euromonitor, "Sustainability in Action: Lessons Learnt From the Success of Allbirds and Veja", 2023',
      'Altermaker, "Example of eco-design: Veja sneakers" (2018 financial figures)',
      'Lampoon Magazine, profile of Veja and its founders, updated June 2025',
      'Veja company website, "No ads" and project documentation, accessed May 2026',
      'Statista, Veja brand profile in the United States, May 2024',
    ]),
  },

  'company.vestiaire': {
    businessModel: pt([
      "Asset-light marketplace. Sellers list pre-owned items; the platform takes a commission and a buyer-protection fee; an in-house team authenticates products before dispatch. The company does not produce, own, or hold inventory. Geography: Europe ~70%, US ~20% (following the 2022 Tradesy acquisition), Asia the remainder.",
      "2025 GMV: just under €1 billion. Revenue: ~€200 million. Take rate: low twenties as a percentage of GMV. Gross margin: stated above 50%. Third-party only. Effectively all GMV flows through individual sellers. Positive EBITDA reported in the 2025 year-end shopping season.",
    ]),
    companySays: pt([
      "Presents as the leading global platform for pre-owned premium and luxury fashion and a sustainable alternative to fast fashion. Certified B Corp. Frames authentication capability and curated catalogue as the basis for its commercial position and its sustainability claim.",
    ]),
    prefallAnalysis: pt([
      "The question this company answers is whether resale is a good business. Founded 2009. Raised over $700M USD. Targeting first annual profit in 2026, more than fifteen years after launch. A gross margin above 50% that takes fifteen years to convert to profit isolates a single cost: authentication and trust.",
      "Every additional item is a physical object requiring individual inspection. This cost does not fall with scale the way software cost does. Valuation declined from ~$1.7B USD in 2021 to ~€1–1.1B in 2024. The 2026 profit target is the test: if it slips, the question becomes whether authenticated luxury resale is an inherently thin-margin business needing permanent scale subsidy.",
    ]),
    verifiableSignals: signals([
      ['Funding', 'Total raised: reported above $700M USD. Investors include Eurazeo (~25%), Vitruvian Partners, Condé Nast, Bpifrance, SoftBank (5–10% each), Kering (~5%, since 2021).'],
      ['Valuation', '~$1.7B USD (2021) → ~€1–1.1B (2024). Decline reflects broader correction in consumer marketplace valuations.'],
      ['Scale', '2025 GMV just under €1B; revenue ~€200M; gross margin stated above 50%; ~600 employees, 100+ in product authentication.'],
      ['Acquisition', 'Acquired US resale platform Tradesy, March 2022.'],
      ['Certification', 'Certified B Corp. First full-year profit targeted for 2026 (company statement, not audited).'],
    ]),
    sources: pt([
      'FashionNetwork, February 2026',
      'Modaes Global, February 2026',
      'Just-Style, January 2024',
      'FashionUnited, 2021 and 2023',
      'CB Insights and PitchBook',
      'Vestiaire Collective investor pitch material 2024',
      'Prism News, February 2026',
    ]),
  },

  'company.circulose': {
    businessModel: pt([
      "Circulose recovers cellulose from discarded cotton textiles and production scraps, removes dyes, trims and synthetic content, and processes the material into sheets of pulp that substitute for virgin wood pulp in viscose, lyocell and modal production. Under the original Renewcell model, the pulp was sold into the fibre market and depended on downstream brands and producers choosing to buy it.",
      "After the 2024 relaunch, Altor changed the commercial model. Circulose now operates a split pricing structure that separates the physical cost of the pulp from a licence and service fee. Brands sign volume commitments and pay a licence fee covering integration support, traceability tools and use of the Circulose trademark. The stated purpose is to stop the price premium compounding at each step of the supply chain, which it did under the old model.",
    ]),
    companySays: pt([
      "Circulose positions itself as the only closed-loop recycled textile player at commercial scale, operating the world's first industrial-scale chemical textile-to-textile recycling plant. It states that its pricing model, developed with Canopy and Fashion for Good, removes the price friction that slows adoption of next-generation materials, and that its production restart is aligned with confirmed demand from named brand partners.",
    ]),
    prefallAnalysis: pt([
      "Renewcell is the clearest recent case in fashion of a sustainability proposition that the technology delivered and the economics did not. The plant performed and the material was rated highly, yet the company went bankrupt within roughly 18 months of opening its industrial plant, after producing far below the volume needed to reach breakeven and recording a Q3 2023 net loss of SEK 94.5M on top of a SEK 105.4M loss the quarter before.",
      "The failure sat in the structure of how the material reached a garment. Brands do not buy pulp. The pulp had to pass through fibre producers, spinners, fabric mills and manufacturers before it reached a product, and at each step the recycled input carried a premium over virgin pulp. Renewcell built supply ahead of committed demand and ran out of liquidity before the market organised itself to absorb the volume.",
      "The relaunched model answers that specific failure. By charging brands a corporate-level licence fee separated from the per-unit pulp price, Circulose moves the buying decision up to brand head offices and works to stop the premium compounding downstream. The restart is staged behind volume commitments secured before production resumes, the reverse of the sequence that sank Renewcell. This is the correct lesson drawn from the bankruptcy. Whether it is sufficient remains open: the model now depends on brands honouring multi-year commitments through price and demand cycles, and the original failure included brands that walked away from earlier offtake agreements. The test is the production restart scheduled for Q4 2026.",
    ]),
    verifiableSignals: signals([
      ['Investment', 'Total investment into Renewcell before bankruptcy: ~$140M USD. H&M Group provided ~$29M USD (nearly SEK 300M) over seven years.'],
      ['Bankruptcy', 'Listed on Nasdaq First North, November 2020. Filed for bankruptcy at Stockholm District Court, February 2024.'],
      ['Capacity', 'Sundsvall plant nameplate capacity: ~60,000 tonnes/year. Previously stated 2030 target: 360,000 tonnes.'],
      ['Acquisition', 'Acquired by Altor Equity Partners, June 2024. Altor had recently raised ~€3B for green businesses.'],
      ['Restart', 'Production restart targeted Q4 2026, behind long-term volume commitments from 11 brands including H&M, Mango, M&S, Bestseller, C&A and Reformation.'],
    ]),
    sources: pt([
      'Business of Fashion, "Renewcell Was Poised to Lead Fashion\'s Recycling Revolution. How Did It Fail?", March 2024',
      'Business of Fashion, "Exclusive: Textile Recycler Circulose Is Restarting Its Recycling Plant", March 2026',
      'WWD, "Textile Recycler Renewcell to Declare Bankruptcy", February 2024',
      'WWD, "As Circulose Emerges From Bankruptcy With New Leaders, Its CEO and Chair Unveil Strategy", November 2024',
      'Trellis, "Circular textile phoenix Renewcell is bought out of bankruptcy", June 2024, updated February 2026',
      'Stanford Social Innovation Review, "What Renewcell\'s Former CCO Learned From Bankruptcy", July 2024',
      'Impact Loop, "Altor-backed Circulose lands new deals with fashion brands", December 2025',
      'Circulose company website, FAQ and pricing model, accessed May 2026',
      'Altor Equity Partners, Circulose company page, accessed May 2026',
    ]),
  },
}

// ============================================================
// CSRD prose (the home-featured regulation)
// ============================================================
const csrdPatch = {
  body: pt([
    'The Corporate Sustainability Reporting Directive (CSRD) entered into force in January 2023 as the successor to the Non-Financial Reporting Directive (NFRD). It requires in-scope companies to disclose detailed environmental, social, and governance (ESG) information in their annual management reports, following mandatory European Sustainability Reporting Standards (ESRS). The directive establishes a double materiality requirement, obliging companies to report both on how sustainability issues affect the business financially and on the company\'s own impacts on people and the planet.',
    'Omnibus I (Directive (EU) 2026/470, in force 18 March 2026) significantly restructured the CSRD\'s scope. Omnibus I replaced the original phased architecture with a dual threshold: both more than 1,000 employees AND more than €450 million net turnover must be met simultaneously. A company satisfying only one threshold is now out of scope. Member states have until 19 March 2027 to transpose the amended directive, with first mandatory reports covering financial year 2027 due in 2028.',
  ]),
  whoItAffects: pt([
    'The amended scope targets companies exceeding both thresholds: more than 1,000 employees and more than €450 million net turnover, both conditions required. This means a fashion conglomerate with 2,000 employees but €300 million turnover is now exempt, as is a high-revenue brand that relies on a small direct workforce through outsourced manufacturing. Importantly, the employee count refers to the company itself, not its supply chain workforce. EU-listed SMEs are no longer subject to proportionate CSRD standards under the revised framework.',
    'The directive also applies to non-EU companies with more than €450 million net turnover generated in the EU and at least one EU subsidiary or branch meeting size criteria. Fashion brands headquartered outside the EU, including major US and Asian groups, may still fall within scope if their EU operations are sufficiently large. Most mid-size and independent fashion brands are now exempt from CSRD reporting obligations under the Omnibus revision.',
  ]),
  whatItRequires: pt([
    'For the large fashion groups that remain in scope, CSRD compliance represents a significant operational investment. Producing ESRS-aligned reports requires systematic data collection across owned operations and, depending on materiality assessments, extending data requests to supply chain partners. Consulting, auditing, and software costs for first-cycle reporting have been estimated in the €1 to 5 million range for complex multi-brand groups, with ongoing annual costs lower. The shift to a simplified ESRS standard (due September 2026) will reduce the number of required datapoints by approximately 61%, which narrows costs but does not eliminate the infrastructure investment required.',
    'Beyond direct compliance costs, CSRD shapes financial market dynamics. Major institutional investors and lenders increasingly require ESG data for portfolio assessment and lending decisions. Companies outside the CSRD threshold will face informal pressure to produce equivalent disclosures if they access capital markets, seek acquisition financing, or supply to in-scope retailers who pass data requests down their supply chains. The Omnibus revision narrows mandatory coverage but does not eliminate this commercial transmission effect.',
    'A secondary effect of the Omnibus narrowing is reduced supply chain visibility for the fashion sector overall. Under the original CSRD architecture, value chain reporting obligations would have generated ESG data on mid-tier and smaller suppliers. Under the revised regime, those data flows are substantially curtailed. Regulators and analysts have flagged this as a risk to the EU\'s broader sustainability transition objectives, particularly for biodiversity, water, and labour rights in fashion supply chains where impact is concentrated upstream.',
  ]),
  prefallAnalysis: pt([
    'The Omnibus I amendment is in force as of 18 March 2026. Member states have until 19 March 2027 to transpose the revised thresholds into national law. Companies that had already begun CSRD compliance preparations under the original scope should audit their revised position against the dual threshold before committing further investment. The simplified ESRS delegated act, due by 18 September 2026, will determine the precise content requirements for in-scope reports and is the next key inflection point for corporate sustainability reporting.',
  ]),
  sources: pt([
    'Directive (EU) 2026/470, Official Journal 26 February 2026',
  ]),
}

// ============================================================
// Apply all patches via transaction
// ============================================================
async function patchAll() {
  const tx = client.transaction()
  let count = 0

  for (const [id, fields] of Object.entries(nodePatches)) {
    tx.patch(id, {set: fields})
    count++
  }
  for (const [id, fields] of Object.entries(companyPatches)) {
    tx.patch(id, {set: fields})
    count++
  }
  tx.patch('regulation.csrd', {set: csrdPatch})
  count++

  await tx.commit()
  console.log(`✓ Patched ${count} documents with prose content.`)
}

patchAll().catch((err) => {
  console.error('Patch failed:', err.message)
  if (err.response?.body) console.error(err.response.body)
  process.exit(1)
})
