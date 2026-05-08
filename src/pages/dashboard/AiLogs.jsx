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
  ArrowUpRight
} from 'lucide-react';

const ActivityLog = ({ log }) => (
  <div className="bg-white/5 rounded-2xl border border-white/5 p-6 hover:bg-white/[0.08] transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          log.type === 'Call' ? 'bg-indigo-500/20 text-indigo-400' : 
          log.type === 'WhatsApp' ? 'bg-emerald-500/20 text-emerald-400' : 
          'bg-purple-500/20 text-purple-400'
        }`}>
          {log.type === 'Call' ? <Phone size={24} /> : 
           log.type === 'WhatsApp' ? <Smartphone size={24} /> : 
           <MessageSquare size={24} />}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-white">{log.customer}</h4>
            <span className="text-[10px] text-gray-500 font-bold tracking-tight">{log.phone}</span>
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
        <div className="text-[10px] text-gray-600 font-bold flex items-center justify-end gap-1">
          Conf Score: <span className="text-indigo-400">{log.confidence}%</span>
        </div>
      </div>
    </div>

    <div className="bg-black/20 rounded-xl p-4 border border-white/5 mb-6">
      <div className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2">Agent Summary</div>
      <p className="text-xs text-gray-400 leading-relaxed italic">"{log.summary}"</p>
    </div>

    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        {log.escalated && (
          <div className="flex items-center gap-2 text-orange-500 text-[10px] font-black uppercase tracking-widest">
            <UserCheck size={14} /> Escalated to Staff
          </div>
        )}
      </div>
      <button className="text-xs font-bold text-indigo-400 flex items-center gap-1 hover:underline">
        Review Transcript <ChevronRight size={14} />
      </button>
    </div>
  </div>
);

export default function AiActivityLogs() {
  const [activeType, setActiveType] = useState('All');

  const logs = [
    { id: 1, customer: 'Ahmed Khan', phone: '+92 300 1234567', type: 'WhatsApp', time: '2 mins ago', outcome: 'Confirmed', confidence: 98, summary: 'Customer requested a table for 4 at 19:30. No special dietary requirements mentioned.', escalated: false },
    { id: 2, customer: 'Sarah Miller', phone: '+92 333 9876543', type: 'Call', time: '14 mins ago', outcome: 'Inquiry', confidence: 92, summary: 'Customer inquired about gluten-free options and menu prices. No booking was made.', escalated: false },
    { id: 3, customer: 'Zainab Ali', phone: '+92 321 4567890', type: 'Chat', time: '45 mins ago', outcome: 'Confirmed', confidence: 85, summary: 'Booking confirmed for 6 guests. AI detected a birthday request and flagged it for staff.', escalated: true },
    { id: 4, customer: 'John Peterson', phone: '+1 555 0199', type: 'WhatsApp', time: '1 hour ago', outcome: 'Canceled', confidence: 96, summary: 'Customer canceled their existing reservation for tonight due to travel delay.', escalated: false },
    { id: 5, customer: 'Fatima Zahra', phone: '+92 301 7654321', type: 'Call', time: '3 hours ago', outcome: 'Escalated', confidence: 72, summary: 'Customer had a complex question about a private event for 30 people. AI escalated to manager.', escalated: true },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">AI Agent Activity</h1>
          <p className="text-gray-500 font-medium">Monitor real-time interactions across all automated channels.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="dashboard-glass px-6 py-3 text-sm font-black flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            3 Agents Online
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="dashboard-glass p-6 bg-indigo-600/5 border-indigo-500/20">
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Total Interactions</div>
          <div className="text-3xl font-black">2,482</div>
          <div className="mt-4 flex items-center gap-2 text-emerald-500 text-[10px] font-black">
            <ArrowUpRight size={14} /> +12% this week
          </div>
        </div>
        <div className="dashboard-glass p-6 bg-emerald-600/5 border-emerald-500/20">
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Success Rate</div>
          <div className="text-3xl font-black">94.8%</div>
          <div className="mt-4 flex items-center gap-2 text-emerald-500 text-[10px] font-black">
            <ArrowUpRight size={14} /> +0.5% optimization
          </div>
        </div>
        <div className="dashboard-glass p-6 bg-orange-600/5 border-orange-500/20">
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Human Escalations</div>
          <div className="text-3xl font-black">32</div>
          <div className="mt-4 flex items-center gap-2 text-red-500 text-[10px] font-black">
            <ArrowUpRight size={14} className="rotate-90" /> Needs Attention
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-white/5 rounded-xl p-1 border border-white/5 w-full md:w-auto">
          {['All', 'Call', 'WhatsApp', 'Chat'].map(type => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                activeType === type ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full md:w-80 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
          <Search size={16} className="text-gray-500" />
          <input type="text" placeholder="Search logs..." className="bg-transparent border-none outline-none text-xs w-full" />
        </div>
      </div>

      {/* Logs Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {logs.map(log => (
          <ActivityLog key={log.id} log={log} />
        ))}
      </div>
      
      <div className="text-center py-8">
        <button className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-indigo-400 transition-colors">
          Load Previous Interactions
        </button>
      </div>
    </div>
  );
}
