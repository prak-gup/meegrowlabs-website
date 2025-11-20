export default function Industries() {
  const industries = [
    {
      name: 'BFSI',
      fullName: 'Banking, Financial Services & Insurance',
      useCases: [
        'Fraud detection with custom ML models',
        'Automated document processing for loans',
        'Risk assessment and credit scoring',
        'Customer service chatbots trained on policy data'
      ]
    },
    {
      name: 'Real Estate',
      fullName: 'Property & Real Estate',
      useCases: [
        'Property valuation using ML algorithms',
        'Lead scoring and qualification automation',
        'Document extraction from property records',
        'Market trend analysis and forecasting'
      ]
    },
    {
      name: 'Media & Entertainment',
      fullName: 'Media, Publishing & Entertainment',
      useCases: [
        'Content generation and summarization',
        'Automated video/audio transcription',
        'Sentiment analysis on audience feedback',
        'Content recommendation systems'
      ]
    },
    {
      name: 'Healthcare',
      fullName: 'Healthcare & Life Sciences',
      useCases: [
        'Medical record digitization and extraction',
        'Patient outcome prediction models',
        'Clinical trial data analysis',
        'Appointment scheduling automation'
      ]
    },
    {
      name: 'Retail & E-commerce',
      fullName: 'Retail & E-commerce',
      useCases: [
        'Demand forecasting and inventory optimization',
        'Customer behavior prediction',
        'Product recommendation engines',
        'Automated pricing strategies'
      ]
    },
    {
      name: 'Manufacturing',
      fullName: 'Manufacturing & Industrial',
      useCases: [
        'Predictive maintenance for equipment',
        'Quality control with computer vision',
        'Supply chain optimization',
        'Production forecasting'
      ]
    }
  ]

  return (
    <section className="relative py-32 px-6 bg-white" id="industries">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-slate-900">
            Industries We Serve
          </h2>
          <p className="text-xl text-slate-700 max-w-2xl">
            Tailored AI solutions for your industry's unique challenges
          </p>
        </div>

        <div className="space-y-6">
          {industries.map((industry, i) => (
            <details
              key={i}
              className="group bg-cream-100 rounded-2xl border border-sage-200 overflow-hidden"
            >
              <summary className="cursor-pointer p-8 flex items-center justify-between hover:bg-cream-200 transition-colors">
                <div>
                  <h3 className="text-2xl font-display font-bold text-slate-900 mb-1">
                    {industry.name}
                  </h3>
                  <p className="text-slate-600">{industry.fullName}</p>
                </div>
                <svg
                  className="w-6 h-6 text-slate-600 transform group-open:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>

              <div className="px-8 pb-8">
                <ul className="grid md:grid-cols-2 gap-4">
                  {industry.useCases.map((useCase, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-sage-500 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-slate-700">{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
