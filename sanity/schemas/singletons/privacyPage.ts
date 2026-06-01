import {defineType} from 'sanity'

export const privacyPage = defineType({
  name: 'privacyPage',
  title: 'Privacy page',
  type: 'document',
  fields: [
    {name: 'heroHeading', type: 'string', title: 'Hero heading'},
    {name: 'heroSubhead', type: 'text', rows: 4, title: 'Hero subhead'},
    {
      name: 'sections',
      type: 'array',
      title: 'Prose sections',
      of: [
        {
          type: 'object',
          name: 'proseSection',
          fields: [
            {name: 'label', type: 'string', title: 'Side label (eyebrow)'},
            {name: 'heading', type: 'string', title: 'Heading'},
            {name: 'body', type: 'blockContent', title: 'Body'},
          ],
          preview: {select: {title: 'heading', subtitle: 'label'}},
        },
      ],
    },
  ],
  preview: {prepare: () => ({title: 'Privacy page'})},
})
