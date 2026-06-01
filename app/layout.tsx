import type {Metadata} from 'next'
import {Figtree, Unbounded, Playfair_Display} from 'next/font/google'
import {Analytics} from '@vercel/analytics/next'
import './globals.css'

// Body font: Figtree 300/400/600/700/800 (per prototype)
const figtree = Figtree({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
  variable: '--font-figtree',
  display: 'swap',
})

// Logo font: Unbounded 500 (per prototype)
const unbounded = Unbounded({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-unbounded',
  display: 'swap',
})

// Accent serif: Playfair Display italic 400/500 (per prototype)
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['italic'],
  variable: '--font-playfair',
  display: 'swap',
})

// Canonical site URL — drives all relative URLs in OG / Twitter / sitemap.
const SITE_URL = 'https://pre-fall.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Prefall: The business behind the next season of fashion',
    template: '%s — Prefall',
  },
  description:
    'Independent editorial intelligence on the business of fashion. Pre-Fall analyses the economic viability of sustainable fashion business models, regulation, and consumer behaviour.',
  keywords: [
    'sustainable fashion',
    'fashion regulation',
    'fashion economics',
    'business of fashion',
    'CSRD',
    'ESPR',
    'CSDDD',
    'circular fashion',
    'editorial intelligence',
  ],
  authors: [{name: 'Ana Maria Claros'}],
  creator: 'Ana Maria Claros',
  publisher: 'Prefall',
  // Open Graph: how the site previews on LinkedIn, Twitter, Slack, etc.
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: 'Prefall',
    title: 'Prefall: The business behind the next season of fashion',
    description:
      'Independent editorial intelligence on the business of fashion. Pre-Fall analyses the economic viability of sustainable fashion business models, regulation, and consumer behaviour.',
    // Image is auto-attached by Next.js from app/opengraph-image.tsx.
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prefall: The business behind the next season of fashion',
    description:
      'Editorial intelligence on the economics of sustainable fashion business models.',
    // Image is auto-attached by Next.js from app/opengraph-image.tsx.
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${unbounded.variable} ${playfair.variable}`}
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
