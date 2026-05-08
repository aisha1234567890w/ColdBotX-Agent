import { useState } from 'react';
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
  XCircle
} from 'lucide-react';
import { menuData } from '../../data/menu';

const MenuItemCard = ({ item }) => (
  <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden group hover:bg-white/[0.08] transition-all duration-300">
    <div className="h-32 overflow-hidden relative">
      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
      <div className="absolute top-2 right-2 flex gap-1">
        {item.spiceLevel > 0 && (
          <div className="bg-red-500/80 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-tighter">
            <Flame size={8} /> {item.spiceLevel}
          </div>
        )}
      </div>
    </div>
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors truncate w-2/3">{item.name}</h4>
        <div className="text-xs font-black text-indigo-400">PKR {item.price.toLocaleString()}</div>
      </div>
      <p className="text-[10px] text-gray-500 line-clamp-2 mb-4 leading-relaxed">{item.description}</p>
      
      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <div className="flex gap-2">
          <button className="p-1.5 text-gray-600 hover:text-white transition-colors"><Edit2 size={12} /></button>
          <button className="p-1.5 text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
        </div>
        <div className={`text-[8px] font-black uppercase tracking-widest flex items-center gap-1 ${
          Math.random() > 0.1 ? 'text-emerald-500' : 'text-red-500'
        }`}>
          {Math.random() > 0.1 ? <><CheckCircle2 size={10} /> Active</> : <><XCircle size={10} /> Out of Stock</>}
        </div>
      </div>
    </div>
  </div>
);

export default function MenuManagement() {
  const [activeCategory, setActiveCategory] = useState('swedish');
  const [activeSub, setActiveSub] = useState('starters');

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
    if (activeCategory === 'deals') return menuData.deals;
    if (activeCategory === 'pakistani' && (activeSub === 'rice' || activeSub === 'bread')) {
      return menuData.pakistani[activeSub];
    }
    return menuData[activeCategory][activeSub] || [];
  };

  const items = getItems();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Menu Inventory</h1>
          <p className="text-gray-500 font-medium">Control pricing, availability, and item descriptions globally.</p>
        </div>
        <div className="flex gap-4">
          <button className="dashboard-glass px-6 py-3 text-sm font-black flex items-center gap-2 hover:bg-white/5">
            <AlertTriangle size={16} className="text-orange-400" />
            Stock Alerts (2)
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 shadow-xl shadow-indigo-500/20">
            <Plus size={16} />
            Add New Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Category Navigation */}
        <div className="lg:col-span-1 space-y-4">
          <div className="dashboard-glass p-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {setActiveCategory(cat.id); setActiveSub(subCategories[cat.id][0]);}}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-xs font-black uppercase tracking-widest">{cat.label}</span>
                </div>
                <div className="text-[10px] opacity-60">
                  {Object.keys(menuData[cat.id] || {}).length || 1} Sec
                </div>
              </button>
            ))}
          </div>

          <div className="dashboard-glass p-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400">Total Items</span>
                <span className="text-xs font-black">124</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400">Average Price</span>
                <span className="text-xs font-black">PKR 1,450</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-500">Active Promos</span>
                <span className="text-xs font-black text-emerald-500">4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Item Management Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/5 overflow-x-auto w-full md:w-auto scrollbar-hide">
              {subCategories[activeCategory].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSub(sub)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                    activeSub === sub ? 'bg-white/10 text-white shadow-inner' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-64 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
              <Search size={14} className="text-gray-600" />
              <input type="text" placeholder="Search menu..." className="bg-transparent border-none outline-none text-xs w-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, idx) => (
              <MenuItemCard key={idx} item={item} />
            ))}
            <button className="border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all mb-4">
                <Plus size={24} />
              </div>
              <div className="text-xs font-black uppercase tracking-widest text-gray-600 group-hover:text-indigo-400 transition-colors">Add Item</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
