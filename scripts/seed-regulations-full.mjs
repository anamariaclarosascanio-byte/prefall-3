/**
 * Verbatim regulation prose from prefall-prototype 1.html (lines 3810-4661).
 * Patches all 14 regulations with:
 *   • shortSummary  (detail-header__summary text)
 *   • body          ("What it is")
 *   • whoItAffects  ("Who it affects")
 *   • whatItRequires("Key economic implications")
 *   • prefallAnalysis ("Where things stand")
 *   • sources       (Official sources)
 *
 * Idempotent. Run:
 *   node --env-file=.env.local scripts/seed-regulations-full.mjs
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

// Bulleted Portable Text — used for sources.
function bullets(items) {
  return items.map((text) => ({
    _type: 'block',
    _key: rand(),
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [{_type: 'span', _key: rand(), text, marks: []}],
  }))
}

// ============================================================
// 14 regulations — keyed by Sanity _id
// ============================================================
const R = {}

R['regulation.csrd'] = {
  shortSummary:
    'Requires large companies to disclose ESG information in annual management reports. Omnibus I (March 2026) narrowed the scope to companies meeting both the 1,000-employee and €450M turnover thresholds simultaneously. First mandatory reports cover FY2027, due in 2028.',
  body: pt([
    "The Corporate Sustainability Reporting Directive (CSRD) entered into force in January 2023 as the successor to the Non-Financial Reporting Directive (NFRD). It requires in-scope companies to disclose detailed environmental, social, and governance (ESG) information in their annual management reports, following mandatory European Sustainability Reporting Standards (ESRS). The directive establishes a double materiality requirement, obliging companies to report both on how sustainability issues affect the business financially and on the company's own impacts on people and the planet.",
    "Omnibus I (Directive (EU) 2026/470, in force 18 March 2026) significantly restructured the CSRD's scope. Omnibus I replaced the original phased architecture with a dual threshold: both more than 1,000 employees AND more than €450 million net turnover must be met simultaneously. A company satisfying only one threshold is now out of scope. Member states have until 19 March 2027 to transpose the amended directive, with first mandatory reports covering financial year 2027 due in 2028.",
  ]),
  whoItAffects: pt([
    'The amended scope targets companies exceeding both thresholds: more than 1,000 employees and more than €450 million net turnover, both conditions required. This means a fashion conglomerate with 2,000 employees but €300 million turnover is now exempt, as is a high-revenue brand that relies on a small direct workforce through outsourced manufacturing. Importantly, the employee count refers to the company itself, not its supply chain workforce. EU-listed SMEs are no longer subject to proportionate CSRD standards under the revised framework.',
    'The directive also applies to non-EU companies with more than €450 million net turnover generated in the EU and at least one EU subsidiary or branch meeting size criteria. Fashion brands headquartered outside the EU, including major US and Asian groups, may still fall within scope if their EU operations are sufficiently large. Most mid-size and independent fashion brands are now exempt from CSRD reporting obligations under the Omnibus revision.',
  ]),
  whatItRequires: pt([
    'For the large fashion groups that remain in scope, CSRD compliance represents a significant operational investment. Producing ESRS-aligned reports requires systematic data collection across owned operations and, depending on materiality assessments, extending data requests to supply chain partners. Consulting, auditing, and software costs for first-cycle reporting have been estimated in the €1 to 5 million range for complex multi-brand groups, with ongoing annual costs lower. The shift to a simplified ESRS standard (due September 2026) will reduce the number of required datapoints by approximately 61%, which narrows costs but does not eliminate the infrastructure investment required.',
    'Beyond direct compliance costs, CSRD shapes financial market dynamics. Major institutional investors and lenders increasingly require ESG data for portfolio assessment and lending decisions. Companies outside the CSRD threshold will face informal pressure to produce equivalent disclosures if they access capital markets, seek acquisition financing, or supply to in-scope retailers who pass data requests down their supply chains. The Omnibus revision narrows mandatory coverage but does not eliminate this commercial transmission effect.',
    "A secondary effect of the Omnibus narrowing is reduced supply chain visibility for the fashion sector overall. Under the original CSRD architecture, value chain reporting obligations would have generated ESG data on mid-tier and smaller suppliers. Under the revised regime, those data flows are substantially curtailed. Regulators and analysts have flagged this as a risk to the EU's broader sustainability transition objectives, particularly for biodiversity, water, and labour rights in fashion supply chains where impact is concentrated upstream.",
  ]),
  prefallAnalysis: pt([
    'The Omnibus I amendment is in force as of 18 March 2026. Member states have until 19 March 2027 to transpose the revised thresholds into national law. Companies that had already begun CSRD compliance preparations under the original scope should audit their revised position against the dual threshold before committing further investment. The simplified ESRS delegated act, due by 18 September 2026, will determine the precise content requirements for in-scope reports and is the next key inflection point for corporate sustainability reporting.',
  ]),
  sources: bullets([
    'Directive (EU) 2026/470, Official Journal 26 February 2026 — https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202600470',
  ]),
}

R['regulation.esrs'] = {
  shortSummary:
    'The mandatory reporting framework that operationalises CSRD. A simplified version, reducing required datapoints by 61%, must be adopted by delegated act by 18 September 2026. First reporting under the simplified standard: 2028.',
  body: pt([
    'The European Sustainability Reporting Standards (ESRS) are the mandatory reporting framework that operationalises CSRD. They define precisely what companies must disclose, covering climate, pollution, water, biodiversity, workforce conditions, human rights, and governance, and specify the format, calculation methodology, and audit trail required for each datapoint. The first set of ESRS standards (ESRS Set 1) was adopted as a Commission delegated act in July 2023 and covered the full universe of topics that could be material to a company.',
    'A simplified version of the ESRS is now required under the Omnibus I amendment to the CSRD. The Commission must adopt this simplified delegated act by 18 September 2026. The revised standard eliminates all voluntary disclosure options and reduces the total number of required datapoints by approximately 61% relative to ESRS Set 1. The simplified ESRS will become the operative standard for the first wave of CSRD-mandatory reporters, meaning ESRS Set 1, while technically in force, will not be enforced as written for any company in the initial reporting cycle.',
  ]),
  whoItAffects: pt([
    'Every company subject to CSRD reporting obligations will produce reports structured under the simplified ESRS. Because all CSRD reporters are now subject to the same standard, the simplified ESRS is effectively the only operative ESRS framework for mandatory reporters. Auditors and assurance providers credentialing their practices to CSRD reporting must track the simplified standards, which will differ materially from the training and tooling built around ESRS Set 1.',
    'The simplified ESRS will also affect the voluntary reporting market. Non-CSRD companies, including many mid-size fashion brands, that wish to produce ESG disclosures aligned with EU regulatory expectations will calibrate against the simplified standard. Financial institutions building sustainability scoring models for the fashion sector will need to recalibrate against whichever datapoints survive the simplification process, making the September 2026 delegated act a key data event for ESG analysts.',
  ]),
  whatItRequires: pt([
    'The reduction in required datapoints reduces the absolute cost of compliance for in-scope companies. However, the compliance infrastructure already partially deployed by companies preparing for the original timeline represents sunk cost. Companies that invested heavily in ESRS Set 1 readiness may find that their data architecture over-captures relative to simplified requirements, generating internal pressure to justify prior investments.',
    'The simplification also creates a divergence risk between EU ESRS and other reporting frameworks, particularly the IFRS Sustainability Disclosure Standards (ISSB), which have been adopted or are under adoption in multiple jurisdictions including the UK, Canada, and Australia. A fashion brand reporting under simplified ESRS for EU purposes while also preparing ISSB-aligned disclosures for other markets faces a dual-reporting burden with limited harmonisation benefits. This divergence increases compliance cost disproportionately for internationally listed or multi-market groups.',
    'Third-party data providers, sustainability rating agencies, and ESG data vendors face product redesign risk as simplified ESRS changes the landscape of available corporate disclosures. For the fashion sector specifically, any simplification that removes biodiversity, water, or supply chain worker disclosures would reduce the public data available for sector-level sustainability benchmarking.',
  ]),
  prefallAnalysis: pt([
    'As of early 2026, the simplified ESRS delegated act is under preparation within the European Commission, with EFRAG providing technical input. The delegated act must be adopted by 18 September 2026. There is active debate over which datapoints will survive simplification, with industry lobbying for maximum reduction and civil society organisations arguing that core environmental and human rights disclosures must be maintained. The outcome of this negotiation will define the practical scope of EU sustainability reporting for the rest of the decade.',
  ]),
  sources: bullets(['EFRAG ESRS project page — https://www.efrag.org/en/projects/esrs-mandatory-for-csrd']),
}

R['regulation.dpp'] = {
  shortSummary:
    'Mandatory product-level data disclosure via QR or NFC tag for all textiles sold in the EU. Not a certification scheme: a market access requirement. Textile delegated act expected 2027; enforcement anticipated mid-2028.',
  body: pt([
    "The Digital Product Passport (DPP) for textiles is a product-level data disclosure mechanism requiring each textile product sold in the EU to carry a data carrier, typically a QR code or NFC tag, linking to a standardised digital record containing defined information about the product's materials, durability, repairability, chemical content, and end-of-life options. It is not a voluntary label or certification scheme; it is a mandatory market access requirement. Products without a compliant DPP will not be permitted on the EU market once enforcement begins.",
    'The DPP is enabled by the Ecodesign for Sustainable Products Regulation (ESPR), which grants the Commission authority to adopt product-specific delegated acts. A textile-specific delegated act defining the precise data fields, format, and timeline is expected in 2027, with mid-2028 as the anticipated enforcement start for textiles. The DPP infrastructure, a distributed interoperable data registry, is being developed by the Commission in parallel. Brands are not required to self-host DPP data but must register it with the EU registry system once operational.',
  ]),
  whoItAffects: pt([
    "The DPP will apply to all textile and apparel products sold in the EU market, regardless of company size or headquarters. Non-EU brands exporting to the EU face the same obligations as EU-domiciled companies; the DPP requirement attaches to the product, not the producer's jurisdiction. The Commission may implement phased rollout by product category or company size through the delegated act, but universal coverage is the stated objective.",
    'The practical burden varies significantly by business model. Brands with complex multi-material products, long supply chains, or high SKU counts face the greatest data aggregation challenge, as DPP data must reflect the actual product rather than a product category average. Retailers who private-label products and source from manufacturers in countries with limited traceability infrastructure face particular risk, as the compliance obligation rests with the EU market-facing entity.',
  ]),
  whatItRequires: pt([
    "The DPP's primary cost driver is data collection and verification, not the digital infrastructure itself. For a fashion brand with hundreds of SKUs across multiple sourcing countries, assembling accurate fibre composition, origin, chemical treatment, and recyclability data for each product requires either significant supplier engagement programmes or investment in product lifecycle management software. Analysts estimate first-cycle DPP compliance costs at €5,000 to €50,000 per brand depending on SKU count and supply chain complexity.",
    'The DPP is designed as a platform, not just a compliance mechanism. Once the infrastructure is operational, DPP data will provide the factual foundation against which environmental claims are assessed, making it the verification layer for green claims under ECGT and potentially under any revived Green Claims Directive. Brands that invest in DPP data quality early gain a verifiable evidentiary basis for premium positioning and sustainability claims.',
    "Second-order effects include significant opportunities in the resale and repair sector. DPP-enabled products carry machine-readable provenance data that secondary market platforms, repair services, and recyclers can use without requiring the original brand's cooperation. This shifts brand control over narrative in the circular economy: once a garment has a DPP, the data is accessible to anyone, including competitors, rating services, and consumer advocacy groups.",
  ]),
  prefallAnalysis: pt([
    "The textile DPP delegated act is under preparation and expected in 2027. The Commission published the ESPR framework regulation in June 2024, establishing the legal basis. Stakeholder consultations on textile-specific data requirements were ongoing through 2025. The DPP is closely linked to ESPR's broader work programme, which includes a 2027 textile ecodesign delegated act covering performance standards. Brands should monitor the delegated act process closely: once published, implementation timelines may be tighter than anticipated given the infrastructure build required.",
  ]),
  sources: bullets(['ESPR Regulation (EU) 2024/1781, Official Journal 28 June 2024 — https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202401781']),
}

R['regulation.textile'] = {
  shortSummary:
    'A Commission proposal to add sustainability and manufacturing origin data to physical textile product labels. Indefinitely delayed as of early 2026; the most likely outcome is absorption into the textile DPP delegated act expected in 2027.',
  body: pt([
    "The EU Textile Labelling Regulation revision is a Commission proposal to update the existing 2011 textile labelling regulation (Regulation (EU) No 1007/2011). The current regulation requires fibre composition and care labels on textile products sold in the EU but does not mandate sustainability information. The proposed revision aimed to add environmental and origin-of-manufacture data to physical product labels, extending labelling obligations to align with the EU's broader sustainability agenda.",
    'The proposal has been indefinitely delayed, with no confirmed timeline for revival as of early 2026. The delay reflects both legislative bandwidth constraints following the Omnibus package and the increasingly likely outcome that textile sustainability disclosure requirements will be addressed through the DPP framework rather than a separate labelling instrument. Physical label revision now appears likely to be absorbed into the textile DPP delegated act scope, expected in 2027.',
  ]),
  whoItAffects: pt([
    'The existing 1007/2011 regulation already applies to all textile products sold in the EU, regardless of company size or origin, and any revision would preserve this universal scope. The proposed additions, covering sustainability information and origin of manufacture, would most significantly affect fast fashion brands and retailers sourcing from multiple jurisdictions, where label accuracy and traceability have historically been inconsistent.',
    'Non-EU exporters fall within scope of EU labelling requirements through the product liability and market access mechanism: any product placed on the EU market must carry a compliant label, with responsibility falling on the EU importer or authorised representative if the manufacturer is outside the EU. This means garment manufacturers in China, Bangladesh, and Turkey producing for the EU market would need to implement compliant labelling at source.',
  ]),
  whatItRequires: pt([
    'Given the indefinite delay, immediate compliance investment is not warranted. However, the underlying regulatory intent, adding sustainability and origin data to product labelling, has not been abandoned. Fashion brands that have built supply chain traceability infrastructure for DPP compliance or other purposes will be better positioned when and if the labelling revision is revived or merged into the DPP framework, without duplication of effort.',
    'The commercial significance of origin labelling should not be underestimated for brand positioning. Mandatory manufacturing origin specificity going beyond current rules, which can reflect final assembly rather than primary production, would expose brands whose marketing implies European or domestic production while sourcing primary production from low-cost countries. This represents a reputational risk that extends beyond regulatory penalty.',
    'The most likely resolution, absorption into DPP requirements, suggests companies should align label investment decisions with their DPP readiness timeline rather than tracking the labelling revision as an independent instrument. Procurement teams managing multi-year packaging contracts should maintain flexibility for mid-contract revision rather than committing to current label formats long-term.',
  ]),
  prefallAnalysis: pt([
    'As of early 2026, the textile labelling revision is formally listed as a Commission proposal but has no active parliamentary timeline. Legislative attention has shifted to the ESPR/DPP framework as the primary vehicle for textile transparency obligations. The most probable outcome is that sustainability labelling requirements will be specified in the textile DPP delegated act (expected 2027), rendering a separate labelling regulation revision redundant. Companies should treat this instrument as a monitoring priority rather than an active compliance obligation.',
  ]),
  sources: bullets(['European Commission, textile strategy communication — https://ec.europa.eu/commission/presscorner/detail/en/ip_23_4328']),
}

R['regulation.ecgt'] = {
  shortSummary:
    'Amends EU consumer protection law to prohibit vague environmental claims in all commercial communications. Generic terms such as "eco-friendly," "green," or "sustainable" require specific, verified evidence to remain in use. Applies from 27 September 2026.',
  body: pt([
    'The Empowering Consumers for the Green Transition Directive (Directive (EU) 2024/825) amends two existing consumer protection directives, the Unfair Commercial Practices Directive and the Consumer Rights Directive, to address greenwashing in commercial communications. It adds greenwashing-related practices to the list of prohibited commercial practices under EU consumer law and establishes minimum requirements for how environmental claims may be substantiated. The directive was published in March 2024 with a transposition deadline of 27 March 2026 and an application date of 27 September 2026.',
    'The ECGT prohibits generic environmental claims, such as "eco-friendly," "green," "natural," "climate neutral," or "sustainable," unless the company can provide specific, verified evidence that the claim is accurate and not misleading in context. It also bans durability claims that cannot be substantiated and requires that any environmental benefit claim be clearly scoped: for example, specifying which aspect of the product\'s lifecycle the claim refers to. The directive applies to all business-to-consumer commercial communications, including advertising, packaging copy, website content, social media, and hangtags.',
  ]),
  whoItAffects: pt([
    "The ECGT applies to all companies making environmental or durability claims to consumers in the EU, with no turnover or employee threshold. A one-person brand selling through an EU-facing platform and making sustainability claims in product descriptions is within scope once the directive applies in their member state. The obligation rests on the party making the claim, not necessarily the product manufacturer: retailers, marketers, and PR agencies facilitating claims on behalf of brands share legal exposure.",
    "Fashion is among the sectors most directly affected, given the prevalence of environmental marketing across all segments from fast fashion to luxury. Enforcement works through national consumer protection authorities, which vary significantly in capacity and appetite across member states. The directive's effect is therefore uneven in the short term, with likely strongest enforcement in Germany, the Netherlands, and Scandinavia, where consumer protection bodies have been most active on greenwashing cases.",
  ]),
  whatItRequires: pt([
    'The most immediate economic effect of ECGT is not direct penalty cost but the cost of claim withdrawal or substantiation. Brands that currently use generic sustainability language across marketing materials, including packaging, website copy, hangtags, and campaign creative, must either remove those claims, restrict them to specifically evidenced assertions, or invest in the verification infrastructure needed to substantiate them. For a mid-size fashion brand with hundreds of product lines, this review and revision exercise represents a meaningful operational cost across legal, marketing, and product teams.',
    'ECGT changes the risk calculation for sustainability marketing across the sector. Under pre-ECGT consumer law, the evidentiary threshold for challenging a green claim was relatively high. ECGT shifts the burden: the default position is that generic claims are prohibited, and companies must proactively demonstrate substantiation. This is likely to reduce the volume of environmental claims in fashion marketing overall, which has significant brand differentiation implications for companies that have invested in verifiable sustainability practices.',
    'The directive also creates competitive dynamics between brands in different EU member states and between EU and non-EU brands. A US brand selling via EU e-commerce faces the same obligation as an EU-domiciled company. Member states that transpose ECGT with stronger enforcement mandates than the minimum will create uneven compliance pressure, potentially distorting competition between brands selling across multiple EU markets. Over time, this is likely to harmonise upward as enforcement precedents develop.',
  ]),
  prefallAnalysis: pt([
    "The ECGT transposition deadline of 27 March 2026 has passed. Member states were required to incorporate the directive's provisions into national consumer protection law by this date. Application, meaning the rules begin to be enforced against businesses, begins 27 September 2026. Fashion brands should treat September 2026 as the operative date from which all consumer-facing environmental claims must meet ECGT standards. Auditing current marketing language against ECGT requirements is the immediate priority for any brand operating in the EU market.",
  ]),
  sources: bullets(['Directive (EU) 2024/825 — https://eur-lex.europa.eu/eli/dir/2024/825/oj/eng']),
}

R['regulation.gcd'] = {
  shortSummary:
    'Would have required independent third-party pre-verification of all explicit environmental claims before use in commercial communications. Legislative process suspended June 2025 as part of the Omnibus simplification package. No confirmed revival date.',
  body: pt([
    'The EU Green Claims Directive was a Commission proposal published in March 2023 that would have required companies to obtain independent third-party verification of any explicit environmental claims before making them in commercial communications. The proposal went substantially further than the ECGT: where ECGT prohibits unsubstantiated claims as a consumer protection matter, the Green Claims Directive would have required pre-market verification and imposed a structured approval mechanism, effectively treating environmental claims as analogous to regulated product claims.',
    'The Commission suspended the legislative process in June 2025 as part of the broader Omnibus regulatory simplification package. The suspension followed significant industry lobbying and a Commission reassessment of the cumulative regulatory burden on businesses. The proposal has not been formally withdrawn, meaning it retains the status of a pending Commission initiative, but no active parliamentary timeline exists and the Commission has not indicated when or if it intends to resubmit a revised proposal.',
  ]),
  whoItAffects: pt([
    'If and when revived, the Green Claims Directive would apply to all companies making explicit environmental claims in the EU market, with no size threshold. The original proposal included an exemption pathway for claims covered by recognised EU ecolabel schemes such as EU Ecolabel and GOTS, but most fashion-specific environmental marketing, including claims about organic cotton percentage, recycled material content, or water savings, would have required independent pre-verification.',
    'The suspension means no immediate compliance obligation exists for fashion brands. However, brands that made compliance investment decisions, including engaging with third-party verifiers or restructuring claims ahead of the original timeline, face sunk cost exposure. The suspension also removes a significant potential barrier for companies that had not yet begun preparing, effectively delaying a meaningful cost event without eliminating the underlying regulatory trajectory.',
  ]),
  whatItRequires: pt([
    'The commercial significance of the suspension differs by brand position. For brands that had positioned themselves around verified sustainability credentials and anticipated competitive advantage from a directive that would have penalised unsubstantiated competitors, the suspension removes a near-term differentiator. For brands that had not yet developed verification infrastructure, the suspension reduces near-term compliance expenditure but does not eliminate the medium-term strategic requirement to substantiate claims, as the ECGT already applies.',
    'The interaction between the suspended Green Claims Directive and the active ECGT creates a coverage gap. ECGT prohibits generic claims without substantiation but does not specify the mechanism or standard for substantiation. The Green Claims Directive would have specified both. In the absence of the directive, the evidentiary standard for adequate substantiation under ECGT will be developed through enforcement precedent by national authorities, meaning the standard will be uneven across member states until the Commission or courts establish consistent criteria.',
    'The economic cost of regulatory uncertainty is itself material. Fashion brands cannot confidently commit to multi-year sustainability communication strategies when the verification requirements governing those communications are undefined. This uncertainty favours well-resourced brands capable of maintaining legal monitoring capacity and adapting marketing rapidly, at the expense of smaller brands that need planning certainty. If a revised Green Claims Directive emerges, it is likely to be less demanding than the 2023 proposal, reflecting the political context that produced the suspension.',
  ]),
  prefallAnalysis: pt([
    'The Green Claims Directive is formally suspended as of June 2025. The Commission has not published a revised proposal timeline. The ECGT entered full application on 27 September 2026 and covers overlapping ground, banning unsubstantiated generic claims, but without the pre-verification mechanism the Green Claims Directive would have imposed. Industry associations and sustainability NGOs are monitoring whether the Commission will revive a revised, lighter proposal in the 2026 to 2029 legislative cycle. For practical planning purposes, brands should design their environmental claims strategy around ECGT requirements and treat any Green Claims Directive revival as upside risk.',
  ]),
  sources: bullets(['European Commission proposal communication (March 2023) — https://ec.europa.eu/commission/presscorner/detail/en/ip_23_2035']),
}

R['regulation.csddd'] = {
  shortSummary:
    'Requires large companies to identify and address human rights and environmental risks in their value chains. Omnibus I narrowed scope to companies with more than 5,000 employees AND more than €1.5B worldwide turnover, removed civil liability, and shifted to a risk-based approach. Compliance required from July 2029.',
  body: pt([
    "The Corporate Sustainability Due Diligence Directive (CSDDD) requires large companies to identify, prevent, mitigate, and account for adverse human rights and environmental impacts in their own operations and value chains. The original directive, adopted in May 2024, established a mandatory due diligence framework covering direct and indirect suppliers, a civil liability regime enabling victims to sue in EU courts, and an obligation to adopt a climate transition plan aligned with the Paris Agreement 1.5°C pathway.",
    'Omnibus I (Directive (EU) 2026/470, in force 18 March 2026) substantially amended the CSDDD before it had been transposed by any member state. The amendments narrowed the scope to companies with more than 5,000 employees AND more than €1.5 billion worldwide net turnover, both thresholds required. The civil liability regime was removed, replaced by administrative penalties only. The climate transition plan obligation was removed. The value chain scope was shifted from a tier-based approach to a risk-based approach requiring companies to focus due diligence effort on identified risk areas.',
  ]),
  whoItAffects: pt([
    "The amended CSDDD applies to EU-incorporated companies exceeding both the 5,000-employee and €1.5 billion turnover thresholds, plus non-EU companies with more than €1.5 billion net turnover generated in the EU. In fashion, this narrows the directly obligated universe to the largest vertically integrated groups and major retailers. The original CSDDD's phased rollout to companies above 1,000 employees has been eliminated; the revised threshold is the single operative scope criterion, applying from the 26 July 2029 compliance deadline.",
    'The removal of the civil liability regime significantly changes the risk profile for in-scope companies. The original CSDDD would have exposed fashion groups to EU-court litigation from workers and communities harmed by supply chain practices. Under the amended directive, enforcement rests with national supervisory authorities empowered to impose administrative penalties of up to 3% of global net turnover. This shifts the enforcement character from litigation risk to regulatory inspection risk, which is more predictable but also more dependent on the enforcement appetite of individual member states.',
  ]),
  whatItRequires: pt([
    'For in-scope fashion groups, the CSDDD requires building or formalising due diligence systems that identify and address human rights and environmental risks across upstream supply chains. The practical minimum involves supply chain mapping, risk assessment against defined criteria, and documented prevention and mitigation measures. Fashion supply chains, typically multi-tier, geographically dispersed, and involving multiple layers of subcontracting, represent among the most complex due diligence contexts of any sector.',
    'The removal of civil liability is commercially significant not only as risk reduction but as a signal about enforcement intensity. Without litigation exposure, in-scope companies can design due diligence programmes calibrated primarily to satisfy regulatory inspection rather than withstand judicial scrutiny. This creates a risk of minimum-viable compliance: systems that satisfy documentation requirements without driving substantive supply chain improvement. Investors and institutional buyers increasingly benchmark supplier due diligence quality beyond minimum legal compliance, so commercially-driven companies have incentive to exceed the directive\'s floor.',
    'The risk-based approach replacing tier-based coverage is both a simplification and a source of ambiguity. Companies must determine which parts of their value chain present material human rights and environmental risks, a judgment call requiring credible risk assessment methodology. For fashion, industry guidance from organisations including the OECD, Ethical Trading Initiative, and Business and Human Rights Resource Centre provides reference frameworks, but regulators have not yet confirmed which methodologies they will accept as demonstrating adequate due diligence.',
  ]),
  prefallAnalysis: pt([
    'The Omnibus I amendment is in force as of 18 March 2026. Member states have until 26 July 2028 to transpose the amended directive into national law. In-scope company compliance is required from 26 July 2029. Fashion groups that had already invested in CSDDD compliance preparation under the original directive should review their programmes against the amended scope and requirements, particularly the shift from tier-based to risk-based value chain coverage and the removal of climate transition plan obligations.',
  ]),
  sources: bullets(['Directive (EU) 2026/470, Official Journal 26 February 2026 — https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202600470']),
}

R['regulation.eudr'] = {
  shortSummary:
    'Prohibits placing on the EU market commodities and products linked to deforestation after December 2020. Fashion-relevant commodities: cattle leather and rubber. Large operators must comply from 30 December 2026.',
  body: pt([
    'The EU Deforestation Regulation (Regulation (EU) 2023/1115, as amended by Regulation (EU) 2025/2650) prohibits placing on the EU market, or exporting from the EU, specific commodities and products derived from land that was deforested after 31 December 2020. Operators and traders must conduct due diligence demonstrating that their products are deforestation-free and have been produced in compliance with the relevant country-of-production legislation. The regulation covers seven commodity categories: cattle, cocoa, coffee, palm oil, soy, wood, and rubber, along with derived products made from these commodities.',
    'For the fashion industry, the directly relevant commodities are cattle (for leather) and rubber (used in footwear outsoles). Cotton, viscose, lyocell, wool, and silk are explicitly outside EUDR scope. The regulation establishes a country benchmarking system classifying countries as low, standard, or high risk for deforestation; this classification determines the intensity of due diligence required. The original enforcement date of December 2024 was postponed by amendment; large operators now face compliance from 30 December 2026.',
  ]),
  whoItAffects: pt([
    'EUDR distinguishes between "operators," companies placing regulated products on the EU market for the first time, and "traders," companies subsequently handling the same products in the supply chain. Both categories have due diligence obligations, though traders can rely on operators\' due diligence statements if the original operator is EUDR-registered. For fashion specifically, leather importers and brands sourcing leather directly from tanneries are operators; retailers purchasing leather goods from EU-based brands are traders.',
    'The size differentiation uses the EU SME definition: fewer than 250 employees and either annual turnover not exceeding €50 million or balance sheet not exceeding €43 million. Most fashion brands selling leather goods in the EU are large operators by this definition. Non-EU fashion brands exporting leather or rubber-containing products to the EU must ensure their products meet EUDR requirements; the due diligence obligation falls on the EU importer if the exporter is outside the EU.',
  ]),
  whatItRequires: pt([
    'Credible EUDR compliance for leather requires geographic traceability of cattle, identifying the farm or ranch where the animal was raised and confirming that land was not deforested after December 2020. For brands sourcing leather from Brazil, Argentina, or other countries with complex, fragmented cattle supply chains, this traceability requirement is operationally demanding and may require third-party verification services or engagement with supply chain intermediaries such as abattoirs and tanners who have not historically tracked geolocation data for their cattle suppliers.',
    'The commodity risk differentiation introduced by the country benchmarking system will create market segmentation in leather supply chains. Leather from countries classified as low risk requires lighter due diligence than leather from standard or high-risk countries. This will incentivise brands to source from European or certified-low-risk origins, potentially increasing competition for European tannery capacity and driving price premiums for verifiably compliant leather.',
    'For footwear, natural rubber outsoles are within EUDR scope. Natural rubber is primarily produced in Southeast Asia: Thailand, Indonesia, Malaysia, and Vietnam. Brands sourcing natural rubber outsoles must ensure their rubber supply chains can demonstrate deforestation-free status with the required geolocation precision. Given that synthetic rubber is increasingly available as a substitute, EUDR compliance costs may accelerate the already-occurring shift from natural to synthetic rubber in fashion footwear.',
  ]),
  prefallAnalysis: pt([
    "Regulation (EU) 2025/2650 amending the enforcement timeline was published in the Official Journal on 23 December 2025. Large fashion brands sourcing cattle leather or rubber for the EU market have until 30 December 2026 to be fully EUDR-compliant, meaning due diligence systems must be operational, not merely in planning. The Commission's country benchmarking classification, which determines due diligence intensity by sourcing country, was expected in 2025 but has faced delays. Brands sourcing from standard-risk countries, the default classification for any country not yet benchmarked, must apply standard due diligence regardless of benchmarking timeline.",
  ]),
  sources: bullets(['Regulation (EU) 2025/2650, Official Journal 23 December 2025 — https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202502650']),
}

R['regulation.espr'] = {
  shortSummary:
    'In force July 2024. Extends ecodesign requirements to virtually all physical products sold in the EU and provides the legal basis for the Digital Product Passport. Bans destruction of unsold apparel and footwear for large companies from 19 July 2026.',
  body: pt([
    'The Ecodesign for Sustainable Products Regulation (Regulation (EU) 2024/1781) entered into force on 18 July 2024 as the successor to the 2009 Ecodesign Directive. Where the original directive was limited to energy-related products, ESPR extends ecodesign requirements to virtually all physical products sold in the EU. The regulation establishes a framework under which the Commission adopts product-specific delegated acts setting requirements for durability, repairability, recycled content, recyclability, carbon and environmental footprint, and information provision. ESPR also provides the legal basis for the Digital Product Passport (DPP) system.',
    'A provision with immediate commercial relevance to fashion is the ban on destruction of unsold consumer textiles and footwear. For large companies (exceeding two of three criteria: balance sheet above €20M, net turnover above €40M, average employees above 250), this ban applies from 19 July 2026. Medium-sized companies with more than 50 employees and more than €10 million turnover face the same ban from 19 July 2030. Micro and small enterprises are permanently exempt. The textile and footwear sector delegated act setting performance-based ecodesign standards is expected in 2027.',
  ]),
  whoItAffects: pt([
    'The unsold goods destruction ban applies to any large company placing textile or footwear products on the EU market, whether a manufacturer, importer, or retailer. The threshold uses the EU accounting definition, meaning a brand with 300 employees and €50 million turnover is a large company subject to the 2026 ban even if it would be considered small by fashion industry standards. Affected companies must have disposal practices for overstock and end-of-season inventory that do not involve destruction, including incineration without energy recovery, landfill, or similar terminal disposal methods.',
    'Permitted alternatives to destruction include donation, resale through secondary channels, textile collection infrastructure, or industrial recycling. The regulation does not mandate a specific alternative but requires that the chosen alternative does not amount to destruction. Companies that currently destroy unsold inventory as a brand equity protection measure face the most significant operational change. Large retailers with high volumes of clearance inventory face logistics challenges in redirecting stock away from destruction at scale.',
  ]),
  whatItRequires: pt([
    "The immediate commercial impact of the unsold goods ban is on inventory management economics. Fashion's overproduction model has historically treated destruction as a cost-efficient alternative to markdown selling or outlet distribution, avoiding the brand dilution or secondary market price erosion that discounting can cause. Eliminating destruction forces a reassessment of either production planning (reducing overstock creation) or distribution strategy (building relationships with donation partners, resellers, recyclers, or franchise operators in new markets). Neither path is cost-free.",
    'The longer-term ESPR textile delegated act, expected in 2027, will establish product performance standards that fundamentally change product design economics. Requirements for minimum recycled content, durability benchmarks, and recyclability specifications would require reformulation of products currently designed without these parameters, with cost implications across materials sourcing, research and development, and potentially retail pricing. Brands that have already built product durability and material circularity into their design process are better positioned to comply with minimal incremental cost.',
    "ESPR's DPP mandate creates a longer-term cost that is difficult to estimate before the textile delegated act is published. DPP data requirements, the registry infrastructure, and the audit obligations attached to DPP claims will establish a per-SKU compliance cost. For high-volume, high-SKU-count fashion businesses, this could represent a meaningful overhead; for lower-volume premium brands, the cost per unit is higher but the strategic value of verified data is greater.",
  ]),
  prefallAnalysis: pt([
    'ESPR is in force. The unsold goods destruction ban for large companies takes effect 19 July 2026. Companies approaching this deadline should have alternative inventory management protocols operational before that date; the regulation does not provide a grace period. The textile ecodesign delegated act is expected in 2027 and will establish performance-based product standards. The Commission published its ESPR working plan in 2024 indicating textiles as a priority category. Monitoring the delegated act drafting process, including public consultations and impact assessments, is the most important near-term intelligence task for fashion brands.',
  ]),
  sources: bullets(['Regulation (EU) 2024/1781, Official Journal 28 June 2024 — https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202401781']),
}

R['regulation.epr'] = {
  shortSummary:
    'Establishes the EU-wide framework requiring producers to fund collection, sorting, and recycling of post-consumer textiles. In force October 2025. National EPR schemes must be operational across all member states by April 2028.',
  body: pt([
    'Directive (EU) 2025/1892 establishes the EU-wide extended producer responsibility (EPR) framework for textiles, entering into force on 16 October 2025. Extended producer responsibility is a policy mechanism that shifts the cost of collection, sorting, and recycling of post-consumer products from public waste management systems to the producers who place products on the market. The directive requires all EU member states to establish operational national EPR schemes for textiles by 17 April 2028. Separate collection of textiles became mandatory across the EU from January 2025 under the Waste Framework Directive amendment.',
    'Under EPR, producers register with a national producer responsibility organisation (PRO) and pay fees that fund the downstream collection and processing of post-consumer textiles. The directive requires that fees be eco-modulated: companies pay lower per-unit fees for products that are more durable, more recyclable, or contain more recycled content, and higher fees for products that are more difficult to process. France and the Netherlands already operate mandatory textile EPR schemes that predate the directive; these national schemes will be aligned with the directive\'s requirements by the April 2028 deadline.',
  ]),
  whoItAffects: pt([
    "The directive applies to all companies placing textile and clothing products on the EU market, including manufacturers, importers, and retailers who are the last entity in the supply chain before the consumer. There is no size exemption in the directive's framework provisions, though member states may introduce de minimis thresholds when establishing national schemes. Brands operating across multiple EU member states will need to register separately with each national EPR scheme, replicating the compliance structure familiar from packaging EPR.",
    "The directive's scope covers textiles broadly, including clothing, footwear, bedding, and household textiles. Fashion brands with multi-category ranges face higher registration complexity and potentially higher aggregate fee exposure than single-category producers. The eco-modulation mechanism means that a brand's EPR fee level is directly connected to product design choices: low-quality, mixed-material, or non-recyclable garments attract higher fees, creating a financial incentive for design-for-recyclability.",
  ]),
  whatItRequires: pt([
    'EPR fees represent a new per-unit cost for every textile product sold in the EU. Fee levels will be set by national PROs based on the cost of collection, sorting, and processing infrastructure, which is currently limited and expensive. Industry estimates for per-garment EPR fees range from €0.01 to €0.10 in the short term, rising as infrastructure costs are internalised more fully. For high-volume, low-margin fashion businesses, even small per-unit fees compound into significant annual obligations.',
    "The eco-modulation mechanism is potentially the directive's most significant commercial consequence. A brand whose products are designed for recyclability, using single-material construction with no non-removable embellishments or bonded coatings, pays lower fees than a competitor whose products are complex composites that cannot be processed by available sorting infrastructure. Over time, this creates structural cost advantage for brands that invest in recyclable product design. The incentive is not immediate, as fee levels will be relatively low in the first years, but the mechanism is permanent and fees will rise as infrastructure investment is recovered.",
    "The directive also creates competitive pressure between EU-based producers and importers. Both are subject to EPR obligations, but enforcement of importer registration and fee collection has historically been weak in EU member states. Brands that comply fully bear a cost that non-compliant importers avoid. National enforcement capacity and willingness to pursue non-EU importers will significantly affect whether the level playing field the directive intends is realised in practice.",
  ]),
  prefallAnalysis: pt([
    "Directive 2025/1892 is in force as of 16 October 2025. Member states have until 17 April 2028 to establish operational national EPR schemes. France's existing scheme (operated through Refashion) is the reference model for eco-modulated textile EPR in Europe and is being monitored by other member states designing their own schemes. For brands without existing EPR exposure, the April 2028 deadline for national scheme operations should be treated as the latest viable compliance date, with registration processes likely to open 12 to 18 months before enforcement.",
  ]),
  sources: bullets(['Directive (EU) 2025/1892 — https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202501892']),
}

R['regulation.ppwr'] = {
  shortSummary:
    'Replaces the 1994 Packaging Directive with a directly applicable regulation covering all packaging sold in the EU. Applies to e-commerce parcels, garment bags, and branded packaging. Empty space in e-commerce parcels must not exceed 40% from 12 August 2026.',
  body: pt([
    "The Packaging and Packaging Waste Regulation (Regulation (EU) 2025/40), published in the Official Journal on 22 January 2025, replaces the 1994 Packaging and Packaging Waste Directive (94/62/EC) with a directly applicable regulation, meaning it requires no national transposition and applies uniformly across the EU. The regulation establishes requirements for packaging design (recyclability, recycled content), mandatory labelling including digital labelling via QR codes, and reuse targets, alongside restrictions on unnecessary packaging formats. General application is from 12 August 2026, with a phased timeline for specific provisions extending to 2030 and beyond.",
    "The regulation's scope covers all packaging placed on the EU market, including primary packaging in contact with the product, secondary packaging grouping individual units, and transport packaging. For fashion, this captures polybags for shipped garments, tissue paper, branded shopping bags, e-commerce shipping boxes, garment bags, and protective accessories packaging. The 40% empty space limit for e-commerce parcels, meaning the void space within a parcel must not exceed 40% of total parcel volume, applies from 12 August 2026 and directly affects brands that currently use oversized packaging for presentation purposes.",
  ]),
  whoItAffects: pt([
    'The PPWR applies to all companies producing, filling, or using packaging for products sold in the EU, with no size threshold or sectoral exemption. A fashion brand shipping a single product in an oversized box to an EU customer is within scope for the space efficiency requirement. E-commerce fashion, which relies extensively on secondary packaging for shipping and often uses distinctive branded outer packaging for customer experience, is among the most directly affected segments.',
    'Luxury and premium fashion brands face particular implications from design restrictions. The PPWR limits the use of packaging elements that are not functional, meaning packaging whose primary purpose is aesthetic rather than protective or informative may require redesign. Brands whose packaging is a significant part of the consumer experience face potential need to demonstrate functional justification for packaging design elements that are currently purely presentational.',
  ]),
  whatItRequires: pt([
    'The immediate cost impact from 12 August 2026 is the space efficiency requirement. Brands using oversized e-commerce packaging must either switch to right-sized boxes, requiring packaging inventory changes and potentially new packaging formats across product categories, or demonstrate that void space is necessary for product protection. For fashion brands managing large SKU ranges and diverse product shapes, eliminating excess packaging space requires either bespoke per-product packaging (expensive) or a reduction in packaging variety (operationally simpler but potentially sacrificing presentation quality).',
    'Digital labelling requirements, applying from 2027, create both compliance cost and opportunity. Compliance requires integrating QR code generation into packaging production workflows and maintaining the digital endpoint the QR code links to. The opportunity is that digital packaging labels can carry far more information than print permits and can be updated without reprinting packaging, enabling dynamic communication with consumers and alignment with DPP data infrastructure at low marginal cost.',
    'Recycled content targets, phasing in from 2030 for different packaging types, require packaging suppliers to source certified post-consumer recycled material. Current certified recycled content availability for some packaging substrates, especially flexible plastic and coated paper, is limited relative to anticipated demand. Brands that lock in long-term packaging supply agreements with recycled content commitments before demand exceeds supply may secure preferential pricing; those who delay face potential supply constraints and premium costs as 2030 approaches.',
  ]),
  prefallAnalysis: pt([
    'The regulation is in force with general application from 12 August 2026. Fashion brands should treat this date as an operational deadline requiring packaging audit, redesign where necessary, and supply chain confirmation that packaging meets PPWR standards. The empty space rule and design requirements apply from this date. Digital labelling requirements follow in 2027, and material composition and recycled content targets cascade through to 2030. The Commission will publish implementing acts and technical standards for specific provisions through 2026 and 2027.',
  ]),
  sources: bullets(['Regulation (EU) 2025/40, Official Journal 22 January 2025 — https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202500040']),
}

R['regulation.france'] = {
  shortSummary:
    'Environmental impact scoring for apparel sold in France using the PEF methodology. Voluntary from October 2025, but mandatory immediately for any brand making any environmental claim in France. Third parties acquire the right to publish scores without brand consent from October 2026.',
  body: pt([
    "France's textile environmental scoring system, commonly referred to as the eco-score or affichage environnemental, is an environmental impact labelling scheme operated under the French anti-waste law (Loi AGEC) and its implementing decrees. The system requires environmental impact scores to be calculated using a standardised methodology based on the PEF (Product Environmental Footprint) framework adapted for textiles, covering climate impact, water use, land use, and resource depletion across the product lifecycle. Voluntary participation opened from October 2025.",
    "The scheme has two legally distinct phases. From October 2025, brands may voluntarily display eco-scores. A critical exception applies immediately: any brand that makes any environmental impact claim on a product in France is required to display the eco-score for that product from October 2025, regardless of whether they have voluntarily adopted the system broadly. From October 2026, any third party, including NGOs, media outlets, competitor brands, and rating platforms, acquires the legal right to publish eco-scores for any product using publicly available data and default worst-case assumptions, without requiring the brand's cooperation or consent.",
  ]),
  whoItAffects: pt([
    'The scheme applies to all brands selling textile and apparel products in France, regardless of size or country of origin. A UK brand selling directly to French consumers faces the same obligations as a French brand. The "any environmental claim triggers mandatory display" provision is the most immediately operative requirement: brands making any ecological, sustainable, or environmental marketing claim in the French market, including claims on labels, websites, advertising, or social media targeted at France, must display the eco-score for those products.',
    'The October 2026 third-party publication right is significant for all brands, not only those making claims. Once third parties can calculate and publish scores using worst-case default data, brands with good actual performance but incomplete public data risk having published scores that understate their performance. The strategic implication is that brands that perform well on the methodology should either voluntarily participate to control their scores or ensure their supply chain data is sufficiently documented to support accurate third-party calculation.',
  ]),
  whatItRequires: pt([
    'The direct compliance cost of eco-score calculation depends on data availability. Brands with existing life cycle assessment programmes and documented supply chain data can adapt to the French methodology at relatively low marginal cost. Brands without LCA capability face either outsourcing score calculation to specialised consultants (at costs of several thousand euros per product family) or adopting sector-average default values, which typically yield worse scores than product-specific data for brands with above-average environmental performance.',
    "The commercial strategic implication of the third-party publication right is material and potentially underweighted in compliance discussions. From October 2026, a sustainability NGO, investigative media outlet, or even a competitor could publish eco-scores for every product in a brand's range using default conservative assumptions, with no legal requirement to consult the brand before publication. Brands that have not controlled their score narrative by that point have no legal mechanism to prevent such publication. The first-mover advantage in voluntary participation is therefore time-bounded.",
    "The eco-score methodology's coverage of multiple environmental indicators beyond carbon creates differentiation dynamics that do not exist in carbon-only footprinting. A brand with high carbon footprint but strong water and land-use performance may score better under the multi-indicator PEF methodology than under single-metric carbon accounting. Conversely, brands that have invested heavily in carbon reduction alone may be surprised by their aggregate scores if water, chemicals, or land use are not simultaneously managed.",
  ]),
  prefallAnalysis: pt([
    'The voluntary scheme opened in October 2025. The immediate obligation for brands making environmental claims in France has been active since that date. Third-party publication rights activate in October 2026. There is no confirmed date for mandatory display across all products for all brands: the French government has indicated that mandatory adoption depends on the DPP framework at EU level, suggesting the French system is designed as a precursor or complement to EU-level mandatory environmental labelling. Brands operating in France should conduct a claim audit and evaluate voluntary participation ahead of the October 2026 third-party publication activation.',
  ]),
  sources: bullets(['French Ministry of Ecological Transition: affichage environnemental — https://www.ecologie.gouv.fr/affichage-environnemental-des-produits-textiles']),
}

R['regulation.italy'] = {
  shortSummary:
    'A legislative proposal introduced to the Italian Senate in October 2025 proposing eco-score labelling, advertising restrictions on ultra-fast fashion, and a per-parcel environmental levy. Still under parliamentary review. Not yet law.',
  body: pt([
    "Italy's DDL S.1690 is a legislative proposal introduced in the Italian Senate in October 2025 that would establish a regulatory framework targeting the fast fashion business model. The bill proposes three core mechanisms: a mandatory environmental and social impact scoring system for textile products (an eco-score scheme similar to France's model but with Italian methodology specifications); a ban on advertising for ultra-fast fashion products, defined as those characterised by very high volume, very low price, and extremely short trend cycles; and a per-parcel environmental levy on packages containing apparel and footwear arriving from outside the EU under the customs de minimis threshold.",
    "The bill remains under parliamentary review as of early 2026 and has not been enacted. It should be distinguished from a separate measure that has already become law: the Italian Budget Act 2026 introduced a €2 levy on extra-EU parcels valued under €150, which applies from 2026. This parcel levy is distinct from DDL S.1690 and is separately enacted. The fast fashion bill itself is broader in scope, but it faces significant parliamentary debate and is uncertain to pass in its current form.",
  ]),
  whoItAffects: pt([
    "If enacted as introduced, DDL S.1690 would affect all brands selling textile and apparel products in Italy, both Italian-domiciled brands and non-EU brands selling to Italian consumers. The advertising ban on ultra-fast fashion would primarily target the largest pure-play ultra-fast-fashion operators, defined by extremely rapid design-to-market cycles, massive SKU volumes, and price points designed to be single-use. The eco-score and parcel levy provisions would have broader industry impact, affecting brands across market segments.",
    "Non-EU ultra-fast-fashion platforms, particularly Chinese operators selling directly to consumers via e-commerce, are the explicit target of the bill's advertising and levy provisions. Italian legislators have cited the growth of these platforms as directly competitive with Italian fashion manufacturing and as raising sustainability and social compliance concerns. If enacted, the bill would be among the first EU member state laws to directly regulate ultra-fast fashion as a business model category.",
  ]),
  whatItRequires: pt([
    "The parcel levy proposal, beyond the already-enacted Budget Act 2026 measure, would increase the cost of direct-to-consumer cross-border e-commerce significantly for operators in the ultra-fast-fashion model, whose economics depend on high parcel volumes at low per-unit cost. For established fashion brands shipping higher-value individual parcels, the per-parcel impact is diluted by higher average order values. The levy is therefore structurally more impactful on business models built on high-frequency, low-value transactions than on luxury or premium brands.",
    'The advertising ban on ultra-fast fashion would, if enacted, require legal definition of "ultra-fast fashion" through implementing regulations, a process that typically generates significant lobbying and definitional ambiguity. The commercial impact depends entirely on how the defined category is drawn. Legal challenges to an advertising ban on a product category not otherwise illegal would be likely and may delay enforcement significantly.',
    "The precedent value of DDL S.1690 may exceed its direct Italian market impact. Italy is the EU's second-largest fashion manufacturing base and a major consumer market. A legislative framework that survives parliamentary scrutiny creates a policy template that other member states could adopt. The bill would also strengthen the case for EU-level fast fashion regulation within the ESPR and textile EPR frameworks.",
  ]),
  prefallAnalysis: pt([
    'DDL S.1690 is under parliamentary review in the Italian Senate as of early 2026. It was introduced in October 2025 and has not yet advanced to committee vote. The Italian legislative calendar introduces significant uncertainty about the timing and form of any final legislation. Brands operating in Italy should monitor parliamentary progress but are not yet required to take compliance action. The separately enacted €2 parcel levy (Budget Act 2026) is already operative and requires no further legislative action.',
  ]),
  sources: bullets(['Italian Parliament, DDL S.1690 (Senato della Repubblica) — https://www.senato.it/leg/19/BGT/Schede/FascicoloSchedeDDL/ebook/57071.pdf']),
}

R['regulation.sb707'] = {
  shortSummary:
    'The first mandatory textile EPR programme in the United States. Applies to producers with more than $1 million annual global revenue selling into California. PRO approved February 2026; producer registration required by July 2026.',
  body: pt([
    "Senate Bill 707, signed into law by California Governor Gavin Newsom on 22 September 2024, establishes the first mandatory textile extended producer responsibility programme in the United States. The law requires producers of covered textile articles, including apparel, shoes, and accessories, sold to California consumers to participate in an approved producer responsibility organisation (PRO) that funds and operates a statewide textile collection, sorting, and end-of-market programme. The law is administered by CalRecycle under the broader framework of California's circular economy legislation.",
    "The PRO was approved by CalRecycle in February 2026. Landbell USA, a subsidiary of the German EPR services group Landbell, was approved as the initial PRO. Producers subject to the law must register with the approved PRO by July 2026. Full programme rollout, including consumer-facing collection infrastructure and funding mechanisms, proceeds through to July 2030, at which point the programme is expected to be fully operational statewide.",
  ]),
  whoItAffects: pt([
    "The law applies to producers, defined as the brand owner, importer, or first domestic seller of covered textile articles, with annual aggregate gross revenue exceeding $1 million. The $1 million threshold refers to global revenue, not California-specific sales. A fashion brand with $1.5 million total global revenue selling any products in California is within scope. Secondhand sellers, thrift stores, and resale platforms are explicitly exempt. The scope covers apparel, shoes, and accessories.",
    'The geographic scope is California, but the compliance obligation attaches to any producer selling into California, regardless of where the company is incorporated. US brands headquartered outside California, and non-US brands exporting to California, are within scope if they meet the revenue threshold. This extraterritorial reach, standard for California consumer protection and environmental legislation, means that California SB 707 functions as a de facto national standard for fashion brands operating at scale in the US market.',
  ]),
  whatItRequires: pt([
    "SB 707 introduces per-unit fees for all covered textile products sold in California, paid by producers to the PRO to fund collection and processing. Fee levels have not yet been set as of early 2026; the PRO approval and producer registration phases precede fee determination. Fees are expected to be modest in the first years, rising as programme costs become clearer. Given California's market size, even small per-unit fees represent material aggregate obligations for high-volume brands.",
    'The law explicitly establishes California as a policy laboratory for textile EPR in the United States. Several other US states, including New York, Massachusetts, and Washington, have introduced or are considering similar legislation. A fashion brand that builds EPR compliance infrastructure for California will be better positioned to adapt to subsequent state programmes with relatively low incremental cost. Brands that delay registration may find themselves simultaneously managing California enforcement and emerging obligations in additional states without a scalable compliance system.',
    "The programme's end-market development provisions require the PRO to invest in building domestic sorting and recycling capacity for collected textiles. If these targets are met, California could develop a domestic textile recycling sector that creates commercially viable markets for post-consumer textile fibre. Brands with material take-back or recycled fibre commitments have strategic interest in the success of this infrastructure build, which could provide lower-cost or more reliable access to post-consumer recycled textile inputs than currently available.",
  ]),
  prefallAnalysis: pt([
    "The PRO was approved in February 2026. Producer registration opens July 2026. Brands within scope should complete registration by the July 2026 deadline to avoid enforcement exposure. CalRecycle has enforcement authority under the law and has indicated it will prioritise compliance with registration requirements. The fee structure and operational programme details will be developed through the PRO's programme plan, subject to CalRecycle approval, meaning the precise financial obligation per unit will become clearer through 2026 and 2027 as the programme plan is finalised.",
  ]),
  sources: bullets(['SB 707 legislative text, California Legislature — https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240SB707']),
}

async function main() {
  const tx = client.transaction()
  let count = 0
  for (const [id, fields] of Object.entries(R)) {
    tx.patch(id, {set: fields})
    count++
  }
  await tx.commit()
  console.log(`✓ Patched ${count} regulations with verbatim prototype prose.`)
}

main().catch((err) => {
  console.error(err?.response?.body ?? err)
  process.exit(1)
})
