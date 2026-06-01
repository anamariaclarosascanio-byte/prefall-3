import {defineType} from 'sanity'

/**
 * Job category — primary filter for /jobs (ESG & Compliance, Sustainability,
 * Regulation, Circularity). Matches the prototype's filter chips. Each
 * category carries an order so the filter bar respects intended sequencing.
 */
export const jobCategory = defineType({
  name: 'jobCategory',
  title: 'Job category (filter)',
  type: 'document',
  fields: [
    {name: 'title', type: 'string', title: 'Title', validation: (r) => r.required()},
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description: 'Stable identifier used by the filter UI (e.g. esg, sustainability).',
      options: {source: 'title', maxLength: 64},
      validation: (r) => r.required(),
    },
    {
      name: 'order',
      type: 'number',
      title: 'Order in filter bar',
      initialValue: 0,
    },
  ],
  orderings: [
    {title: 'Order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {select: {title: 'title', subtitle: 'slug.current'}},
})
