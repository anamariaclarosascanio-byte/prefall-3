'use client'

/**
 * Scroll-triggered animations for prose-style text elements + the explicit
 * `.stagger-item` blocks (regulation tracker pieces).
 *
 * Design choices to avoid the bugs of the previous attempts:
 *   • We target ONLY text classes (.detail-body__prose, .prose-section__body,
 *     headings, etc.). Never wrappers that contain htmlEmbed or complex
 *     children — that's what trapped article body content invisible before.
 *   • The hidden initial state is gated by `html.scroll-fade-ready`, added
 *     ONLY after the IntersectionObserver is wired up. If JS fails, the gate
 *     never appears and text is always visible.
 *   • No "already in viewport" manual check. The IntersectionObserver fires
 *     for above-the-fold elements naturally on the next tick — they animate
 *     in on page load, which IS the desired feel for opening / navigating.
 *   • 1-second safety timer: any text element still hidden after 1s is
 *     forced visible. Hard guarantee that nothing stays invisible.
 *   • Re-runs on every client-side navigation (key = pathname).
 */
import {useEffect} from 'react'
import {usePathname} from 'next/navigation'

// Text-only classes — never wrappers / containers. Targets pure prose so
// the surrounding layout never gets pulled into the hide-then-fade state.
const TEXT_FADE_SELECTORS = [
  // Home hero
  '.hero__label',
  '.hero__heading',
  '.hero__body',
  '.hero__ctas',
  // Detail body prose (articles, regulations, nodes, companies)
  '.detail-body__prose',
  '.detail-body__section-head',
  '.detail-body__h2',
  '.article-page__title',
  '.article-page__dek',
  '.article-page__lead',
  '.article-page__h2',
  '.article-page__pullquote',
  // Prose pages (about, methodology, privacy)
  '.prose-section__body',
  '.prose-section__heading',
  '.prose-section__label',
  '.prose-hero__heading',
  '.prose-hero__subhead',
  // Generic section text
  '.section__heading',
  '.section__label',
  '.section__subhead',
  '.page-header__heading',
  '.page-header__subhead',
  // Home modules
  '.regulation-module__name',
  '.regulation-module__full',
  '.regulation-module__summary',
  '.newsletter-heading',
  '.newsletter-body',
  '.featured-text__label',
  '.featured-text__title',
  '.featured-text__excerpt',
  '.card__title',
  // Other pages
  '.company-card__name',
  '.company-card__meta',
  '.company-card__model',
  '.company-profile__name',
  '.company-profile__tagline',
  '.nl-feature__text',
  '.about-form__title',
  '.about-form__sub',
].join(',')

export function StaggerOnScroll() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    // Tag text elements (idempotent — repeated calls do nothing).
    const textEls = prefersReducedMotion
      ? []
      : Array.from(document.querySelectorAll(TEXT_FADE_SELECTORS))
    textEls.forEach((el) => el.setAttribute('data-text-fade', ''))

    const staggerEls = Array.from(document.querySelectorAll('.stagger-item'))

    if (prefersReducedMotion) {
      textEls.forEach((el) => el.classList.add('is-revealed'))
      staggerEls.forEach((el) => el.classList.add('visible'))
      return
    }

    // Activate the hide gate AFTER tagging is complete. CSS-wise, elements
    // are hidden only while `html.scroll-fade-ready` is set AND they don't
    // yet have `.is-revealed`.
    document.documentElement.classList.add('scroll-fade-ready')

    // ── Observer for text elements ────────────────────────────────────
    if (textEls.length > 0) {
      // First paint: ensure the hidden state (opacity 0, translateY 32px)
      // actually renders BEFORE the observer fires. The IntersectionObserver
      // callback runs synchronously on initialisation for every element
      // that's already in the viewport (above-the-fold). If we add
      // `is-revealed` in that callback, the browser collapses both states
      // into a single paint and the user never sees the animation play.
      //
      // Two nested requestAnimationFrame calls guarantee a paint between
      // "tagged + hidden" and "revealed" — the first rAF schedules to the
      // next frame, the second rAF runs AFTER that frame paints. Now the
      // CSS transition actually has two distinct states to animate between.
      const textObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const target = entry.target
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  target.classList.add('is-revealed')
                })
              })
              textObs.unobserve(target)
            }
          })
        },
        // threshold 0 + small negative bottom rootMargin so the element
        // reveals just as it enters the visible area (not while still
        // tucked below the fold).
        {threshold: 0, rootMargin: '0px 0px -10% 0px'}
      )
      textEls.forEach((el) => {
        if (!el.classList.contains('is-revealed')) textObs.observe(el)
      })

      // Long safety net (15 s): if the IntersectionObserver never fires for
      // some element (very rare — usually only happens if the browser
      // suspends IO callbacks during scroll-restoration), reveal anything
      // still hidden so content can't stay invisible forever. 15 s is long
      // enough that the user will have scrolled past everything organically
      // first — this only catches stuck-in-viewport elements that the
      // observer somehow missed.
      const safetyText = window.setTimeout(() => {
        document
          .querySelectorAll('[data-text-fade]:not(.is-revealed)')
          .forEach((el) => el.classList.add('is-revealed'))
      }, 15000)

      // ── Observer for legacy .stagger-item ───────────────────────────
      let staggerObs: IntersectionObserver | null = null
      let safetyStagger: number | null = null
      if (staggerEls.length > 0) {
        staggerObs = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible')
                staggerObs!.unobserve(entry.target)
              }
            })
          },
          {threshold: 0.05, rootMargin: '0px 0px -40px 0px'}
        )
        staggerEls.forEach((el) => {
          if (!el.classList.contains('visible')) staggerObs!.observe(el)
        })
        safetyStagger = window.setTimeout(() => {
          document
            .querySelectorAll('.stagger-item:not(.visible)')
            .forEach((el) => el.classList.add('visible'))
        }, 2000)
      }

      return () => {
        textObs.disconnect()
        window.clearTimeout(safetyText)
        if (staggerObs) staggerObs.disconnect()
        if (safetyStagger != null) window.clearTimeout(safetyStagger)
      }
    }
  }, [pathname])

  return null
}
