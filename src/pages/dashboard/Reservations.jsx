import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, Filter, Calendar, Users, Phone, MessageSquare, Smartphone,
  MoreVertical, Download, ArrowUpDown, ExternalLink, RefreshCcw,
  Check, X, AlertTriangle
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const ReservationRow = ({ reservation, theme, onUpdateStatus }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const name = reservation.customer_name || 'Unknown Guest';
  const phone = reservation.phone_number || 'No phone provided';
  const guests = reservation.guests_count || 2;
  const date = reservation.reservation_date || new Date().toLocaleDateString();
  const time = reservation.reservation_time || '19:00';
  const source = reservation.source || 'Web';
  const status = reservation.status ? reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1).toLowerCase() : 'Confirmed';

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    setMenuOpen(false);
    try {
      const { error } = await supabase
        .from('reservations_main')
        .update({ status: newStatus.toLowerCase() })
        .eq('id', reservation.id);
      
      if (!error) {
        onUpdateStatus(reservation.id, newStatus.toLowerCase());
      }
    } catch (err) {
      console.error("Update Error:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <tr className={`group border-b transition-all ${isUpdating ? 'opacity-50' : ''} ${theme === 'dark' ? 'border-white/5 hover:bg-white/[0.02]' : 'border-gray-100 hover:bg-gray-50'}`}>
      <td className="py-5 pl-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-xs uppercase shadow-inner">
            {name.substring(0, 2)}
          </div>
          <div>
            <div className={`text-sm font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {name}
            </div>
            <div className="text-[10px] text-gray-500 font-bold tracking-tight">{phone}</div>
          </div>
        </div>
      </td>
      <td className="py-5">
        <div className={`flex items-center gap-2 px-2 py-1 rounded-lg border w-fit ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
          <div className="text-indigo-500">
            {source.toLowerCase().includes('call') ? <Phone size={12} /> : 
             source.toLowerCase().includes('whatsapp') ? <Smartphone size={12} /> : 
             <MessageSquare size={12} />}
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">{source}</span>
        </div>
      </td>
      <td className="py-5">
        <div className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{time}</div>
        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{date}</div>
      </td>
      <td className="py-5">
        <div className={`flex items-center gap-2 text-sm font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          <Users size={14} className="text-gray-400" />
          {guests} Guests
        </div>
      </td>
      <td className={`py-5 text-sm font-medium text-gray-500`}>
        {reservation.table_id || reservation.tableNumber ? `Table #${reservation.table_id || reservation.tableNumber}` : 'Auto-Assign'}
      </td>
      <td className="py-5">
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
          status.toLowerCase() === 'confirmed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500' : 
          status.toLowerCase() === 'pending' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-500' : 
          status.toLowerCase() === 'completed' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-500' :
          status.toLowerCase() === 'cancelled' || status.toLowerCase() === 'canceled' ? 'bg-red-500/10 text-red-600 dark:text-red-500' :
          'bg-gray-500/10 text-gray-500'
        }`}>
          {status}
        </span>
      </td>
      <td className="py-5 pr-4 text-right relative">
        <div className="flex justify-end gap-2">
          <button className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'text-gray-600 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-indigo-600 hover:bg-gray-100'}`}>
            <ExternalLink size={16} />
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'text-gray-600 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-indigo-600 hover:bg-gray-100'}`}>
            <MoreVertical size={16} />
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-12 right-12 w-40 bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 shadow-xl rounded-2xl overflow-hidden z-20 text-left"
            >
              <div className="p-2 space-y-1">
                <button onClick={() => handleStatusChange('confirmed')} className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-emerald-50 dark:hover:bg-white/5 rounded-xl text-emerald-600 font-bold">Mark Confirmed</button>
                <button onClick={() => handleStatusChange('completed')} className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-indigo-50 dark:hover:bg-white/5 rounded-xl text-indigo-600 font-bold">Mark Completed</button>
                <button onClick={() => handleStatusChange('pending')} className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-orange-50 dark:hover:bg-white/5 rounded-xl text-orange-600 font-bold">Mark Pending</button>
                <button onClick={() => handleStatusChange('cancelled')} className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-red-500 font-bold">Cancel Booking</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </td>
    </tr>
  );
};

export default function Reservations() {
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('reservations_main').select('*');

      if (activeFilter !== 'All') {
        query = query.ilike('status', activeFilter);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setReservations(data || []);
    } catch (err) {
      console.error('Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) setSearchTerm(urlSearch);
  }, [searchParams]);

  const handleExport = () => {
    if (reservations.length === 0) return;
    
    const headers = ["ID", "Customer Name", "Phone", "Guests", "Source", "Status", "Date", "Time"];
    const csvContent = [
      headers.join(","),
      ...reservations.map(r => [
        r.id,
        `"${r.customer_name || 'Unknown'}"`,
        `"${r.phone_number || ''}"`,
        r.guests_count || 0,
        r.source || 'Web',
        r.status || 'pending',
        r.reservation_date || '',
        r.reservation_time || ''
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `reservations_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    const sorted = [...reservations].sort((a, b) => {
      return newOrder === 'desc' ? (a.id > b.id ? -1 : 1) : (a.id > b.id ? 1 : -1);
    });
    setReservations(sorted);
  };

  const filteredReservations = reservations.filter(r => {
    const searchName = (r.customer_name || r.name || '').toLowerCase();
    const searchPhone = (r.phone_number || r.phone || '');
    return searchName.includes(searchTerm.toLowerCase()) || searchPhone.includes(searchTerm);
  });

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Reservations & Bookings</h1>
          <p className="text-gray-500 font-medium">Consolidated feed from AI Calling, Chat, and Web.</p>
        </div>
        
        <div className="flex gap-4">
          <button onClick={handleExport} className={`px-6 py-3 text-sm font-black flex items-center gap-2 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[2rem] p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search guests or phone..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchParams(e.target.value ? { search: e.target.value } : {});
              }}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button 
            onClick={() => {
              setSearchTerm('');
              setActiveFilter('All');
              setSearchParams({});
            }}
            title="Clear all filters"
            className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <Filter size={18} className="text-gray-500" />
          </button>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                activeFilter === filter ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              {filter}
            </button>
          ))}
          <button onClick={fetchReservations} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
             <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                <th className="py-4 pl-4 text-left text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-2 cursor-pointer" onClick={toggleSort}>
                  Customer <ArrowUpDown size={12} />
                </th>
                <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-500">Source</th>
                <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-500 cursor-pointer" onClick={toggleSort}>
                  <div className="flex items-center gap-2">Date & Time <ArrowUpDown size={12} /></div>
                </th>
                <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-500">Party</th>
                <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-500">Seating</th>
                <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                <th className="py-4 pr-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map(res => (
                <ReservationRow key={res.id} reservation={res} theme={theme} onUpdateStatus={handleUpdateStatus} />
              ))}
              {filteredReservations.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 font-bold">No reservations found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
