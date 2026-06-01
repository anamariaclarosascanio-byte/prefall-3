import {groq} from 'next-sanity'

/**
 * GROQ queries. Kept as named string exports so they can be reused by
 * server-side fetches anywhere in the app.
 */

// -- Site-wide ------------------------------------------------------------
export const siteSettingsQuery = groq`*[_id == "siteSettings"][0]{
  logoText,
  heroLabel,
  heroHeading,
  heroBody,
  heroPrimaryCtaLabel,
  heroSecondaryCtaLabel,
  readingNowSectionLabel,
  readingNowIntroBody,
  fromTheDirectoryLabel,
  regulationFocusLabel,
  valueChainHeroHeading,
  valueChainHeroSubhead,
  valueChainHeroCaption,
  homeFullWidthImage,
  footerCtaTitle,
  footerNewsletterCtaLabel,
  footerContactCtaLabel,
  footerTagline,
  socialLinks,
  footerCopyright,
  cookieBannerText,
  cookieAcceptLabel,
  cookieEssentialLabel,
  emptyNodeCompaniesMessage,
  emptyArticlesMessage,
  emptyJobsMessage
}`

// -- Home -----------------------------------------------------------------

// Latest articles for the "Reading now" section. Returns [] until articles
// are populated. Includes modal fields so cards can open the modal directly.
export const latestArticlesQuery = groq`*[_type == "article"] | order(publishedAt desc, _createdAt desc)[0...5]{
  _id,
  title,
  "slug": slug.current,
  "category": category->{title, "slug": slug.current},
  readingMinutes,
  heroImage,
  cardImage,
  publishedAt,
  dek,
  modalSynopsis,
  modalTakeaways,
  modalPrimarySources,
  modalSectors
}`

// Featured company on home — most recently created. Per launch spec auto-
// populates from the latest in the directory. Veja, Vestiaire, Circulose
// at launch.
export const featuredCompanyQuery = groq`*[_type == "company"] | order(_createdAt desc, name asc)[0]{
  _id,
  name,
  "slug": slug.current,
  tagline,
  businessModelSummary,
  logo,
  "nodes": nodes[]->{title, "slug": slug.current}
}`

// Featured regulation for the home "Regulation that matters now" module.
// Reads the curated pick from siteSettings.homeFeaturedRegulation (editable
// in Studio); falls back to CSRD if empty so the section is never blank.
export const featuredRegulationQuery = groq`coalesce(
  *[_id == "siteSettings"][0].homeFeaturedRegulation->{
    _id,
    name,
    fullName,
    "slug": slug.current,
    shortSummary,
    "status": status->{
      title,
      "slug": slug.current,
      dotColor,
      badgeBg,
      badgeText
    }
  },
  *[_type == "regulation" && slug.current == "csrd"][0]{
    _id,
    name,
    fullName,
    "slug": slug.current,
    shortSummary,
    "status": status->{
      title,
      "slug": slug.current,
      dotColor,
      badgeBg,
      badgeText
    }
  }
)`

// "Also in force" — curated picks from siteSettings (editable in Studio).
// Falls back to "first 3 regs with status in-force" if list is empty.
export const inForceRegulationsQuery = groq`coalesce(
  *[_id == "siteSettings"][0].homeAlsoInForceRegulations[]->{
    _id,
    name,
    fullName,
    "slug": slug.current,
    "statusSlug": status->slug.current
  },
  *[_type == "regulation" && status->slug.current == "in-force"] | order(_createdAt asc)[0...3]{
    _id,
    name,
    fullName,
    "slug": slug.current,
    "statusSlug": status->slug.current
  }
)`

// "In preparation" — curated picks from siteSettings (editable in Studio).
// Falls back to "first 2 regs with status preparation" if list is empty.
export const inPreparationRegulationsQuery = groq`coalesce(
  *[_id == "siteSettings"][0].homeInPreparationRegulations[]->{
    _id,
    name,
    fullName,
    "slug": slug.current,
    "statusSlug": status->slug.current
  },
  *[_type == "regulation" && status->slug.current == "preparation"] | order(_createdAt asc)[0...2]{
    _id,
    name,
    fullName,
    "slug": slug.current,
    "statusSlug": status->slug.current
  }
)`

// 7 value chain nodes in order.
export const nodesQuery = groq`*[_type == "node"] | order(order asc){
  _id,
  title,
  order,
  "slug": slug.current,
  shortBlurb,
  colorKey
}`

