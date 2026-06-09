const CONTACT_FORM_LINK = "https://tally.so/r/444qZ5"

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-sage-50/95 backdrop-blur-sm border-b border-sage-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between gap-4">
        <a href="/" className="text-xl font-display font-bold text-slate-900">
          Meegrowlabs
        </a>

        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="/learn"
            className="hidden sm:inline-block px-4 py-3 font-semibold text-slate-900 hover:text-slate-600 transition-colors"
          >
            Free Course
          </a>
          <a
            href="https://blog.meegrowlabs.com"
            className="hidden sm:inline-block px-4 py-3 font-semibold text-slate-900 hover:text-slate-600 transition-colors"
          >
            Blog
          </a>
          <a
            href={CONTACT_FORM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 sm:px-8 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
          >
            Get started
          </a>
        </div>
      </div>
    </nav>
  )
}
