import {defineType} from 'sanity'

/**
 * Article — long-form editorial piece. None at launch. Once created in Studio
 * each appears on home (most recent), on /articles, and on any related
 * node/company/regulation pages via references.
 *
 * Per launch spec: tag once → appears everywhere relevant.
 */
export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  groups: [
    {name: 'identity', title: 'Identity', default: true},
    {name: 'body', title: 'Body'},
    {name: 'modal', title: 'Modal preview'},
    {name: 'relationships', title: 'Relationships'},
  ],
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      group: 'identity',
      validation: (r) => r.required(),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      group: 'identity',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required(),
    },
    {
      name: 'category',
      type: 'reference',
      title: 'Category',
      group: 'identity',
      to: [{type: 'articleCategory'}],
      validation: (r) => r.required(),
    },
    {
      name: 'dek',
      type: 'text',
      rows: 3,
      title: 'Dek (sub-headline)',
      group: 'identity',
    },
    {
      name: 'author',
      type: 'string',
      title: 'Author',
      group: 'identity',
      initialValue: 'Ana Maria Claros',
    },
    {
      name: 'publishedAt',
      type: 'date',
      title: 'Published',
      group: 'identity',
      validation: (r) => r.required(),
    },
    {
      name: 'readingMinutes',
      type: 'number',
      title: 'Reading time (minutes)',
      group: 'identity',
    },
    {
      name: 'heroImage',
      type: 'image',
      title: 'Hero image (inside the article)',
      group: 'identity',
      options: {hotspot: true},
      description:
        'Wide image shown above the article body on the detail page. Rendered at the image\'s natural aspect ratio inside a 16:7 frame.',
      fields: [{name: 'alt', type: 'string', title: 'Alt text'}],
    },
    {
      name: 'cardImage',
      type: 'image',
      title: 'Card image (used in every card listing)',
      group: 'identity',
      options: {hotspot: true},
      description:
        'Image shown on the article card across the site: home "Reading now", the /articles index, related articles at the bottom of other articles, and the modal preview. Typically a portrait or square crop. If left empty, the Hero image is used as a fallback.',
      fields: [{name: 'alt', type: 'string', title: 'Alt text'}],
    },

    {
      name: 'lead',
      type: 'text',
      rows: 4,
      title: 'Lead paragraph (separate from body)',
      group: 'body',
      description: 'Rendered with the .article-page__lead style.',
    },
    {
      name: 'body',
      type: 'blockContent',
      title: 'Body',
      group: 'body',
    },
    {
      name: 'sources',
      type: 'blockContent',
      title: 'Sources',
      group: 'body',
    },

    {
      name: 'modalSynopsis',
      type: 'text',
      rows: 4,
      title: 'Modal: synopsis',
      group: 'modal',
    },
    {
      name: 'modalTakeaways',
      type: 'array',
      title: 'Modal: key takeaways',
      group: 'modal',
      of: [{type: 'string'}],
    },
    {
      name: 'modalPrimarySources',
      type: 'array',
      title: 'Modal: primary sources',
      group: 'modal',
      of: [{type: 'string'}],
    },
    {
      name: 'modalSectors',
      type: 'array',
      title: 'Modal: sectors implicated (chips)',
      group: 'modal',
      of: [{type: 'string'}],
    },

    {
      name: 'nodes',
      type: 'array',
      title: 'Related value chain nodes',
      group: 'relationships',
      of: [{type: 'reference', to: [{type: 'node'}]}],
    },
    {
      name: 'companies',
      type: 'array',
      title: 'Related companies (optional)',
      group: 'relationships',
      description: 'Articles can reference multiple companies.',
      of: [{type: 'reference', to: [{type: 'company'}]}],
    },
    {
      name: 'regulations',
      type: 'array',
      title: 'Related regulations (optional)',
      group: 'relationships',
      description: 'Articles can reference multiple regulations.',
      of: [{type: 'reference', to: [{type: 'regulation'}]}],
    },
    {
      name: 'relatedArticles',
      type: 'array',
      title: 'Related articles (manual selection)',
      group: 'relationships',
      description:
        'Pick up to 3 articles to show in the "Related on Prefall" section at the bottom of this article. If left empty, related articles are picked automatically by shared nodes/category.',
      of: [{type: 'reference', to: [{type: 'article'}]}],
      validation: (r) => r.max(3),
    },
  ],
  orderings: [
    {title: 'Newest first', name: 'publishedDesc', by: [{field: 'publishedAt', direction: 'desc'}]},
    {title: 'Oldest first', name: 'publishedAsc', by: [{field: 'publishedAt', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', subtitle: 'category.title', media: 'heroImage'},
  },
})
