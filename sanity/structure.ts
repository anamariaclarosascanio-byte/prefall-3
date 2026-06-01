import type {StructureResolver} from 'sanity/structure'

/**
 * Custom Studio sidebar so:
 *  • Singletons appear as single editable documents (not lists).
 *  • Content types are grouped logically for non-technical editing.
 *  • The 7 value chain nodes appear in their fixed order.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Singletons: site-wide settings + page-level copy
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings')
        ),
      S.divider(),

      S.listItem()
        .title('Home page')
        .icon(() => '🏠')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings')
        ),
      S.listItem()
        .title('Articles index')
        .id('articlesPage')
        .child(
          S.document().schemaType('articlesPage').documentId('articlesPage')
        ),
      S.listItem()
        .title('Companies index')
        .id('companiesPage')
        .child(
          S.document().schemaType('companiesPage').documentId('companiesPage')
        ),
      S.listItem()
        .title('Regulation index')
        .id('regulationPage')
        .child(
          S.document().schemaType('regulationPage').documentId('regulationPage')
        ),
      S.listItem()
        .title('Value chain page')
        .id('valueChainPage')
        .child(
          S.document()
            .schemaType('valueChainPage')
            .documentId('valueChainPage')
        ),
      S.listItem()
        .title('Jobs page')
        .id('jobsPage')
        .child(S.document().schemaType('jobsPage').documentId('jobsPage')),
      S.listItem()
        .title('Newsletter page')
        .id('newsletterPage')
        .child(
          S.document().schemaType('newsletterPage').documentId('newsletterPage')
        ),
      S.listItem()
        .title('About page')
        .id('aboutPage')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
      S.listItem()
        .title('Methodology page')
        .id('methodologyPage')
        .child(
          S.document()
            .schemaType('methodologyPage')
            .documentId('methodologyPage')
        ),
      S.listItem()
        .title('Privacy page')
        .id('privacyPage')
        .child(
          S.document().schemaType('privacyPage').documentId('privacyPage')
        ),

      S.divider(),

      // Lists of editable documents
      S.documentTypeListItem('article').title('Articles'),
      S.documentTypeListItem('company').title('Companies'),
      S.documentTypeListItem('regulation').title('Regulations'),
      S.documentTypeListItem('job').title('Jobs'),
      S.listItem()
        .title('Value chain nodes (7 fixed)')
        .child(
          S.documentTypeList('node')
            .title('Value chain nodes')
            .defaultOrdering([{field: 'order', direction: 'asc'}])
        ),

      S.divider(),

      // Taxonomies (filters)
      S.listItem()
        .title('Filters')
        .child(
          S.list()
            .title('Filters')
            .items([
              S.documentTypeListItem('articleCategory').title(
                'Article categories'
              ),
              S.documentTypeListItem('companyTag').title('Company tags'),
              S.documentTypeListItem('jobSeniority').title('Job seniority'),
              S.documentTypeListItem('regulationStatus').title(
                'Regulation status'
              ),
            ])
        ),
    ])
