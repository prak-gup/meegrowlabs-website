export default function WhoItsFor() {
  const audiences = [
    {
      title: 'Teams Drowning in Repetitive Work',
      description:
        'If your team spends hours on copy-paste, manual data entry, or repetitive tasks that a computer should handle, we can help.'
    },
    {
      title: 'Founders Who Want AI Without the Chaos',
      description:
        'Stop managing 10 disconnected tools. We build unified systems that work together seamlessly.'
    },
    {
      title: 'Operators Who Care About Data Quality',
      description:
        'Not interested in AI demos or buzzwords. We build systems that produce accurate, reliable results you can actually use.'
    }
  ]

  return (
    <section className="relative py-32 px-6 bg-cream-100">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-slate-900">
            Who Meegrowlabs Is For
          </h2>
          <p className="text-xl text-slate-700 max-w-2xl">
            We work best with teams who are ready to move beyond one-off tools and build real,
            lasting automation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {audiences.map((audience, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-sage-200">
              <h3 className="text-xl font-display font-semibold text-slate-900 mb-3 leading-tight">
                {audience.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">{audience.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
