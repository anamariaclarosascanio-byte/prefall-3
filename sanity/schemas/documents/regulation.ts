import {defineType} from 'sanity'

/**
 * Regulation — index, single detail page, tracker grid cells, and the home
 * "Regulation that matters now" module. 14 regs seeded at launch.
 */
export const regulation = defineType({
  name: 'regulation',
  title: 'Regulation',
  type: 'document',
  groups: [
    {name: 'identity', title: 'Identity', default: true},
    {name: 'timeline', title: 'Timeline & tracker'},
    {name: 'content', title: 'Detail page'},
    {name: 'sources', title: 'Sources'},
  ],
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Short name',
      description: 'e.g. "CSRD", "ESPR". Shown as the badge.',
      group: 'identity',
      validation: (r) => r.required(),
    },
    {
      name: 'fullName',
      type: 'string',
      title: 'Full name',
      description: 'e.g. "Corporate Sustainability Reporting Directive".',
      group: 'identity',
      validation: (r) => r.required(),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      group: 'identity',
      options: {source: 'name', maxLength: 64},
      validation: (r) => r.required(),
    },
    {
      name: 'status',
      type: 'reference',
      title: 'Status',
      group: 'identity',
      to: [{type: 'regulationStatus'}],
      validation: (r) => r.required(),
    },
    {
      name: 'shortSummary',
      type: 'text',
      rows: 3,
      title: 'Short summary',
      group: 'identity',
      description: 'Shown on index list and tracker tooltips.',
    },
    {
      name: 'nodes',
      type: 'array',
      title: 'Applicable nodes',
      group: 'identity',
      of: [{type: 'reference', to: [{type: 'node'}]}],
      description: 'Drives node-page visibility and exposure layer rendering.',
    },

    {
      name: 'enteredForce',
      type: 'date',
      title: 'Date entered force / current milestone',
      group: 'timeline',
    },
    {
      name: 'nextDeadline',
      type: 'date',
      title: 'Next deadline (countdown)',
      group: 'timeline',
      description: 'If set, contributes to /regulation tracker countdowns.',
    },
    {
      name: 'countdownTheme',
      type: 'string',
      title: 'Countdown theme label',
      group: 'timeline',
      description: 'Eyebrow above the countdown (e.g. "REPORTING THRESHOLD").',
    },
    {
      name: 'countdownDescription',
      type: 'text',
      rows: 2,
      title: 'Countdown description',
      group: 'timeline',
    },
    {
      name: 'milestones',
      type: 'array',
      title: 'Timeline milestones (tracker grid)',
      group: 'timeline',
      description:
        'Each milestone is one labelled cell on the cartography grid. Year + label + colour (hex).',
      of: [
        {
          type: 'object',
          name: 'milestone',
          fields: [
            {name: 'year', type: 'number', title: 'Year', validation: (r) => r.required()},
            {name: 'label', type: 'string', title: 'Label', validation: (r) => r.required()},
            {name: 'color', type: 'string', title: 'Cell colour (hex)'},
          ],
          preview: {select: {title: 'label', subtitle: 'year'}},
        },
      ],
    },

    {
      name: 'summary',
      type: 'blockContent',
      title: 'Detail page summary (lead)',
      group: 'content',
    },
    {
      name: 'body',
      type: 'blockContent',
      title: 'Detail page body',
      group: 'content',
    },
    {
      name: 'whoItAffects',
      type: 'blockContent',
      title: 'Who it affects',
      group: 'content',
    },
    {
      name: 'whatItRequires',
      type: 'blockContent',
      title: 'What it requires',
      group: 'content',
    },
    {
      name: 'prefallAnalysis',
      type: 'blockContent',
      title: "Prefall's analysis",
      group: 'content',
    },

    {
      name: 'sources',
      type: 'blockContent',
      title: 'Sources',
      group: 'sources',
    },
  ],
  orderings: [
    {title: 'Name', name: 'nameAsc', by: [{field: 'name', direction: 'asc'}]},
    {
      title: 'Status then name',
      name: 'statusName',
      by: [
        {field: 'status._ref', direction: 'asc'},
        {field: 'name', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {title: 'name', subtitle: 'fullName'},
  },
})
