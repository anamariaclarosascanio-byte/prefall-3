/**
 * Sanity → Vercel revalidation webhook.
 *
 * When Ana publishes anything in Sanity Studio, Sanity POSTs to this endpoint
 * and we tell Next.js to invalidate the cached HTML for the affected pages.
 * Result: edits show up on pre-fall.com within ~2 seconds, no rebuild needed.
 *
 * Security: Sanity signs the body with our shared secret using HMAC-SHA256.
 * If the signature header is missing or wrong, we 401 — random POSTs from the
 * internet can't force rebuilds.
 *
 * Sanity sends body like:
 *   { _type: 'article', _id: '...', slug: { current: '...' } }
 *
 * We map document type → the routes that depend on it. Everything else is
 * revalidated via the broad `prefall` tag in case we missed something.
 */
import {NextResponse} from 'next/server'
import {revalidatePath} from 'next/cache'
import {createHmac, timingSafeEqual} from 'node:crypto'

export const runtime = 'nodejs'

function verifySignature(body: string, signature: string, secret: string) {
  // Sanity v3 sends `sanity-webhook-signature` header in format:
  //   t=<unix-seconds>,v1=<base64-hmac-sha256>
  // We recompute HMAC over `<timestamp>.<body>` and compare to v1.
  try {
    const parts = Object.fromEntries(
      signature.split(',').map((kv) => {
        const [k, ...v] = kv.split('=')
        return [k, v.join('=')]
      })
    )
    const t = parts['t']
    const v1 = parts['v1']
    if (!t || !v1) return false
    const expected = createHmac('sha256', secret)
      .update(`${t}.${body}`)
      .digest('base64')
      // Sanity strips '+/=' to make it URL-safe.
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
    const v1Norm = v1.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    const a = Buffer.from(expected)
    const b = Buffer.from(v1Norm)
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json({error: 'Missing secret'}, {status: 500})
  }
  const body = await req.text()
  const sig = req.headers.get('sanity-webhook-signature') ?? ''
  if (!verifySignature(body, sig, secret)) {
    return NextResponse.json({error: 'Invalid signature'}, {status: 401})
  }

  let payload: any = {}
  try {
    payload = JSON.parse(body)
  } catch {}

  const type = payload._type as string | undefined
  const slug = payload?.slug?.current as string | undefined

  // Map document types to the routes/tags they affect.
  const revalidated: string[] = []
  const path = (p: string) => {
    revalidatePath(p)
    revalidated.push(p)
  }

  switch (type) {
    case 'article':
      path('/')
      path('/articles')
      if (slug) path(`/articles/${slug}`)
      break
    case 'regulation':
      path('/')
      path('/regulation')
      if (slug) path(`/regulation/${slug}`)
      break
    case 'company':
      path('/')
      path('/companies')
      if (slug) path(`/companies/${slug}`)
      break
    case 'node':
      path('/')
      path('/value-chain')
      if (slug) path(`/value-chain/${slug}`)
      break
    case 'job':
    case 'jobCategory':
    case 'jobSeniority':
    case 'jobCountry':
      path('/jobs')
      break
    case 'siteSettings':
    case 'aboutPage':
    case 'methodologyPage':
    case 'privacyPage':
    case 'newsletterPage':
    case 'articlesPage':
    case 'companiesPage':
    case 'regulationPage':
    case 'valueChainPage':
    case 'jobsPage':
      // Settings + singletons can affect any page — bust everything.
      path('/')
      path('/articles')
      path('/companies')
      path('/regulation')
      path('/value-chain')
      path('/jobs')
      path('/newsletter')
      path('/about')
      path('/methodology')
      path('/privacy')
      break
    default:
      // Unknown type — at least bust the homepage and indices.
      path('/')
  }

  return NextResponse.json({
    ok: true,
    type,
    slug,
    revalidated,
  })
}

// Sanity tests the webhook with a GET to confirm reachability. Return 200
// so the UI shows the endpoint as healthy.
export async function GET() {
  return NextResponse.json({
    ok: true,
    message:
      'Prefall revalidation webhook. POST from Sanity with a valid signature.',
  })
}
