import {defineType} from 'sanity'

export const valueChainPage = defineType({
  name: 'valueChainPage',
  title: 'Value chain page',
  type: 'document',
  fields: [
    {name: 'heading', type: 'string', title: 'Heading', initialValue: 'The fashion value chain'},
    {name: 'subhead', type: 'text', rows: 4, title: 'Subhead'},
    {name: 'mapHintLabel', type: 'string', title: 'Map hint label'},
    {name: 'mapFooterNote', type: 'text', rows: 3, title: 'Map footer note'},
  ],
  preview: {prepare: () => ({title: 'Value chain page'})},
})
