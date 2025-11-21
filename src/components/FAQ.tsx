const faqs = [
  {
    question: 'What is an agentic AI workflow?',
    answer:
      'An agentic AI workflow combines deterministic automations with AI policies. LLM-driven agents evaluate context, decide which downstream actions to call, and log reasoning so operators can audit every step.'
  },
  {
    question: 'How fast can we launch the first automation?',
    answer:
      'Most teams see a validated prototype in 2–3 weeks. Because we reuse battle-tested pipelines for data ingestion, evaluation, and monitoring, productionizing a workflow typically takes under six weeks.'
  },
  {
    question: 'Do you work with sensitive data?',
    answer:
      'Yes. We rely on Supabase auth + RLS, encrypted storage, and scoped service accounts. Every workflow is designed with SOC 2-ready audit logs and optional data anonymization.'
  },
  {
    question: 'Which teams get the biggest lift?',
    answer:
      'Operators, finance, and CX teams that touch repetitive data entry or analytics benefit the most. We also partner with founders who want AI-powered onboarding, reporting, or support without hiring an internal ML team.'
  }
]

export default function FAQ() {
  return (
    <section className="relative py-32 px-6 bg-cream-100" id="faq">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center space-y-3">
          <p className="text-sm font-semibold tracking-[0.3em] text-slate-500">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900">
            AI Workflow Automation Questions We Hear Most
          </h2>
          <p className="text-lg text-slate-600">
            Straight answers about timeline, data security, and how we slot into your existing ops.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-sage-200 bg-white p-6 open:shadow-lg transition-shadow"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-left">
                <span className="text-2xl font-display font-semibold text-slate-900">
                  {faq.question}
                </span>
                <span className="text-sage-500 text-3xl group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-4 text-slate-700 leading-relaxed text-lg">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

