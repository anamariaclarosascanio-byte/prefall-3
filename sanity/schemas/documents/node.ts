import {defineType} from 'sanity'

/**
 * Value chain node — there are exactly 7 of these, fixed forever per the launch
 * spec. The 7 slugs are: raw-materials, yarn-fabric, manufacturing, brands,
 * retail, consumer, secondary-market. Ana Maria edits content; the structure
 * group restricts deletion / creation past 7.
 *
 * Referenced by company.nodes, regulation.nodes, article.nodes.
 */
export const node = defineType({
  name: 'node',
  title: 'Value chain node',
  type: 'document',
  fields: [
    {
      name: 'order',
      type: 'number',
      title: 'Position (1–7)',
      description: 'Order along the value chain — 01 raw materials … 07 secondary market.',
      validation: (r) => r.required().min(1).max(7),
    },
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'Display name (e.g. "Raw Materials", "Yarn & Fabric").',
      validation: (r) => r.required(),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description: 'Fixed — do not change once set. URL: /value-chain/[slug].',
      options: {source: 'title', maxLength: 64},
      validation: (r) => r.required(),
    },
    {
      name: 'colorKey',
      type: 'string',
      title: 'Colour key (CSS data-node attribute)',
      description:
        'Matches the prototype data-node values: raw-materials, yarn-fabric, manufacturing, brands, retail, secondary-market. Consumer has no colour in prototype.',
    },
    {
      name: 'shortBlurb',
      type: 'text',
      rows: 2,
      title: 'Short description (vc-node__desc)',
      description: 'One-line summary shown under the node name on the value-chain map.',
    },
    {
      name: 'heroHeading',
      type: 'string',
      title: 'Hero heading',
      description: 'Big heading on the node detail page.',
    },
    {
      name: 'heroSummary',
      type: 'text',
      rows: 4,
      title: 'Hero summary',
      description: 'Lead paragraph on the node detail page.',
    },
    {
      name: 'description',
      type: 'blockContent',
      title: 'Description',
      description: 'Full description on the node detail page.',
    },
    {
      name: 'economics',
      type: 'blockContent',
      title: 'Economics',
    },
    {
      name: 'tensions',
      type: 'blockContent',
      title: 'Tensions',
    },
    {
      name: 'nodeExplanation',
      type: 'blockContent',
      title: 'Why this node matters',
    },
  ],
  orderings: [
    {
      title: 'Order along value chain',
      name: 'order',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', order: 'order', slug: 'slug.current'},
    prepare: ({title, order, slug}) => ({
      title: `${String(order).padStart(2, '0')} — ${title}`,
      subtitle: `/value-chain/${slug}`,
    }),
  },
})
