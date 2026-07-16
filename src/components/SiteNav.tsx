import { TALLY } from '../lib/site'

export default function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 border-b-4 border-slate-900 bg-cream-100">
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between gap-4">
        <a href="/" className="font-mono font-bold text-lg tracking-widest text-slate-900">&gt;_ MEEGROW <span className="text-green-600">LABS</span></a>
        <div className="flex items-center gap-5 text-[15px] font-semibold">
          <a href="/seo-geo/" className="hidden sm:inline text-slate-900 hover:text-green-600">SEO/GEO</a>
          <details className="relative group">
            <summary className="cursor-pointer list-none text-slate-900 hover:text-green-600 marker:hidden">
              Products
            </summary>
            <div className="absolute top-8 -left-3 flex flex-col gap-0.5 min-w-[190px] rounded-xl border-[3px] border-slate-900 bg-cream-100 p-2 shadow-[5px_5px_0_#0F0F0F]">
              <a href="/antidote/" className="rounded-lg px-3 py-2 text-slate-900 hover:bg-cream-200">Antidote</a>
              <a href="/research/" className="rounded-lg px-3 py-2 text-slate-900 hover:bg-cream-200">Research</a>
              <a href="/social/" className="rounded-lg px-3 py-2 text-slate-900 hover:bg-cream-200">Social</a>
            </div>
          </details>
          <a href="/learn/" className="text-slate-900 hover:text-green-600">Learn</a>
          <a href="https://blog.meegrowlabs.com" className="hidden sm:inline text-slate-900 hover:text-green-600">Blog</a>
          <a href={TALLY} target="_blank" rel="noopener noreferrer"
             className="rounded-lg border-[3px] border-slate-900 bg-green-600 px-4 py-2 text-white shadow-[4px_4px_0_#0F0F0F] hover:bg-green-700">
            Talk to us
          </a>
        </div>
      </div>
    </nav>
  )
}
