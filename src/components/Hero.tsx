const CONTACT_FORM_LINK = "https://tally.so/r/444qZ5"

export default function Hero() {
  const scrollToInternship = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const internshipSection = document.getElementById('internship-banner')
    if (internshipSection) {
      internshipSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="relative bg-cream-100 px-6 pt-32 pb-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text Content */}
        <div className="space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-slate-900 leading-tight">
            AI WORKFLOW AUTOMATION FOR MODERN TEAMS
          </h1>

          <p className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-xl">
            Agentic AI workflows, intelligent routing, and enterprise-ready automation pipelines that
            move data securely between your finance, ops, product, and CX stacks.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={CONTACT_FORM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-lg text-lg text-center"
            >
              Discover how
            </a>
            <a
              href="#internship-banner"
              onClick={scrollToInternship}
              className="inline-block px-10 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg text-lg text-center relative overflow-hidden group"
            >
              <span className="relative z-10">Winter Internship 2025</span>
              <span className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full animate-ping"></span>
            </a>
          </div>
        </div>

        {/* Right: Animated Workflow Cards */}
        <div className="relative max-w-lg mx-auto lg:max-w-none space-y-6">

          {/* Input Card */}
          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-sage-200 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-cream-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-sage-200 transition-colors duration-300">
                <svg className="w-7 h-7 text-slate-700 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Input</div>
                <div className="font-bold text-lg text-slate-900">Raw Data</div>
              </div>
              {/* Animated dots */}
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-sage-400 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-sage-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-sage-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>

          {/* Animated Arrow */}
          <div className="flex justify-center animate-bounce" style={{ animationDuration: '2s' }}>
            <svg className="w-8 h-10 text-sage-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" transform="rotate(90 12 12)"/>
            </svg>
          </div>

          {/* AI Process Card */}
          <div className="group relative bg-gradient-to-br from-mustard-400 to-mustard-500 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in overflow-hidden" style={{ animationDelay: '0.2s' }}>
            {/* Animated background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:rotate-12 transition-transform duration-300">
                <svg className="w-7 h-7 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">AI Process</div>
                <div className="font-bold text-lg text-slate-900">ML Models</div>
              </div>
              {/* Processing indicator */}
              <div className="w-8 h-8 border-3 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>

          {/* Animated Arrow */}
          <div className="flex justify-center animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.5s' }}>
            <svg className="w-8 h-10 text-sage-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" transform="rotate(90 12 12)"/>
            </svg>
          </div>

          {/* Output Card */}
          <div className="group relative bg-gradient-to-br from-sage-500 to-sage-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in overflow-hidden" style={{ animationDelay: '0.4s' }}>
            {/* Success glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Output</div>
                <div className="font-bold text-lg text-slate-900">Insights & Actions</div>
              </div>
              {/* Success checkmark */}
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Section - 3 Pillars */}
      <div className="max-w-7xl mx-auto mt-32">
        <div className="bg-slate-900 rounded-3xl p-12">
          <div className="grid md:grid-cols-3 gap-12 text-white">
            <div>
              <div className="text-sm font-semibold mb-3 text-sage-300">TECH</div>
              <p className="text-slate-300 leading-relaxed">
                Innovation you can't ignore — built to make automation seamless and intelligent.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold mb-3 text-sage-300">PROCESS</div>
              <p className="text-slate-300 leading-relaxed">
                The link between strategy, execution, and measurable growth.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold mb-3 text-sage-300">SOLVED</div>
              <p className="text-slate-300 leading-relaxed">
                Real outcomes. Real impact. Real transformation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
