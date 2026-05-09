import { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, Search, Plus, MoreVertical, Edit2, Trash2, Eye, 
  Flame, RefreshCcw, Save
} from 'lucide-react';
import { menuData as defaultMenuData } from '../../data/menu';
import { useTheme } from '../../context/ThemeContext';

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
    name: '', description: '', price: 0, image: '', isAvailable: true, spiceLevel: 0
  });

  useEffect(() => {
    // Load from localStorage or fallback to default
    const saved = localStorage.getItem('aifur_menu_override');
    if (saved) {
      setMenuState(JSON.parse(saved));
    } else {
      setMenuState(defaultMenuData);
      localStorage.setItem('aifur_menu_override', JSON.stringify(defaultMenuData));
    }
  }, []);

  const saveMenu = (newState) => {
    setMenuState(newState);
    localStorage.setItem('aifur_menu_override', JSON.stringify(newState));
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

  const handleDelete = (itemId) => {
    if (!confirm('Are you sure you want to delete this dish? It will be removed from the main website.')) return;
    
    const newState = JSON.parse(JSON.stringify(menuState));
    if (activeCategory === 'deals') {
      newState.deals = newState.deals.filter(i => i.id !== itemId);
    } else {
      newState[activeCategory][activeSub] = newState[activeCategory][activeSub].filter(i => i.id !== itemId);
    }
    saveMenu(newState);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      id: `item_${Date.now()}`,
      name: '', description: '', price: 0, 
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', 
      isAvailable: true, spiceLevel: 0
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = () => {
    const newState = JSON.parse(JSON.stringify(menuState));
    
    if (editingItem) {
      // Update existing
      if (activeCategory === 'deals') {
        newState.deals = newState.deals.map(i => i.id === formData.id ? formData : i);
      } else {
        newState[activeCategory][activeSub] = newState[activeCategory][activeSub].map(i => i.id === formData.id ? formData : i);
      }
    } else {
      // Add new
      if (activeCategory === 'deals') {
        newState.deals.push(formData);
      } else {
        if (!newState[activeCategory][activeSub]) newState[activeCategory][activeSub] = [];
        newState[activeCategory][activeSub].push(formData);
      }
    }
    
    saveMenu(newState);
    setIsModalOpen(false);
  };

  const items = getItems();

  if (!menuState) return <div className="p-8 text-center">Loading Menu Data...</div>;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Menu Inventory</h1>
          <p className="text-gray-500 font-medium">Any edits here immediately sync to the main Aifur website.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleAddNew} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">
            <Plus size={16} />
            Add New Dish
          </button>
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
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(item)} className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                        <Trash2 size={14} />
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
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Dish Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border-none outline-none font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border-none outline-none text-sm h-24" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Price (PKR)</label>
                  <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border-none outline-none font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Image URL</label>
                  <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border-none outline-none text-xs" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white">Cancel</button>
              <button onClick={handleSaveModal} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-black flex items-center gap-2"><Save size={16} /> Save Dish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
