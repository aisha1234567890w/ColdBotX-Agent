import { Link } from 'react-router-dom';

export default function FinalCTA() {
  return (
    <section className="bg-gradient-to-r from-indigo-900 to-purple-700 text-white py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to meet your AI tutor?</h2>
        <p className="text-lg text-indigo-100 mb-8">Sign up and start a personalized learning plan in minutes — adaptive, emotionally-aware, and exam-focused.</p>
        <div className="flex justify-center">
          <Link to="/signup">
            <button className="bg-white text-indigo-900 font-bold px-8 py-4 rounded-xl shadow-xl hover:scale-105 transition">Sign Up and Meet Your AI Tutor</button>
          </Link>
        </div>
      </div>
    </section>
  );
}
