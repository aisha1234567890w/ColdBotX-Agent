export default function FeaturesGrid() {
  const items = [
    { title: 'Guaranteed Mastery', desc: 'Focused practice and adaptive sequencing ensure you master topics, not just complete them.' },
    { title: 'Emotional Engagement', desc: 'Sentiment-aware coaching keeps motivation high and reduces burnout.' },
    { title: 'Exam Ready', desc: 'High-fidelity mock exams and tailored drills build confidence for test day.' }
  ];

  return (
    <section className="bg-white dark:bg-gray-900 py-16 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">The Learnoviax Edge: How We Ensure Mastery</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((it, idx) => (
            <div key={idx} className="p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 hover:shadow-lg transition-all">
              <div className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">{it.title}</div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
