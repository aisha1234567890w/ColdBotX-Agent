import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Link as LinkIcon, 
  Unlink, 
  Info,
  Maximize2,
  Lock,
  ChevronRight
} from 'lucide-react';

const TableCard = ({ id, capacity, status, reservation, selected, onClick, onCombine }) => (
  <motion.div 
    layout
    onClick={onClick}
    className={`relative group cursor-pointer p-6 rounded-[2rem] border-2 transition-all duration-300 ${
      selected 
        ? 'border-indigo-500 bg-indigo-500/10 shadow-2xl shadow-indigo-500/20' 
        : status === 'Occupied'
        ? 'border-red-500/30 bg-red-500/5 hover:border-red-500/50'
        : status === 'Reserved'
        ? 'border-orange-500/30 bg-orange-500/5 hover:border-orange-500/50'
        : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/[0.08]'
    }`}
  >
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
          status === 'Available' ? 'bg-emerald-500/20 text-emerald-500' : 
          status === 'Occupied' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'
        }`}>
          {id}
        </div>
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Table ID</div>
          <div className="font-bold text-sm">Table #{id}</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-gray-400">
        <Users size={12} />
        {capacity} Seats
      </div>
    </div>

    {reservation ? (
      <div className="space-y-3">
        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Active Reservation</div>
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <div className="text-sm font-bold text-white mb-1 truncate">{reservation.name}</div>
          <div className="text-[10px] text-gray-500 font-medium">19:30 • {reservation.party} Guests</div>
        </div>
      </div>
    ) : (
      <div className="h-[72px] flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl group-hover:border-white/10 transition-colors">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Available</span>
      </div>
    )}

    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all ${
      status === 'Available' ? 'bg-emerald-500 text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0' : 
      status === 'Occupied' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
    }`}>
      {status === 'Available' ? <Plus size={16} /> : status === 'Occupied' ? <Lock size={14} /> : <Info size={14} />}
    </div>
  </motion.div>
);

export default function TableManagement() {
  const [tables, setTables] = useState([
    { id: 1, capacity: 2, status: 'Occupied', reservation: { name: 'Ahmed Khan', party: 2 } },
    { id: 2, capacity: 2, status: 'Available', reservation: null },
    { id: 3, capacity: 4, status: 'Reserved', reservation: { name: 'Sarah Miller', party: 4 } },
    { id: 4, capacity: 4, status: 'Available', reservation: null },
    { id: 5, capacity: 2, status: 'Available', reservation: null },
    { id: 6, capacity: 6, status: 'Occupied', reservation: { name: 'Family Dinner', party: 6 } },
    { id: 7, capacity: 4, status: 'Available', reservation: null },
    { id: 8, capacity: 2, status: 'Available', reservation: null },
    { id: 9, capacity: 8, status: 'Reserved', reservation: { name: 'Corporate Event', party: 8 } },
    { id: 10, capacity: 4, status: 'Available', reservation: null },
  ]);

  const [selectedTables, setSelectedTables] = useState([]);

  const toggleSelect = (id) => {
    if (selectedTables.includes(id)) {
      setSelectedTables(selectedTables.filter(t => t !== id));
    } else {
      setSelectedTables([...selectedTables, id]);
    }
  };

  const combineSelected = () => {
    if (selectedTables.length < 2) return;
    alert(`Combining tables ${selectedTables.join(' & ')}. Total capacity: ${
      tables.filter(t => selectedTables.includes(t.id)).reduce((acc, t) => acc + t.capacity, 0)
    } seats.`);
    setSelectedTables([]);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Seating & Table Map</h1>
          <p className="text-gray-500 font-medium">Real-time floor management for 10 dining zones.</p>
        </div>
        
        <div className="flex gap-4">
          <AnimatePresence>
            {selectedTables.length >= 2 && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={combineSelected}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 shadow-xl shadow-indigo-500/20"
              >
                <LinkIcon size={16} />
                Combine Selected ({selectedTables.length})
              </motion.button>
            )}
          </AnimatePresence>
          <button className="dashboard-glass px-6 py-3 text-sm font-black flex items-center gap-2 hover:bg-white/5">
            <Maximize2 size={16} />
            Full Screen Map
          </button>
        </div>
      </div>

      {/* Legend & Quick Stats */}
      <div className="flex gap-8 border-y border-white/5 py-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Available (6)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Occupied (2)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reserved (2)</span>
        </div>
        <div className="ml-auto flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
          <Info size={14} />
          Auto-optimizing seat assignments based on party size
        </div>
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {tables.map(table => (
          <TableCard 
            key={table.id}
            {...table}
            selected={selectedTables.includes(table.id)}
            onClick={() => toggleSelect(table.id)}
          />
        ))}
      </div>

      {/* AI Table Optimization Sidebar (Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
        <div className="lg:col-span-2 dashboard-glass p-8 bg-indigo-600/5 border-dashed border-indigo-500/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-indigo-400 flex items-center gap-2">
              <Plus size={18} />
              Suggested Combinations
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-indigo-500/50">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-xs border-2 border-[#030712]">4</div>
                  <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-xs border-2 border-[#030712]">5</div>
                </div>
                <div>
                  <div className="text-sm font-bold">Party of 6 Expected</div>
                  <div className="text-[10px] text-gray-500 font-medium">Merge T4 + T5 (Total 6 seats)</div>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-600 group-hover:text-indigo-400 transition-colors" />
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-indigo-500/50 opacity-60">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center font-bold text-xs border-2 border-[#030712]">2</div>
                  <div className="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center font-bold text-xs border-2 border-[#030712]">8</div>
                </div>
                <div>
                  <div className="text-sm font-bold">Party of 4 Potential</div>
                  <div className="text-[10px] text-gray-500 font-medium">Tables currently unavailable</div>
                </div>
              </div>
              <Lock size={14} className="text-gray-600" />
            </div>
          </div>
        </div>
        
        <div className="dashboard-glass p-8 flex flex-col justify-between">
          <div>
            <h3 className="font-black mb-4">Seating Efficiency</h3>
            <div className="text-4xl font-black text-indigo-400 mb-2">92%</div>
            <p className="text-xs text-gray-500 leading-relaxed">Your current seating arrangement is highly efficient. Minimal unused capacity across all zones.</p>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full mt-6 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '92%' }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
