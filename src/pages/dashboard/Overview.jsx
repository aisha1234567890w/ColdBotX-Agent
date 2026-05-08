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
  Phone
} from 'lucide-react';

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
    <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">{label}</div>
  </div>
);

const LiveReservation = ({ name, time, party, source, status }) => (
  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/[0.08] transition-colors group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center font-bold text-indigo-400 text-xs">
        {name.split(' ').map(n => n[0]).join('')}
      </div>
      <div>
        <div className="text-sm font-bold group-hover:text-indigo-400 transition-colors">{name}</div>
        <div className="text-[10px] text-gray-500 font-bold flex items-center gap-2">
          <Clock size={10} /> {time} • {party} Guests
        </div>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-white/5 text-gray-400" title={`Source: ${source}`}>
        {source === 'Call' ? <Phone size={14} /> : source === 'WhatsApp' ? <Smartphone size={14} /> : <MessageSquare size={14} />}
      </div>
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
        status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
      }`}>
        {status}
      </span>
    </div>
  </div>
);

export default function DashboardOverview() {
  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Welcome Back, Ayesha</h1>
          <p className="text-gray-500 font-medium">Aifur Islamabad • <span className="text-emerald-500 font-bold">Open for Service</span></p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white/5 rounded-xl px-4 py-2 border border-white/5 text-xs font-bold flex items-center gap-2">
            <Calendar size={14} className="text-indigo-400" />
            May 8, 2026
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl text-sm font-black transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
            + Quick Reservation
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Today's Bookings" value="24" icon={Calendar} trend={12} color="indigo" />
        <StatCard label="Live Occupancy" value="72%" icon={TableIcon} trend={5} color="purple" />
        <StatCard label="Peak Hour Load" value="High" icon={TrendingUp} trend={-2} color="orange" />
        <StatCard label="Revenue Today" value="PKR 84k" icon={TrendingUp} trend={18} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reservations */}
        <div className="lg:col-span-2 dashboard-glass p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black flex items-center gap-3">
              Upcoming Reservations
              <span className="bg-indigo-500/10 text-indigo-400 text-xs px-2 py-1 rounded-full">Next 4 Hours</span>
            </h2>
            <button className="text-xs font-bold text-indigo-400 hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            <LiveReservation name="Ahmed Khan" time="19:30" party="4" source="WhatsApp" status="Confirmed" />
            <LiveReservation name="Sarah Miller" time="20:00" party="2" source="Call" status="Pending" />
            <LiveReservation name="Zainab Ali" time="20:15" party="6" source="Chat" status="Confirmed" />
            <LiveReservation name="John Peterson" time="20:45" party="2" source="WhatsApp" status="Confirmed" />
            <LiveReservation name="Fatima Zahra" time="21:00" party="3" source="Call" status="Confirmed" />
          </div>
        </div>

        {/* Live Alerts & AI Insights */}
        <div className="space-y-8">
          <div className="dashboard-glass p-8 border-l-4 border-orange-500">
            <div className="flex items-center gap-3 text-orange-500 mb-4">
              <AlertCircle size={20} />
              <h3 className="font-black">Operational Alerts</h3>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-1 h-12 bg-orange-500/20 rounded-full"></div>
                <div>
                  <div className="text-sm font-bold">Overbooked Slot</div>
                  <div className="text-[10px] text-gray-500 leading-relaxed mt-1">20:00 - 21:00 has 12 guests vs 10 capacity. AI suggests combining Table 4 & 5.</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1 h-12 bg-red-500/20 rounded-full"></div>
                <div>
                  <div className="text-sm font-bold text-red-400">Inventory Shortage</div>
                  <div className="text-[10px] text-gray-500 leading-relaxed mt-1">"Swedish Meatballs" predicted to run out by 21:30 based on current order rate.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-glass p-8 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 overflow-hidden relative group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-indigo-400 mb-4">
                <TrendingUp size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Smart Insight</span>
              </div>
              <h4 className="text-lg font-black mb-2">Staffing Recommendation</h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">Based on previous Friday data and 24 confirmed bookings, we recommend adding 1 extra server between 19:00 - 22:00.</p>
              <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors">
                View Forecast Model
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
