import {defineType} from 'sanity'

/**
 * Job seniority — filter for /jobs. Each level can carry its own colour to
 * match the prototype's seniority-tag--senior/mid/junior styling.
 */
export const jobSeniority = defineType({
  name: 'jobSeniority',
  title: 'Job seniority (filter)',
  type: 'document',
  fields: [
    {name: 'title', type: 'string', title: 'Title', validation: (r) => r.required()},
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description: 'Maps to CSS modifier: junior | mid | senior.',
      options: {
        source: 'title',
        maxLength: 64,
      },
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
