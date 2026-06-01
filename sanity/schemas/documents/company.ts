import {defineType} from 'sanity'

/**
 * Company — appears on /companies index + /companies/[slug] detail page + as
 * featured-company on home + on each node detail page (filtered by node ref).
 * Veja, Vestiaire, Circulose are seeded at launch.
 */
export const company = defineType({
  name: 'company',
  title: 'Company',
  type: 'document',
  groups: [
    {name: 'identity', title: 'Identity', default: true},
    {name: 'images', title: 'Images'},
    {name: 'meta', title: 'Meta box'},
    {name: 'content', title: 'Analysis'},
    {name: 'exposure', title: 'Regulatory exposure'},
    {name: 'signals', title: 'Verifiable signals'},
    {name: 'sources', title: 'Sources'},
  ],
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Company name',
      group: 'identity',
      validation: (r) => r.required(),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      group: 'identity',
      options: {source: 'name', maxLength: 96},
      validation: (r) => r.required(),
    },
    {
      name: 'tagline',
      type: 'text',
      rows: 3,
      title: 'Tagline / one-line description',
      group: 'identity',
      description: 'Hero subhead on the profile and short summary on directory cards.',
    },
    {
      name: 'businessModelSummary',
      type: 'text',
      rows: 4,
      title: 'Business model summary (directory card)',
      group: 'identity',
      description: 'Used on the companies index card (company-card__model).',
    },
    {
      name: 'location',
      type: 'string',
      title: 'Location (city, country)',
      group: 'identity',
    },
    {
      name: 'nodes',
      type: 'array',
      title: 'Value chain nodes',
      group: 'identity',
      description: 'Where this company operates in the value chain. Drives placement.',
      of: [{type: 'reference', to: [{type: 'node'}]}],
      validation: (r) => r.min(1),
    },
    {
      name: 'tags',
      type: 'array',
      title: 'Tags (re-commerce, B Corp, etc.)',
      group: 'identity',
      of: [{type: 'reference', to: [{type: 'companyTag'}]}],
    },

    {
      name: 'logo',
      type: 'image',
      title: 'Logo (directory card)',
      group: 'images',
      options: {hotspot: true},
      description: 'Square or 4:3 logo shown on the directory card.',
      fields: [{name: 'alt', type: 'string', title: 'Alt text'}],
    },
    {
      name: 'heroImage',
      type: 'image',
      title: 'Hero image (profile page gallery)',
      group: 'images',
      options: {hotspot: true},
      description: 'Wide 21:8 image on the company profile page.',
      fields: [{name: 'alt', type: 'string', title: 'Alt text'}],
    },

    {
      name: 'headquarters',
      type: 'string',
      title: 'Headquarters',
      group: 'meta',
    },
    {
      name: 'founded',
      type: 'string',
      title: 'Founded',
      group: 'meta',
      description: 'Free text: e.g. "2009, by Fanny Moizant and Sophie Hersan".',
    },
    {
      name: 'ownership',
      type: 'text',
      rows: 2,
      title: 'Ownership',
      group: 'meta',
    },
    {
      name: 'leadership',
      type: 'string',
      title: 'Leadership',
      group: 'meta',
    },
    {
      name: 'approximateSize',
      type: 'string',
      title: 'Approximate size',
      group: 'meta',
      description: 'e.g. "~600 employees, 100+ in authentication".',
    },
    {
      name: 'website',
      type: 'url',
      title: 'Website',
      group: 'meta',
      validation: (r) => r.uri({scheme: ['http', 'https']}),
    },

    {
      name: 'businessModel',
      type: 'blockContent',
      title: 'Business model',
      group: 'content',
    },
    {
      name: 'companySays',
      type: 'blockContent',
      title: 'What the company says about itself',
      group: 'content',
    },
    {
      name: 'prefallAnalysis',
      type: 'blockContent',
      title: "Prefall's analysis",
      group: 'content',
    },

    {
      name: 'regulatoryExposure',
      type: 'array',
      title: 'Regulatory exposure',
      group: 'exposure',
      of: [
        {
          type: 'object',
          name: 'exposureItem',
          fields: [
            {
              name: 'regulation',
              type: 'reference',
              to: [{type: 'regulation'}],
              title: 'Regulation',
              validation: (r) => r.required(),
            },
            {
              name: 'displayLabel',
              type: 'string',
              title: 'Display label (optional override)',
              description:
                'Optional label shown next to the badge. Use when the entry covers more than one regulation, e.g. "ESPR & Digital Product Passport" or "Waste Framework Directive & Textile EPR". Falls back to the referenced regulation\'s name.',
            },
            {
              name: 'materiality',
              type: 'string',
              title: 'Materiality',
              options: {
                list: [
                  {title: 'Low', value: 'low'},
                  {title: 'Low-Medium', value: 'low-medium'},
                  {title: 'Medium', value: 'medium'},
                  {title: 'High', value: 'high'},
                ],
              },
            },
            {
              name: 'directionShort',
              type: 'string',
              title: 'Direction (short)',
              description: 'e.g. "net positive", "net negative", "neutral".',
            },
            {
              name: 'note',
              type: 'text',
              rows: 3,
              title: 'Note',
            },
          ],
          preview: {
            select: {
              title: 'regulation.name',
              subtitle: 'materiality',
            },
          },
        },
      ],
    },

    {
      name: 'verifiableSignals',
      type: 'array',
      title: 'Publicly verifiable signals',
      group: 'signals',
      of: [
        {
          type: 'object',
          name: 'signal',
          fields: [
            {
              name: 'label',
              type: 'string',
              title: 'Label',
              description: 'e.g. "Funding", "Valuation", "Scale".',
              validation: (r) => r.required(),
            },
            {
              name: 'body',
              type: 'text',
              rows: 3,
              title: 'Body',
              validation: (r) => r.required(),
            },
          ],
          preview: {select: {title: 'label', subtitle: 'body'}},
        },
      ],
    },

    {
      name: 'sources',
      type: 'blockContent',
      title: 'Sources',
      group: 'sources',
    },
  ],
  orderings: [
    {title: 'Newest first', name: 'createdDesc', by: [{field: '_createdAt', direction: 'desc'}]},
    {title: 'A → Z', name: 'nameAsc', by: [{field: 'name', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'name', subtitle: 'location', media: 'logo'},
  },
})
