/**
 * Contact form endpoint — receives form submissions and sends them as
 * an email to contact@pre-fall.com via Resend.
 *
 * Inbound:  POST { name: string, email: string, message: string }
 * Outbound: 200 { ok: true } | 4xx { error: string }
 *
 * The sender is locked to `noreply@send.pre-fall.com` (the verified
 * subdomain on Resend). `reply_to` is set to the visitor's address so
 * Ana can reply directly from her inbox.
 */
import {NextResponse} from 'next/server'
import {Resend} from 'resend'

export const runtime = 'nodejs'

// Lazy-instantiate the client so build-time bundles don't need the secret.
function client() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('Missing RESEND_API_KEY')
  return new Resend(key)
}

// Minimal sanity: trim + length caps + email regex. We're not running an
// open relay — the only side effect is one email to Ana, so this is enough.
function validate(body: any): {ok: true; data: {name: string; email: string; message: string}} | {ok: false; err: string} {
  if (!body || typeof body !== 'object') return {ok: false, err: 'Invalid body'}
  const name = (body.name ?? '').toString().trim().slice(0, 200)
  const email = (body.email ?? '').toString().trim().slice(0, 200)
  const message = (body.message ?? '').toString().trim().slice(0, 8000)
  if (!name) return {ok: false, err: 'Name required'}
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {ok: false, err: 'Valid email required'}
  }
  if (!message) return {ok: false, err: 'Message required'}
  return {ok: true, data: {name, email, message}}
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({error: 'Bad JSON'}, {status: 400})
  }
  const v = validate(body)
  if (!v.ok) return NextResponse.json({error: v.err}, {status: 400})
  const {name, email, message} = v.data

  try {
    const resend = client()
    await resend.emails.send({
      from: 'Prefall Contact <noreply@send.pre-fall.com>',
      to: ['contact@pre-fall.com'],
      replyTo: email,
      subject: `New contact form message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}\n\n— Sent via pre-fall.com contact form`,
      html: `
        <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;color:#1a1a1a;line-height:1.5">
          <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#6b6b6b;margin:0 0 16px">
            New contact form message
          </p>
          <p style="margin:0 0 4px"><strong>${escapeHtml(name)}</strong></p>
          <p style="margin:0 0 24px"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          <div style="border-left:3px solid #8B5CF6;padding:8px 16px;background:#FAF8F4;white-space:pre-wrap;font-size:15px">${escapeHtml(message)}</div>
          <p style="font-size:11px;color:#9b9b9b;margin-top:32px">
            Sent via the contact form at pre-fall.com/about · Reply directly to respond to ${escapeHtml(name)}.
          </p>
        </div>
      `,
    })
    return NextResponse.json({ok: true})
  } catch (err) {
    console.error('Resend send failed', err)
    return NextResponse.json({error: 'Could not send'}, {status: 502})
  }
}
