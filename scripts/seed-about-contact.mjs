/**
 * Patch the aboutPage contact-section copy verbatim from
 * prefall-prototype 1.html lines 5066-5075.
 */
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

await client
  .patch('aboutPage')
  .set({
    contactLeftLabel: 'Get in touch',
    contactLeftPressIntro:
      'For press inquiries, interview requests, or partnership conversations:',
    contactLeftPressEmail: 'anamaria@pre-fall.com',
    contactLeftTipsIntro:
      'Tips on companies, regulations, or industry developments:',
    contactLeftTipsEmail: 'contact@pre-fall.com',
    contactFormTitle: 'Send a message',
    contactFormSubtitle:
      'We read every message and reply within one business day.',
    contactSuccessTitle: 'Message sent.',
    contactSuccessBody:
      "Thank you — we'll be in touch within one business day.",
  })
  .commit()
console.log('✓ aboutPage contact fields patched')
