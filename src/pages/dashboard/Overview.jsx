import { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Calendar,
  ChevronRight,
  Star
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { supabase } from '../../utils/supabaseClient';
import { menuData } from '../../data/menu';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const COLORS = ['#FF6B35', '#4F46E5', '#10B981', '#F59E0B'];

const StatCard = ({ icon: Icon, label, value, trend, trendUp, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <button className="text-gray-400 hover:text-gray-600 transition-colors"><MoreVertical size={20} /></button>
    </div>
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-end gap-3">
        <h3 className="text-2xl font-black tracking-tight">{value}</h3>
        <div className={`flex items-center text-[10px] font-black pb-1 ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
          {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      </div>
    </div>
  </motion.div>
);

export default function Overview() {
  const { theme } = useTheme();
  const [stats, setStats] = useState({ orders: 0, customers: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  // Trending items from Fusion Mains (Aifur's pride)
  const trendingMenus = menuData.fusion.mains.slice(0, 3);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data, error } = await supabase
          .from('reservations_main')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;

        const totalOrders = data.length;
        const uniqueCustomers = new Set(data.map(r => r.email)).size;
        const totalRevenue = data.reduce((acc, r) => acc + (parseInt(r.guests) * 4500), 0);

        setStats({
          orders: totalOrders.toLocaleString(),
          customers: uniqueCustomers.toLocaleString(),
          revenue: `PKR ${totalRevenue.toLocaleString()}`
        });
      } catch (err) {
        console.error("Dashboard data error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Mock chart data for high-end visualization
  const revenueData = [
    { name: 'Mar', income: 120000, expense: 80000 },
    { name: 'Apr', income: 150000, expense: 90000 },
    { name: 'May', income: 184839, expense: 95000 },
    { name: 'Jun', income: 160000, expense: 85000 },
    { name: 'Jul', income: 195000, expense: 110000 },
  ];

  const categoryData = [
    { name: 'Fusion', value: 45 },
    { name: 'Swedish', value: 30 },
    { name: 'Pakistani', value: 25 },
  ];

  const weeklyData = [
    { name: 'Mon', count: 120 },
    { name: 'Tue', count: 150 },
    { name: 'Wed', count: 180 },
    { name: 'Thu', count: 240 },
    { name: 'Fri', count: 320 },
    { name: 'Sat', count: 450 },
    { name: 'Sun', count: 380 },
  ];

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#FF6B35]/20 border-t-[#FF6B35] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-black tracking-tighter mb-1">Dashboard</h1>
          <p className="text-gray-500 text-sm font-medium">Welcome back to Aifur Operations Center</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-500">
            <Calendar size={14} /> Last 30 Days
          </div>
          <button className="px-6 py-2.5 bg-[#FF6B35] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform">
            Export Report
          </button>
        </div>
      </div>

      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard 
          icon={ShoppingBag} 
          label="Total Orders" 
          value={stats.orders} 
          trend="1.58%" 
          trendUp={true} 
          color="bg-[#FF6B35]"
        />
        <StatCard 
          icon={Users} 
          label="Total Customers" 
          value={stats.customers} 
          trend="0.42%" 
          trendUp={true} 
          color="bg-indigo-600"
        />
        <StatCard 
          icon={DollarSign} 
          label="Total Revenue" 
          value={stats.revenue} 
          trend="2.35%" 
          trendUp={true} 
          color="bg-emerald-600"
        />
      </div>

      {/* Row 2: Charts and Trending */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Revenue Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-lg font-black tracking-tight mb-1">Total Revenue</h3>
              <p className="text-3xl font-black text-[#FF6B35] tracking-tighter">{stats.revenue}</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                <span className="w-2 h-2 rounded-full bg-[#FF6B35]" /> Income
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700" /> Expense
              </div>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#333' : '#eee'} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#888' }} 
                  dy={10}
                />
                <YAxis 
                  hide 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#111' : '#fff', 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                  }}
                  itemStyle={{ fontSize: '10px', fontWeight: '900' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#FF6B35" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#888" 
                  strokeWidth={2}
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Column: Trending Menus */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm flex-1">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-lg font-black tracking-tight">Trending Menus</h3>
               <button className="text-[10px] font-black uppercase text-[#FF6B35]">This Week</button>
             </div>
             <div className="space-y-6">
                {trendingMenus.map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-sm font-black mb-1 line-clamp-1">{item.name}</h4>
                      <div className="flex items-center gap-1 text-[#FF6B35] mb-2">
                         <Star size={10} fill="currentColor" />
                         <span className="text-[10px] font-black">4.9 (350 orders)</span>
                      </div>
                      <div className="text-sm font-black text-gray-400">PKR {item.price.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>

      {/* Row 3: Orders Overview & Category Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Orders Overview Bar Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-lg font-black tracking-tight">Orders Overview</h3>
              <select className="bg-transparent text-[10px] font-black uppercase outline-none text-[#FF6B35]">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
           </div>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#888' }} 
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#FF6B35" 
                    radius={[8, 8, 8, 8]} 
                    barSize={30}
                    activeBar={<CustomBar fill="#4F46E5" />}
                  />
                </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="lg:col-span-4 bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
           <h3 className="text-lg font-black tracking-tight mb-8">Top Categories</h3>
           <div className="h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="grid grid-cols-2 gap-4 mt-6">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{cat.name} {cat.value}%</span>
                </div>
              ))}
           </div>
        </div>
      </div>

    </div>
  );
}

// Custom Bar for BarChart active state
const CustomBar = (props) => {
  const { fill, x, y, width, height } = props;
  return <rect x={x} y={y} width={width} height={height} fill={fill} rx={8} ry={8} />;
};
