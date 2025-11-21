export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Discovery & Use-Case Shortlist',
      description:
        'We start by understanding your workflows, pain points, and opportunities. Together, we identify 2-3 high-impact automations to focus on.'
    },
    {
      number: '02',
      title: 'Prototype & Validate',
      description:
        'We build a working prototype with your real data. You see it in action, test it with your team, and we refine based on feedback.'
    },
    {
      number: '03',
      title: 'Productize & Integrate',
      description:
        'We turn the prototype into a production-ready system, integrated seamlessly with your existing tools and workflows.'
    },
    {
      number: '04',
      title: 'Scale & Evolve',
      description:
        'As you use the system, we monitor, optimize, and expand. Your automation grows with your needs.'
    }
  ]

  return (
    <section className="relative py-32 px-6 bg-white" id="how-it-works">
      <div className="max-w-6xl mx-auto">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-slate-900">
            How Our AI Workflow Automation Engagement Runs
          </h2>
          <p className="text-xl text-slate-700 max-w-2xl">
            From first conversation to production system in weeks, not months—each step keeps data governance and measurable outcomes front and center.
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, i) => (
            <div key={i} className="bg-cream-100 rounded-2xl p-10 border border-sage-200">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-mustard-400 rounded-full flex items-center justify-center text-xl font-bold text-slate-900">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-display font-semibold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-700 leading-relaxed text-lg">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
