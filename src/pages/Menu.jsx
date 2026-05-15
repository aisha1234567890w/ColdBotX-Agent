import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { menuData } from '../data/menu';

const CategorySection = ({ title, items = [] }) => {
  if (!items || items.length === 0) return null;
  
  return (
    <section className="mb-16">
      <h3 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white border-b-2 border-indigo-500 inline-block pb-2">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, index) => (
          <div 
            key={`${item.name}-${index}`} 
            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
          >
            <div className="h-48 overflow-hidden relative">
              <img 
                src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              {item.spiceLevel > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  Spice: {item.spiceLevel}/5
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{item.name}</h4>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  PKR {(item.price || 0).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {item.isGlutenFree && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded uppercase font-bold">Gluten Free</span>}
                {item.isLactoseFree && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded uppercase font-bold">Lactose Free</span>}
                {item.containsDairy && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded uppercase font-bold">Contains Dairy</span>}
                {item.containsNuts && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded uppercase font-bold">Contains Nuts</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default function Menu() {
  const [activeTab, setActiveTab] = useState('swedish');
  const [localMenuData, setLocalMenuData] = useState(menuData);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('aifur_menu_override');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Basic validation to ensure structure exists
        if (parsed && typeof parsed === 'object') {
          setLocalMenuData(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to load menu overrides:", err);
      setError("Some of your local settings couldn't be loaded. Falling back to default menu.");
    }
  }, []);

  const resetMenu = () => {
    localStorage.removeItem('aifur_menu_override');
    setLocalMenuData(menuData);
    setError(null);
    window.location.reload();
  };

  if (!localMenuData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Menu...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-12 pb-24 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-4 px-2">
            Our Culinary Canvas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            From the serene fjords of Sweden to the vibrant streets of Pakistan, 
            explore our carefully curated selection of authentic and fusion dishes.
          </p>
          {error && (
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl text-sm font-medium">
              {error} <button onClick={resetMenu} className="underline font-bold ml-2">Reset Menu</button>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 md:flex md:justify-center gap-3 md:gap-4 mb-12 px-2">
          {['swedish', 'pakistani', 'fusion', 'deals'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-8 py-3 md:py-3 rounded-2xl md:rounded-full font-bold transition-all duration-300 text-sm md:text-base ${
                activeTab === tab 
                  ? 'bg-indigo-600 text-white shadow-xl scale-[1.02] md:scale-105' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Menu Content */}
        <div className="animate-fade-in min-h-[400px]">
          {activeTab === 'swedish' && localMenuData.swedish && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <CategorySection title="Starters" items={localMenuData.swedish.starters} />
              <CategorySection title="Mains" items={localMenuData.swedish.mains} />
              <CategorySection title="Desserts" items={localMenuData.swedish.desserts} />
              <CategorySection title="Beverages" items={localMenuData.swedish.beverages} />
            </motion.div>
          )}

          {activeTab === 'pakistani' && localMenuData.pakistani && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <CategorySection title="Starters" items={localMenuData.pakistani.starters} />
              <CategorySection title="BBQ" items={localMenuData.pakistani.bbq} />
              <CategorySection title="Mains" items={localMenuData.pakistani.mains} />
              <CategorySection title="Rice" items={localMenuData.pakistani.rice} />
              <CategorySection title="Bread" items={localMenuData.pakistani.bread} />
              <CategorySection title="Desserts" items={localMenuData.pakistani.desserts} />
              <CategorySection title="Beverages" items={localMenuData.pakistani.beverages} />
            </motion.div>
          )}

          {activeTab === 'fusion' && localMenuData.fusion && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <CategorySection title="Starters" items={localMenuData.fusion.starters} />
              <CategorySection title="Mains" items={localMenuData.fusion.mains} />
              <CategorySection title="Rice" items={localMenuData.fusion.rice} />
              <CategorySection title="Desserts" items={localMenuData.fusion.desserts} />
              <CategorySection title="Beverages" items={localMenuData.fusion.beverages} />
            </motion.div>
          )}

          {activeTab === 'deals' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <CategorySection title="Value Deals" items={localMenuData.deals} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
