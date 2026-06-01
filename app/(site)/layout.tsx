/**
 * Layout for the public site (route group "(site)").
 * Wraps every site page with the shared chrome: header, mobile nav, footer,
 * cookie banner. /studio is OUTSIDE this group, so Studio doesn't get the
 * chrome.
 */
import {SiteHeader} from '@/components/SiteHeader'
import {SiteFooter} from '@/components/SiteFooter'
import {CookieBanner} from '@/components/CookieBanner'
import {StaggerOnScroll} from '@/components/StaggerOnScroll'
import {ArticleModalProvider} from '@/components/modal/ArticleModalContext'
import {ArticleModal} from '@/components/modal/ArticleModal'

export default function SiteLayout({children}: {children: React.ReactNode}) {
  return (
    <ArticleModalProvider>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <CookieBanner />
      <StaggerOnScroll />
      <ArticleModal />
    </ArticleModalProvider>
  )
}
