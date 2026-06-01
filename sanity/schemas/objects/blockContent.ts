import {defineType, defineArrayMember} from 'sanity'

/**
 * Block content for article bodies, prose pages, company sections, regulation
 * detail bodies, About / Methodology / Privacy pages.
 *
 * Mirrors the prototype's typography (lead paragraph, h2, h3, pullquote, inline
 * figure) so the renderer can map each block style to the exact prototype class.
 */
export const blockContent = defineType({
  title: 'Block content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2 (article-page__h2)', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'Lead paragraph (article-page__lead)', value: 'lead'},
        {title: 'Pullquote (article-page__pullquote)', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'External link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (rule) =>
                  rule.uri({scheme: ['http', 'https', 'mailto', 'tel']}),
              },
              {
                name: 'blank',
                type: 'boolean',
                title: 'Open in new tab',
                initialValue: false,
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      title: 'Inline figure',
      name: 'figure',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Description for screen readers.',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
          description:
            'Rendered as <figcaption> under the image (prototype: article-page__figure figcaption).',
        },
      ],
    }),
    defineArrayMember({
      type: 'object',
      name: 'htmlEmbed',
      title: 'HTML embed',
      fields: [
        {
          name: 'code',
          type: 'text',
          rows: 8,
          title: 'HTML code',
          description:
            'Raw HTML inserted directly into the article. Use for iframes (YouTube, charts, etc.), custom layouts, or anything beyond the standard block types. NOTE: this HTML is rendered as-is — only paste from trusted sources.',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption (optional)',
          description: 'Shown below the embed.',
        },
      ],
      preview: {
        select: {code: 'code', caption: 'caption'},
        prepare: ({code, caption}) => ({
          title: caption || 'HTML embed',
          subtitle: code ? `${code.replace(/<[^>]+>/g, '').slice(0, 60)}…` : '(empty)',
        }),
      },
    }),
  ],
})
