export default function InternshipBanner() {
  return (
    <section id="internship-banner" className="relative py-16 px-6 bg-gradient-to-br from-slate-900 to-slate-800 border-y border-slate-700">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-sm font-semibold mb-4">
              <span className="animate-pulse">⏰</span>
              <span>Deadline: 30th November 2025</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
              Winter AI Engineering Internship 2025
            </h2>

            <p className="text-lg text-slate-300 max-w-2xl mb-6">
              8-12 week intensive research internship on Project Horizon—the natural language to 3D AI platform.
              For serious 3rd/4th-year Computer Science students or recent CS graduates with the relevant skills.
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-md text-sm">
                Python · PyTorch
              </span>
              <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-md text-sm">
                NVIDIA GPUs
              </span>
              <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-md text-sm">
                Remote/Gurgaon
              </span>
              <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-md text-sm">
                Paid Position
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="/internship.html"
                className="inline-block px-8 py-4 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100 transition-colors shadow-lg"
              >
                View Details & Apply
              </a>
              <a
                href="https://tally.so/r/q44pQd"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
              >
                Apply Now
              </a>
            </div>
          </div>

          <div className="flex-shrink-0 hidden lg:block">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 bg-gradient-to-br from-sage-400 to-mustard-400 rounded-2xl opacity-20 blur-2xl"></div>
              <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-8 backdrop-blur">
                <div className="text-center">
                  <div className="text-5xl font-display font-bold text-white mb-2">4</div>
                  <div className="text-slate-400 text-sm mb-4">Positions Open</div>

                  <div className="h-px bg-slate-700 mb-4"></div>

                  <div className="text-3xl font-display font-bold text-white mb-2">8-12</div>
                  <div className="text-slate-400 text-sm mb-4">Weeks Duration</div>

                  <div className="h-px bg-slate-700 mb-4"></div>

                  <div className="text-sm text-red-400 font-semibold animate-pulse">
                    Closes in Days
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
