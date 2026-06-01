import {defineType} from 'sanity'

export const regulationPage = defineType({
  name: 'regulationPage',
  title: 'Regulation index page',
  type: 'document',
  fields: [
    {name: 'heading', type: 'string', title: 'Heading', initialValue: 'Regulation'},
    {name: 'subhead', type: 'text', rows: 4, title: 'Subhead'},
    {
      name: 'trackerTitle',
      type: 'string',
      title: 'Tracker title',
      initialValue: 'Tracker — EU sustainability rules',
    },
    {
      name: 'trackerSubtitle',
      type: 'text',
      rows: 3,
      title: 'Tracker subtitle',
    },
    {
      name: 'trackerCtaLabel',
      type: 'string',
      title: 'Tracker CTA label',
      initialValue: 'Read the latest analysis',
    },
    {
      name: 'trackerCtaSubLabel',
      type: 'string',
      title: 'Tracker CTA sub-label',
    },
  ],
  preview: {prepare: () => ({title: 'Regulation index page'})},
})
