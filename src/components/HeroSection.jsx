import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function HeroSection() {
  const isLoggedIn = !!localStorage.getItem('user');

  return (
    <section className="relative bg-gradient-to-b from-gray-900 via-indigo-900 to-purple-900 dark:from-black dark:via-gray-900 dark:to-indigo-950 text-white transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <img src={logo} alt="Learnoviax" className="w-24 h-24 mb-4" />
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-white">The Adaptive AI Platform That Learns How You Learn.</h1>
            <p className="text-lg text-gray-300 mb-8">Stop following fixed curriculums. Learnoviax uses four collaborative AI agents to create a personalized, emotionally-intelligent path to guaranteed mastery.</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={isLoggedIn ? "/dashboard" : "/course"} className="inline-block">
                <button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-gray-900 font-semibold px-6 py-4 rounded-xl shadow-lg">
                  {isLoggedIn ? "Continue Your Journey" : "Start Your Personalized Learning Journey"}
                </button>
              </Link>
            </div>
          </div>

          <div className="flex-1 min-w-0 bg-gradient-to-br from-black to-gray-800 dark:from-gray-900 dark:to-black rounded-2xl p-4 sm:p-6 shadow-2xl border border-gray-700 dark:border-gray-800 overflow-hidden">
            <div className="text-sm text-gray-400 uppercase mb-3">Adaptive • Emotional • Multi-Agent</div>
            <div className="bg-gradient-to-r from-indigo-700 to-purple-600 rounded-xl p-4 sm:p-6 shadow-inner">
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">Personalized Learning Snapshot</h3>
              <p className="text-sm text-gray-200 mb-4">Example: Strengths in fundamentals, needs practice with recursion and time complexity. Recommended: 3 focused lessons this week.</p>
              <div className="flex gap-2 sm:gap-3">
                <div className="text-center bg-white bg-opacity-10 rounded-lg p-2 sm:p-3 flex-1 min-w-0 backdrop-blur-sm">
                  <div className="text-xl sm:text-2xl font-bold text-white">85%</div>
                  <div className="text-xs text-gray-300">Accuracy</div>
                </div>
                <div className="text-center bg-white bg-opacity-10 rounded-lg p-2 sm:p-3 flex-1 min-w-0 backdrop-blur-sm">
                  <div className="text-xl sm:text-2xl font-bold text-white">+12</div>
                  <div className="text-xs text-gray-300">XP / lesson</div>
                </div>
                <div className="text-center bg-white bg-opacity-10 rounded-lg p-2 sm:p-3 flex-1 min-w-0 backdrop-blur-sm">
                  <div className="text-xl sm:text-2xl font-bold text-white">3</div>
                  <div className="text-xs text-gray-300">Weak Topics</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-900 to-transparent dark:from-gray-950 pointer-events-none" />
    </section>
  );
}
