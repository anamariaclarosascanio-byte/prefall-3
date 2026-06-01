import {defineType} from 'sanity'

/**
 * Article category — the filter pill bar on /articles is generated from these
 * docs. Ana Maria adds new categories in Studio; the filter bar updates on
 * the next build. Seeded with the 9 categories in the prototype.
 */
export const articleCategory = defineType({
  name: 'articleCategory',
  title: 'Article category (filter)',
  type: 'document',
  fields: [
    {name: 'title', type: 'string', title: 'Title', validation: (r) => r.required()},
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {source: 'title', maxLength: 64},
      validation: (r) => r.required(),
    },
    {
      name: 'order',
      type: 'number',
      title: 'Order in filter bar',
      description: 'Lower numbers appear first. The "All" pill is always first.',
      initialValue: 0,
    },
  ],
  orderings: [
    {title: 'Order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {select: {title: 'title', subtitle: 'slug.current'}},
})
