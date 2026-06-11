const CONTACT_FORM_LINK = "https://tally.so/r/444qZ5"

export default function Hero() {
  return (
    <section className="relative bg-cream-100 px-6 pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: course pitch */}
        <div className="space-y-7">
          <span className="inline-flex items-center gap-2 rounded-full bg-mustard-400 px-4 py-2 text-sm font-bold text-slate-900 ring-1 ring-mustard-500/40">
            <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-mustard-300">100% Free</span>
            हिंदी &amp; English · 2-minute lessons
          </span>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-slate-900 leading-[1.02]">
            Go from <span className="text-green-600">zero to AI hero</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-xl">
            Learn to actually <strong>use and build with AI</strong> — from “what’s a file?” all the way to
            Claude Code and AI agents. <strong>150+ free 2-minute lessons</strong>, in simple हिंदी &amp; English.
            No degree. No jargon. No being left behind.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/app" className="inline-block px-10 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg text-lg text-center">
              🎓 Start learning free →
            </a>
            <a href="/learn" className="inline-block px-8 py-4 bg-white text-slate-900 font-bold rounded-lg border-2 border-slate-900 hover:bg-cream-200 transition-colors text-lg text-center">
              Browse the course
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-slate-600 pt-1">
            <span>✓ 18 levels · 150+ lessons</span>
            <span>✓ Beginner-friendly</span>
            <span>✓ Save your progress</span>
          </div>
        </div>

        {/* Right: course preview card */}
        <div className="relative max-w-md mx-auto lg:max-w-none w-full">
          <div className="bg-white rounded-2xl border-4 border-slate-900 shadow-[12px_12px_0_#0F0F0F] overflow-hidden">
            <div className="bg-slate-900 px-5 py-3 flex items-center justify-between">
              <span className="font-mono text-xs font-bold tracking-widest text-mustard-300">&gt;_ ZERO TO AI HERO</span>
              <span className="text-[10px] font-bold uppercase bg-green-600 text-white px-2 py-0.5 rounded-full">Free</span>
            </div>
            <div className="p-5 space-y-2">
              {[
                ['01', 'What is a file?', '✓'],
                ['02', 'Your first terminal command', '✓'],
                ['08', 'Build apps with Claude Code', '▶'],
                ['15', 'Your first AI agent', '▶'],
              ].map(([n, t, s]) => (
                <div key={n} className="flex items-center gap-3 rounded-lg border-2 border-slate-200 px-3 py-2.5">
                  <span className="font-mono text-xs font-bold text-green-700 w-6">{n}</span>
                  <span className="font-medium text-slate-800 text-sm flex-1">{t}</span>
                  <span className={s === '✓' ? 'text-green-600' : 'text-clay'}>{s}</span>
                </div>
              ))}
              <div className="pt-2 text-center">
                <span className="font-mono text-xs text-slate-500">+ 146 more · हिंदी &amp; English</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* tiny "for teams" line */}
      <div className="max-w-7xl mx-auto mt-16 text-center">
        <p className="text-sm text-slate-500">
          Building with AI at work?{' '}
          <a href={CONTACT_FORM_LINK} target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-900 underline underline-offset-2">
            Meegrow Labs for teams →
          </a>
        </p>
      </div>
    </section>
  )
}
