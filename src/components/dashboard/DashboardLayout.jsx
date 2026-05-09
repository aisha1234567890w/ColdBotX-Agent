import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  TableProperties, 
  CalendarCheck, 
  BarChart3, 
  Users, 
  MessageSquareCode, 
  Settings,
  Bell,
  Search,
  User,
  Moon,
  Sun,
  LogOut,
  Menu as MenuIcon,
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../utils/supabaseClient';

const NavItem = ({ icon: Icon, label, path, active }) => (
  <Link 
    to={path}
    className={`relative flex items-center gap-2 px-4 py-2 transition-all duration-300 rounded-xl ${
      active 
        ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-500/10' 
        : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
    }`}
  >
    <Icon size={18} />
    <span className="text-sm font-semibold whitespace-nowrap">{label}</span>
    {active && (
      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
    )}
  </Link>
);

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications] = useState(3);
  
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Admin", "email": "admin@aifur.com"}');

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/manager' },
    { icon: CalendarCheck, label: 'Reservations', path: '/manager/reservations' },
    { icon: TableProperties, label: 'Table Map', path: '/manager/tables' },
    { icon: UtensilsCrossed, label: 'Menu Manager', path: '/manager/menu' },
    { icon: BarChart3, label: 'Analytics', path: '/manager/analytics' },
    { icon: Users, label: 'Customers', path: '/manager/customers' },
    { icon: MessageSquareCode, label: 'AI Activity', path: '/manager/ai-logs' },
    { icon: Settings, label: 'Settings', path: '/manager/settings' },
  ];

  const handleLogout = async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('supabase_session');
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#030712] text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Top Navigation Bar */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b ${theme === 'dark' ? 'bg-[#030712]/80 border-white/5' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo & Search */}
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
                <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-sm italic text-white shadow-lg shadow-indigo-500/30">A</span>
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>AIFUR</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold tracking-normal border border-indigo-500/20">OPS</span>
              </Link>

              <div className={`hidden lg:flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all ${
                theme === 'dark' 
                  ? 'bg-white/5 border-white/5 focus-within:border-indigo-500/50' 
                  : 'bg-gray-100 border-gray-200 focus-within:border-indigo-500/50'
              } w-80 group`}>
                <Search size={18} className="text-gray-500 group-focus-within:text-indigo-500" />
                <input 
                  type="text" 
                  placeholder="Search Ops Center..." 
                  className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-1">
              {menuItems.slice(0, 5).map((item) => (
                <NavItem 
                  key={item.path}
                  {...item}
                  active={location.pathname === item.path || (item.path !== '/manager' && location.pathname.startsWith(item.path))}
                />
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3 md:gap-6">
              <div className="flex items-center gap-1 md:gap-2">
                <button 
                  onClick={toggleTheme}
                  className={`p-2.5 rounded-xl transition-all ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100'}`}
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button className={`relative p-2.5 rounded-xl transition-all ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100'}`}>
                  <Bell size={20} />
                  {notifications > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-[10px] font-black flex items-center justify-center rounded-full text-white ring-2 ring-white dark:ring-[#030712]">
                      {notifications}
                    </span>
                  )}
                </button>
              </div>

              <div className={`h-8 w-px ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'} hidden md:block`}></div>

              {/* Profile Dropdown (Simplified for now) */}
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="hidden md:block text-right">
                  <div className="text-sm font-bold truncate max-w-[100px]">{user.name}</div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Admin</div>
                </div>
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white group-hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20">
                  {user.name?.charAt(0) || 'A'}
                </div>
                <button 
                  onClick={handleLogout}
                  className={`p-2.5 rounded-xl transition-all md:hidden xl:block ${theme === 'dark' ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}`}
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`xl:hidden p-2.5 rounded-xl transition-all ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100'}`}
              >
                {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`xl:hidden border-t animate-in slide-in-from-top duration-300 ${theme === 'dark' ? 'bg-[#030712] border-white/5' : 'bg-white border-gray-200'}`}>
            <div className="p-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    location.pathname === item.path 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-bold">{item.label}</span>
                </Link>
              ))}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all mt-4 border border-red-500/20"
              >
                <LogOut size={20} />
                <span className="font-bold">Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="max-w-[1600px] mx-auto p-4 md:p-8">
        <Outlet />
      </main>

      {/* Footer status bar */}
      <footer className={`fixed bottom-0 left-0 right-0 py-2 px-6 backdrop-blur-md border-t z-40 hidden md:flex items-center justify-between ${
        theme === 'dark' ? 'bg-[#030712]/50 border-white/5' : 'bg-white/50 border-gray-100'
      }`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">System Operational</span>
          </div>
          <div className={`h-3 w-px ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`}></div>
          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            Aifur AI Engine v2.4 <span className="text-indigo-500">Active</span>
          </div>
        </div>
        <div className="text-[10px] text-gray-400 font-medium">
          Last sync: {new Date().toLocaleTimeString()}
        </div>
      </footer>
    </div>
  );
}

