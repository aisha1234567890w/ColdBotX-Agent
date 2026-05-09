import { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  AlertTriangle,
  Flame,
  CheckCircle2,
  XCircle,
  TrendingUp,
  RefreshCcw
} from 'lucide-react';
import { menuData } from '../../data/menu';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../utils/supabaseClient';

const MenuItemCard = ({ item, theme }) => (
  <div className={`dashboard-glass overflow-hidden group hover:scale-[1.02] transition-all duration-300 ${theme === 'dark' ? 'hover:bg-white/[0.08]' : 'hover:bg-gray-50'}`}>
    <div className="h-40 overflow-hidden relative">
      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
      <div className="absolute top-3 right-3 flex gap-2">
        {item.spiceLevel > 0 && (
          <div className="bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 uppercase shadow-lg">
            <Flame size={10} /> {item.spiceLevel}
          </div>
        )}
      </div>
      <div className="absolute bottom-3 left-3">
         <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${
          item.isAvailable !== false ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {item.isAvailable !== false ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
    </div>
    <div className="p-5">
      <div className="flex justify-between items-start mb-2 gap-2">
        <h4 className={`text-base font-black truncate transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.name}</h4>
        <div className="text-sm font-black text-indigo-600 dark:text-indigo-400 whitespace-nowrap">PKR {item.price.toLocaleString()}</div>
      </div>
      <p className="text-[10px] text-gray-500 line-clamp-2 mb-6 leading-relaxed min-h-[2.5rem]">{item.description}</p>
      
      <div className={`flex justify-between items-center pt-4 border-t ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
        <div className="flex gap-1">
          <button className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-indigo-600 hover:bg-gray-100'}`}>
            <Edit2 size={14} />
          </button>
          <button className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'text-gray-500 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}>
            <Trash2 size={14} />
          </button>
        </div>
        <button className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
          theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50 shadow-sm'
        }`}>
          <Eye size={12} /> Preview
        </button>
      </div>
    </div>
  </div>
);

export default function MenuManagement() {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('swedish');
  const [activeSub, setActiveSub] = useState('starters');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'swedish', label: 'Swedish Cuisine', icon: '🇸🇪' },
    { id: 'pakistani', label: 'Pakistani Cuisine', icon: '🇵🇰' },
    { id: 'fusion', label: 'Aifur Fusion', icon: '✨' },
    { id: 'deals', label: 'Value Deals', icon: '🏷️' },
  ];

  const subCategories = {
    swedish: ['starters', 'mains', 'desserts', 'beverages'],
    pakistani: ['starters', 'bbq', 'mains', 'rice', 'bread', 'desserts', 'beverages'],
    fusion: ['starters', 'mains', 'rice', 'desserts', 'beverages'],
    deals: ['Combos']
  };

  const getItems = () => {
    let baseItems = [];
    if (activeCategory === 'deals') baseItems = menuData.deals;
    else if (activeCategory === 'pakistani' && (activeSub === 'rice' || activeSub === 'bread')) {
      baseItems = menuData.pakistani[activeSub];
    } else {
      baseItems = menuData[activeCategory][activeSub] || [];
    }

    if (searchTerm) {
      return baseItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return baseItems;
  };

  const items = getItems();

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Menu Inventory</h1>
          <p className="text-gray-500 font-medium">Control pricing, availability, and item descriptions globally.</p>
        </div>
        <div className="flex gap-4">
          <button className={`px-6 py-3 text-sm font-black flex items-center gap-2 rounded-2xl border transition-all ${
            theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}>
            <AlertTriangle size={16} className="text-orange-500" />
            Stock Alerts
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">
            <Plus size={16} />
            Add New Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Category Navigation */}
        <div className="lg:col-span-1 space-y-6">
          <div className="dashboard-glass p-3 space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {setActiveCategory(cat.id); setActiveSub(subCategories[cat.id][0]);}}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 scale-[1.02]' 
                    : 'text-gray-500 hover:text-indigo-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-xs font-black uppercase tracking-widest">{cat.label}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="dashboard-glass p-8">
            <div className="flex items-center gap-2 text-indigo-500 mb-6">
              <TrendingUp size={18} />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Inventory Health</h3>
            </div>
            <div className="space-y-6">
              {[
                { label: 'Active Items', value: '124', color: 'indigo' },
                { label: 'Out of Stock', value: '3', color: 'red' },
                { label: 'Top Seller', value: 'Meatballs', color: 'emerald' },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500">{stat.label}</span>
                  <span className={`text-sm font-black text-${stat.color}-500`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Item Management Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col xl:flex-row gap-4 justify-between items-center">
            <div className={`flex gap-2 p-1.5 rounded-xl border transition-all overflow-x-auto w-full xl:w-auto no-scrollbar ${
              theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-100 border-gray-200'
            }`}>
              {subCategories[activeCategory].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSub(sub)}
                  className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                    activeSub === sub 
                      ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-sm' 
                      : 'text-gray-500 hover:text-indigo-600 dark:hover:text-white'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
            
            <div className={`flex items-center gap-3 w-full xl:w-80 px-4 py-2.5 rounded-xl border transition-all group ${
              theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-100 border-gray-200'
            }`}>
              <Search size={16} className="text-gray-500 group-focus-within:text-indigo-500" />
              <input 
                type="text" 
                placeholder="Search by name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-500" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((item, idx) => (
              <MenuItemCard key={idx} item={item} theme={theme} />
            ))}
            <button className="border-2 border-dashed border-gray-200 dark:border-white/5 rounded-[2rem] flex flex-col items-center justify-center p-10 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group min-h-[300px]">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 mb-4 shadow-sm group-hover:shadow-xl group-hover:shadow-indigo-500/30">
                <Plus size={32} />
              </div>
              <div className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Add New Dish</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

