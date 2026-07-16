import SiteNav from './SiteNav'
import SiteFooter from './SiteFooter'
import { TALLY } from '../lib/site'

const ROUTES = [
  {
    head: 'Services', tag: 'WE DO IT FOR YOU',
    items: [{
      name: 'SEO / GEO', href: '/seo-geo/',
      blurb: 'Search moved to the machines. We make sure ChatGPT, Perplexity, and Google cite you — not your competitor. SEO, GEO, Google Business Profile, AI citability, backlinks.',
    }],
  },
  {
    head: 'Products', tag: 'SOFTWARE WE BUILT',
    items: [
      { name: 'Antidote', href: '/antidote/', blurb: 'The marketing engine. It drafts content, publishes blogs and social posts, watches competitors, and briefs you every morning. You approve, it ships.' },
      { name: 'Antidote Research', href: '/research/', blurb: 'The SEO research suite. Keywords, backlinks, site audits, rank tracking, local SEO, schema — every result turns into a task on your board.' },
      { name: 'Meegrow Social', href: '/social/', blurb: 'Plan, schedule, publish, and measure — across Facebook, Instagram, Google Business Profiles, LinkedIn, and YouTube, from one calendar.' },
    ],
  },
  {
    head: 'Learn', tag: 'FREE, FOREVER',
    items: [{
      name: 'Zero to AI Hero', href: '/learn/',
      blurb: '150+ free 2-minute lessons in हिंदी & English. From "what’s a file?" to Claude Code and AI agents. No degree. No jargon.',
    }],
  },
]

export default function CompanyHome() {
  return (
    <div className="min-h-screen bg-cream-100">
      <SiteNav />

      {/* Hero */}
      <section className="px-5 pt-16 pb-14 md:pt-24 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs font-bold uppercase tracking-[.22em] text-green-600">
            The growth lab for the AI era
          </p>
          <h1 className="mt-3.5 font-display text-[clamp(38px,7vw,76px)] leading-[.95] tracking-[-1.5px] text-slate-900 max-w-4xl">
            We make brands impossible to ignore.
          </h1>
          <p className="mt-5 max-w-2xl text-lg md:text-xl text-slate-700">
            Search didn’t die — it moved. Your customers now ask machines.
            We make sure you’re the answer they get.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a href={TALLY} target="_blank" rel="noopener noreferrer"
               className="rounded-lg border-[3px] border-slate-900 bg-green-600 px-7 py-3.5 text-center font-bold text-white shadow-[5px_5px_0_#0F0F0F] hover:bg-green-700">
              Talk to us →
            </a>
            <a href="/learn/"
               className="rounded-lg border-[3px] border-slate-900 bg-cream-100 px-7 py-3.5 text-center font-bold text-slate-900 shadow-[5px_5px_0_#0F0F0F] hover:bg-cream-200">
              Take the free course
            </a>
          </div>
        </div>
      </section>

      {/* Router */}
      <section className="px-5 pb-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {ROUTES.map((group) => (
            <div key={group.head}>
              <div className="flex items-baseline gap-3 border-b-[3px] border-slate-900 pb-2.5">
                <h2 className="font-display text-2xl text-slate-900">{group.head}</h2>
                <span className="font-mono text-[11px] uppercase tracking-[.18em] text-slate-600">{group.tag}</span>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {group.items.map((it) => {
                  const isFullWidth = group.items.length === 1
                  return (
                    <a key={it.name} href={it.href}
                       className={`block rounded-2xl border-[3px] border-slate-900 bg-cream-200 p-5 shadow-[5px_5px_0_#0F0F0F] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#0F0F0F] ${isFullWidth ? 'md:col-span-3' : ''}`}>
                      <div className="font-display text-lg text-slate-900">{it.name}</div>
                      <p className={`mt-2 text-[15px] text-slate-600 ${isFullWidth ? 'max-w-2xl' : ''}`}>{it.blurb}</p>
                      <span className="mt-3 inline-block font-semibold text-green-600">Learn more →</span>
                    </a>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-16">
        <div className="max-w-6xl mx-auto rounded-3xl bg-slate-900 px-6 py-14 text-center md:py-16">
          <h2 className="font-display text-[clamp(26px,3.6vw,40px)] leading-tight text-cream-100">
            Let’s make you impossible to ignore.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-cream-300">
            Tell us what you sell and who you sell it to. We’ll tell you where you’re invisible.
          </p>
          <a href={TALLY} target="_blank" rel="noopener noreferrer"
             className="mt-7 inline-block rounded-lg border-[3px] border-cream-100 bg-green-600 px-8 py-3.5 font-bold text-white hover:bg-green-700">
            Talk to us →
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
