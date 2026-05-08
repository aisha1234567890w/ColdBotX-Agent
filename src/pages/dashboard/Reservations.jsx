import { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';

const ReservationRow = ({ reservation }) => (
  <tr className="group border-b border-white/5 hover:bg-white/[0.02] transition-all">
    <td className="py-5 pl-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center font-bold text-indigo-400 text-xs">
          {reservation.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{reservation.name}</div>
          <div className="text-[10px] text-gray-500 font-bold tracking-tight">{reservation.phone}</div>
        </div>
      </div>
    </td>
    <td className="py-5">
      <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 w-fit border border-white/5">
        <div className="text-indigo-400">
          {reservation.source === 'Call' ? <Phone size={12} /> : 
           reservation.source === 'WhatsApp' ? <Smartphone size={12} /> : 
           <MessageSquare size={12} />}
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{reservation.source}</span>
      </div>
    </td>
    <td className="py-5">
      <div className="text-sm font-bold">{reservation.time}</div>
      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{reservation.date}</div>
    </td>
    <td className="py-5">
      <div className="flex items-center gap-2 text-sm font-bold">
        <Users size={14} className="text-gray-600" />
        {reservation.party} Guests
      </div>
    </td>
    <td className="py-5 text-sm font-medium text-gray-400">
      Table #{reservation.table}
    </td>
    <td className="py-5">
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
        reservation.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 
        reservation.status === 'Pending' ? 'bg-orange-500/10 text-orange-500' : 
        'bg-gray-500/10 text-gray-500'
      }`}>
        {reservation.status}
      </span>
    </td>
    <td className="py-5 pr-4 text-right">
      <div className="flex justify-end gap-2">
        <button className="p-2 text-gray-600 hover:text-white hover:bg-white/5 rounded-lg transition-all">
          <ExternalLink size={16} />
        </button>
        <button className="p-2 text-gray-600 hover:text-white hover:bg-white/5 rounded-lg transition-all">
          <MoreVertical size={16} />
        </button>
      </div>
    </td>
  </tr>
);

export default function Reservations() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const reservations = [
    { id: 1, name: 'Ahmed Khan', phone: '+92 300 1234567', source: 'WhatsApp', date: 'May 8, 2026', time: '19:30', party: 4, table: 4, status: 'Confirmed' },
    { id: 2, name: 'Sarah Miller', phone: '+92 333 9876543', source: 'Call', date: 'May 8, 2026', time: '20:00', party: 2, table: 1, status: 'Pending' },
    { id: 3, name: 'Zainab Ali', phone: '+92 321 4567890', source: 'Chat', date: 'May 8, 2026', time: '20:15', party: 6, table: 6, status: 'Confirmed' },
    { id: 4, name: 'John Peterson', phone: '+1 555 0199', source: 'WhatsApp', date: 'May 8, 2026', time: '20:45', party: 2, table: 8, status: 'Confirmed' },
    { id: 5, name: 'Fatima Zahra', phone: '+92 301 7654321', source: 'Call', date: 'May 8, 2026', time: '21:00', party: 3, table: 5, status: 'Confirmed' },
    { id: 6, name: 'Robert De Niro', phone: '+1 212 999 0000', source: 'Chat', date: 'May 9, 2026', time: '18:30', party: 4, table: 3, status: 'Confirmed' },
    { id: 7, name: 'Malala Yousafzai', phone: '+44 20 7946 0000', source: 'WhatsApp', date: 'May 9, 2026', time: '19:00', party: 2, table: 2, status: 'Confirmed' },
  ];

  const filteredReservations = reservations.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         res.phone.includes(searchTerm);
    const matchesFilter = activeFilter === 'All' || res.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Master Bookings</h1>
          <p className="text-gray-500 font-medium">Consolidated feed from AI Calling, Chat, and WhatsApp agents.</p>
        </div>
        
        <div className="flex gap-4">
          <button className="dashboard-glass px-6 py-3 text-sm font-black flex items-center gap-2 hover:bg-white/5">
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
      <div className="dashboard-glass p-4 flex flex-col md:flex-row gap-4 items-center justify-between border-white/5">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
            {['All', 'Confirmed', 'Pending', 'Seated'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${
                  activeFilter === filter ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <button className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-white border border-white/5 transition-colors">
            <Filter size={18} />
          </button>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5 w-full md:w-80">
            <Search size={18} className="text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-600"
            />
          </div>
          <button className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-white border border-white/5 transition-colors whitespace-nowrap flex items-center gap-2">
            <Calendar size={18} />
            <span className="text-xs font-black">May 8 - 14</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="dashboard-glass overflow-hidden border-white/5">
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                <th className="py-5 pl-4 flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                  Customer <ArrowUpDown size={12} />
                </th>
                <th className="py-5">Source</th>
                <th className="py-5 cursor-pointer hover:text-white transition-colors">
                  Date & Time <ArrowUpDown size={12} />
                </th>
                <th className="py-5">Party</th>
                <th className="py-5">Seating</th>
                <th className="py-5">Status</th>
                <th className="py-5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.length > 0 ? (
                filteredReservations.map(res => (
                  <ReservationRow key={res.id} reservation={res} />
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-24 text-center">
                    <div className="text-gray-600 font-bold mb-2 italic">No reservations found matching your criteria.</div>
                    <button 
                      onClick={() => {setSearchTerm(''); setActiveFilter('All');}}
                      className="text-indigo-400 text-xs font-black underline"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Info */}
        <div className="p-6 border-t border-white/5 flex items-center justify-between">
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-600">
            Showing {filteredReservations.length} of {reservations.length} entries
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/5 rounded-lg text-[10px] font-black text-gray-500 hover:text-white transition-colors disabled:opacity-30" disabled>Previous</button>
            <button className="px-4 py-2 bg-white/5 rounded-lg text-[10px] font-black text-gray-500 hover:text-white transition-colors disabled:opacity-30" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
