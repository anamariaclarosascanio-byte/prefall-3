import {defineType} from 'sanity'

export const jobsPage = defineType({
  name: 'jobsPage',
  title: 'Jobs page',
  type: 'document',
  fields: [
    {name: 'heading', type: 'string', title: 'Heading'},
    {name: 'subhead', type: 'text', rows: 4, title: 'Subhead'},
    {
      name: 'emptyMessage',
      type: 'text',
      rows: 2,
      title: 'Empty-state message (shown when no jobs in Sanity)',
    },
  ],
  preview: {prepare: () => ({title: 'Jobs page'})},
})
