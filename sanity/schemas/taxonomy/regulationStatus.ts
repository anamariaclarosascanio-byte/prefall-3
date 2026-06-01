import {defineType} from 'sanity'

/**
 * Regulation status — drives:
 *  • the status-badge dot colour and badge classes on regulation pages
 *  • the grouping headings on /regulation
 *  • the tracker (cartography) legend
 * Seeded with In force / In transposition / In preparation / Withdrawn / Amended.
 */
export const regulationStatus = defineType({
  name: 'regulationStatus',
  title: 'Regulation status (filter)',
  type: 'document',
  fields: [
    {name: 'title', type: 'string', title: 'Title', validation: (r) => r.required()},
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description:
        'Maps to CSS modifier: in-force | enforced | transpos | preparation | withdrawn | amended.',
      options: {source: 'title', maxLength: 64},
      validation: (r) => r.required(),
    },
    {
      name: 'dotColor',
      type: 'string',
      title: 'Status dot colour (hex)',
      description: 'Used by status-badge__dot. e.g. #059669 (active green).',
    },
    {
      name: 'badgeBg',
      type: 'string',
      title: 'Badge background (hex/rgba)',
    },
    {
      name: 'badgeText',
      type: 'string',
      title: 'Badge text colour (hex)',
    },
    {
      name: 'order',
      type: 'number',
      title: 'Order in groupings',
      initialValue: 0,
    },
  ],
  orderings: [
    {title: 'Order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {select: {title: 'title', subtitle: 'slug.current'}},
})
