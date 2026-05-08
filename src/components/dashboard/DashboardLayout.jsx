import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
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
  Sun
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, path, active }) => (
  <Link 
    to={path}
    className={`flex items-center gap-3 px-6 py-4 transition-all duration-200 ${
      active 
        ? 'sidebar-link-active text-indigo-400 font-bold' 
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon size={20} />
    <span className="text-sm tracking-wide">{label}</span>
  </Link>
);

export default function DashboardLayout() {
  const location = useLocation();
  const [notifications] = useState(3);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: CalendarCheck, label: 'Reservations', path: '/dashboard/reservations' },
    { icon: TableProperties, label: 'Table Map', path: '/dashboard/tables' },
    { icon: UtensilsCrossed, label: 'Menu Manager', path: '/dashboard/menu' },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: Users, label: 'Customers', path: '/dashboard/customers' },
    { icon: MessageSquareCode, label: 'AI Activity', path: '/dashboard/ai-logs' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white flex font-sans selection:bg-indigo-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col sticky top-0 h-screen hidden lg:flex bg-[#030712]">
        <div className="p-8">
          <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-sm italic">A</span>
            AIFUR <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold ml-1 tracking-normal">OPS</span>
          </Link>
        </div>

        <nav className="flex-1 mt-4">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.path}
              {...item}
              active={location.pathname === item.path}
            />
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="bg-indigo-600/10 rounded-2xl p-4 border border-indigo-500/20">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Store Status</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-bold text-emerald-500">Live & Open</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto overflow-x-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 bg-[#030712]/80 backdrop-blur-xl z-30">
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5 w-96">
            <Search size={18} className="text-gray-500" />
            <input 
              type="text" 
              placeholder="Search reservations, tables, orders..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-600"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell size={22} />
              {notifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-[10px] font-black flex items-center justify-center rounded-full text-white ring-2 ring-[#030712]">
                  {notifications}
                </span>
              )}
            </button>
            <div className="h-8 w-px bg-white/10"></div>
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="text-right">
                <div className="text-sm font-bold">Ayesha Altaf</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Admin Owner</div>
              </div>
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black group-hover:scale-105 transition-transform">
                AA
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Pages Root */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