// Combined home query so we fetch in one round-trip.
export const homePageQuery = groq`{
  "settings":         ${siteSettingsQuery},
  "latestArticles":   ${latestArticlesQuery},
  "featuredCompany":  ${featuredCompanyQuery},
  "featuredReg":      ${featuredRegulationQuery},
  "inForceRegs":      ${inForceRegulationsQuery},
  "inPreparationRegs":${inPreparationRegulationsQuery},
  "nodes":            ${nodesQuery}
}`

// -- Companies -----------------------------------------------------------
export const companiesIndexQuery = groq`{
  "page": *[_id == "companiesPage"][0]{
    heading,
    subhead,
    methodNoteHeading,
    methodNoteBody
  },
  "settings": *[_id == "siteSettings"][0]{logoText, emptyNodeCompaniesMessage},
  "nodes": ${nodesQuery},
  "companies": *[_type == "company"] | order(name asc){
    _id,
    name,
    "slug": slug.current,
    location,
    businessModelSummary,
    tagline,
    logo,
    "nodes": nodes[]->{
      _id,
      title,
      "slug": slug.current,
      colorKey
    }
  }
}`

export const companyBySlugQuery = groq`*[_type == "company" && slug.current == $slug][0]{
  _id,
  name,
  "slug": slug.current,
  tagline,
  businessModelSummary,
  location,
  headquarters,
  founded,
  ownership,
  leadership,
  approximateSize,
  website,
  logo,
  heroImage,
  "nodes": nodes[]->{
    _id,
    title,
    "slug": slug.current,
    colorKey
  },
  "tags": tags[]->{
    _id,
    title,
    "slug": slug.current
  },
  businessModel,
  companySays,
  prefallAnalysis,
  regulatoryExposure[]{
    _key,
    materiality,
    directionShort,
    displayLabel,
    note,
    "regulation": regulation->{name, fullName, "slug": slug.current, "statusSlug": status->slug.current}
  },
  verifiableSignals[]{
    _key,
    label,
    body
  },
  sources
}`

// Related articles for a given company (used on profile page).
// Schema change: company → companies[] — query updated to use the array.
export const articlesForCompanyQuery = groq`*[_type == "article" && $companyId in companies[]._ref] | order(publishedAt desc)[0...6]{
  _id,
  title,
  "slug": slug.current,
  "category": category->{title, "slug": slug.current},
  readingMinutes,
  heroImage,
  cardImage,
  publishedAt
}`

// All company slugs (used by generateStaticParams)
export const allCompanySlugsQuery = groq`*[_type == "company" && defined(slug.current)][].slug.current`

// -- Regulation -----------------------------------------------------------

// All regulations grouped (resolves status once for sorting/grouping).
export const regulationIndexQuery = groq`{
  "page": *[_id == "regulationPage"][0]{
    heading,
    subhead,
    trackerTitle,
    trackerSubtitle,
    trackerCtaLabel,
    trackerCtaSubLabel
  },
  "statuses": *[_type == "regulationStatus"] | order(order asc){
    _id,
    title,
    "slug": slug.current,
    dotColor,
    badgeBg,
    badgeText,
    order
  },
  "regulations": *[_type == "regulation"] | order(name asc){
    _id,
    name,
    fullName,
    "slug": slug.current,
    shortSummary,
    enteredForce,
    nextDeadline,
    countdownTheme,
    countdownDescription,
    "status": status->{
      _id,
      title,
      "slug": slug.current,
      dotColor,
      badgeBg,
      badgeText
    },
    milestones[]{year, label, color}
  }
}`

export const regulationBySlugQuery = groq`*[_type == "regulation" && slug.current == $slug][0]{
  _id,
  name,
  fullName,
  "slug": slug.current,
  shortSummary,
  enteredForce,
  nextDeadline,
  countdownTheme,
  countdownDescription,
  "status": status->{
    title,
    "slug": slug.current,
    dotColor,
    badgeBg,
    badgeText
  },
  "nodes": nodes[]->{_id, title, "slug": slug.current, colorKey},
  summary,
  body,
  whoItAffects,
  whatItRequires,
  prefallAnalysis,
  milestones[]{year, label, color},
  sources
}`

export const allRegulationSlugsQuery = groq`*[_type == "regulation" && defined(slug.current)][].slug.current`

// -- Value chain ---------------------------------------------------------

export const valueChainPageQuery = groq`{
  "page": *[_id == "valueChainPage"][0]{
    heading,
    subhead,
    mapHintLabel,
    mapFooterNote
  },
  "settings": *[_id == "siteSettings"][0]{valueChainHeroCaption},
  "nodes": ${nodesQuery}
}`

