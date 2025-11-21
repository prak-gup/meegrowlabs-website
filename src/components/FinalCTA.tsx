const CONTACT_FORM_LINK = "https://tally.so/r/444qZ5"

export default function FinalCTA() {
  return (
    <section className="relative py-32 px-6 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8 leading-tight text-slate-900">
          Ready to Ship Your First Serious AI Workflow Automation?
        </h2>

        <p className="text-xl md:text-2xl text-slate-700 mb-12 max-w-3xl mx-auto leading-relaxed">
          Share 2-3 workflows you'd love to automate. We'll show you what's possible, build a
          prototype with your data, and get you running in weeks.
        </p>

        <a
          href={CONTACT_FORM_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-12 py-5 text-xl bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-xl"
          aria-label="Book an AI workflow automation call with Meegrowlabs"
        >
          Get Started
        </a>

        <p className="mt-8 text-slate-600">
          No commitment. Just a conversation about what's possible.
        </p>
      </div>

      <footer className="mt-32 pt-16 border-t border-sage-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Meegrowlabs</h3>
              <p className="text-slate-600">AI Automation for Real Work</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Contact</h4>
              <a
                href={CONTACT_FORM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Get in Touch
              </a>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Services</h4>
              <ul className="space-y-2 text-slate-600">
                <li>Custom AI Automation</li>
                <li>Workflow Integration</li>
                <li>AI Consulting</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Company</h4>
              <p className="text-slate-600">Building intelligent systems for modern teams</p>
            </div>
          </div>

          <div className="text-center text-sm text-slate-500 pt-8 border-t border-sage-200">
            © {new Date().getFullYear()} Meegrowlabs. All rights reserved.
          </div>
        </div>
      </footer>
    </section>
  )
}
