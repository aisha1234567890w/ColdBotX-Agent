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
  X,
  Plus
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../utils/supabaseClient';

const NavItem = ({ icon: Icon, label, path, active, collapsed }) => (
  <Link 
    to={path}
    className={`group relative flex items-center gap-3 px-4 py-3.5 transition-all duration-300 rounded-2xl mb-1 ${
      active 
        ? 'text-white font-bold bg-indigo-600 shadow-lg shadow-indigo-500/20' 
        : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white hover:bg-indigo-50 dark:hover:bg-white/5'
    }`}
  >
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
      <Icon size={20} />
    </div>
    {!collapsed && <span className="text-sm font-bold tracking-tight">{label}</span>}
    {active && !collapsed && (
      <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
    )}
  </Link>
);

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Admin", "email": "admin@aifur.com"}');

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin-ops' },
    { icon: CalendarCheck, label: 'Reservations & Bookings', path: '/admin-ops/reservations' },
    { icon: TableProperties, label: 'Table & Seating', path: '/admin-ops/tables' },
    { icon: UtensilsCrossed, label: 'Menu Management', path: '/admin-ops/menu' },
    { icon: Users, label: 'Customer Profiles', path: '/admin-ops/customers' },
    { icon: MessageSquareCode, label: 'Messages & Inquiries', path: '/admin-ops/messages' },
    { icon: BarChart3, label: 'Analytics & Insights', path: '/admin-ops/analytics' },
    { icon: Settings, label: 'Settings & Config', path: '/admin-ops/settings' }
  ];

  const handleLogout = async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('supabase_session');
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${theme === 'dark' ? 'bg-[#030712] text-white' : 'bg-[#FAFAFA] text-gray-900'}`}>
      
      {/* Permanent Side Sidebar (Desktop) */}
      <aside className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen transition-all duration-500 z-50 border-r ${
        isCollapsed ? 'w-24' : 'w-72'
      } ${theme === 'dark' ? 'bg-[#030712] border-white/5' : 'bg-white border-gray-100'}`}>
        
        {/* Sidebar Header */}
        <div className="p-8 flex items-center justify-between mb-4">
          {!isCollapsed ? (
            <Link to="/" className="flex items-center gap-3">
               <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                 <UtensilsCrossed size={20} />
               </div>
               <span className="text-xl font-black tracking-tighter">Aifur</span>
            </Link>
          ) : (
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto text-white shadow-xl">
               <UtensilsCrossed size={20} />
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 overflow-y-auto">
          {menuItems.map((item) => (
            <NavItem 
              key={item.path}
              {...item}
              collapsed={isCollapsed}
              active={location.pathname === item.path}
            />
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-gray-50 dark:border-white/5 space-y-4">
           {!isCollapsed && (
             <div className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-2xl mb-4 relative overflow-hidden group">
               <div className="relative z-10">
                 <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Aifur AI</h4>
                 <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-3">Upgrade to Pro for deep insights.</p>
                 <button className="w-full py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">Upgrade Now</button>
               </div>
               <Plus size={40} className="absolute -bottom-4 -right-4 text-indigo-500/10 group-hover:rotate-90 transition-transform duration-500" />
             </div>
           )}
           <button 
             onClick={handleLogout}
             className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-500 hover:bg-red-50 transition-all ${isCollapsed ? 'justify-center' : ''}`}
           >
             <LogOut size={20} />
             {!isCollapsed && <span className="text-sm font-bold tracking-tight">Logout</span>}
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-500 ${isCollapsed ? 'lg:ml-24' : 'lg:ml-72'}`}>
        
        {/* Top bar */}
        <header className={`sticky top-0 z-40 backdrop-blur-xl border-b ${theme === 'dark' ? 'bg-[#030712]/80 border-white/5' : 'bg-white/80 border-gray-100'}`}>
          <div className="px-6 h-20 flex items-center justify-between">
            {/* Search */}
            <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all w-96 ${
              theme === 'dark' ? 'bg-white/5 border border-white/5' : 'bg-gray-100 border border-transparent focus-within:bg-white focus-within:border-gray-200 focus-within:shadow-sm'
            }`}>
              <Search size={18} className="text-gray-400" />
              <input type="text" placeholder="Search anything..." className="bg-transparent border-none outline-none text-sm w-full font-medium" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className="p-3 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-indigo-600 transition-all">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button className="relative p-3 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-indigo-600 transition-all">
                <Bell size={20} />
                <span className="absolute top-3 right-3 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white dark:ring-[#030712]" />
              </button>
              <div className="h-8 w-px bg-gray-200 dark:bg-white/10 mx-2" />
              <div className="flex items-center gap-3">
                 <div className="text-right hidden sm:block">
                   <div className="text-sm font-black">{user.name}</div>
                   <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Administrator</div>
                 </div>
                 <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center p-0.5 overflow-hidden shadow-lg shadow-indigo-500/10">
                   <img src={`https://ui-avatars.com/api/?name=${user.name}&background=4F46E5&color=fff&bold=true`} className="w-full h-full rounded-xl object-cover" alt="Profile" />
                 </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Overlay */}
        <main className="p-8 pb-32">
          <Outlet />
        </main>
      </div>

      {/* Mobile Menu Toggle (Fixed bottom right) */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-2xl shadow-2xl z-50 flex items-center justify-center animate-bounce"
      >
        <MenuIcon size={24} />
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-[#030712] p-8 animate-slide-in-right" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-12">
               <span className="text-2xl font-black italic">Aifur.</span>
               <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
            </div>
            <nav className="space-y-4">
              {menuItems.map(item => (
                <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-4 p-4 rounded-2xl font-bold ${location.pathname === item.path ? 'bg-indigo-600 text-white shadow-xl' : 'text-gray-500'}`}>
                  <item.icon size={20} /> {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

