import {defineType} from 'sanity'

/**
 * Job listing — empty at launch. Filter by seniority on /jobs.
 */
export const job = defineType({
  name: 'job',
  title: 'Job listing',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Role title',
      validation: (r) => r.required(),
    },
    {
      name: 'description',
      type: 'text',
      rows: 5,
      title: 'Description',
    },
    {
      name: 'category',
      type: 'reference',
      title: 'Category',
      to: [{type: 'jobCategory'}],
      description: 'Drives the filter chips on /jobs (ESG, Sustainability, Regulation, Circularity).',
      validation: (r) => r.required(),
    },
    {
      name: 'seniority',
      type: 'reference',
      title: 'Seniority',
      to: [{type: 'jobSeniority'}],
      description: 'Shown as a coloured tag next to the role title.',
      validation: (r) => r.required(),
    },
    {
      name: 'link',
      type: 'url',
      title: 'External application link',
      description: 'Optional. If absent, the listing renders without click-through.',
      validation: (r) => r.uri({scheme: ['http', 'https', 'mailto']}),
    },
    {
      name: 'publishedAt',
      type: 'date',
      title: 'Published',
      initialValue: () => new Date().toISOString().split('T')[0],
      validation: (r) => r.required(),
    },
    {
      name: 'company',
      type: 'string',
      title: 'Hiring organisation (free text)',
      description: 'Optional. Not a reference — jobs are not cross-linked per spec.',
    },
    {
      name: 'location',
      type: 'string',
      title: 'Location (free text — shown in the meta row)',
      description: 'Display string only. For filtering use the Country + City fields below.',
    },
    {
      name: 'country',
      type: 'reference',
      title: 'Country',
      to: [{type: 'jobCountry'}],
      description: 'Drives the Country filter chips on /jobs.',
    },
    {
      name: 'city',
      type: 'string',
      title: 'City',
      description: 'Free text. The /jobs page builds City filter chips from whatever values exist across all jobs.',
    },
  ],
  orderings: [
    {title: 'Newest first', name: 'publishedDesc', by: [{field: 'publishedAt', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'title', subtitle: 'seniority.title'},
  },
})