export const nodeBySlugQuery = groq`{
  "node": *[_type == "node" && slug.current == $slug][0]{
    _id,
    title,
    order,
    "slug": slug.current,
    colorKey,
    shortBlurb,
    heroHeading,
    heroSummary,
    description,
    economics,
    tensions,
    nodeExplanation
  },
  "settings": *[_id == "siteSettings"][0]{emptyNodeCompaniesMessage},
  "siblings": *[_type == "node"] | order(order asc){
    _id, title, order, "slug": slug.current
  },
  "companies": *[_type == "company" && $slug in nodes[]->slug.current] | order(name asc){
    _id, name, "slug": slug.current, location, businessModelSummary, tagline, logo,
    "nodes": nodes[]->{_id, title, "slug": slug.current, colorKey}
  },
  "regulations": *[_type == "regulation" && $slug in nodes[]->slug.current] | order(name asc){
    _id, name, fullName, "slug": slug.current, shortSummary,
    "status": status->{title, "slug": slug.current}
  },
  "articles": *[_type == "article" && $slug in nodes[]->slug.current] | order(publishedAt desc)[0...6]{
    _id, title, "slug": slug.current,
    "category": category->{title, "slug": slug.current},
    readingMinutes, heroImage, publishedAt
  }
}`

export const allNodeSlugsQuery = groq`*[_type == "node" && defined(slug.current)][].slug.current`

// -- Articles ------------------------------------------------------------

export const articlesIndexQuery = groq`{
  "page": *[_id == "articlesPage"][0]{heading, subhead, emptyMessage},
  "categories": *[_type == "articleCategory"] | order(order asc){
    _id, title, "slug": slug.current, order
  },
  "articles": *[_type == "article"] | order(publishedAt desc){
    _id, title, "slug": slug.current, dek, publishedAt, readingMinutes, heroImage, cardImage,
    "category": category->{title, "slug": slug.current},
    modalSynopsis, modalTakeaways, modalPrimarySources, modalSectors
  }
}`

export const articleBySlugQuery = groq`*[_type == "article" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  dek,
  publishedAt,
  readingMinutes,
  author,
  heroImage,
  lead,
  body,
  sources,
  "category": category->{title, "slug": slug.current},
  "nodes": nodes[]->{_id, title, "slug": slug.current},
  "companies": companies[]->{_id, name, "slug": slug.current},
  "regulations": regulations[]->{_id, name, "slug": slug.current},
  "relatedArticles": relatedArticles[]->{
    _id, title, "slug": slug.current, readingMinutes, publishedAt, heroImage, cardImage,
    "category": category->{title, "slug": slug.current}
  }
}`

export const allArticleSlugsQuery = groq`*[_type == "article" && defined(slug.current)][].slug.current`

// (relatedArticlesQuery removed — the article detail page now uses
//  ONLY the manually-picked `relatedArticles` array per Ana Maria's spec.)

// -- Jobs ----------------------------------------------------------------

export const jobsIndexQuery = groq`{
  "page": *[_id == "jobsPage"][0]{heading, subhead, emptyMessage},
  "categories": *[_type == "jobCategory"] | order(order asc){
    _id, title, "slug": slug.current, order
  },
  "seniorities": *[_type == "jobSeniority"] | order(order asc){
    _id, title, "slug": slug.current, order
  },
  "countries": *[_type == "jobCountry"] | order(order asc){
    _id, title, "slug": slug.current, order
  },
  "jobs": *[_type == "job"] | order(publishedAt desc){
    _id, title, description, link, publishedAt, company, location, city,
    "category": category->{title, "slug": slug.current},
    "seniority": seniority->{title, "slug": slug.current},
    "country": country->{title, "slug": slug.current}
  }
}`

// -- Singletons (prose pages) --------------------------------------------

export const aboutPageQuery = groq`*[_id == "aboutPage"][0]{
  heroHeading, heroSubhead, portrait,
  sections[]{_key, label, heading, body},
  contactLeftLabel,
  contactLeftPressIntro, contactLeftPressEmail,
  contactLeftTipsIntro, contactLeftTipsEmail,
  contactFormTitle, contactFormSubtitle, contactSuccessTitle, contactSuccessBody
}`

export const methodologyPageQuery = groq`*[_id == "methodologyPage"][0]{
  heroHeading, heroSubhead,
  sections[]{_key, label, heading, body}
}`

export const privacyPageQuery = groq`*[_id == "privacyPage"][0]{
  heroHeading, heroSubhead,
  sections[]{_key, label, heading, body}
}`

export const newsletterPageQuery = groq`*[_id == "newsletterPage"][0]{
  kicker, heading, body,
  features[]{_key, number, text},
  submitLabel, inputPlaceholder, successTitle, successBody
}`
