import {defineType} from 'sanity'

export const articlesPage = defineType({
  name: 'articlesPage',
  title: 'Articles index page',
  type: 'document',
  fields: [
    {name: 'heading', type: 'string', title: 'Heading', initialValue: 'Articles'},
    {name: 'subhead', type: 'text', rows: 4, title: 'Subhead'},
    {
      name: 'emptyMessage',
      type: 'text',
      rows: 2,
      title: 'Empty-state message (shown when no articles in Sanity)',
    },
  ],
  preview: {prepare: () => ({title: 'Articles index page'})},
})
