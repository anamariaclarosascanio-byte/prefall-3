import {defineType} from 'sanity'

export const companiesPage = defineType({
  name: 'companiesPage',
  title: 'Companies index page',
  type: 'document',
  fields: [
    {name: 'heading', type: 'string', title: 'Heading', initialValue: 'Companies'},
    {name: 'subhead', type: 'text', rows: 4, title: 'Subhead'},
    {
      name: 'methodNoteHeading',
      type: 'string',
      title: 'Method note heading',
      initialValue: 'How this directory works',
    },
    {
      name: 'methodNoteBody',
      type: 'text',
      rows: 5,
      title: 'Method note body',
    },
  ],
  preview: {prepare: () => ({title: 'Companies index page'})},
})
