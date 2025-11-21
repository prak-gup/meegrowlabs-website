const platforms = [
  {
    name: 'n8n + agentic AI routing',
    description:
      'Design multi-step automations where LLM-driven agents decide the next best action and call internal APIs securely.',
    keywords: 'agentic ai workflow'
  },
  {
    name: 'Zapier and Make',
    description:
      'Modernize existing Zapier/Make recipes with AI enrichment, intelligent branching, and automated QA before actions fire.',
    keywords: 'zapier ai workflow'
  },
  {
    name: 'Custom API + data warehouses',
    description:
      'Wire AI copilots directly into Supabase, Snowflake, or internal services for faster reporting and anomaly detection.',
    keywords: 'ai workflow tools'
  },
  {
    name: 'Knowledge-trained assistants',
    description:
      'Build RAG pipelines on proprietary content so support or product teams get accurate answers in every channel.',
    keywords: 'ai workflow automation'
  }
]

export default function Platforms() {
  return (
    <section className="relative py-32 px-6 bg-white" id="platforms">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center space-y-4">
          <p className="text-sm font-semibold tracking-[0.3em] text-slate-500">
            PLATFORMS & STACKS
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900">
            Platform Integrations for AI Workflow Automation
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We meet you inside the tools you already use, then layer agentic AI decisioning,
            monitoring, and analytics so every workflow composes smartly.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {platforms.map((platform) => (
            <article
              key={platform.name}
              className="rounded-2xl border border-sage-200 bg-cream-50 p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              <h3 className="text-2xl font-display font-semibold text-slate-900 mb-3">
                {platform.name}
              </h3>
              <p className="text-slate-700 leading-relaxed">{platform.description}</p>
              <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-sage-500">
                {platform.keywords}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

