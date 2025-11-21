export default function Automations() {
  const automations = [
    {
      title: 'Custom Trained AI Models',
      description:
        'Fine-tuned models trained on your data. Domain-specific language models that understand your industry terminology, processes, and patterns.'
    },
    {
      title: 'Machine Learning Pipelines',
      description:
        'End-to-end ML workflows from data ingestion to model deployment. Automated retraining, monitoring, and optimization.'
    },
    {
      title: 'Knowledge-Trained Assistants',
      description:
        'Private, company-trained chat assistants that answer questions on documents, playbooks and archives using RAG architecture.'
    },
    {
      title: 'Custom OCR & Document Intelligence',
      description:
        'Tailored OCR + extraction for PDFs, scans and forms. Computer vision models that understand your document layouts and extract structured data.'
    },
    {
      title: 'Predictive Analytics & Forecasting',
      description:
        'ML-powered forecasting for demand, churn, risk assessment. Custom models trained on historical patterns to predict future outcomes.'
    },
    {
      title: 'Content & Analytics Automation',
      description:
        'AI workflows that turn raw inputs into publish-ready content. Automated analysis, summarization, and reporting with NLP models.'
    }
  ]

  return (
    <section className="relative py-32 px-6 bg-cream-100" id="automations">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-slate-900">
            Agentic AI Workflow Automations We Ship
          </h2>
          <p className="text-xl text-slate-700 max-w-2xl">
            Real systems solving real problems for teams like yours—from onboarding bots to ML-powered reporting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {automations.map((automation, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 border border-sage-200 hover:border-sage-400 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-display font-semibold text-slate-900 mb-3">
                {automation.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">{automation.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
