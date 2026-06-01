import {defineType} from 'sanity'

export const newsletterPage = defineType({
  name: 'newsletterPage',
  title: 'Newsletter page',
  type: 'document',
  fields: [
    {name: 'kicker', type: 'string', title: 'Kicker (eyebrow)'},
    {name: 'heading', type: 'string', title: 'Heading'},
    {name: 'body', type: 'text', rows: 4, title: 'Body'},
    {
      name: 'features',
      type: 'array',
      title: 'Feature columns (4)',
      of: [
        {
          type: 'object',
          name: 'feature',
          fields: [
            {name: 'number', type: 'string', title: 'Number / label'},
            {name: 'text', type: 'text', rows: 3, title: 'Text'},
          ],
          preview: {select: {title: 'number', subtitle: 'text'}},
        },
      ],
    },
    {name: 'submitLabel', type: 'string', title: 'Submit button label', initialValue: 'Subscribe'},
    {name: 'inputPlaceholder', type: 'string', title: 'Email input placeholder', initialValue: 'Your email address'},
    {name: 'successTitle', type: 'string', title: 'Success title', initialValue: 'You\'re in.'},
    {name: 'successBody', type: 'text', rows: 3, title: 'Success body'},
  ],
  preview: {prepare: () => ({title: 'Newsletter page'})},
})
