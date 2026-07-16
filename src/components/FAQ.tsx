const FAQS = [
  ['Is it really free?', 'Yes — 100% free. All 150+ lessons, in हिंदी and English. No credit card, no catch.'],
  ['Do I need to know how to code?', 'No. We start from absolute zero — “what’s a file?” — and build up. If you can use WhatsApp, you can do this.'],
  ['Is it in Hindi or English?', 'Both. Every lesson plays in हिंदी or English — switch language any time with one tap.'],
  ['How long are the lessons?', 'About 2 minutes each. Watch one on a chai break. Your progress is saved when you sign in.'],
  ['What will I be able to do by the end?', 'Use and build with AI for real — from the terminal and Git to Claude Code and your own AI agents.'],
  ['Do I need to sign up?', 'Browse freely. Sign in (free, just your email) to save progress and pick up where you left off.'],
]

export default function FAQ() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-display text-slate-900 text-center">Questions?</h2>
        <div className="mt-10 space-y-4">
          {FAQS.map(([q, a]) => (
            <div key={q} className="border-l-4 border-green-600 bg-cream-100 rounded-r-xl p-5">
              <div className="font-display text-lg text-slate-900">{q}</div>
              <p className="mt-1 text-slate-700">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
