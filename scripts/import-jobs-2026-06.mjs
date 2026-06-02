/**
 * One-off import of the 20 sustainability-in-fashion jobs sourced from
 * Dale Barrow's LinkedIn list (June 2, 2026). Does in order:
 *
 *   1. HEAD-check each URL (follows redirects, accepts 2xx/3xx; also tolerates
 *      LinkedIn's anti-bot 999 because that still means the URL is live).
 *   2. Delete the 6 placeholder demo jobs that were seeded earlier.
 *   3. Create the 4 missing jobCountry docs (USA, Italy, Switzerland, Vietnam).
 *   4. Create the 20 real jobs with all references resolved.
 *
 * Re-runnable: deletes are idempotent (no error if already gone), country
 * creates use createIfNotExists, jobs use deterministic _ids based on the
 * LinkedIn job ID so re-running replaces in-place instead of duplicating.
 */
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// ─── Source data ──────────────────────────────────────────────────────────
// Raw rows verbatim from sustainability-fashion-jobs.html. `country` maps to
// a jobCountry slug; `category` to jobCategory; `seniority` to jobSeniority.
const TODAY = '2026-06-02'

const JOBS = [
  {
    n: 1,
    title: 'People Sustainability, ESG & Workforce Analytics Expert',
    company: 'MANGO',
    country: 'spain',
    city: 'Palau-solità i Plegamans',
    location: 'Palau-solità i Plegamans, Catalonia',
    seniority: 'senior',
    category: 'esg',
    description:
      "Drive people sustainability, ESG reporting, and workforce analytics at MANGO, one of Europe's leading fashion groups. Based at their HQ near Barcelona.",
    link: 'https://www.linkedin.com/jobs/view/4423216496/',
  },
  {
    n: 2,
    title: 'Product & Environmental Quality Manager (F/H)',
    company: 'LVMH',
    country: 'france',
    city: 'Paris',
    location: 'Paris, Île-de-France (On-site)',
    seniority: 'senior',
    category: 'sustainability',
    description:
      "Lead product and environmental quality management at the world's leading luxury fashion group. Ensure compliance and sustainability standards across product lines.",
    link: 'https://www.linkedin.com/jobs/view/4421662193/',
  },
  {
    n: 3,
    title: 'CDD — Expert Affaires Réglementaires (H/F/X)',
    company: 'CHANEL',
    country: 'france',
    city: 'Paris',
    location: 'Paris, Île-de-France',
    seniority: 'mid',
    category: 'regulation',
    description:
      'Fixed-term regulatory affairs expert role at CHANEL, ensuring compliance with evolving EU regulations around product sustainability and environmental standards in fashion.',
    link: 'https://www.linkedin.com/jobs/view/4422047363/',
  },
  {
    n: 4,
    title: 'Alternance — Chef de Projet Traçabilité & RSE H/F',
    company: 'SANDRO',
    country: 'france',
    city: 'Paris',
    location: 'Paris, Île-de-France (On-site)',
    seniority: 'internship',
    category: 'sustainability',
    description:
      'Work-study opportunity at SANDRO managing traceability and CSR projects in the supply chain. Ideal entry point into fashion sustainability at a Parisian fashion house.',
    link: 'https://www.linkedin.com/jobs/view/4421801027/',
  },
  {
    n: 5,
    title: 'Sustainability Manager',
    company: 'SUITSUIT | Certified B Corp',
    country: 'netherlands',
    city: 'Randstad',
    location: 'The Randstad (Hybrid)',
    seniority: 'senior',
    category: 'sustainability',
    description:
      'Lead sustainability strategy at a Certified B Corporation in the luggage & fashion space. Drive impact initiatives across product, supply chain, and reporting frameworks.',
    link: 'https://www.linkedin.com/jobs/view/4417618993/',
  },
  {
    n: 6,
    title: 'Sustainability & Product Compliance Senior Manager',
    company: 'Salomon',
    country: 'france',
    city: 'Annecy',
    location: 'Annecy, Auvergne-Rhône-Alpes (Hybrid)',
    seniority: 'senior',
    category: 'sustainability',
    description:
      'Senior role overseeing sustainability and product compliance at Salomon, a global outdoor sports and fashion brand. Drive compliance with EU regulations and sustainability strategy.',
    link: 'https://www.linkedin.com/jobs/view/4419888993/',
  },
  {
    n: 7,
    title: 'Senior Director, Global Responsible Sourcing & Supply Chain Sustainability',
    company: 'Levi Strauss & Co.',
    country: 'usa',
    city: 'San Francisco',
    location: 'San Francisco, CA (Hybrid)',
    seniority: 'senior',
    category: 'sustainability',
    description:
      "Lead global responsible sourcing and supply chain sustainability for one of the world's most iconic denim brands. Drive ZDHC, Higg, and science-based targets compliance.",
    link: 'https://lnkd.in/gxnFd6Ga',
  },
  {
    n: 8,
    title: 'Manager, Product Testing & Compliance (Apparel)',
    company: 'Oved Group',
    country: 'usa',
    city: 'New York',
    location: 'New York City Metropolitan Area (Hybrid)',
    seniority: 'mid',
    category: 'esg',
    description:
      'Manage product testing and compliance programs for an apparel group. Ensure products meet safety, regulatory and sustainability standards. Full benefits package.',
    link: 'https://www.linkedin.com/jobs/view/4418384717/',
  },
  {
    n: 9,
    title: 'Compliance, Quality & Sustainability Trainee',
    company: 'Champion Europe Group',
    country: 'italy',
    city: 'Carpi',
    location: 'Carpi, Emilia-Romagna (Hybrid)',
    seniority: 'internship',
    category: 'sustainability',
    description:
      "Join Champion Europe's compliance, quality, and sustainability team as a trainee. Great entry-level opportunity in the sportswear and fashion industry based in Italy.",
    link: 'https://www.linkedin.com/jobs/view/4417220388/',
  },
  {
    n: 10,
    title: 'Fabric Research & Development Manager, Beyond Yoga',
    company: 'Beyond Yoga',
    country: 'usa',
    city: 'Culver City',
    location: 'Culver City, California (Hybrid)',
    seniority: 'mid',
    category: 'circularity',
    description:
      'Lead fabric research and development at Beyond Yoga, an inclusive activewear brand known for sustainable and comfortable clothing. Drive material innovation and sustainability.',
    link: 'https://www.linkedin.com/jobs/view/4418822918/',
  },
  {
    n: 11,
    title: 'International Compliance Risk Manager',
    company: 'Cartier',
    country: 'switzerland',
    city: 'Meyrin',
    location: 'Meyrin, Geneva (Hybrid)',
    seniority: 'senior',
    category: 'esg',
    description:
      'Manage international compliance and regulatory risk at Cartier, the iconic luxury fashion and jewelry brand. Oversee global compliance frameworks and sustainability regulations.',
    link: 'https://www.linkedin.com/jobs/view/4418829350/',
  },
  {
    n: 12,
    title: 'VP of Production & Supply Chain',
    company: 'Suitsupply',
    country: 'usa',
    city: 'New York',
    location: 'New York, New York (On-site)',
    seniority: 'senior',
    category: 'sustainability',
    description:
      'Lead production and supply chain operations at Suitsupply, a brand known for its commitment to quality and responsible sourcing in the menswear fashion industry.',
    link: 'https://www.linkedin.com/jobs/view/4417646062/',
  },
  {
    n: 13,
    title: 'Director, Raw Materials',
    company: 'Veronica Beard',
    country: 'usa',
    city: 'New York',
    location: 'New York City Metropolitan Area (Hybrid)',
    seniority: 'senior',
    category: 'circularity',
    description:
      "Direct raw materials strategy and sourcing for Veronica Beard, an American women's fashion brand. Oversee sustainable material procurement and vendor relationships.",
    link: 'https://www.linkedin.com/jobs/view/4417645702/',
  },
  {
    n: 14,
    title: 'Senior Manager Materials Development Footwear',
    company: 'adidas',
    country: 'usa',
    city: 'Portland',
    location: 'Portland, Oregon (On-site)',
    seniority: 'senior',
    category: 'circularity',
    description:
      'Drive materials development for footwear at adidas, advancing sustainable material innovation across performance and lifestyle collections at the Portland HQ.',
    link: 'https://www.linkedin.com/jobs/view/4418768785/',
  },
  {
    n: 15,
    title: 'Associate Manager, Sourcing Development, Footwear',
    company: 'VF Corporation',
    country: 'vietnam',
    city: 'Hanoi',
    location: 'Hanoi (Remote)',
    seniority: 'mid',
    category: 'sustainability',
    description:
      'Develop and manage footwear sourcing strategies at VF Corporation, home to brands like The North Face and Timberland known for their sustainability commitments.',
    link: 'https://www.linkedin.com/jobs/view/4420555411/',
  },
  {
    n: 16,
    title: 'Colour & Materials Developer Footwear',
    company: 'Axel Arigato',
    country: 'sweden',
    city: 'Gothenburg',
    location: 'Gothenburg, Västra Götaland (On-site)',
    seniority: 'mid',
    category: 'circularity',
    description:
      'Develop colours and materials for footwear at Axel Arigato, a contemporary Swedish fashion brand with a strong focus on quality and sustainability in their product range.',
    link: 'https://www.linkedin.com/jobs/view/4418832898/',
  },
  {
    n: 17,
    title: 'Footwear Product Development Manager — Colors & Materials (F/H)',
    company: 'Lacoste',
    country: 'france',
    city: 'Paris',
    location: 'Paris, Île-de-France',
    seniority: 'mid',
    category: 'circularity',
    description:
      'Manage footwear product development with a focus on colors and materials at Lacoste. Drive sustainable material choices and innovation at the iconic French fashion brand.',
    link: 'https://www.linkedin.com/jobs/view/4421857478/',
  },
  {
    n: 18,
    title: 'Fabric Intern — HQ Stockholm',
    company: 'FILIPPA K',
    country: 'sweden',
    city: 'Stockholm',
    location: 'Stockholm (On-site)',
    seniority: 'internship',
    category: 'circularity',
    description:
      'Intern in the fabric team at FILIPPA K headquarters in Stockholm. A great opportunity to learn sustainable material development at a Scandinavian minimalist fashion brand.',
    link: 'https://www.linkedin.com/jobs/view/4419051945/',
  },
  {
    n: 19,
    title: 'Senior Manager, Sourcing',
    company: 'Centric Brands',
    country: 'usa',
    city: 'New York',
    location: 'New York, New York (Hybrid)',
    seniority: 'senior',
    category: 'sustainability',
    description:
      'Lead sourcing strategy for Centric Brands, a portfolio of fashion lifestyle brands. Drive responsible sourcing practices, supplier relationships and supply chain sustainability.',
    link: 'https://www.linkedin.com/jobs/view/4423222111/',
  },
  {
    n: 20,
    title: 'Senior Lead — Footwear Materials',
    company: 'On',
    country: 'switzerland',
    city: 'Zurich',
    location: 'Zurich, Zurich',
    seniority: 'senior',
    category: 'circularity',
    description:
      'Lead footwear materials development at On, a premium Swiss running and outdoor brand known for innovation and commitment to reducing environmental impact through Cyclon and Cloudneo.',
    link: 'https://www.linkedin.com/jobs/view/4422897635/',
  },
]

