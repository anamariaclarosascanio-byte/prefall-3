/**
 * Site footer — ported from prefall-prototype 1.html lines 5255-5312.
 * Class names preserved exactly: site-footer, footer__cta-title, footer-accent,
 * footer__cta-row, footer-cta-btn, footer__grid, footer-logo, footer-tagline,
 * footer-social, footer-col, footer-bottom, footer-copy.
 *
 * NOTE: copy strings (CTA title, tagline, social links, column items, copyright)
 * will be wired to siteSettings in Step 3c. Hard-coded now to match prototype
 * exactly.
 */
import Link from 'next/link'
import {routes} from '@/lib/routes'

export function SiteFooter() {
  return (
    <footer className="site-footer" role="contentinfo">
      <h2 className="footer__cta-title">
        Let&apos;s talk about the
        <br />
        business of{' '}
        <em className="footer-accent">fashion&apos;s</em>
        <br />
        next chapter.
      </h2>

      <div className="footer__cta-row">
        <Link href={routes.newsletter} className="footer-cta-btn">
          Subscribe to the newsletter
        </Link>
        <Link href={routes.about} className="footer-cta-btn">
          Get in touch →
        </Link>
      </div>

      <div className="footer__grid">
        <div>
          <Link href={routes.home} className="footer-logo">
            PREFALL
          </Link>
          <p className="footer-tagline">
            The business behind the next season of fashion. Editorial intelligence
            on sustainable fashion economics.
          </p>
          <div className="footer-social">
            <a
              href="https://www.linkedin.com/in/ana-claros/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a href="#">Twitter/X</a>
            <a href="#">Substack</a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Explore</h4>
          <ul>
            <li>
              <Link href={routes.articles}>Articles</Link>
            </li>
            <li>
              <Link href={routes.companies}>Companies</Link>
            </li>
            <li>
              <Link href={routes.regulation}>Regulation</Link>
            </li>
            <li>
              <Link href={routes.valueChain}>Value Chain</Link>
            </li>
            <li>
              <Link href={routes.jobs}>Jobs</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li>
              <Link href={routes.about}>About</Link>
            </li>
            <li>
              <Link href={routes.methodology}>Methodology</Link>
            </li>
            <li>
              <Link href={routes.newsletter}>Newsletter</Link>
            </li>
            <li>
              <Link href={routes.about}>Contact</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <ul>
            <li>
              <Link href={routes.privacy}>Privacy Policy</Link>
            </li>
            <li>
              <a href="#">Cookie Policy</a>
            </li>
            <li>
              <a href="#">Terms of Use</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-copy">
          © {new Date().getFullYear()} Prefall. All rights reserved.
        </span>
      </div>
    </footer>
  )
}
