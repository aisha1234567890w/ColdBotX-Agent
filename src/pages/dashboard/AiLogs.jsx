import { useState } from 'react';
import { 
  MessageSquareCode, 
  Phone, 
  Smartphone, 
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  UserCheck,
  ChevronRight,
  Clock,
  ArrowUpRight,
  RefreshCcw
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ActivityLog = ({ log, theme }) => (
  <div className={`dashboard-glass p-6 hover:scale-[1.01] transition-all group ${theme === 'dark' ? 'hover:bg-white/[0.08]' : 'hover:bg-gray-50'}`}>
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/10 ${
          log.type === 'Call' ? 'bg-indigo-500/10 text-indigo-500' : 
          log.type === 'WhatsApp' ? 'bg-emerald-500/10 text-emerald-500' : 
          'bg-purple-500/10 text-purple-500'
        }`}>
          {log.type === 'Call' ? <Phone size={22} /> : 
           log.type === 'WhatsApp' ? <Smartphone size={22} /> : 
           <MessageSquare size={22} />}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{log.customer}</h4>
            <span className="text-[10px] text-gray-400 font-bold tracking-tight">{log.phone}</span>
          </div>
          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
            <Clock size={10} /> {log.time} • {log.type} Interaction
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`text-[10px] font-black uppercase tracking-[0.1em] px-3 py-1 rounded-full mb-2 inline-block ${
          log.outcome === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 
          log.outcome === 'Escalated' ? 'bg-orange-500/10 text-orange-500' : 
          'bg-gray-500/10 text-gray-500'
        }`}>
          {log.outcome}
        </div>
        <div className="text-[10px] text-gray-500 font-bold flex items-center justify-end gap-1">
          Conf Score: <span className="text-indigo-500">{log.confidence}%</span>
        </div>
      </div>
    </div>

    <div className={`rounded-xl p-4 border mb-6 ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
      <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Agent Summary</div>
      <p className={`text-xs leading-relaxed italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>"{log.summary}"</p>
    </div>

    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        {log.escalated && (
          <div className="flex items-center gap-2 text-orange-500 text-[10px] font-black uppercase tracking-widest">
            <UserCheck size={14} /> Escalated to Staff
          </div>
        )}
      </div>
      <button className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1 hover:underline">
        Review Transcript <ChevronRight size={14} />
      </button>
    </div>
  </div>
);

export default function AiActivityLogs() {
  const { theme } = useTheme();
  const [activeType, setActiveType] = useState('All');

  const logs = [
    { id: 1, customer: 'Ahmed Khan', phone: '+92 300 1234567', type: 'WhatsApp', time: '2 mins ago', outcome: 'Confirmed', confidence: 98, summary: 'Customer requested a table for 4 at 19:30. No special dietary requirements mentioned.', escalated: false },
    { id: 2, customer: 'Sarah Miller', phone: '+92 333 9876543', type: 'Call', time: '14 mins ago', outcome: 'Inquiry', confidence: 92, summary: 'Customer inquired about gluten-free options and menu prices. No booking was made.', escalated: false },
    { id: 3, customer: 'Zainab Ali', phone: '+92 321 4567890', type: 'Chat', time: '45 mins ago', outcome: 'Confirmed', confidence: 85, summary: 'Booking confirmed for 6 guests. AI detected a birthday request and flagged it for staff.', escalated: true },
    { id: 4, customer: 'John Peterson', phone: '+1 555 0199', type: 'WhatsApp', time: '1 hour ago', outcome: 'Canceled', confidence: 96, summary: 'Customer canceled their existing reservation for tonight due to travel delay.', escalated: false },
    { id: 5, customer: 'Fatima Zahra', phone: '+92 301 7654321', type: 'Call', time: '3 hours ago', outcome: 'Escalated', confidence: 72, summary: 'Customer had a complex question about a private event for 30 people. AI escalated to manager.', escalated: true },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">AI Agent Activity</h1>
          <p className="text-gray-500 font-medium">Monitor real-time interactions across all automated channels.</p>
        </div>
        
        <div className="flex gap-4">
          <div className={`rounded-2xl px-6 py-3 text-sm font-black flex items-center gap-2 border ${
            theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'
          }`}>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            3 Agents Online
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`dashboard-glass p-8 border-l-4 border-indigo-500 ${theme === 'light' ? 'bg-indigo-50/30' : 'bg-indigo-600/5'}`}>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Total Interactions</div>
          <div className="text-4xl font-black">2,482</div>
          <div className="mt-6 flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
            <ArrowUpRight size={14} /> +12% vs last week
          </div>
        </div>
        <div className={`dashboard-glass p-8 border-l-4 border-emerald-500 ${theme === 'light' ? 'bg-emerald-50/30' : 'bg-emerald-600/5'}`}>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Success Rate</div>
          <div className="text-4xl font-black">94.8%</div>
          <div className="mt-6 flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
            <ArrowUpRight size={14} /> AI Optimization Active
          </div>
        </div>
        <div className={`dashboard-glass p-8 border-l-4 border-orange-500 ${theme === 'light' ? 'bg-orange-50/30' : 'bg-orange-600/5'}`}>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Human Escalations</div>
          <div className="text-4xl font-black">32</div>
          <div className="mt-6 flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest">
            <RefreshCcw size={14} /> Action Required
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className={`flex rounded-xl p-1 border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-100 border-gray-200'}`}>
          {['All', 'Call', 'WhatsApp', 'Chat'].map(type => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                activeType === type 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-gray-500 hover:text-indigo-600 dark:hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className={`flex items-center gap-4 w-full md:w-80 px-4 py-2.5 rounded-xl border transition-all group ${
          theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-100 border-gray-200'
        }`}>
          <Search size={16} className="text-gray-500 group-focus-within:text-indigo-500" />
          <input type="text" placeholder="Search by customer..." className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-500" />
        </div>
      </div>

      {/* Logs Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {logs.map(log => (
          <ActivityLog key={log.id} log={log} theme={theme} />
        ))}
      </div>
      
      <div className="text-center py-12">
        <button className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-indigo-500 transition-all border-b border-transparent hover:border-indigo-500 pb-2">
          Load Historical Data
        </button>
      </div>
    </div>
  );
}

