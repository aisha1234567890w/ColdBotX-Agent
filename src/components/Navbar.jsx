import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../utils/supabaseClient';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initial load
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(storedUser);

    // Listen for auth state changes from Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        const updatedUser = JSON.parse(localStorage.getItem('user') || 'null');
        setUser(updatedUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Hide global navbar on manager dashboard to prevent double-header issue
  if (location.pathname.startsWith('/admin-ops')) return null;

  const handleLogout = async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('supabase_session');
    localStorage.removeItem('isLoggedIn');
    setUser(null);
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/reservations', label: 'Reservations' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-colors duration-200 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Aifur
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 ml-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-bold tracking-tight transition-colors ${
                  location.pathname === link.to 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          {user && (
            <Link 
              to={user.role === 'manager' ? '/admin-ops' : '/user-dashboard'}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-black/10 dark:shadow-white/5 border border-transparent dark:border-white/10"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
              {user.role === 'manager' ? 'Ops Center' : 'Dashboard'}
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3 md:gap-5">
              <Link 
                to={user.role === 'manager' ? '/admin-ops' : '/user-dashboard'}
                className="flex items-center gap-2 group"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="hidden lg:block">
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    {user.role === 'manager' ? 'Admin / Ops' : 'Customer'}
                  </div>
                  <div className="text-xs font-bold dark:text-white truncate max-w-[100px]">{user.name}</div>
                </div>
              </Link>
              
              {/* Extra Ops Center link for managers to be super clear */}
              {user.role === 'manager' && (
                <Link 
                  to="/admin-ops"
                  className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-tighter hover:bg-indigo-100 transition-all border border-indigo-100 dark:border-indigo-800"
                >
                  Ops Dashboard
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-xs font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Login</Link>
              <Link 
                to="/signup" 
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                Join Now
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 transition-all"
          >
            {open ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div className={`md:hidden bg-white dark:bg-gray-900 overflow-hidden transition-all duration-300 ${open ? 'max-h-[500px] border-t border-gray-100 dark:border-gray-800' : 'max-h-0'}`}>
        <div className="px-6 py-6 flex flex-col gap-2">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="py-3 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-bold text-gray-700 dark:text-gray-300 transition-all">
              {link.label}
            </Link>
          ))}
          {user && (
             <Link 
               to={user.role === 'manager' ? '/admin-ops' : '/user-dashboard'} 
               onClick={() => setOpen(false)} 
               className="py-3 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest mt-2 text-center"
             >
               {user.role === 'manager' ? 'Operations Dashboard' : 'My Dashboard'}
             </Link>
          )}
        </div>
      </div>
    </header>
  );
}
