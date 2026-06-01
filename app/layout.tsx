import type {Metadata} from 'next'
import {Figtree, Unbounded, Playfair_Display} from 'next/font/google'
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

export const metadata: Metadata = {
  title: 'Prefall: The business behind the next season of fashion',
  description:
    'Independent editorial intelligence on the business of fashion. Pre-Fall analyses the economic viability of sustainable fashion business models, regulation, and consumer behaviour.',
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
      <body>{children}</body>
    </html>
  )
}