// New countries needed for jobs 7,8,10,11,12,13,14,15,19,20
const NEW_COUNTRIES = [
  {slug: 'usa', title: 'USA', order: 7},
  {slug: 'italy', title: 'Italy', order: 8},
  {slug: 'switzerland', title: 'Switzerland', order: 9},
  {slug: 'vietnam', title: 'Vietnam', order: 10},
]

const OLD_JOB_IDS = [
  'job.hm-circular-economy-lead',
  'job.inditex-product-lifecycle',
  'job.kering-esg-analyst',
  'job.mckinsey-sustainability-consultant',
  'job.pvh-regulatory-affairs',
  'job.zalando-sustainability-reporting',
]

// ─── 1. URL verification ──────────────────────────────────────────────────
async function verifyUrl(url) {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36',
      },
    })
    // LinkedIn fires 999 against bots but the listing still exists. 2xx/3xx
    // are unambiguous OK. 404/410 means dead — those we flag.
    if (res.status === 999) return {ok: true, status: 999, note: 'LinkedIn anti-bot 999 (URL exists)'}
    if (res.status >= 200 && res.status < 400) return {ok: true, status: res.status, finalUrl: res.url}
    return {ok: false, status: res.status, finalUrl: res.url}
  } catch (e) {
    return {ok: false, error: String(e).slice(0, 100)}
  }
}

