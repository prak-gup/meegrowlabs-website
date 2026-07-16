export default function FinalCTA() {
  return (
    <section className="bg-green-600 px-6 py-24">
      <div className="max-w-3xl mx-auto text-center text-white">
        <h2 className="text-4xl md:text-5xl font-display leading-tight">
          Your 2-minute head start on AI begins now
        </h2>
        <p className="mt-4 text-lg text-green-50 max-w-xl mx-auto">
          Join learners across India going from zero to AI hero — free, in हिंदी &amp; English.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/app" className="inline-block px-10 py-4 bg-white text-green-700 font-bold rounded-lg hover:bg-cream-100 transition-colors shadow-lg text-lg">
            🎓 Start the free course →
          </a>
          <a href="/learn" className="inline-block px-8 py-4 bg-green-700 text-white font-bold rounded-lg border-2 border-white/40 hover:bg-green-800 transition-colors text-lg">
            See all lessons
          </a>
        </div>
        <p className="mt-6 text-sm text-green-100">No credit card. Just your email to save progress.</p>
      </div>
    </section>
  )
}
