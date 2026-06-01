import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/fetch'
import {aboutPageQuery} from '@/sanity/lib/queries'
import {PortableBlock} from '@/components/portable/PortableBlock'
import {ContactForm} from '@/components/forms/ContactForm'
import {urlFor} from '@/sanity/lib/image'

export const metadata: Metadata = {
  title: 'About — Prefall',
  description:
    'About Prefall — an independent editorial platform on sustainable fashion economics.',
}

export default async function AboutPage() {
  const data = await sanityFetch<any>({
    query: aboutPageQuery,
    tags: ['aboutPage'],
  })

  if (!data) return null

  return (
    <div className="prose-page" id="view-about">
      <div className="prose-hero">
        {data.heroHeading ? (
          <h1 className="prose-hero__heading">{data.heroHeading}</h1>
        ) : null}
        {data.heroSubhead ? (
          <p className="prose-hero__subhead">{data.heroSubhead}</p>
        ) : null}
      </div>

      {data.portrait ? (
        <div className="company-gallery">
          <div className="company-gallery__main">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={urlFor(data.portrait).width(2000).url()}
              alt={data.portrait.alt ?? 'Ana Maria Claros'}
            />
          </div>
        </div>
      ) : null}

      {data.sections?.map((s: any) => (
        <section key={s._key} className="prose-section">
          {s.label ? <p className="prose-section__label">{s.label}</p> : null}
          <div className="prose-section__content">
            {s.heading ? (
              <h2 className="prose-section__heading">{s.heading}</h2>
            ) : null}
            {s.body ? <PortableBlock value={s.body} /> : null}
          </div>
        </section>
      ))}

      {/* Contact section — 2 columns matching prefall-prototype 1.html
          lines 5064-5102. LEFT: "Get in touch" eyebrow + two intro lines
          each followed by a mailto link. RIGHT: the message form, with
          its own title + subtitle bundled above the inputs. */}
      <section className="about-contact" id="about-contact">
        <div className="about-contact__left">
          {data.contactLeftLabel ? (
            <p
              className="prose-section__label"
              style={{marginBottom: '32px'}}
            >
              {data.contactLeftLabel}
            </p>
          ) : null}
          {data.contactLeftPressIntro ? (
            <p
              className="prose-section__body"
              style={{marginBottom: '12px'}}
            >
              {data.contactLeftPressIntro}
            </p>
          ) : null}
          {data.contactLeftPressEmail ? (
            <p className="prose-section__body">
              <a
                href={`mailto:${data.contactLeftPressEmail}`}
                className="link-u"
                style={{color: 'inherit'}}
              >
                {data.contactLeftPressEmail}
              </a>
            </p>
          ) : null}
          {data.contactLeftTipsIntro ? (
            <p
              className="prose-section__body"
              style={{marginTop: '28px', marginBottom: '12px'}}
            >
              {data.contactLeftTipsIntro}
            </p>
          ) : null}
          {data.contactLeftTipsEmail ? (
            <p className="prose-section__body">
              <a
                href={`mailto:${data.contactLeftTipsEmail}`}
                className="link-u"
                style={{color: 'inherit'}}
              >
                {data.contactLeftTipsEmail}
              </a>
            </p>
          ) : null}
        </div>
        <div className="about-contact__right" id="about-contact-card">
          {/* Form head sits ABOVE the form (prototype's about-form__head),
              not in the left column. */}
          {data.contactFormTitle || data.contactFormSubtitle ? (
            <div className="about-form__head" id="about-form-head">
              {data.contactFormTitle ? (
                <p className="about-form__title">{data.contactFormTitle}</p>
              ) : null}
              {data.contactFormSubtitle ? (
                <p className="about-form__sub">{data.contactFormSubtitle}</p>
              ) : null}
            </div>
          ) : null}
          <ContactForm
            successTitle={data.contactSuccessTitle}
            successBody={data.contactSuccessBody}
          />
        </div>
      </section>
    </div>
  )
}
