import { useState } from 'react';

export default function Pricing() {
  const [billing, setBilling] = useState('monthly'); // 'monthly' | 'yearly'
  const [hovered, setHovered] = useState(null);

  const plans = [
    {
      id: 'free',
      title: 'Free',
      monthly: 0,
      perks: [
        '2 AI-generated lessons per day',
        'Pre-generated lesson library',
        'Unlimited quizzes',
        'XP, streaks & achievements',
        'Basic Code Lab',
        'Community support'
      ]
    },
    {
      id: 'pro',
      title: 'Pro',
      monthly: 10,
      featured: true,
      perks: [
        'Unlimited AI lessons',
        '💬 Socratic AI Chat tutor',
        '🤖 AI-powered code feedback',
        '📊 Personalized difficulty',
        '📜 Shareable certificates',
        '📄 Clean PDF exports',
        'Priority support'
      ]
    },
    {
      id: 'team',
      title: 'Campus',
      monthly: 49,
      perks: [
        'Everything in Pro',
        'Admin dashboard',
        'Bulk seat licensing',
        'Student progress analytics',
        'Custom roadmaps',
        'Knowledge tracing reports',
        'Dedicated support'
      ]
    }
  ];

  const format = (n) => (n === 0 ? '$0' : `$${n}`);
  const priceFor = (monthly) => {
    if (billing === 'monthly') return `${format(monthly)}/mo`;
    const yearly = Math.round(monthly * 12 * 0.8); // 20% off yearly
    return `${format(yearly)}/yr`;
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Simple, Transparent Pricing</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Start learning for free. Upgrade when you're ready for the full AI-powered experience.</p>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-full p-1 flex items-center shadow-sm border border-gray-100 dark:border-gray-700">
            <button onClick={() => setBilling('monthly')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${billing === 'monthly' ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300'}`}>Monthly</button>
            <button onClick={() => setBilling('yearly')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${billing === 'yearly' ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300'}`}>
              Yearly
              <span className="ml-1 text-xs text-emerald-500 font-bold">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((p) => {
            const isActive = hovered ? (hovered === p.id) : p.featured;
            return (
              <div
                key={p.id}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                className={`relative p-6 rounded-2xl border bg-white dark:bg-gray-800 transform transition-all flex flex-col ${isActive ? 'border-indigo-300 dark:border-indigo-500 shadow-2xl dark:shadow-indigo-900/20 -translate-y-1 scale-[1.01]' : 'border-gray-100 dark:border-gray-700 shadow dark:shadow-none'} `}
              >
                {p.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">Most popular</div>}

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{p.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{p.id === 'free' ? 'Forever free' : (billing === 'monthly' ? 'Billed monthly' : 'Billed yearly — save 20%')}</div>
                  </div>
                  <div className={`text-4xl font-extrabold tracking-tight transition-all duration-300 ${isActive ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>
                    <span className="inline-block align-baseline">{priceFor(p.monthly)}</span>
                  </div>
                </div>

                <ul className="mb-6 space-y-3 flex-1">
                  {p.perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 mt-0.5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{perk}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <button className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform hover:scale-[1.02]' : 'border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                    {p.id === 'free' ? 'Get started free' : p.id === 'pro' ? 'Start free trial' : 'Contact sales'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
