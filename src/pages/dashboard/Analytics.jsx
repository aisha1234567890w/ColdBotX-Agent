import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  MapPin, 
  Smartphone, 
  Phone, 
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight
} from 'lucide-react';

const ChartPlaceholder = ({ height = 200, type = 'bar' }) => (
  <div className="w-full relative flex items-end justify-between px-2 gap-2" style={{ height: `${height}px` }}>
    {/* Bar Chart Mock */}
    {type === 'bar' && [40, 70, 45, 90, 65, 30, 85, 55, 75, 40, 60, 95].map((h, i) => (
      <motion.div 
        key={i}
        initial={{ height: 0 }}
        animate={{ height: `${h}%` }}
        transition={{ delay: i * 0.05, duration: 0.8 }}
        className="flex-1 bg-gradient-to-t from-indigo-600/40 to-indigo-500 rounded-t-sm relative group"
      >
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-indigo-600 text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {Math.floor(h * 1.2)}%
        </div>
      </motion.div>
    ))}

    {/* Simple SVG Line Chart Mock */}
    {type === 'line' && (
      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path 
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          d="M0,80 L10,60 L20,70 L30,40 L40,50 L50,20 L60,30 L70,10 L80,40 L90,20 L100,50" 
          fill="none" 
          stroke="#6366f1" 
          strokeWidth="2" 
          vectorEffect="non-scaling-stroke"
        />
        <path d="M0,80 L10,60 L20,70 L30,40 L40,50 L50,20 L60,30 L70,10 L80,40 L90,20 L100,50 V100 H0 Z" fill="url(#lineGrad)" />
      </svg>
    )}
  </div>
);

const MetricItem = ({ label, value, trend, sub }) => (
  <div className="p-6 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
    <div className="flex justify-between items-start mb-1">
      <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{label}</div>
      {trend && (
        <div className={`flex items-center text-[10px] font-black ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
          {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="text-2xl font-black text-white">{value}</div>
    {sub && <div className="text-[10px] text-gray-600 font-bold mt-1">{sub}</div>}
  </div>
);

export default function Analytics() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Performance Intelligence</h1>
          <p className="text-gray-500 font-medium">Deep insights into Aifur's operations and AI agent efficiency.</p>
        </div>
        <div className="flex gap-4">
          <select className="bg-white/5 border border-white/5 text-gray-400 text-xs font-bold px-4 py-3 rounded-xl outline-none focus:border-indigo-500/50 transition-colors">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>This Month</option>
            <option>All Time</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Core Metrics Sidebar */}
        <div className="lg:col-span-1 dashboard-glass flex flex-col overflow-hidden h-fit">
          <MetricItem label="Avg Party Size" value="3.4" trend={8} sub="Optimal: 4.0 guests" />
          <MetricItem label="Cancellations" value="4.2%" trend={-12} sub="Industry Avg: 6.5%" />
          <MetricItem label="Peak Wait Time" value="12m" trend={15} sub="Target: <10m" />
          <MetricItem label="Repeat Guests" value="28%" trend={4} sub="+2% from last month" />
        </div>

        {/* Main Charts Area */}
        <div className="lg:col-span-3 space-y-8">
          <div className="dashboard-glass p-8">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="font-black text-lg mb-1">Reservation Volume by Hour</h3>
                <p className="text-xs text-gray-500 font-medium">Heatmap shows heaviest load between 19:00 and 21:00.</p>
              </div>
              <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Weekdays</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500/30"></div> Weekends</div>
              </div>
            </div>
            <ChartPlaceholder height={250} type="bar" />
            <div className="flex justify-between mt-6 px-2 text-[10px] font-black text-gray-600 uppercase tracking-widest">
              <span>11:00</span><span>13:00</span><span>15:00</span><span>17:00</span><span>19:00</span><span>21:00</span><span>23:00</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="dashboard-glass p-8">
              <h3 className="font-black text-sm mb-6 uppercase tracking-widest text-gray-400">Channel Performance</h3>
              <div className="space-y-6">
                {[
                  { label: 'Voice AI Agent', icon: Phone, color: 'indigo', value: 45, count: '1,240' },
                  { label: 'WhatsApp Bot', icon: Smartphone, color: 'emerald', value: 35, count: '960' },
                  { label: 'Web Chatbot', icon: MessageSquare, color: 'purple', value: 20, count: '550' },
                ].map((channel, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <channel.icon size={14} className={`text-${channel.color}-400`} />
                        {channel.label}
                      </div>
                      <div className="text-gray-500">{channel.count} Bookings</div>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${channel.value}%` }}
                        className={`h-full bg-${channel.color}-500`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-glass p-8">
              <h3 className="font-black text-sm mb-6 uppercase tracking-widest text-gray-400">Revenue Growth</h3>
              <ChartPlaceholder height={120} type="line" />
              <div className="mt-8 flex items-center justify-between">
                <div>
                  <div className="text-3xl font-black">+PKR 450k</div>
                  <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Est. Monthly Gain</div>
                </div>
                <button className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl hover:bg-indigo-600/20 transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