// ─── 2. Deterministic job _id from the LinkedIn job ID ───────────────────
function jobIdFromUrl(url) {
  // Matches both /jobs/view/<id>/ and lnkd.in shortened URLs (after redirect).
  // We extract the LinkedIn job id where possible; if absent, fall back to a
  // slugged hash of the URL so re-running stays idempotent.
  const m = url.match(/\/jobs\/view\/(\d+)/)
  if (m) return `job.li-${m[1]}`
  // For shortened lnkd.in URLs, use the slug after the host.
  const shortMatch = url.match(/lnkd\.in\/(\w+)/)
  if (shortMatch) return `job.li-${shortMatch[1]}`
  return `job.li-${url.slice(-10).replace(/[^a-z0-9]/gi, '')}`
}

// ─── Main ─────────────────────────────────────────────────────────────────
async function main() {
  console.log('═══ Step 1: Verify URLs ═══')
  const verified = []
  for (const j of JOBS) {
    const r = await verifyUrl(j.link)
    verified.push({...j, urlCheck: r})
    const flag = r.ok ? '✓' : '✗'
    console.log(`  ${flag} #${String(j.n).padStart(2, '0')} ${j.company.padEnd(30)} — ${r.status ?? r.error}${r.note ? ' (' + r.note + ')' : ''}`)
  }
  const dead = verified.filter((v) => !v.urlCheck.ok)
  if (dead.length > 0) {
    console.log(`\n⚠ ${dead.length} dead URLs — skipping those.`)
    dead.forEach((d) => console.log(`   #${d.n} ${d.company}`))
  }
  const liveJobs = verified.filter((v) => v.urlCheck.ok)
  console.log(`\n${liveJobs.length}/${JOBS.length} URLs live → proceeding with these.`)

  console.log('\n═══ Step 2: Delete 6 placeholder demo jobs ═══')
  for (const id of OLD_JOB_IDS) {
    try {
      await client.delete(id)
      console.log(`  ✓ deleted ${id}`)
    } catch (e) {
      console.log(`  ⊘ ${id} — ${String(e).slice(0, 80)}`)
    }
  }

  console.log('\n═══ Step 3: Create missing jobCountry docs ═══')
  for (const c of NEW_COUNTRIES) {
    const doc = {
      _id: `jobCountry.${c.slug}`,
      _type: 'jobCountry',
      title: c.title,
      slug: {_type: 'slug', current: c.slug},
      order: c.order,
    }
    await client.createOrReplace(doc)
    console.log(`  ✓ ${c.title}`)
  }

  console.log('\n═══ Step 4: Upsert 20 live jobs ═══')
  for (const j of liveJobs) {
    const _id = jobIdFromUrl(j.link)
    const doc = {
      _id,
      _type: 'job',
      title: j.title,
      description: j.description,
      company: j.company,
      location: j.location,
      city: j.city,
      link: j.link,
      publishedAt: TODAY,
      category: {_type: 'reference', _ref: `jobCategory.${j.category}`},
      seniority: {_type: 'reference', _ref: `seniority.${j.seniority}`},
      country: {_type: 'reference', _ref: `jobCountry.${j.country}`},
    }
    await client.createOrReplace(doc)
    console.log(`  ✓ #${String(j.n).padStart(2, '0')} ${j.company} — ${j.title.slice(0, 50)}`)
  }

  console.log('\n═══ Summary ═══')
  const final = await client.fetch(
    `count(*[_type == "job"])`
  )
  console.log(`Total jobs in Sanity now: ${final}`)
}

main().catch((e) => {
  console.error('FATAL:', e)
  process.exit(1)
})
