import { useState, useEffect } from 'react';
import { 
  Users, Table as TableIcon, RefreshCcw, Plus, Maximize2, MoreVertical, Clock, Check, X, Bell
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const TableCard = ({ table, theme, onUpdateStatus }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const isOccupied = table.status === 'occupied' || table.status === 'Occupied';
  const isReserved = table.status === 'reserved' || table.status === 'Reserved';

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    setMenuOpen(false);
    try {
      const { error } = await supabase
        .from('restaurant_tables')
        .update({ status: newStatus, last_updated: new Date().toISOString() })
        .eq('id', table.id);
      
      if (error) throw error;
      onUpdateStatus(table.id, newStatus);
    } catch (err) {
      console.error('Error updating table status:', err);
      alert('Failed to update table. Please check if table exists in Supabase.');
    } finally {
      setUpdating(false);
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
        
        <div className="flex items-center gap-2 relative">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            isOccupied ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 
            isReserved ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 
            'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500'
          }`}>
            {updating ? 'Updating...' : table.status}
          </span>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
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
                  <button onClick={() => handleStatusChange('Available')} className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl flex items-center gap-2 text-emerald-600"><Check size={14} /> Available</button>
                  <button onClick={() => handleStatusChange('Occupied')} className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl flex items-center gap-2 text-indigo-600"><Users size={14} /> Occupied</button>
                  <button onClick={() => handleStatusChange('Reserved')} className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl flex items-center gap-2 text-amber-600"><Clock size={14} /> Reserved</button>
                  <div className="h-px bg-gray-100 dark:bg-white/10 my-1" />
                  <button onClick={() => setMenuOpen(false)} className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl flex items-center gap-2 text-red-500"><X size={14} /> Close Menu</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-black mb-1">Table {table.table_number || table.id}</h3>
        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
          <Users size={10} /> {table.capacity} Persons Max
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
        {isOccupied ? (
          <div className="flex flex-col gap-3">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                 <Clock size={14} /> Standard 2H limit
               </div>
               <button onClick={() => handleStatusChange('Available')} className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">
                 Free Table
               </button>
             </div>
             {/* 2 hour notification simulation */}
             <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-[10px] font-bold text-amber-600">
                <Bell size={12} /> Notify manager at 2h mark
             </div>
          </div>
        ) : (
          <button 
            onClick={() => handleStatusChange('Occupied')}
            className={`w-full py-2.5 rounded-xl text-xs font-black transition-all ${
              theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-gray-300' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
            }`}
          >
            {isReserved ? 'Seat Guest (Mark Occupied)' : 'Assign Table (Mark Occupied)'}
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
      let query = supabase.from('restaurant_tables').select('*');
      
      if (activeFilter !== 'All') {
        query = query.eq('status', activeFilter.toLowerCase()); // Supabase matches lowercase if status is saved lowercase
      }

      const { data, error } = await query.order('table_number', { ascending: true });
      if (error) throw error;
      
      // If table exists but empty, warn user
      if (!data || data.length === 0) {
        console.warn("No tables found in Supabase restaurant_tables.");
        setTables([]);
      } else {
        // Map data to ensure status has correct casing for UI
        const mappedData = data.map(t => ({
           ...t,
           status: t.status ? t.status.charAt(0).toUpperCase() + t.status.slice(1) : 'Available'
        }));
        setTables(mappedData);
      }
    } catch (err) {
      console.error('Error fetching tables:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [activeFilter]);

  const handleUpdateStatus = (id, newStatus) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const stats = {
    total: tables.length,
    available: tables.filter(t => t.status === 'Available').length,
    occupied: tables.filter(t => t.status === 'Occupied').length,
    reserved: tables.filter(t => t.status === 'Reserved').length,
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Table & Seating Management</h1>
          <p className="text-gray-500 font-medium">Real-time floor map powered by Supabase. Tap 3 dots to manage.</p>
        </div>
        
        <div className="flex gap-4">
          <button className="px-6 py-3 text-sm font-black flex items-center gap-2 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:bg-gray-50 transition-all">
            <Maximize2 size={16} />
            Floor View
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">
            <Plus size={16} />
            Add Table
          </button>
        </div>
      </div>

      {/* Stats Summary */}
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

      {/* Filter Bar */}
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

      {/* Grid Section */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-64 animate-pulse bg-gray-100 dark:bg-white/5 rounded-[2rem]"></div>
          ))}
        </div>
      ) : tables.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-cols-5 gap-6">
          {tables.map(table => (
            <TableCard key={table.id} table={table} theme={theme} onUpdateStatus={handleUpdateStatus} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[2rem]">
          <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
             <TableIcon size={32} />
          </div>
          <h3 className="text-xl font-black mb-2">No Tables Found</h3>
          <p className="text-gray-500 font-medium mb-6 max-w-sm mx-auto">There are no tables in your Supabase database. Please ensure you have added 20 tables to the `restaurant_tables` table.</p>
          <button onClick={fetchTables} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-lg">Refresh Data</button>
        </div>
      )}
    </div>
  );
}
