import { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  Phone, 
  MessageSquare, 
  Smartphone,
  MoreVertical,
  Download,
  Plus,
  ArrowUpDown,
  ExternalLink,
  RefreshCcw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { useTheme } from '../../context/ThemeContext';

const ReservationRow = ({ reservation, theme }) => (
  <tr className={`group border-b transition-all ${theme === 'dark' ? 'border-white/5 hover:bg-white/[0.02]' : 'border-gray-100 hover:bg-gray-50'}`}>
    <td className="py-5 pl-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center font-bold text-indigo-400 text-xs">
          {reservation.name ? reservation.name.split(' ').map(n => n[0]).join('') : '??'}
        </div>
        <div>
          <div className={`text-sm font-bold group-hover:text-indigo-400 transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {reservation.name}
          </div>
          <div className="text-[10px] text-gray-500 font-bold tracking-tight">{reservation.phone}</div>
        </div>
      </div>
    </td>
    <td className="py-5">
      <div className={`flex items-center gap-2 px-2 py-1 rounded-lg border w-fit ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
        <div className="text-indigo-400">
          {reservation.source === 'Call' ? <Phone size={12} /> : 
           reservation.source === 'WhatsApp' ? <Smartphone size={12} /> : 
           <MessageSquare size={12} />}
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{reservation.source || 'Web'}</span>
      </div>
    </td>
    <td className="py-5">
      <div className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{reservation.time}</div>
      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{reservation.date}</div>
    </td>
    <td className="py-5">
      <div className={`flex items-center gap-2 text-sm font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        <Users size={14} className="text-gray-400" />
        {reservation.guests} Guests
      </div>
    </td>
    <td className={`py-5 text-sm font-medium text-gray-500`}>
      {reservation.table_id ? `Table #${reservation.table_id}` : 'Unassigned'}
    </td>
    <td className="py-5">
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
        reservation.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 
        reservation.status === 'Pending' ? 'bg-orange-500/10 text-orange-500' : 
        'bg-gray-500/10 text-gray-500'
      }`}>
        {reservation.status || 'Confirmed'}
      </span>
    </td>
    <td className="py-5 pr-4 text-right">
      <div className="flex justify-end gap-2">
        <button className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'text-gray-600 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-indigo-600 hover:bg-gray-100'}`}>
          <ExternalLink size={16} />
        </button>
        <button className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'text-gray-600 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-indigo-600 hover:bg-gray-100'}`}>
          <MoreVertical size={16} />
        </button>
      </div>
    </td>
  </tr>
);

export default function Reservations() {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('reservations_main')
        .select('*', { count: 'exact' });

      if (activeFilter !== 'All') {
        query = query.eq('status', activeFilter);
      }

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) throw error;
      setReservations(data || []);
    } catch (err) {
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, searchTerm, page]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Name,Phone,Source,Date,Time,Guests,Status"].join(",") + "\n"
      + reservations.map(r => `${r.name},${r.phone},${r.source},${r.date},${r.time},${r.guests},${r.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `reservations_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Master Bookings</h1>
          <p className="text-gray-500 font-medium">Consolidated feed from AI Calling, Chat, and WhatsApp agents.</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={handleExport}
            className={`px-6 py-3 text-sm font-black flex items-center gap-2 rounded-2xl border transition-all ${
              theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Download size={16} />
            Export CSV
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">
            <Plus size={16} />
            New Booking
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="dashboard-glass p-4 flex flex-col xl:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 no-scrollbar">
          <div className={`flex rounded-xl p-1 border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-100 border-gray-200'}`}>
            {['All', 'Confirmed', 'Pending', 'Seated'].map(filter => (
              <button
                key={filter}
                onClick={() => {setActiveFilter(filter); setPage(1);}}
                className={`px-6 py-2 rounded-lg text-xs font-black transition-all whitespace-nowrap ${
                  activeFilter === filter 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-gray-500 hover:text-indigo-600 dark:hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <button 
            onClick={fetchReservations}
            className={`p-3 rounded-xl border transition-all ${
              theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
          <div className={`flex items-center gap-4 px-4 py-2 rounded-xl border transition-all w-full md:w-80 group ${
            theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-100 border-gray-200'
          }`}>
            <Search size={18} className="text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value); setPage(1);}}
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-500"
            />
          </div>
          <button className={`p-3 rounded-xl border transition-all whitespace-nowrap flex items-center gap-2 w-full md:w-auto justify-center ${
            theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <Calendar size={18} className="text-indigo-500" />
            <span className="text-xs font-black">Today, {new Date().toLocaleDateString()}</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="dashboard-glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} text-[10px] font-black uppercase tracking-[0.2em] text-gray-500`}>
                <th className="py-5 pl-4 flex items-center gap-2 cursor-pointer hover:text-indigo-500 transition-colors">
                  Customer <ArrowUpDown size={12} />
                </th>
                <th className="py-5">Source</th>
                <th className="py-5 cursor-pointer hover:text-indigo-500 transition-colors">
                  Date & Time <ArrowUpDown size={12} />
                </th>
                <th className="py-5">Party</th>
                <th className="py-5">Seating</th>
                <th className="py-5">Status</th>
                <th className="py-5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse border-b border-white/5">
                    <td colSpan="7" className="py-8 px-4"><div className="h-4 bg-gray-500/10 rounded w-full"></div></td>
                  </tr>
                ))
              ) : reservations.length > 0 ? (
                reservations.map(res => (
                  <ReservationRow key={res.id} reservation={res} theme={theme} />
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-24 text-center">
                    <div className="text-gray-500 font-bold mb-2 italic text-lg">No reservations found.</div>
                    <button 
                      onClick={() => {setSearchTerm(''); setActiveFilter('All');}}
                      className="text-indigo-500 text-xs font-black underline uppercase tracking-widest"
                    >
                      Reset all filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Info */}
        <div className={`p-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">
            Showing {reservations.length} entries
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className={`p-2 rounded-lg border transition-all disabled:opacity-30 ${
                theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <div className={`flex items-center justify-center px-4 rounded-lg font-bold text-sm ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
              {page}
            </div>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={reservations.length < pageSize || loading}
              className={`p-2 rounded-lg border transition-all disabled:opacity-30 ${
                theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

