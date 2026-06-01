import {defineType} from 'sanity'

/**
 * Job country — controlled list (so filter chips stay clean). Each entry has
 * a title (e.g. "Germany") and a slug (e.g. "germany"). Add countries in
 * Studio as new postings appear; the filter bar reflects whatever exists.
 */
export const jobCountry = defineType({
  name: 'jobCountry',
  title: 'Job country (filter)',
  type: 'document',
  fields: [
    {name: 'title', type: 'string', title: 'Country name', validation: (r) => r.required()},
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
      initialValue: 0,
    },
  ],
  orderings: [
    {title: 'Order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
    {title: 'A → Z', name: 'titleAsc', by: [{field: 'title', direction: 'asc'}]},
  ],
  preview: {select: {title: 'title', subtitle: 'slug.current'}},
})
