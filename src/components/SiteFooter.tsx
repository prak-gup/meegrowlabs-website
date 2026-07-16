const TALLY = 'https://tally.so/r/444qZ5'

const COLS = [
  { head: 'Services', links: [['SEO / GEO', '/seo-geo/']] },
  { head: 'Products', links: [['Antidote', '/antidote/'], ['Antidote Research', '/research/'], ['Meegrow Social', '/social/']] },
  { head: 'Learn', links: [['Zero to AI Hero', '/learn/'], ['Blog', 'https://blog.meegrowlabs.com']] },
  { head: 'Company', links: [['Talk to us', TALLY], ['Privacy Policy', '/privacy/'], ['Terms of Service', '/terms/'], ['Data Deletion', '/data-deletion/']] },
]

export default function SiteFooter() {
  return (
    <footer className="mt-10 border-t-4 border-slate-900 bg-cream-200">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-7 px-5 py-11">
        {COLS.map((c) => (
          <div key={c.head}>
            <h4 className="font-mono text-[11px] uppercase tracking-[.18em] text-slate-600 mb-2.5">{c.head}</h4>
            {c.links.map(([label, href]) => (
              <a key={label} href={href} className="block py-0.5 text-[15px] text-slate-900 hover:text-green-600">{label}</a>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t-2 border-cream-300">
        <div className="max-w-6xl mx-auto px-5 py-4 font-mono text-xs text-slate-600">
          © 2026 Meegrow Labs · Growth, engineered. · prakhar@meegrowlabs.com
        </div>
      </div>
    </footer>
  )
}
