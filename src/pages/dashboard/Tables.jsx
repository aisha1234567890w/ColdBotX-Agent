import { useState, useEffect } from 'react';
import { 
  Users, Table as TableIcon, RefreshCcw, Plus, Maximize2, MoreVertical, Clock, Check, X, Bell
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const TableCard = ({ table, theme, onUpdateStatus }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const isOccupied = table.status === 'occupied' || table.status === 'Occupied';
  const isReserved = table.status === 'reserved' || table.status === 'Reserved';

  const getTimeOccupied = () => {
    if (!table.occupied_at) return null;
    const diff = Date.now() - new Date(table.occupied_at).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ${mins % 60}m`;
  };

  const handleStatusChange = async (newStatus) => {
    setMenuOpen(false);
    
    const dbStatus = newStatus === 'Available' ? 'free' : newStatus.toLowerCase();
    const now = new Date();
    const nowStr = now.toISOString();
    const todayDate = nowStr.split('T')[0];
    const currentTime = now.toLocaleTimeString('en-GB', { hour12: false }); // 24h format for DB

    // Deep Sync with Supabase schema
    const updateData = { 
      status: dbStatus,
      available: dbStatus === 'free'
    };
    
    if (dbStatus === 'occupied') {
      updateData.occupied_at = nowStr;
      updateData.seated_at = nowStr; // Filling seated_at as well
    } else if (dbStatus === 'reserved') {
      updateData.reserved_date = todayDate;
      updateData.reserved_time = currentTime;
      updateData.occupied_at = null;
    } else {
      updateData.occupied_at = null;
      updateData.reserved_date = null;
      updateData.reserved_time = null;
      updateData.seated_at = null;
    }

    try {
      // Direct update using table.id
      const { error } = await supabase
        .from('restaurant_tables')
        .update(updateData)
        .eq('id', table.id);
      
      if (!error) {
        onUpdateStatus(table.id, newStatus, dbStatus === 'occupied' ? nowStr : null);
      } else {
        // Fallback: If status column is missing, try updating other columns only
        const safeData = { available: updateData.available, occupied_at: updateData.occupied_at };
        await supabase.from('restaurant_tables').update(safeData).eq('id', table.id);
        onUpdateStatus(table.id, newStatus, dbStatus === 'occupied' ? nowStr : null);
      }
    } catch (err) {
      console.error('Deep Sync Error:', err);
    }
  };

  return (
    <div className={`bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm rounded-[2rem] p-6 group transition-all duration-300 relative ${
      isOccupied ? 'border-indigo-500/50 dark:border-indigo-500/50 bg-indigo-50/30 dark:bg-indigo-500/5' : 
      isReserved ? 'border-amber-500/50 dark:border-amber-500/50 bg-amber-50/30 dark:bg-amber-500/5' : ''
    }`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${
          isOccupied ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 
          isReserved ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 
          'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
        }`}>
          <TableIcon size={24} />
        </div>
        
        <div className="flex flex-wrap items-center justify-end gap-1.5 relative max-w-[140px]">
          {isOccupied && (
            <div className="flex items-center gap-1 text-[9px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-full border border-indigo-100 dark:border-indigo-500/20 animate-pulse whitespace-nowrap">
              <Clock size={10} /> {getTimeOccupied()}
            </div>
          )}
          <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider whitespace-nowrap ${
            isOccupied ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 
            isReserved ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 
            'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500'
          }`}>
            {table.status}
          </span>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ml-1"
          >
            <MoreVertical size={16} className="text-gray-500" />
          </button>
          
          <AnimatePresence>
            {menuOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-10 right-0 w-40 bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 shadow-xl rounded-2xl overflow-hidden z-20"
              >
                <div className="p-2 space-y-1">
                  <div className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-gray-400">Set Status</div>
                  <button onClick={() => handleStatusChange('Available')} className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl flex items-center gap-2 text-emerald-600 font-bold"><Check size={14} /> Available</button>
                  <button onClick={() => handleStatusChange('Occupied')} className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl flex items-center gap-2 text-indigo-600 font-bold"><Users size={14} /> Occupied</button>
                  <button onClick={() => handleStatusChange('Reserved')} className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl flex items-center gap-2 text-amber-600 font-bold"><Clock size={14} /> Reserved</button>
                  <div className="h-px bg-gray-100 dark:bg-white/10 my-1" />
                  <button onClick={() => setMenuOpen(false)} className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl flex items-center gap-2 text-red-500 font-bold"><X size={14} /> Close Menu</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-black mb-1">Table {table.table_number || table.id}</h3>
        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
          <Users size={10} /> {table.capacity || 4} Persons Max
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
        {isOccupied ? (
          <div className="flex flex-col gap-3">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                 <Clock size={14} /> 2H limit
               </div>
               <button onClick={() => handleStatusChange('Available')} className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">
                 Free Table
               </button>
             </div>
          </div>
        ) : (
          <button 
            onClick={() => handleStatusChange('Occupied')}
            className={`w-full py-2.5 rounded-xl text-xs font-black transition-all ${
              theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-gray-300' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
            }`}
          >
            Assign
          </button>
        )}
      </div>
    </div>
  );
};

export default function Tables() {
  const { theme } = useTheme();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  const fetchTables = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('restaurant_tables')
        .select('*')
        .order('table_number', { ascending: true });
      
      if (error) throw error;

      if (data && data.length > 0) {
        const mappedData = data.map(t => {
           const s = (t.status || '').toLowerCase();
           let formattedStatus = 'Available';
           if (s === 'occupied' || s === 'busy') formattedStatus = 'Occupied';
           else if (s === 'reserved' || s === 'booked') formattedStatus = 'Reserved';
           else if (s === 'free' || s === 'available') formattedStatus = 'Available';
           
           return { ...t, status: formattedStatus };
        });
        setTables(mappedData);
      } else {
        // Only if table is actually empty in DB, we create 20 default rows
        const localTables = Array.from({ length: 20 }, (_, i) => ({
          id: i + 1, table_number: i + 1, capacity: 4, status: 'Available'
        }));
        setTables(localTables);
      }
    } catch (err) {
      console.error('Supabase Table Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleUpdateStatus = (id, newStatus) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleAddTable = async () => {
    const newNum = tables.length > 0 ? Math.max(...tables.map(t => t.table_number || 0)) + 1 : 1;
    const newTable = { table_number: newNum, capacity: 4, status: 'free' };
    
    try {
      const { data, error } = await supabase.from('restaurant_tables').insert([newTable]).select();
      if (!error && data) {
        setTables([...tables, { ...data[0], status: 'Available' }]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTables = tables.filter(t => activeFilter === 'All' || t.status === activeFilter);

  const stats = {
    total: tables.length,
    available: tables.filter(t => t.status === 'Available').length,
    occupied: tables.filter(t => t.status === 'Occupied').length,
    reserved: tables.filter(t => t.status === 'Reserved').length,
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Table & Seating Management</h1>
          <p className="text-gray-500 font-medium">Real-time floor map. Tap 3 dots to manage status.</p>
        </div>
        
        <div className="flex gap-4">
          <button onClick={() => alert("Floor View layout mode activated")} className="px-6 py-3 text-sm font-black flex items-center gap-2 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:bg-gray-50 transition-all">
            <Maximize2 size={16} />
            Floor View
          </button>
          <button onClick={handleAddTable} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">
            <Plus size={16} />
            Add Table
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tables', value: stats.total, color: 'text-indigo-600' },
          { label: 'Available', value: stats.available, color: 'text-emerald-500' },
          { label: 'Occupied', value: stats.occupied, color: 'text-indigo-600' },
          { label: 'Reserved', value: stats.reserved, color: 'text-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-6 rounded-[2rem] text-center shadow-sm">
            <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-2 rounded-[1.5rem]">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          {['All', 'Available', 'Occupied', 'Reserved'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                activeFilter === filter 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <button 
          onClick={fetchTables}
          className="p-3 rounded-xl border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all w-full md:w-auto flex justify-center text-gray-500"
        >
          <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-64 animate-pulse bg-gray-100 dark:bg-white/5 rounded-[2rem]"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredTables.map(table => (
            <TableCard key={table.id} table={table} theme={theme} onUpdateStatus={handleUpdateStatus} />
          ))}
        </div>
      )}
    </div>
  );
}
