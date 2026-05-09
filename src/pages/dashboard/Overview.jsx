import { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  Activity,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TableProperties
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { motion } from 'framer-motion';

export default function Overview() {
  const [stats, setStats] = useState({
    todayReservations: 0,
    upcomingReservations: 0,
    occupiedTables: 0,
    availableTables: 10,
    peakHour: "20:00 - 21:00",
    todayRevenue: 0,
    alerts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealTimeData();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('public:reservations_main')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations_main' }, payload => {
        fetchRealTimeData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRealTimeData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toTimeString().split(' ')[0].substring(0, 5); // "HH:MM"

      const { data: reservations, error } = await supabase
        .from('reservations_main')
        .select('*');

      if (error) throw error;

      // Calculate Today's Reservations
      const todayRes = reservations.filter(r => r.date === today);
      const upcomingRes = reservations.filter(r => r.date > today || (r.date === today && r.time > now));

      // Calculate Revenue Estimate (Assuming average spend per guest is PKR 4500)
      const todayRevenue = todayRes.reduce((acc, r) => acc + (parseInt(r.guests || 0) * 4500), 0);

      // Calculate peak hour based on all historical reservations
      const timeFreq = {};
      reservations.forEach(r => {
        const hour = r.time?.split(':')[0];
        if (hour) {
          timeFreq[hour] = (timeFreq[hour] || 0) + 1;
        }
      });
      const peakHourRaw = Object.keys(timeFreq).sort((a, b) => timeFreq[b] - timeFreq[a])[0] || "20";
      const peakHour = `${peakHourRaw}:00 - ${parseInt(peakHourRaw)+1}:00`;

      const { data: tablesData, error: tablesError } = await supabase
        .from('restaurant_tables')
        .select('*');

      if (tablesError) console.error(tablesError);

      const totalTables = tablesData ? tablesData.length : 20; // Fallback to 20 if failed
      
      // Calculate real occupied tables based on status
      const actualOccupied = tablesData ? tablesData.filter(t => t.status?.toLowerCase() === 'occupied').length : 0;

      // Alerts
      const alerts = [];
      if (todayRes.length > 20) alerts.push({ type: 'warning', text: 'High volume expected today.' });
      if (actualOccupied >= 8) alerts.push({ type: 'critical', text: 'Restaurant is nearing full capacity.' });
      if (alerts.length === 0) alerts.push({ type: 'success', text: 'All operations running smoothly.' });

      setStats({
        todayReservations: todayRes.length,
        upcomingReservations: upcomingRes.length,
        occupiedTables: actualOccupied,
        availableTables: totalTables - actualOccupied,
        peakHour,
        todayRevenue,
        alerts
      });

    } catch (err) {
      console.error("Error fetching overview data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter mb-1">Command Center</h1>
          <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live operations sync active
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 rounded-xl flex items-center gap-2 text-xs font-bold">
            <Clock size={14} /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Today's Bookings</p>
              <h3 className="text-2xl font-black">{stats.todayReservations}</h3>
            </div>
          </div>
          <div className="text-xs font-bold text-gray-400 flex items-center gap-1">
            <ArrowUpRight size={14} className="text-emerald-500" /> {stats.upcomingReservations} upcoming
          </div>
        </motion.div>

        {/* Metric 2 */}
        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TableProperties size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Tables</p>
              <h3 className="text-2xl font-black">{stats.occupiedTables} <span className="text-gray-400 text-lg">/ {stats.occupiedTables + stats.availableTables}</span></h3>
            </div>
          </div>
          <div className="text-xs font-bold text-gray-400 flex items-center gap-1">
            <span className="text-emerald-500">{stats.availableTables} available</span> right now
          </div>
        </motion.div>

        {/* Metric 3 */}
        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Est. Revenue</p>
              <h3 className="text-xl font-black truncate">PKR {stats.todayRevenue.toLocaleString()}</h3>
            </div>
          </div>
          <div className="text-xs font-bold text-gray-400 flex items-center gap-1">
            <TrendingUp size={14} className="text-emerald-500" /> Based on today's guests
          </div>
        </motion.div>

        {/* Metric 4 */}
        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Peak Hour</p>
              <h3 className="text-xl font-black">{stats.peakHour}</h3>
            </div>
          </div>
          <div className="text-xs font-bold text-gray-400 flex items-center gap-1">
            Historical highest volume
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Alerts */}
        <div className="lg:col-span-2 bg-white dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm p-8">
          <h3 className="text-lg font-black tracking-tight mb-6 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" /> System Alerts & Notifications
          </h3>
          <div className="space-y-4">
            {stats.alerts.map((alert, i) => (
              <div key={i} className={`flex items-start gap-4 p-4 rounded-2xl border ${
                alert.type === 'critical' ? 'bg-red-50 border-red-100 text-red-900' :
                alert.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-900' :
                'bg-emerald-50 border-emerald-100 text-emerald-900'
              }`}>
                <div className="mt-0.5">
                  {alert.type === 'critical' ? <XCircle className="text-red-500" /> :
                   alert.type === 'warning' ? <AlertTriangle className="text-amber-500" /> :
                   <CheckCircle2 className="text-emerald-500" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest">{alert.type}</h4>
                  <p className="font-medium text-sm mt-1">{alert.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        {/* Quick Actions */}
        <div className="bg-white dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm p-8">
          <h3 className="text-lg font-black tracking-tight mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => window.location.href = '/admin-ops'} className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl font-bold transition-all group">
              <span className="flex items-center gap-3"><Calendar size={18} /> Manage Today's Bookings</span>
              <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
            </button>
            <button onClick={() => window.location.href = '/admin-ops'} className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl font-bold transition-all group">
              <span className="flex items-center gap-3"><TableProperties size={18} /> Reassign Tables</span>
              <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
            </button>
            <button onClick={() => window.location.href = '/admin-ops'} className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl font-bold transition-all group">
              <span className="flex items-center gap-3"><Users size={18} /> View VIP Guests</span>
              <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
