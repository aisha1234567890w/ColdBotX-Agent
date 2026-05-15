import { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, Search, Edit2, 
  Flame, Save, X
} from 'lucide-react';
import { menuData as defaultMenuData } from '../../data/menu';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../utils/supabaseClient';

export default function MenuManagement() {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('swedish');
  const [activeSub, setActiveSub] = useState('starters');
  const [searchTerm, setSearchTerm] = useState('');
  const [menuState, setMenuState] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: 0, image: '', isAvailable: true, spiceLevel: 0,
    siteAnnouncement: ''
  });
  const [announcement, setAnnouncement] = useState('Welcome to Aifur!');

  useEffect(() => {
    fetchOverrides();
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    const { data } = await supabase.from('restaurant_config').select('value').eq('key', 'site_announcement').single();
    if (data) setAnnouncement(data.value);
  };

  const fetchOverrides = async () => {
    const { data: overrides } = await supabase.from('menu_overrides').select('*');
    
    const mergedMenu = JSON.parse(JSON.stringify(defaultMenuData));
    
    if (overrides) {
      overrides.forEach(ov => {
        // Search through all categories/subs to apply overrides
        Object.keys(mergedMenu).forEach(cat => {
          if (cat === 'deals') {
            mergedMenu.deals = mergedMenu.deals.map(item => 
              item.name === ov.dish_name ? { ...item, price: ov.price, isAvailable: ov.is_available } : item
            );
          } else {
            Object.keys(mergedMenu[cat]).forEach(sub => {
              mergedMenu[cat][sub] = mergedMenu[cat][sub].map(item => 
                item.name === ov.dish_name ? { ...item, price: ov.price, isAvailable: ov.is_available } : item
              );
            });
          }
        });
      });
    }
    setMenuState(mergedMenu);
  };

  const saveAnnouncement = async (val) => {
    await supabase.from('restaurant_config').upsert({ key: 'site_announcement', value: val });
    setAnnouncement(val);
    setIsModalOpen(false);
  };

  const saveOverride = async (item) => {
    const { error } = await supabase.from('menu_overrides').upsert({
      dish_name: item.name,
      price: parseInt(formData.price),
      is_available: formData.isAvailable
    });
    
    if (!error) {
      fetchOverrides();
      setIsModalOpen(false);
    } else {
      alert("Error syncing with website: " + error.message);
    }
  };

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
    if (!menuState) return [];
    let baseItems = [];
    if (activeCategory === 'deals') baseItems = menuState.deals || [];
    else if (activeCategory === 'pakistani' && (activeSub === 'rice' || activeSub === 'bread')) {
      baseItems = menuState.pakistani[activeSub] || [];
    } else {
      baseItems = menuState[activeCategory]?.[activeSub] || [];
    }

    if (searchTerm) {
      return baseItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return baseItems;
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const items = getItems().map((item, idx) => ({
    ...item,
    id: item.id || `item_${activeCategory}_${activeSub}_${idx}`
  }));

  if (!menuState) return <div className="p-8 text-center">Loading Menu Data...</div>;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Site & Inventory Status</h1>
          <p className="text-gray-500 font-medium">Manage site-wide announcements and real-time stock availability.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white dark:bg-white/5 border border-indigo-100 dark:border-indigo-500/20 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-sm">
             <div className="flex flex-col">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Banner</span>
               <span className="text-xs font-bold text-indigo-600 truncate max-w-[200px]">{announcement}</span>
             </div>
             <button onClick={() => {
               setEditingItem({ isAnnouncement: true });
               setFormData({ siteAnnouncement: announcement, isAnnouncement: true });
               setIsModalOpen(true);
             }} className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition-all">
               <Edit2 size={16} />
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Category Navigation */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-3 rounded-[2rem] space-y-1 shadow-sm">
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

          <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-4 rounded-[2rem] shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 px-2">Sub-Categories</div>
            <div className="space-y-1">
              {subCategories[activeCategory].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSub(sub)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeSub === sub 
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="capitalize">{sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-3 rounded-2xl shadow-sm">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search menu items..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="text-xs font-bold text-gray-500 px-4">{items.length} Items Found</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm rounded-[2rem] overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                <div className="h-40 overflow-hidden relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${item.isAvailable !== false ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                      {item.isAvailable !== false ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h4 className={`text-base font-black truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.name}</h4>
                    <div className="text-sm font-black text-indigo-600 dark:text-indigo-400 whitespace-nowrap">PKR {Number(item.price).toLocaleString()}</div>
                  </div>
                  <p className="text-[10px] text-gray-500 line-clamp-2 mb-6 leading-relaxed min-h-[2.5rem]">{item.description}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-white/5">
                    <div className="flex gap-1 w-full">
                      <button onClick={() => handleEdit(item)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 transition-all">
                        <Edit2 size={12} /> Edit Price & Stock
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-black">{editingItem ? 'Edit Dish' : 'Add New Dish'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-xl bg-gray-50 dark:bg-white/5"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {formData.isAnnouncement ? (
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Site-Wide Announcement (Top Banner)</label>
                  <textarea 
                    value={formData.siteAnnouncement} 
                    onChange={e => setFormData({...formData, siteAnnouncement: e.target.value})} 
                    className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none outline-none text-sm h-32 font-bold ring-2 ring-indigo-500/10 focus:ring-indigo-500 transition-all" 
                    placeholder="e.g. We are closed today for a private event. See you tomorrow!" 
                  />
                  <p className="mt-2 text-[10px] text-gray-400 font-medium">This will appear at the top of every page on the main website.</p>
                </div>
              ) : (
                <>
                  <div className="bg-gray-50 dark:bg-white/5 p-5 rounded-3xl mb-4 border border-indigo-50 dark:border-white/5">
                    <h4 className="font-black text-indigo-600 text-lg mb-1">{formData.name}</h4>
                    <p className="text-xs text-gray-500 leading-tight">{formData.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Current Price (PKR)</label>
                      <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none outline-none font-bold ring-2 ring-indigo-500/5 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Stock Availability</label>
                      <select value={formData.isAvailable} onChange={e => setFormData({...formData, isAvailable: e.target.value === 'true'})} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none outline-none font-bold text-xs ring-2 ring-indigo-500/5 focus:ring-indigo-500">
                        <option value="true">In Stock (Available)</option>
                        <option value="false">Out of Stock (Sold Out)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Cancel</button>
              <button onClick={() => formData.isAnnouncement ? saveAnnouncement(formData.siteAnnouncement) : saveOverride(formData)} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-black flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
                <Save size={16} /> {formData.isAnnouncement ? 'Update Banner' : 'Sync to Website'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
