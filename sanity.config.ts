import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes, SINGLETON_ACTIONS, SINGLETON_TYPES} from './sanity/schemas'
import {structure} from './sanity/structure'
import {apiVersion, dataset, projectId} from './sanity/env'

export default defineConfig({
  name: 'default',
  title: 'prefall-3',
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Hide singleton types from the global "Create new" menu — they live as
    // single documents in the structure sidebar.
    templates: (templates) =>
      templates.filter(({schemaType}) => !SINGLETON_TYPES.has(schemaType)),
  },
  document: {
    // Block delete/duplicate on singletons so the doc IDs stay stable.
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(({action}) => action && SINGLETON_ACTIONS.has(action))
        : input,
  },
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
