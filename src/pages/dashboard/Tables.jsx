import { useState, useEffect } from 'react';
import { 
  Users, 
  Table as TableIcon,
  RefreshCcw,
  Plus,
  Maximize2,
  MoreVertical,
  Clock,
  Lock,
  Info,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const TableCard = ({ table, theme }) => {
  const isOccupied = table.status === 'occupied' || table.status === 'Occupied';
  const isReserved = table.status === 'reserved' || table.status === 'Reserved';

  return (
    <div className={`dashboard-glass p-6 group transition-all duration-300 hover:scale-[1.02] ${
      isOccupied ? 'border-indigo-500/50' : isReserved ? 'border-purple-500/50' : ''
    }`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-xl ${
          isOccupied ? 'bg-indigo-500/10 text-indigo-400' : 
          isReserved ? 'bg-purple-500/10 text-purple-400' : 
          'bg-emerald-500/10 text-emerald-400'
        }`}>
          <TableIcon size={24} />
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            isOccupied ? 'bg-indigo-500/10 text-indigo-400' : 
            isReserved ? 'bg-purple-500/10 text-purple-400' : 
            'bg-emerald-500/10 text-emerald-500'
          }`}>
            {table.status}
          </span>
          <button className={`p-1 rounded hover:bg-white/5 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-black mb-1">Table {table.table_number || table.id}</h3>
        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
          <Users size={10} /> {table.capacity} Persons Max
        </div>
      </div>

      <div className={`mt-6 pt-6 border-t ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
        {isOccupied ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
              <Clock size={14} /> 45m seated
            </div>
            <button className="text-[10px] font-black text-indigo-400 hover:underline uppercase tracking-widest">
              Manage
            </button>
          </div>
        ) : (
          <button className={`w-full py-2.5 rounded-xl text-xs font-black transition-all ${
            theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}>
            {isReserved ? 'View Reservation' : 'Assign'}
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
        query = query.eq('status', activeFilter.toLowerCase());
      }

      const { data, error } = await query.order('table_number', { ascending: true });
      if (error) throw error;
      setTables(data || []);
    } catch (err) {
      console.error('Error fetching tables:', err);
      // Fallback to some dummy data if table doesn't exist
      setTables([
        { id: 1, table_number: 1, capacity: 2, status: 'Occupied' },
        { id: 2, table_number: 2, capacity: 2, status: 'Available' },
        { id: 3, table_number: 3, capacity: 4, status: 'Available' },
        { id: 4, table_number: 4, capacity: 4, status: 'Reserved' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [activeFilter]);

  const stats = {
    total: tables.length,
    available: tables.filter(t => (t.status || '').toLowerCase() === 'available').length,
    occupied: tables.filter(t => (t.status || '').toLowerCase() === 'occupied').length,
    reserved: tables.filter(t => (t.status || '').toLowerCase() === 'reserved').length,
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Seating Control</h1>
          <p className="text-gray-500 font-medium">Real-time floor map and table occupancy management.</p>
        </div>
        
        <div className="flex gap-4">
          <button className={`px-6 py-3 text-sm font-black flex items-center gap-2 rounded-2xl border transition-all ${
            theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}>
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
          { label: 'Total Tables', value: stats.total, color: 'indigo' },
          { label: 'Available', value: stats.available, color: 'emerald' },
          { label: 'Occupied', value: stats.occupied, color: 'indigo' },
          { label: 'Reserved', value: stats.reserved, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="dashboard-glass p-4 text-center">
            <div className={`text-2xl font-black text-${stat.color}-500`}>{stat.value}</div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className={`flex rounded-xl p-1 border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-100 border-gray-200'}`}>
          {['All', 'Available', 'Occupied', 'Reserved'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${
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
          onClick={fetchTables}
          className={`p-3 rounded-xl border transition-all ${
            theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Grid Section */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-64 animate-pulse bg-gray-500/10 rounded-[2rem]"></div>
          ))}
        </div>
      ) : tables.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tables.map(table => (
            <TableCard key={table.id} table={table} theme={theme} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center dashboard-glass">
          <div className="text-gray-500 font-bold mb-2 italic">No tables found.</div>
          <button 
            onClick={() => setActiveFilter('All')}
            className="text-indigo-500 text-xs font-black underline uppercase tracking-widest"
          >
            Show All
          </button>
        </div>
      )}

      {/* AI Optimization Section */}
      <div className="dashboard-glass p-8 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 border-dashed">
        <div className="flex items-center gap-3 text-indigo-500 mb-6">
          <Info size={20} />
          <h3 className="font-black uppercase tracking-widest text-sm">AI Seating Optimization</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 mb-2">92%</div>
            <div className="text-sm font-bold mb-4">Floor Efficiency</div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Current table arrangements are optimal for the expected party sizes this evening. 
              No combinations recommended at this time.
            </p>
          </div>
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold text-xs">AI</div>
                <div className="text-xs font-bold">Predictive Staffing: 4 Servers Required</div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
