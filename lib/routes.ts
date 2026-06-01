/**
 * Centralized site routes. Used by chrome (header, mobile nav, footer) and
 * any cross-page links. Keeps slugs in one place so renaming a route is one
 * edit.
 */
export const routes = {
  home: '/',
  articles: '/articles',
  companies: '/companies',
  regulation: '/regulation',
  valueChain: '/value-chain',
  jobs: '/jobs',
  newsletter: '/newsletter',
  about: '/about',
  methodology: '/methodology',
  privacy: '/privacy',
  notFound: '/not-found',
} as const

export const primaryNav = [
  {label: 'Articles', href: routes.articles},
  {label: 'Companies', href: routes.companies},
  {label: 'Regulation', href: routes.regulation},
  {label: 'Value Chain', href: routes.valueChain},
  {label: 'Jobs', href: routes.jobs},
  {label: 'Newsletter', href: routes.newsletter},
  {label: 'About', href: routes.about},
] as const
