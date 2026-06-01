import type {SchemaTypeDefinition} from 'sanity'

// Shared objects
import {blockContent} from './objects/blockContent'
import {socialLink} from './objects/socialLink'

// Filter taxonomies (live, editable, drive filter bars)
import {articleCategory} from './taxonomy/articleCategory'
import {companyTag} from './taxonomy/companyTag'
import {jobSeniority} from './taxonomy/jobSeniority'
import {jobCategory} from './taxonomy/jobCategory'
import {jobCountry} from './taxonomy/jobCountry'
import {regulationStatus} from './taxonomy/regulationStatus'

// Core documents
import {node} from './documents/node'
import {company} from './documents/company'
import {regulation} from './documents/regulation'
import {article} from './documents/article'
import {job} from './documents/job'

// Singletons
import {siteSettings} from './singletons/siteSettings'
import {aboutPage} from './singletons/aboutPage'
import {methodologyPage} from './singletons/methodologyPage'
import {privacyPage} from './singletons/privacyPage'
import {newsletterPage} from './singletons/newsletterPage'
import {jobsPage} from './singletons/jobsPage'
import {articlesPage} from './singletons/articlesPage'
import {companiesPage} from './singletons/companiesPage'
import {regulationPage} from './singletons/regulationPage'
import {valueChainPage} from './singletons/valueChainPage'

export const schemaTypes: SchemaTypeDefinition[] = [
  // objects
  blockContent,
  socialLink,
  // taxonomy
  articleCategory,
  companyTag,
  jobSeniority,
  jobCategory,
  jobCountry,
  regulationStatus,
  // documents
  node,
  company,
  regulation,
  article,
  job,
  // singletons
  siteSettings,
  aboutPage,
  methodologyPage,
  privacyPage,
  newsletterPage,
  jobsPage,
  articlesPage,
  companiesPage,
  regulationPage,
  valueChainPage,
]

/**
 * Names of singleton document types — used by sanity.config structure to
 * render them as single docs (not lists) and disable "Create new" /
 * "Delete" actions.
 */
export const SINGLETON_TYPES = new Set([
  'siteSettings',
  'aboutPage',
  'methodologyPage',
  'privacyPage',
  'newsletterPage',
  'jobsPage',
  'articlesPage',
  'companiesPage',
  'regulationPage',
  'valueChainPage',
])

export const SINGLETON_ACTIONS = new Set([
  'publish',
  'discardChanges',
  'restore',
])
