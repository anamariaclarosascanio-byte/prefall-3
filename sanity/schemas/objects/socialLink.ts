import {defineType} from 'sanity'

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social link',
  type: 'object',
  fields: [
    {name: 'label', type: 'string', title: 'Label', validation: (r) => r.required()},
    {
      name: 'url',
      type: 'url',
      title: 'URL',
      validation: (r) => r.required(),
    },
  ],
  preview: {select: {title: 'label', subtitle: 'url'}},
})
