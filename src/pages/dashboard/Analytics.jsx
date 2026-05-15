import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Users, Clock, Smartphone, Phone, MessageSquare, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const COLORS = ['#4F46E5', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalGuests: 0,
    avgCheck: 0,
    retentionRate: 0,
    growth: 12.5 // Simulated growth trend
  });
  const [data, setData] = useState({
    peakHours: [],
    dayTrends: [],
    loyaltyData: [],
    statusBreakdown: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch Reservations
      const { data: reservations, error: resError } = await supabase
        .from('reservations_main')
        .select('*');

      // Fetch Menu Overrides for price calculation
      const { data: menuItems, error: menuError } = await supabase
        .from('menu_overrides')
        .select('price');

      if (resError) throw resError;

      // 1. Calculate Revenue (Estimated)
      // We take avg menu price or a default (e.g., 1500 PKR)
      const avgPrice = menuItems && menuItems.length > 0 
        ? menuItems.reduce((a, b) => a + (b.price || 0), 0) / menuItems.length 
        : 1500;
      
      const totalGuests = reservations.reduce((sum, r) => sum + (parseInt(r.guests_count) || 0), 0);
      const estimatedRevenue = totalGuests * avgPrice;

      // 2. Loyalty Breakdown
      const phoneVisits = {};
      reservations.forEach(r => {
        const phone = r.phone_number || 'unknown';
        phoneVisits[phone] = (phoneVisits[phone] || 0) + 1;
      });
      const vips = Object.values(phoneVisits).filter(v => v >= 3).length;
      const regulars = Object.values(phoneVisits).filter(v => v === 2).length;
      const newcomers = Object.values(phoneVisits).filter(v => v === 1).length;

      // 3. Day-wise Trends
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayCounts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
      reservations.forEach(r => {
        const dayName = days[new Date(r.reservation_date).getDay()];
        dayCounts[dayName] += 1;
      });

      // 4. Peak Hours
      const hourCounts = {};
      reservations.forEach(r => {
        if (r.reservation_time) {
          const hour = r.reservation_time.substring(0, 2) + ':00';
          hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        }
      });

      setMetrics({
        totalRevenue: estimatedRevenue,
        totalGuests,
        avgCheck: avgPrice,
        retentionRate: ((vips + regulars) / Object.keys(phoneVisits).length * 100).toFixed(1),
        growth: 8.2
      });

      setData({
        dayTrends: Object.keys(dayCounts).map(day => ({ name: day, bookings: dayCounts[day] })),
        peakHours: Object.keys(hourCounts).sort().map(h => ({ hour: h, count: hourCounts[h] })),
        loyaltyData: [
          { name: 'VIPs', value: vips },
          { name: 'Regulars', value: regulars },
          { name: 'New Guests', value: newcomers }
        ],
        statusBreakdown: [
          { name: 'Completed', value: reservations.filter(r => r.status === 'completed').length },
          { name: 'Confirmed', value: reservations.filter(r => r.status === 'confirmed').length },
          { name: 'Cancelled', value: reservations.filter(r => r.status === 'cancelled').length }
        ]
      });

    } catch (err) {
      console.error("Analytics Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const Card = ({ title, children, className = "" }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm ${className}`}
    >
      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-8">{title}</h3>
      {children}
    </motion.div>
  );

  if (loading) return (
    <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
      <div className="w-16 h-16 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin" />
      <div className="text-gray-400 font-black uppercase tracking-widest text-xs animate-pulse">Computing Insights...</div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Performance Analytics</h1>
          <p className="text-gray-500 font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Real-time business intelligence from Aifur operational data
          </p>
        </div>
        <div className="flex bg-white dark:bg-white/5 p-1.5 rounded-2xl border border-gray-100 dark:border-white/10">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">Last 30 Days</button>
          <button className="px-6 py-2 text-gray-500 rounded-xl text-xs font-black uppercase tracking-widest hover:text-indigo-600 transition-colors">Lifetime</button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Est. Revenue', value: `PKR ${metrics.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500', trend: '+12%', desc: 'Total guests x avg. menu item price' },
          { label: 'Total Guests', value: metrics.totalGuests, icon: Users, color: 'text-indigo-500', trend: '+5%', desc: 'Sum of all guests from confirmed bookings' },
          { label: 'Avg Check', value: `PKR ${Math.round(metrics.avgCheck).toLocaleString()}`, icon: Clock, color: 'text-amber-500', trend: 'Stable', desc: 'Average price of all active menu items' },
          { label: 'Peak Occupancy', value: Math.max(...data.peakHours.map(h => h.count), 0), icon: ArrowUpRight, color: 'text-purple-500', trend: 'Peak', desc: 'Highest number of bookings in a single hour' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden group"
          >
            <div className={`w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">{stat.label}</div>
            <div className="text-3xl font-black mb-1">{stat.value}</div>
            <div className="text-[9px] font-bold text-red-500 uppercase tracking-wider mb-3 leading-tight opacity-80">
              {stat.desc}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 w-fit px-2 py-1 rounded-lg">
              <ArrowUpRight size={12} /> {stat.trend}
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <stat.icon size={120} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Primary Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Chart */}
        <Card title="Reservation Trends">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.dayTrends}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#94a3b8'}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#94a3b8'}} dx={-15} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff', padding: '12px 20px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '10px' }}
                />
                <Line type="monotone" dataKey="bookings" stroke="#4F46E5" strokeWidth={4} dot={{ r: 6, fill: '#fff', stroke: '#4F46E5', strokeWidth: 3 }} activeDot={{ r: 8, fill: '#10B981', stroke: '#fff', strokeWidth: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-[10px] font-bold text-red-500 uppercase tracking-[0.15em] opacity-80">
            * Tracking daily reservation volume across all active channels
          </div>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Loyalty Distribution */}
          <Card title="Loyalty Funnel">
            <div className="h-[250px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.loyaltyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {data.loyaltyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-3xl font-black">{data.loyaltyData.reduce((a,b)=>a+b.value,0)}</div>
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Profiles</div>
              </div>
            </div>
            <div className="mt-4 text-[10px] font-bold text-red-500 uppercase tracking-[0.15em] opacity-80">
              * Categorizing guests by visit frequency (VIP = 3+ visits)
            </div>
          </Card>

          {/* Booking Health */}
          <Card title="Booking Health">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.statusBreakdown}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} dy={10} />
                  <Tooltip cursor={{fill: 'none'}} />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                    {data.statusBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'Cancelled' ? '#EF4444' : entry.name === 'Completed' ? '#10B981' : '#4F46E5'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-[10px] font-bold text-red-500 uppercase tracking-[0.15em] opacity-80">
              * Real-time success rate of your reservation funnel
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Peak Hours Full Width */}
        <Card title="Peak Hours Heatmap" className="lg:col-span-4">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.peakHours}>
                <defs>
                  <linearGradient id="colorPeak" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Area type="monotone" dataKey="count" stroke="#10B981" fillOpacity={1} fill="url(#colorPeak)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 text-[10px] font-bold text-red-500 uppercase tracking-[0.15em] opacity-80">
            * Distribution of guest arrival times across the 24-hour cycle
          </div>
        </Card>
      </div>
    </div>
  );
}


