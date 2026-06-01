/**
 * Verbatim node prose from prefall-prototype 1.html (NODE_DETAIL object,
 * lines 5862-6032 + vc-node__desc text on lines 4790-4796). Patches all
 * 7 nodes with:
 *   • shortBlurb   (one-line summary under the node name on the lifecycle map)
 *   • heroSummary  (the longer paragraph shown on the node detail page)
 *   • description  (the "What happens here" body)
 *   • economics    (the "The economics" body)
 *   • tensions     (the "Tensions" body)
 *
 * Idempotent — overwrites every field this script touches. Run:
 *   node --env-file=.env.local scripts/seed-nodes-full.mjs
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

function pt(paragraphs) {
  return paragraphs.map((text) => ({
    _type: 'block',
    _key: rand(),
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: rand(), text, marks: []}],
  }))
}

const N = {}

// ── 01 Raw Materials ───────────────────────────────────────────────────────
N['node.raw-materials'] = {
  shortBlurb:
    "Cotton, wool, and synthetic fibres. The chain's biggest environmental cost, the smallest direct regulatory footprint.",
  heroSummary:
    "Cotton, wool, and synthetic fibres. The chain's largest environmental footprint (water, land, and upstream emissions) concentrated in actors who carry the smallest direct regulatory obligation.",
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
    "The sustainability burden (water, land, and upstream emissions) concentrates here, but the financial incentive to change does not. Regulation arrives indirectly: brands are obligated under CSDDD and EUDR to audit their supply chains, which creates data requests and audit pressure on raw material suppliers without compensating them for the cost of compliance. A cotton farmer asked to provide traceability data for a brand's CSRD disclosure does not receive a share of the compliance value that disclosure creates for the brand.",
    "The market premium for certified sustainable fibres has not historically been passed back to the farm or mill. The gap between the certified-sustainable product retail price and the farm-gate price for certified cotton has been documented consistently over two decades of certification programme growth. Whether DPP and CSRD reporting requirements change that dynamic (by making ingredient provenance visible to consumers and institutional buyers) is the open structural question that no current regulation resolves.",
    "A third tension sits in the microplastic problem. Synthetic fibre shedding during washing generates microplastic pollution that has been detected in Arctic ice, ocean sediment, and human blood. The scale is significant: an estimated 35% of primary microplastics in the ocean come from synthetic textiles. No EU regulation currently limits microplastic shedding from garments, though ESPR delegated acts for textiles may address washing filter requirements at the appliance level.",
  ]),
}

// ── 02 Yarn & Fabric ───────────────────────────────────────────────────────
N['node.yarn-fabric'] = {
  shortBlurb:
    'Spinning, weaving, dyeing. Where raw fibre becomes usable material — and where water pollution concentrates.',
  heroSummary:
    "Spinning, weaving, dyeing, and finishing. Where raw fibre becomes usable material, and where the industry's chemical pollution and water contamination problems concentrate.",
  description: pt([
    "The yarn and fabric stage covers spinning (converting staple fibre or filament into yarn), weaving or weft/warp knitting (producing greige fabric), wet processing (dyeing, bleaching, printing), and finishing (softening, water repellency coatings, antimicrobial treatments). Each sub-stage typically involves distinct actors: yarn spinners, fabric mills, dyehouses, and finishing houses are often separate businesses in a subcontracted chain, with each handoff creating a visibility gap.",
    "The sector is geographically concentrated in South and East Asia: China accounts for roughly 50% of global fabric production; India, Bangladesh, Vietnam, and Turkey make up much of the remainder. Wet processing is the industry's primary water pollution source: dyehouses use approximately 200 litres of water per kilogram of fabric, and an estimated 20% of global industrial freshwater pollution comes from textile dyeing and treatment. The discharge often contains heavy metals, azo dyes, and finishing chemicals, a significant proportion of which are restricted under REACH but unevenly enforced in producing countries.",
    "Chemical use is a defining issue at this node. Restricted Substances Lists (RSLs) maintained by brands and the OEKO-TEX STANDARD 100 set limits on hazardous chemical residues in finished fabrics. REACH (the EU's chemical regulation) applies to imports entering the EU market, creating a compliance obligation that falls on the brand or importer rather than the mill itself, but that effectively determines which mills European brands can source from.",
  ]),
  economics: pt([
    "Margins at this stage are thin and contract-dependent. Volume fabric mills in China, India, and Bangladesh compete primarily on price, with gross margins of 5–12%. Specialist mills with proprietary fabric technologies, blended constructions, or recognised certifications (GRS, OEKO-TEX, Bluesign) can extract modest premiums, particularly in the premium and performance apparel segment. Dyehouse operations are energy and chemical-intensive, with margins compressed by commodity chemical pricing and rising energy costs.",
    "DPP will require mills to provide primary sustainability data (fibre composition, chemical inputs, water and energy consumption, and certification status), which creates a new compliance infrastructure cost. This burden falls on the mill, not on the brand that uses the data, and no mechanism in the DPP framework currently compensates mills for the cost of becoming DPP-compliant data providers. Smaller mills, without the IT systems to automate data collection and transfer, face a structural disadvantage.",
  ]),
  tensions: pt([
    "Mills sit between brands demanding more sustainable fabrics and procurement teams that won't pay the premium those fabrics require. A brand may have a stated commitment to Bluesign-certified fabrics while its pricing model makes Bluesign certification economically untenable for most of its Tier 2 mill base. This internal contradiction in brand purchasing is documented but rarely resolved.",
    "The DPP data obligation lands here with significant weight: mills must generate, verify, and transmit traceability records that brands use for their own compliance filings. The cost of creating those records (data collection systems, third-party verification, and format compliance) is a new uncompensated obligation on actors operating at very low margins. This creates pressure toward consolidation: large, integrated mill groups with existing data infrastructure will absorb compliance more easily than small single-stage operators.",
    "PFAS (per- and polyfluoroalkyl substances) used in durable water repellency (DWR) coatings represent a specific near-term tension. PFAS are in the process of being broadly restricted under REACH and are already restricted in several EU member state markets. The alternatives (silicon-based and wax-based DWR treatments) underperform on durability, and no broadly adopted replacement technology exists at volume. Brands with outdoor and performance product lines face a reformulation challenge without a clear technical solution.",
  ]),
}

// ── 03 Manufacturing ───────────────────────────────────────────────────────
N['node.manufacturing'] = {
  shortBlurb:
    'The cut-make-trim supply chain. Multi-tier, mostly subcontracted, most visibility gaps, most compliance risk.',
  heroSummary:
    "The cut-make-trim supply chain. Multi-tier, mostly subcontracted, predominantly located in Asia, where most of the industry's labour rights violations and supply chain visibility gaps concentrate.",
  description: pt([
    "Manufacturing covers the cutting, sewing, and assembly of fabric into finished garments. The structure is almost universally subcontracted: brands establish relationships with Tier 1 manufacturers who hold the primary commercial contract, but those Tier 1 suppliers routinely subcontract embroidery, printing, cutting, and finishing to Tier 2, 3, and 4 operators. A brand's stated supplier list may cover 200–400 Tier 1 factories; the full supply chain beneath those factories can involve thousands of additional facilities, most of which the brand has never audited and some of which it does not know exist.",
    "Manufacturing is geographically concentrated in Bangladesh, Cambodia, Vietnam, Myanmar, India, and China, with nearshoring growth in Morocco, Turkey, and Portugal (driven partly by speed, partly by regulatory risk management). The Rana Plaza collapse in 2013, which killed 1,138 garment workers in Dhaka, remains the defining reference point for what supply chain invisibility costs at its worst. The industry employs an estimated 75 million people in garment manufacturing globally; the ILO estimates that roughly 85% of garment workers are women, concentrated in countries where labour protections are structurally weaker than in brand headquarter markets.",
    "The audit industry that grew up to address brand supply chain accountability is itself structurally compromised. Social compliance audits are typically announced, short, and conducted by auditors whose fees are paid by the factory being audited. A 2023 analysis of BSCI audit scores in Bangladesh found no correlation between audit results and independently observed labour conditions. CSDDD's due diligence framework requires brands to go beyond audit-as-compliance, but the alternatives (worker grievance mechanisms, corrective action processes, supplier capability building) require time and investment that procurement cycles rarely accommodate.",
  ]),
  economics: pt([
    "Manufacturing is the most labour-intensive and structurally lowest-margin stage in the chain. Brands use competitive bidding to compress CMT (cut-make-trim) costs, and the real price-per-piece has declined consistently over two decades. Gross margins for Tier 1 manufacturers range from 8–18%, depending on product complexity, order stability, and geographic location. Factories in Bangladesh operate at the lower end of this range; Turkish and Portuguese manufacturers at the higher end, reflecting wage differentials.",
    "The incoming regulatory compliance burden (CSDDD due diligence documentation, DPP primary data provision, and ESPR design-for-repair requirements) falls on an industry segment operating at margins that cannot absorb new uncompensated compliance costs. In practice, brands have historically responded to compliance requirements by adding obligations to supplier contracts without adjusting payment terms. Whether CSDDD's more substantive due diligence requirements change this dynamic depends on enforcement rigour that has not yet been demonstrated.",
  ]),
  tensions: pt([
    "The core structural tension is between brands' sustainability commitments and the pricing model that makes those commitments structurally impossible. A brand can publish a CSRD disclosure describing its supply chain oversight programme while its CMT pricing simultaneously creates conditions (unrealistic lead times, downward price pressure, and order instability) that make meaningful oversight unachievable. The tension is not primarily between sustainability and profitability; it is between the sustainability communication and the procurement reality.",
    "ESPR's repairability requirements, DPP primary data obligations, and CSDDD audit depth all require manufacturer investment (in design capability, data management infrastructure, and remediation processes) that the CMT pricing model does not fund. The structural question is whether CSDDD's legal liability provisions create enough downside risk for brands to change the economic relationship, or whether brands find ways to discharge compliance requirements (documentation, contractual representations) without changing the underlying commercial terms.",
    "Living wage remains the most contested issue at this node. The gap between legal minimum wages and independently calculated living wages in major garment-producing countries is substantial: in Bangladesh, the legal minimum wage was increased to roughly $113/month in 2024 following worker strikes, still estimated to be approximately 40–50% of a living wage by the Asia Floor Wage Alliance. No EU regulation currently creates a binding living wage requirement in fashion supply chains, though CSDDD's human rights due diligence framework requires brands to identify and address severe human rights impacts, of which wage levels are one.",
  ]),
}

// ── 04 Brands ──────────────────────────────────────────────────────────────
N['node.brands'] = {
  shortBlurb:
    'Where the product brief is set and the regulatory obligation lands. The highest-margin, highest-obligation node.',
  heroSummary:
    'Where the product brief is set and the regulatory obligation lands. The highest-margin, highest-obligation node, and the actor whose strategic choices determine whether the sustainability logic of the chain holds.',
  description: pt([
    "Brands control the product brief, the supply chain structure, the retail price, and increasingly the direct consumer relationship. They do not manufacture, spin, or grow; they coordinate. This is structurally significant: brands extract the majority of value from the chain while externalising the majority of its environmental and labour costs to nodes upstream. The regulatory system is increasingly designed to close this gap. CSRD, CSDDD, DPP, ECGT, and ESPR all designate the brand as the primary obligated actor precisely because it is the first point of market entry and the entity with both the margin and the market power to force change upstream.",
    "The brand universe is structurally varied. Mass-market operators (Inditex, H&M Group, Primark) compete on speed, volume, and price; their sustainability challenge is primarily operational scale. Premium brands (COS, Arket, Jacquemus) compete on perceived quality; their challenge is substantiating the sustainability premium embedded in their positioning. Luxury houses (LVMH group brands, Kering group brands, Hermès) compete on scarcity and brand equity; their challenge is maintaining the exclusivity narrative while meeting transparency obligations that apply uniformly. Each faces the same incoming regulatory framework with very different financial capacity to absorb compliance costs.",
    "The structural shift toward direct-to-consumer (DTC) channels, specifically own e-commerce and own retail stores, has given brands more supply chain data visibility than the wholesale model provided, but has also increased their EPR exposure: a brand operating its own retail is also operating at the point of sale where DPP display obligations and EPR collection requirements apply.",
  ]),
  economics: pt([
    "Brands capture the majority of value in the fashion chain. Gross margins range from 40–55% at mass market (Inditex consistently publishes ~57%) to 60–75% in the premium segment, to above 70% at luxury. This margin structure makes brands, in principle, the only actors with sufficient capital to invest in supply chain compliance, circular product design, and sustainability data infrastructure. The question is not capacity but prioritisation.",
    "The regulatory cost landing on brands is material but bounded within current margin structures. CSRD sustainability reporting at scale costs an estimated €1–5 million annually in data collection, audit, and disclosure infrastructure for large operators. CSDDD compliance infrastructure requires one-time investment with ongoing audit, grievance mechanism, and supplier development costs. DPP is primarily a product data management transformation, not a manufacturing cost. None of these individually threatens the margin structure, but together they compete with capital allocated to marketing, growth, and product development.",
  ]),
  tensions: pt([
    "The central structural tension is between volume growth, which remains the primary commercial imperative at most brands, and the regulatory trajectory toward durability, repairability, and circularity, which reduces volume. A brand's CSRD sustainability disclosures can be technically accurate while its commercial model remains structurally dependent on production volumes that the regulatory environment is simultaneously moving to reduce.",
    'ESPR\'s ban on the destruction of unsold goods targets the excess production model directly: the practice of producing 15–30% more than projected demand and writing off the remainder. ECGT restricts the green claim vocabulary that brands use to manage the reputational risk that excess production creates: brands cannot claim garments are "made with sustainable materials" or that collections are "conscious" without substantiated, quantified evidence. CSRD makes the volume-sustainability gap visible in public disclosures for the first time in a standardised, audited format.',
    "Collection take-back programmes (offered by H&M, Zara, and others) represent a case study in the gap between sustainability communication and systemic impact. Independent analysis has consistently found that the volumes collected represent a fraction of annual production, and that a significant share of collected items is not recycled but downcycled or exported. These programmes are not fraudulent, but they function more as brand equity investment than as circular infrastructure.",
  ]),
}

// ── 05 Logistics & Retail ──────────────────────────────────────────────────
N['node.retail'] = {
  shortBlurb:
    'Physical and digital channels to the first buyer. DPP display requirements and EPR collection duties land here.',
  heroSummary:
    'Freight, warehousing, and the channels to the first buyer. Logistics generates significant Scope 3 emissions that CSRD now makes visible; retail carries DPP display obligations, EPR collection duties, and an unresolved return-rate problem.',
  description: pt([
    "This node encompasses two interconnected stages: the physical movement of goods from factory to consumer, and the retail channels through which garments are sold for the first time. Logistics covers ocean freight (the dominant mode for finished garment imports from Asia), air freight (used for replenishment speed), warehousing and distribution centre operations, and last-mile parcel delivery to the end customer. Retail covers physical stores (department stores, specialty chains, boutiques), online marketplaces, direct-to-consumer brand channels, and wholesale distribution to multi-brand retailers.",
    "The logistics dimension is underweighted in most industry sustainability discussions, but its emissions are material. Ocean freight from Bangladesh or Vietnam to European ports generates roughly 2–5 kg of CO₂ per kilogram of garment, a Scope 3 Category 4 (upstream transportation) emission that brands must now account for under CSRD. Air freight, used for fast-fashion replenishment and luxury product delivery, generates approximately 50 times the CO₂ of sea freight per tonne-kilometre. Last-mile delivery (the van or courier step from distribution centre to doorstep) is the fastest-growing logistics emissions category as e-commerce share increases.",
    "The distribution of market power in retail has shifted decisively toward online channels over the past decade. Zalando, ASOS, Amazon Fashion, and Tmall collectively represent a disproportionate share of European fashion transaction volume. The structural shift to online has introduced the return rate problem: fashion return rates of 25–40% for online purchases inflate logistics emissions from reverse logistics, generate warehouse processing costs, and create waste from items that cannot be economically restocked after return. This is a structural cost that the marketplace model externalises to brands and the environment.",
  ]),
  economics: pt([
    "Logistics costs represent 10–20% of fashion retail prices and are rising. E-commerce growth has increased the per-unit logistics cost relative to physical retail, because individual parcel fulfilment is structurally more expensive than store replenishment. The cost of a fashion return (reverse logistics, inspection, repackaging, restocking, and a significant disposal rate for items that cannot be resold) is estimated at €10–20 per item in Europe. Returns are not priced into fashion retail economics; they are absorbed by margin.",
    "Retail margins are thinner than brand margins and under structural pressure. Physical specialty retail operates at gross margins of 30–45%; department stores and wholesale channels are lower. Online marketplaces extract value through listing fees, fulfilment services, advertising (sponsored placements are a significant revenue line for Zalando and Amazon), and data, compressing the selling economics for brands while growing as a share of total market.",
    "DPP point-of-sale display requirements add a compliance infrastructure cost (QR code integration into product pages, digital label systems, and data synchronisation with brand DPP systems) that physical and online retailers have not yet priced into their operating models. EU Textile EPR will require retailers to operate or fund garment take-back infrastructure, a cost that depends on final EPR scheme design decisions not yet confirmed.",
  ]),
  tensions: pt([
    "Marketplaces face a defining structural tension: they benefit from the volume of fast fashion listings (transaction revenue, logistics income, and advertising spend) while their platforms distance them from the supply chain behind those listings. ECGT's co-liability provisions, which hold marketplace operators responsible for green claims displayed on their platforms, begin to close that gap. DPP's point-of-sale display requirement means marketplace product pages must carry passport data, connecting the platform to the brand's sustainability claims in a concrete, auditable way.",
    "The logistics emissions problem is real but underdiscussed. A brand's Scope 3 Category 4 emissions disclosure under CSRD will make freight mode choices visible in ways they have not been before. The fast fashion model (weekly drops, small-batch production, and global sourcing) is structurally dependent on the logistics infrastructure that generates the emissions the model is now required to disclose. Whether CSRD disclosure changes sourcing and logistics strategy depends on whether institutional investors and procurement counterparties use the disclosed data as a decision variable.",
    "The return rate problem is structurally underaddressed by regulation. No EU instrument currently restricts free return policies, despite the documented environmental cost. The economics of online fashion retail are built around free returns as a competitive feature and a conversion mechanism; removing that feature unilaterally creates a measurable conversion disadvantage. Several brands (Zara, H&M) have introduced return fees on some channels, but adoption is partial. This is a market failure (where the correct solution requires coordinated action that individual actors cannot lead) that EU regulation has not yet addressed.",
  ]),
}

// ── 06 Consumer ────────────────────────────────────────────────────────────
N['node.consumer'] = {
  shortBlurb:
    'The end-user: the only actor whose behaviour determines whether the sustainability logic of the chain closes.',
  heroSummary:
    'The end-user: the only actor whose behaviour determines whether the sustainability logic of the chain closes. Shaped by price, availability, and social context, not primarily by sustainability signals.',
  description: pt([
    "The consumer node represents the individual at the point of purchase and throughout the use phase. Fashion consumption is driven primarily by price, trend, social context, and convenience, not sustainability signals, and a persistent gap exists between stated consumer preferences for sustainable products and actual purchasing behaviour. Multiple academic studies tracking this intention–action gap find it has not narrowed materially over a decade of growing sustainability awareness. That gap is well-documented; the policy question is whether structured disclosure (making the environmental cost of a garment visible at the point of purchase through the Digital Product Passport) can begin to close it, or whether structural change in what is available and how it is priced is the necessary precondition.",
    "Consumer behaviour also determines use-phase impacts, which are larger than most consumers estimate. A garment's use phase (laundering, drying, and care over its life) contributes significantly to its total lifetime water consumption and, for synthetic fibres, is the primary source of microplastic release. The estimated average number of times a garment is worn before discard has declined: analysis of H&M Foundation data suggests the global average fell from 200 wears in 2000 to 160 in 2015, driven by fast fashion price dynamics and accelerated trend cycles. How long items are kept and how they are cared for are the two highest-leverage variables at this node.",
    "End-of-life consumer decisions determine what re-enters circular pathways. EPR take-back schemes collect garments for sorting and redistribution; their effectiveness depends entirely on consumer participation and on whether the take-back infrastructure is designed as genuine circular input or as marketing cost. The sorting and redistribution infrastructure that handles collected garments is a separate industrial challenge addressed under the Secondary Market node.",
  ]),
  economics: pt([
    "The consumer has no supply chain economics in the conventional sense; they are the endpoint of value extraction, not a participant in margin distribution. The relevant economic question is how price sensitivity and disposable income interact with sustainability preferences across different consumer segments. The current evidence: willingness to pay a premium for certified sustainable products is real in luxury (sustainability as quality signal), limited in premium, and negligible in volume fashion, where price remains the dominant decision variable.",
    "The growth of the secondary market represents a structural shift in how consumers relate to fashion economics: buying used primarily as a price-efficiency strategy, with sustainability as secondary benefit or post-rationalisation. Resale platforms have made secondhand the price-competitive choice in categories where authentication and platform trust exist (luxury, denim, outerwear), and this is having measurable effects on primary market demand in those categories. McKinsey's State of Fashion reports have noted secondhand growth compressing new purchase volumes in the €100–500 garment segment since 2021.",
  ]),
  tensions: pt([
    "The central structural tension is between individual behaviour and systemic constraint. Sustainable consumption is being asked to occur inside a system optimised for volume and frequency, where the cheapest, most convenient, and most trend-responsive option is also the least sustainable. Without structural change in what is produced, what is available, and at what price, the consumer cannot be expected to drive the transition alone. Blaming individual consumer behaviour for an industry structure that makes sustainable choices more expensive and less convenient is a moral framework that lets the structural actors off the hook.",
    "The DPP transparency premise rests on an assumption that requires scrutiny: that making environmental performance data visible at point of sale will change purchasing decisions at scale. The evidence base for this premise is thin. Consumer-facing eco-labels in food (traffic light nutrition labels, organic certification) have had mixed results in changing behaviour at the population level. Fashion sustainability information at point of sale faces an additional challenge: the information must be both legible and affectively relevant to a consumer making a decision primarily on aesthetic and price grounds. DPP interface design will be critical to whether the data functions as a genuine decision signal or as compliance noise.",
    "Overwashing is a documented but under-regulated behaviour. Consumers wash fashion items more frequently than care instructions recommend and use higher temperatures, significantly increasing water, energy, and microplastic-release impacts. No regulation currently addresses washing frequency or temperature, though ESPR delegated acts may address appliance-level microfibre filtration requirements.",
  ]),
}

// ── 07 Secondary Market ────────────────────────────────────────────────────
N['node.secondary-market'] = {
  shortBlurb:
    'Resale, rental, repair. The fastest-growing segment by transaction volume, and the hardest to make profitable.',
  heroSummary:
    'Resale, rental, repair, and recycling: the end-of-life infrastructure for fashion. The fastest-growing segment by transaction volume, but with unit economics that are structurally difficult below luxury price points.',
  description: pt([
    "The secondary market covers every channel through which fashion items re-enter circulation after their first retail sale. This includes peer-to-peer resale platforms (Vinted, Depop), curated resale (Vestiaire Collective, The RealReal), brand-operated take-back and resale (Filippa K Second Hand, Patagonia Worn Wear), rental and subscription services (Hurr, By Rotation), repair and alteration services, and the industrial sorter-and-exporter network that handles donated and collected garments at scale.",
    "The node is growing faster than primary fashion retail by transaction volume. The global secondhand apparel market was estimated at $227 billion in 2025 (ThredUp Resale Report 2025) and is projected to reach $350 billion by 2028, with digital platforms driving the majority of new volume. This growth narrative is commercially real (peer-to-peer volume is measurable and accelerating), but the profitability narrative in most segments below luxury remains unproven and has disappointed investors in a series of high-profile platform recapitalisations and model pivots since 2022.",
    "Repair represents the highest-value circular intervention (extending garment life is more emissions-efficient than any end-of-life recycling process), but the economics of professional repair are structurally challenging. Labour costs for repair in EU markets exceed the original manufacturing cost of a fast fashion garment, making repair economically irrational for the majority of the wardrobe. ESPR's right-to-repair obligations require brands and retailers to provide repair services and spare parts information for products in scope, but the pricing challenge of making repair cost-competitive with replacement is not addressed by the regulatory framework.",
  ]),
  economics: pt([
    "Margin structure in the secondary market varies sharply by model and price segment. Platform marketplace models (Vinted, Depop) extract a take-rate of 5–15% of transaction value, rates that have enabled volume growth but generated persistent operating losses. Managed resale models (Vestiaire Collective, The RealReal) with in-house authentication and fulfilment extract 15–30% take-rates, with higher unit economics but significant fixed cost in authentication and warehousing infrastructure. Platform profitability at scale has been demonstrated only in the volume peer-to-peer segment (Vinted reported operating profitability in 2023) and the high-end authenticated segment.",
    "The primary cost drivers are: authentication (a fixed per-item labour cost that compresses margin severely at garment price points below €100); individual-item logistics (structurally more expensive than batched new inventory fulfilment); returns and condition disputes; and customer acquisition. The secondary market has high customer acquisition costs because it requires building trust in condition, authenticity, and fulfilment standards, infrastructure that primary retail does not need to build from scratch.",
    "Industrial textile sorting and recycling sits at the low-margin end of the secondary market. Sorters in Eastern Europe and Africa (Kantamanto in Accra, Ghana is the largest secondhand market in the world) operate on margins of €0.10–0.30 per kilogram. The volume of collected textiles that reaches genuine recycling (fibre-to-fibre, not downcycling) is estimated at less than 1% globally: a structural gap between the volume of EPR collection and the availability of recycling infrastructure that the EU's Extended Producer Responsibility framework must create incentives to close.",
  ]),
  tensions: pt([
    "The core sustainability tension is between the narrative promise (that secondhand is inherently more sustainable than new) and the empirical question of whether secondhand transactions substitute for new purchases or add to total consumption. If a consumer buys three secondhand items instead of one new item they would otherwise have purchased, the net impact may be negative. The substitution hypothesis is foundational to secondhand sustainability claims, and the evidence on it is genuinely mixed. It varies significantly by income level, product category, and resale price relative to new.",
    "A second tension is between growth and economics. The secondary market is growing because consumer appetite is real, but the platforms built to capture that growth have struggled to reach and maintain profitability. The venture-backed growth model applied to resale platforms (prioritise volume over unit economics, then scale into profitability) has worked in volume peer-to-peer (Vinted) but failed in the managed resale model for most operators below luxury authentication level. Investment in secondary market infrastructure is contracting precisely when EPR and ESPR regulations are creating new demand for that infrastructure.",
    "Brand-operated resale programmes present a specific tension: they can create a secondary market channel for brand products (capturing value that would otherwise flow to platforms), provide a touchpoint for brand relationship, and generate sustainability credentials, but they require investment in logistics and quality control infrastructure that competes with primary market investment. The brands that have launched resale programmes (Eileen Fisher Renew, Patagonia Worn Wear, Mulberry Exchange) have found that the resale business is more complex and less margin-accretive than the primary business, and several programmes launched between 2020–2023 have been scaled back.",
  ]),
}

async function main() {
  const tx = client.transaction()
  let count = 0
  for (const [id, fields] of Object.entries(N)) {
    tx.patch(id, {set: fields})
    count++
  }
  await tx.commit()
  console.log(`✓ Patched ${count} nodes with verbatim prototype prose.`)
}

main().catch((err) => {
  console.error(err?.response?.body ?? err)
  process.exit(1)
})
