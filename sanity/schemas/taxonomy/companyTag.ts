import {defineType} from 'sanity'

/**
 * Company tag — for extra hero pills like "Re-commerce", "B Corp" that aren't
 * value chain nodes. Distinct from node references. Multi-select on each
 * company.
 */
export const companyTag = defineType({
  name: 'companyTag',
  title: 'Company tag',
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
  ],
  preview: {select: {title: 'title', subtitle: 'slug.current'}},
})
