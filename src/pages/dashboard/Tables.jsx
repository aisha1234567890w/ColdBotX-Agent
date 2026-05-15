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
  const isAvailable = table.status === 'Available' || table.status === 'free';

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
    
    // Exact mapping to match SQL CHECK constraints
    let dbStatus = 'free';
    if (newStatus === 'Occupied') dbStatus = 'occupied';
    else if (newStatus === 'Reserved') dbStatus = 'booked';

    const now = new Date();
    const nowStr = now.toISOString();
    const todayDate = nowStr.split('T')[0];
    const currentTime = now.toLocaleTimeString('en-GB', { hour12: false });

    const updateData = { status: dbStatus };
    
    if (dbStatus === 'occupied') {
      updateData.occupied_at = nowStr;
      updateData.seated_at = nowStr;
    } else if (dbStatus === 'booked') {
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
      const { error } = await supabase
        .from('restaurant_tables')
        .update(updateData)
        .eq('id', table.id);
      
      if (error) throw error;
      
      onUpdateStatus(table.id, newStatus, updateData.occupied_at);
      
      if (dbStatus === 'free') {
        supabase
          .from('reservations_main')
          .update({ status: 'completed' })
          .or(`table_id.eq.${table.id},table_number.eq.${table.table_number || table.id}`)
          .neq('status', 'cancelled')
          .then(({ error: resErr }) => {
            if (resErr) console.warn("Reservation auto-complete failed:", resErr);
          });
      }
    } catch (err) {
      alert('Sync Error: ' + err.message);
      console.error('Update Error:', err);
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
                  <button 
                    onClick={() => {
                      if (isOccupied || isReserved) {
                        alert("⚠️ Safety Block: This table is currently busy! Please free it before deleting.");
                      } else if (confirm(`🛑 Permanent Action: Are you sure you want to delete Table ${table.table_number}? This cannot be undone.`)) {
                        onDelete(table.id);
                      }
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-black hover:bg-red-500/10 rounded-xl flex items-center gap-2 text-red-500 transition-colors"
                  >
                    <X size={14} className="opacity-70" /> Delete This Table
                  </button>
                  <div className="h-px bg-gray-100 dark:bg-white/10 my-1" />
                  <button onClick={() => setMenuOpen(false)} className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl flex items-center gap-2 text-gray-400 opacity-60">Close Menu</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-black mb-1">Table {table.table_number || table.id}</h3>
        <div className="space-y-1">
          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
            <Users size={10} /> {table.capacity || 4} Persons Max
          </div>
          {!isAvailable && table.customer_name && (
            <div className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-2 bg-indigo-50/50 dark:bg-white/5 px-2 py-1 rounded-lg w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              {table.customer_name}
            </div>
          )}
          {!isAvailable && table.reserved_time && (
            <div className="text-[10px] text-gray-400 font-bold flex items-center gap-2">
              <Clock size={10} /> {table.reserved_time} {table.reserved_date ? `(${table.reserved_date})` : ''}
            </div>
          )}
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

  const [isAdding, setIsAdding] = useState(false);
  const [isFloorView, setIsFloorView] = useState(false);
  const [newTableData, setNewTableData] = useState({ capacity: 4, position: 'center' });

  const fetchTables = async () => {
    setLoading(true);
    try {
      // 1. Fetch all tables
      const { data: tablesData, error: tablesError } = await supabase
        .from('restaurant_tables')
        .select('*')
        .order('table_number', { ascending: true });
      
      if (tablesError) throw tablesError;

      // 2. Fetch active reservations to link info
      const { data: resData } = await supabase
        .from('reservations_main')
        .select('*')
        .neq('status', 'cancelled');

      if (tablesData) {
        const mappedData = tablesData.map(t => {
           // Refined Priority Inference based on official SQL status
           let inferredStatus = 'Available';
           const s = (t.status || 'free').toLowerCase();
           
           if (s === 'occupied') inferredStatus = 'Occupied';
           else if (s === 'booked') inferredStatus = 'Reserved';
           else inferredStatus = 'Available';

           // Link with reservation data if table_number matches
           const matchingRes = resData?.find(r => 
             (r.table_id === t.id || r.table_number === t.table_number)
           );

           return { 
             ...t, 
             status: inferredStatus,
             customer_name: matchingRes?.customer_name,
             reserved_date: t.reserved_date || matchingRes?.reservation_date,
             reserved_time: t.reserved_time || matchingRes?.reservation_time
           };
        });
        setTables(mappedData);
      }
    } catch (err) {
      console.error('Bulletproof Sync Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleUpdateStatus = (id, newStatus, occupiedAt = null) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, status: newStatus, occupied_at: occupiedAt } : t));
    setTimeout(() => fetchTables(), 1000);
  };

  const handleAddTable = async () => {
    const nextNum = tables.length > 0 ? Math.max(...tables.map(t => t.table_number || 0)) + 1 : 1;
    const newTable = { 
      table_number: nextNum, 
      capacity: newTableData.capacity, 
      position: newTableData.position,
      status: 'free' 
    };
    
    try {
      const { data, error } = await supabase.from('restaurant_tables').insert([newTable]).select();
      if (!error && data) {
        setIsAdding(false);
        fetchTables();
      } else {
        alert("Error adding table: " + error.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTable = async (id) => {
    try {
      const { error } = await supabase.from('restaurant_tables').delete().eq('id', id);
      if (!error) {
        setTables(prev => prev.filter(t => t.id !== id));
      } else {
        alert("Error deleting table: " + error.message);
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
          <button 
            onClick={() => setIsFloorView(!isFloorView)} 
            className={`px-6 py-3 text-sm font-black flex items-center gap-2 rounded-2xl border transition-all ${
              isFloorView 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20' 
                : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 hover:bg-gray-50'
            }`}
          >
            <Maximize2 size={16} />
            {isFloorView ? 'Grid View' : 'Floor Map'}
          </button>
          <button 
            onClick={() => setIsAdding(true)} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
          >
            <Plus size={16} />
            Add Table
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-[#0f1115] w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-black mb-6">Add New Table</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Capacity (Persons)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[2, 4, 6, 8].map(c => (
                      <button 
                        key={c} onClick={() => setNewTableData({...newTableData, capacity: c})}
                        className={`py-3 rounded-xl font-black text-sm transition-all ${newTableData.capacity === c ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-50 dark:bg-white/5'}`}
                      >{c}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Position / Section</label>
                  <select 
                    value={newTableData.position} onChange={(e) => setNewTableData({...newTableData, position: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl py-3 px-4 font-bold text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="center">Center Area</option>
                    <option value="window">Window Side</option>
                    <option value="corner">Corner</option>
                    <option value="bar">Bar Section</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setIsAdding(false)} className="flex-1 py-3 font-black text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all">Cancel</button>
                  <button onClick={handleAddTable} className="flex-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-sm shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">Create Table</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
        <div className={`transition-all duration-700 min-h-[600px] rounded-[3rem] relative overflow-hidden ${
          isFloorView 
            ? 'p-12 bg-[#0a0c10] border border-white/5 shadow-2xl' 
            : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-cols-5 gap-6'
        }`}>
          {isFloorView && (
            <div className="absolute inset-0 opacity-20" style={{ 
              backgroundImage: 'radial-gradient(circle, #312e81 1px, transparent 1px)', 
              backgroundSize: '30px 30px' 
            }} />
          )}

          {isFloorView ? (
            <div className="relative z-10 grid grid-cols-3 gap-8">
              {/* Window Zone */}
              <div className="col-span-1 border-r border-white/5 pr-8 space-y-6">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-8 flex items-center gap-4">
                  <div className="h-px flex-1 bg-indigo-500/20"></div> WINDOW ZONE
                </div>
                {filteredTables.filter(t => t.position === 'window').map((table, idx) => (
                  <motion.div layout key={table.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                    <TableCard table={table} theme={theme} onUpdateStatus={handleUpdateStatus} onDelete={handleDeleteTable} />
                  </motion.div>
                ))}
              </div>

              {/* Center Zone */}
              <div className="col-span-1 px-4 space-y-6">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8 flex items-center gap-4">
                   MAIN DINING <div className="h-px flex-1 bg-gray-500/20"></div>
                </div>
                {filteredTables.filter(t => t.position === 'center' || !['window', 'bar'].includes(t.position)).map((table, idx) => (
                  <motion.div layout key={table.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                    <TableCard table={table} theme={theme} onUpdateStatus={handleUpdateStatus} onDelete={handleDeleteTable} />
                  </motion.div>
                ))}
              </div>

              {/* Bar/Social Zone */}
              <div className="col-span-1 border-l border-white/5 pl-8 space-y-6">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-8 flex items-center gap-4 text-right">
                   BAR & SOCIAL <div className="h-px flex-1 bg-amber-500/20"></div>
                </div>
                {filteredTables.filter(t => t.position === 'bar' || t.position === 'corner').map((table, idx) => (
                  <motion.div layout key={table.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                    <TableCard table={table} theme={theme} onUpdateStatus={handleUpdateStatus} onDelete={handleDeleteTable} />
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            filteredTables.map(table => (
              <TableCard key={table.id} table={table} theme={theme} onUpdateStatus={handleUpdateStatus} onDelete={handleDeleteTable} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
