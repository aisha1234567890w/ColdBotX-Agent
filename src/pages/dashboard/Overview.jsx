import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  Table as TableIcon,
  Smartphone,
  MessageSquare,
  Phone,
  RefreshCcw
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useTheme } from '../../context/ThemeContext';

const StatCard = ({ label, value, icon: Icon, trend, color }) => (
  <div className="dashboard-glass p-6 stat-card-gradient transition-all duration-300 hover:scale-[1.02]">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-bold ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend > 0 ? '+' : ''}{trend}%
          <TrendingUp size={12} className={trend < 0 ? 'rotate-180' : ''} />
        </div>
      )}
    </div>
    <div className="text-3xl font-black mb-1">{value}</div>
    <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{label}</div>
  </div>
);

const LiveReservation = ({ name, time, party, source, status, theme }) => (
  <div className={`flex items-center justify-between p-4 rounded-2xl border transition-colors group ${
    theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/[0.08]' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
  }`}>
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center font-bold text-indigo-400 text-xs">
        {name ? name.split(' ').map(n => n[0]).join('') : '??'}
      </div>
      <div>
        <div className="text-sm font-bold group-hover:text-indigo-400 transition-colors">{name || 'Guest'}</div>
        <div className="text-[10px] text-gray-500 font-bold flex items-center gap-2">
          <Clock size={10} /> {time} • {party} Guests
        </div>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5 text-gray-400' : 'bg-white text-gray-400 shadow-sm'}`} title={`Source: ${source}`}>
        {source === 'Call' ? <Phone size={14} /> : source === 'WhatsApp' ? <Smartphone size={14} /> : <MessageSquare size={14} />}
      </div>
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
        status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 
        status === 'Pending' ? 'bg-orange-500/10 text-orange-500' :
        'bg-gray-500/10 text-gray-500'
      }`}>
        {status}
      </span>
    </div>
  </div>
);

export default function DashboardOverview() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayBookings: 0,
    occupancy: '0%',
    revenue: 'PKR 0',
    growth: 0
  });
  const [recentReservations, setRecentReservations] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch today's reservations
      const { data: todayRes, error: resError } = await supabase
        .from('reservations_main')
        .select('*')
        .eq('date', today);
      
      if (resError) throw resError;

      // Fetch recent reservations for the list
      const { data: recent, error: recentError } = await supabase
        .from('reservations_main')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      setRecentReservations(recent || []);
      setStats({
        todayBookings: todayRes?.length || 0,
        occupancy: '72%', // Mocked for now until table logic is in
        revenue: `PKR ${(todayRes?.length || 0) * 3500}`, // Mocked revenue calc
        growth: 12
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Operations Overview</h1>
          <p className="text-gray-500 font-medium flex items-center gap-2">
            Aifur Islamabad • 
            <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Live for Service
            </span>
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchData}
            className={`p-3 rounded-xl border transition-all ${
              theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
            title="Refresh Data"
          >
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <div className={`rounded-xl px-4 py-2 border text-xs font-bold flex items-center gap-2 ${
            theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <Calendar size={14} className="text-indigo-400" />
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl text-sm font-black transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
            + Quick Booking
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Today's Bookings" value={stats.todayBookings} icon={Calendar} trend={12} color="indigo" />
        <StatCard label="Live Occupancy" value={stats.occupancy} icon={TableIcon} trend={5} color="purple" />
        <StatCard label="AI Efficiency" value="98%" icon={TrendingUp} trend={2} color="orange" />
        <StatCard label="Est. Revenue" value={stats.revenue} icon={TrendingUp} trend={18} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reservations */}
        <div className="lg:col-span-2 dashboard-glass p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black flex items-center gap-3">
              Upcoming Reservations
              <span className="bg-indigo-500/10 text-indigo-400 text-[10px] px-2 py-1 rounded-full uppercase tracking-widest font-bold">Live Feed</span>
            </h2>
            <button className="text-xs font-bold text-indigo-400 hover:underline">View All Bookings</button>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-20 animate-pulse bg-gray-500/10 rounded-2xl"></div>
              ))
            ) : recentReservations.length > 0 ? (
              recentReservations.map((res) => (
                <LiveReservation 
                  key={res.id}
                  name={res.name}
                  time={res.time}
                  party={res.guests}
                  source={res.source || 'Web'}
                  status={res.status || 'Confirmed'}
                  theme={theme}
                />
              ))
            ) : (
              <div className="py-12 text-center text-gray-500 font-bold italic">
                No reservations found for today.
              </div>
            )}
          </div>
        </div>

        {/* Live Alerts & AI Insights */}
        <div className="space-y-8">
          <div className={`dashboard-glass p-8 border-l-4 border-orange-500 ${theme === 'light' ? 'bg-orange-50/50' : ''}`}>
            <div className="flex items-center gap-3 text-orange-500 mb-4">
              <AlertCircle size={20} />
              <h3 className="font-black">Operational Alerts</h3>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-1 h-12 bg-orange-500/20 rounded-full"></div>
                <div>
                  <div className="text-sm font-bold">High Load Detected</div>
                  <div className="text-[10px] text-gray-500 leading-relaxed mt-1">Evening slot (19:00-21:00) is at 85% capacity. Monitor standby list.</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1 h-12 bg-indigo-500/20 rounded-full"></div>
                <div>
                  <div className="text-sm font-bold">AI Agent Notice</div>
                  <div className="text-[10px] text-gray-500 leading-relaxed mt-1">Voice AI successfully handled 12 calls in the last hour. No human intervention needed.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-glass p-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-none overflow-hidden relative group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-indigo-100 mb-4">
                <TrendingUp size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Smart Insight</span>
              </div>
              <h4 className="text-lg font-black mb-2 text-white">Staffing Optimized</h4>
              <p className="text-xs text-indigo-100 leading-relaxed mb-6">Current staffing matches predicted guest flow. Efficiency is at peak performance.</p>
              <button className="w-full py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-xs font-bold hover:bg-white/20 transition-colors">
                View Detailed Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

