const PATHS = [
  { t: 'Coding Foundations', d: 'Files, terminal & Git — the basics every AI power-user needs.', tag: 'Beginner', a: 'bg-green-600' },
  { t: 'How Software Works', d: 'Servers, APIs, databases & building real things.', tag: 'Beginner', a: 'bg-mustard-400' },
  { t: 'Build with Claude Code', d: 'Make real apps just by describing them — Skills, MCP.', tag: 'Intermediate', a: 'bg-[#D97757]' },
  { t: 'AI Agents & Projects', d: 'Agents, automation, and shipping real projects.', tag: 'Advanced', a: 'bg-pink-400' },
  { t: 'Loop Engineering', d: 'The hot new way to run AI: self-running loops.', tag: '🔥 New', a: 'bg-slate-900' },
]
const STEPS = [
  ['1', 'Pick a path', 'Foundations, Claude Code, AI Agents — or the full Zero to AI Hero journey.'],
  ['2', 'Watch 2-minute lessons', 'Tiny, focused videos in हिंदी or English. Switch language any time.'],
  ['3', 'Build for real', 'By the end you can use and build with AI — and you keep your progress as you go.'],
]
const WHO = ['Complete beginners', 'Students', 'Working professionals', 'Founders']

export default function CourseSections() {
  return (
    <>
      {/* What you'll learn */}
      <section className="bg-cream-100 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display text-slate-900 text-center">Choose your path</h2>
          <p className="text-center text-slate-600 mt-2 max-w-xl mx-auto">Guided learning paths made of bite-sized lessons. Start anywhere — it’s all free.</p>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PATHS.map((p) => (
              <a key={p.t} href="/app" className="block bg-white rounded-2xl border-4 border-slate-900 p-6 shadow-[6px_6px_0_#0F0F0F] hover:-translate-y-0.5 transition-transform">
                <span className={`inline-block ${p.a} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>{p.tag}</span>
                <div className="mt-3 text-xl font-display text-slate-900">{p.t}</div>
                <p className="mt-1 text-slate-600 text-sm">{p.d}</p>
                <span className="mt-4 inline-block font-semibold text-green-700">Start →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display text-slate-900 text-center">How it works</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-8">
            {STEPS.map(([n, t, d]) => (
              <div key={n} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-green-600 text-white font-display text-xl flex items-center justify-center border-4 border-slate-900">{n}</div>
                <div className="mt-4 text-xl font-display text-slate-900">{t}</div>
                <p className="mt-2 text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-cream-100 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display text-slate-900">Made for India — for anyone who refuses to be left behind by AI</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {WHO.map((w) => (
              <span key={w} className="bg-white border-2 border-slate-900 rounded-full px-5 py-2 font-bold text-slate-900">{w}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
