import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../utils/supabaseClient';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Hide global navbar on dashboard to prevent double-header issue (Dashboard has its own)
  if (location.pathname === '/dashboard') return null;

  const handleLogout = async () => {
    // Clear ALL auth-related storage FIRST, before any async calls
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('supabase_session');
    localStorage.removeItem('isLoggedIn');

    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Logout warning:', e);
    }

    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-30 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Aifur</Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 ml-6 text-sm text-gray-600 dark:text-gray-300">
            {[
              { to: '/', label: 'Home' },
              { to: '/menu', label: 'Menu' },
              { to: '/reservations', label: 'Reservations' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' }
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group relative px-1 py-1 inline-block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute left-0 -bottom-0.5 h-0.5 w-full bg-gradient-to-r from-indigo-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold hover:opacity-90 overflow-hidden">
                {user.avatar ? <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" /> : (user.name?.charAt(0) || "U")}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-semibold"
              >
                Sign out
              </button>
              <Link to="/dashboard">
                <button className="group relative overflow-hidden px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-lg inline-flex items-center transform transition-all duration-200 hover:scale-105">
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-90"></span>
                  <span className="relative z-10">Dashboard</span>
                </button>
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Sign in</Link>

            </>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:text-gray-300"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div className={`md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 overflow-hidden transition-all ${open ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-6 py-4 flex flex-col gap-3">
          <Link to="/" onClick={() => setOpen(false)} className="py-2 px-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">Home</Link>
          <Link to="/menu" onClick={() => setOpen(false)} className="py-2 px-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">Menu</Link>
          <Link to="/reservations" onClick={() => setOpen(false)} className="py-2 px-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">Reservations</Link>
          <Link to="/about" onClick={() => setOpen(false)} className="py-2 px-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">About</Link>
          <Link to="/contact" onClick={() => setOpen(false)} className="py-2 px-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">Contact</Link>
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            {user ? (
              <>
                <button onClick={() => { setOpen(false); handleLogout(); }} className="block w-full text-center text-red-600 dark:text-red-400 font-semibold py-2">Sign out</button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
