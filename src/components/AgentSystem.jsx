import { useState, useEffect, useRef } from 'react';
const agents = [
  {
    id: 'performance',
    name: 'InsightSage',
    emoji: '🔎',
    focus: 'Skill Diagnostics',
    benefit: 'Continuously analyzes scores and engagement to pinpoint precise knowledge gaps and learning trends.'
  },
  {
    id: 'curriculum',
    name: 'PathWeaver',
    emoji: '🧭',
    focus: 'Adaptive Learning Paths',
    benefit: 'Crafts a personalized, efficient learning sequence that adapts as you improve.'
  },
  {
    id: 'exam',
    name: 'ExamForge',
    emoji: '⚒️',
    focus: 'Realistic Exam Simulation',
    benefit: 'Generates varied, timed mock exams to build accuracy, speed, and confidence.'
  },
  {
    id: 'feedback',
    name: 'EchoCoach',
    emoji: '💬',
    focus: 'Emotionally Intelligent Feedback',
    benefit: 'Analyzes answers and sentiment to provide motivating, actionable guidance.'
  }
];

export default function AgentSystem() {
  const [selected, setSelected] = useState(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setSelected(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (selected && closeButtonRef.current) {
      try { closeButtonRef.current.focus(); } catch (e) { }
    }
  }, [selected]);

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Meet Your AI Collaborative Agents</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((a, idx) => (
            <article
              key={a.id}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 transform transition hover:-translate-y-1 hover:shadow-2xl`}
              style={{ transitionDelay: `${idx * 60}ms` }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl text-white" style={{ background: ['linear-gradient(135deg,#7c3aed,#06b6d4)', 'linear-gradient(135deg,#06b6d4,#8b5cf6)', 'linear-gradient(135deg,#f97316,#ef4444)', 'linear-gradient(135deg,#10b981,#06b6d4)'][idx % 4] }}>
                  <span className="text-2xl">{a.emoji}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold leading-tight text-gray-900 dark:text-white">{a.name}</h3>
                  <div className="text-xs text-gray-500 dark:text-gray-400 italic">{a.focus}</div>
                </div>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{a.benefit}</p>

              <div className="mt-auto pt-2">
                <button onClick={() => setSelected(a)} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition inline-flex items-center gap-2">
                  Learn more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setSelected(null)} aria-hidden="true" />

          <div role="dialog" aria-modal="true" aria-labelledby="agent-title" className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full mx-4 p-6 shadow-2xl transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl" style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: 'white' }}>{selected.emoji}</div>
                <div>
                  <h3 id="agent-title" className="text-2xl font-bold text-gray-900 dark:text-white">{selected.name}</h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{selected.focus}</div>
                </div>
              </div>

              <button ref={closeButtonRef} onClick={() => setSelected(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md p-2" aria-label="Close details">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-4 text-gray-700 dark:text-gray-300">
              <p className="mb-3">{selected.benefit}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">How it helps you:</p>
              <ul className="list-disc pl-5 mt-2 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>Personalized insights based on your interactions and performance</li>
                <li>Actionable next steps and curated lessons</li>
                <li>Continuous adjustments as you progress</li>
              </ul>
            </div>

            {/* Footer buttons removed as per request */}
          </div>
        </div>
      )}
    </section>
  );
}
