import {defineType} from 'sanity'

/**
 * Site settings — singleton. Everything visible in the chrome and on top-level
 * sections that needs to be editable from one place. Ana Maria never touches
 * code to change these.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    {name: 'header', title: 'Header', default: true},
    {name: 'home', title: 'Home page copy'},
    {name: 'footer', title: 'Footer'},
    {name: 'cookies', title: 'Cookie banner'},
    {name: 'empty', title: 'Empty-state messages'},
  ],
  fields: [
    // header
    {
      name: 'logoText',
      type: 'string',
      title: 'Logo text',
      group: 'header',
      initialValue: 'PREFALL',
    },

    // home
    {
      name: 'heroLabel',
      type: 'string',
      title: 'Hero label (eyebrow)',
      group: 'home',
    },
    {
      name: 'heroHeading',
      type: 'text',
      rows: 3,
      title: 'Hero heading',
      group: 'home',
    },
    {
      name: 'heroBody',
      type: 'text',
      rows: 4,
      title: 'Hero body',
      group: 'home',
    },
    {
      name: 'heroPrimaryCtaLabel',
      type: 'string',
      title: 'Hero primary CTA label',
      group: 'home',
      initialValue: 'Read the latest →',
    },
    {
      name: 'heroSecondaryCtaLabel',
      type: 'string',
      title: 'Hero secondary CTA label',
      group: 'home',
      initialValue: 'Get in touch →',
    },
    {
      name: 'readingNowSectionLabel',
      type: 'string',
      title: '"Reading now" section label',
      group: 'home',
      initialValue: 'Reading now',
    },
    {
      name: 'readingNowIntroBody',
      type: 'text',
      rows: 3,
      title: '"Reading now" intro body',
      group: 'home',
    },
    {
      name: 'fromTheDirectoryLabel',
      type: 'string',
      title: '"From the directory" label',
      group: 'home',
      initialValue: 'From the directory',
    },
    {
      name: 'regulationFocusLabel',
      type: 'string',
      title: '"Regulation that matters now" label',
      group: 'home',
      initialValue: 'Regulation that matters now',
    },
    // Home "Regulation that matters now" curation — three editable picks so
    // Ana controls exactly which regulations appear (featured + two lists).
    {
      name: 'homeFeaturedRegulation',
      type: 'reference',
      title: 'Home — featured regulation (big card)',
      group: 'home',
      to: [{type: 'regulation'}],
      description: 'The regulation shown large on the left of "Regulation that matters now". Falls back to CSRD if empty.',
    },
    {
      name: 'homeAlsoInForceRegulations',
      type: 'array',
      title: 'Home — "Also in force" list',
      group: 'home',
      of: [{type: 'reference', to: [{type: 'regulation'}]}],
      validation: (Rule) => Rule.max(3),
      description: 'Up to 3 regulations shown in the middle column. Order matters.',
    },
    {
      name: 'homeInPreparationRegulations',
      type: 'array',
      title: 'Home — "In preparation" list',
      group: 'home',
      of: [{type: 'reference', to: [{type: 'regulation'}]}],
      validation: (Rule) => Rule.max(3),
      description: 'Up to 3 regulations shown in the right column. Order matters.',
    },
    {
      name: 'valueChainHeroHeading',
      type: 'string',
      title: 'Value chain preview heading',
      group: 'home',
      initialValue: 'The fashion value chain',
    },
    {
      name: 'valueChainHeroSubhead',
      type: 'text',
      rows: 3,
      title: 'Value chain preview subhead',
      group: 'home',
    },
    {
      name: 'valueChainHeroCaption',
      type: 'text',
      rows: 3,
      title: 'Value chain preview caption (below nodes grid)',
      group: 'home',
    },
    {
      name: 'homeFullWidthImage',
      type: 'image',
      title: 'Home full-width image',
      group: 'home',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Alt text'}],
    },

    // footer
    {
      name: 'footerCtaTitle',
      type: 'text',
      rows: 3,
      title: 'Footer CTA title',
      group: 'footer',
      description: 'Wrap the italic accent word(s) in {{accent}}…{{/accent}}.',
    },
    {
      name: 'footerNewsletterCtaLabel',
      type: 'string',
      title: 'Footer newsletter CTA label',
      group: 'footer',
      initialValue: 'Subscribe to the newsletter',
    },
    {
      name: 'footerContactCtaLabel',
      type: 'string',
      title: 'Footer contact CTA label',
      group: 'footer',
      initialValue: 'Get in touch →',
    },
    {
      name: 'footerTagline',
      type: 'text',
      rows: 3,
      title: 'Footer tagline',
      group: 'footer',
    },
    {
      name: 'socialLinks',
      type: 'array',
      title: 'Footer social links',
      group: 'footer',
      of: [{type: 'socialLink'}],
    },
    {
      name: 'footerCopyright',
      type: 'string',
      title: 'Footer copyright',
      group: 'footer',
    },

    // cookies
    {
      name: 'cookieBannerText',
      type: 'text',
      rows: 3,
      title: 'Cookie banner text',
      group: 'cookies',
    },
    {
      name: 'cookieAcceptLabel',
      type: 'string',
      title: 'Accept analytics label',
      group: 'cookies',
      initialValue: 'Accept analytics',
    },
    {
      name: 'cookieEssentialLabel',
      type: 'string',
      title: 'Essential only label',
      group: 'cookies',
      initialValue: 'Essential only',
    },

    // empty
    {
      name: 'emptyNodeCompaniesMessage',
      type: 'text',
      rows: 2,
      title: 'Empty-state line for nodes with no companies',
      group: 'empty',
      initialValue:
        'Prefall has not yet profiled companies operating at this node.',
    },
    {
      name: 'emptyArticlesMessage',
      type: 'string',
      title: 'Empty-state line for /articles when no articles exist',
      group: 'empty',
    },
    {
      name: 'emptyJobsMessage',
      type: 'string',
      title: 'Empty-state line for /jobs when no listings exist',
      group: 'empty',
    },
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})
