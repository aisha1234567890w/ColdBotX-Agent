import { useState } from 'react';
import { menuData } from '../data/menu';

const CategorySection = ({ title, items }) => (
  <section className="mb-16">
    <h3 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white border-b-2 border-indigo-500 inline-block pb-2">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item, index) => (
        <div 
          key={index} 
          className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
        >
          <div className="h-48 overflow-hidden relative">
            <img 
              src={item.image} 
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
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">PKR {item.price.toLocaleString()}</span>
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

export default function Menu() {
  const [activeTab, setActiveTab] = useState('swedish');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-12 pb-24 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-4 px-2">
            Aifur Culinary Menu
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            From the serene fjords of Sweden to the vibrant streets of Pakistan, 
            explore our carefully curated selection of authentic and fusion dishes.
          </p>
        </div>

        {/* Tab Navigation - 2x2 Grid on Mobile, Row on Desktop */}
        <div className="grid grid-cols-2 md:flex md:justify-center gap-3 md:gap-4 mb-12 px-2">
          {['swedish', 'pakistani', 'fusion', 'deals'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-8 py-3 md:py-3 rounded-2xl md:rounded-full font-bold transition-all duration-300 text-sm md:text-base ${
                activeTab === tab 
                  ? 'bg-red-600 text-white shadow-xl scale-[1.02] md:scale-105' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-2 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 shadow-sm'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Menu Content */}
        <div className="animate-fade-in">
          {activeTab === 'swedish' && (
            <>
              <CategorySection title="Swedish Starters" items={menuData.swedish.starters} />
              <CategorySection title="Classic Swedish Mains" items={menuData.swedish.mains} />
              <CategorySection title="Swedish Desserts" items={menuData.swedish.desserts} />
              <CategorySection title="Swedish Beverages" items={menuData.swedish.beverages} />
            </>
          )}
          {activeTab === 'pakistani' && (
            <>
              <CategorySection title="Desi Starters" items={menuData.pakistani.starters} />
              <CategorySection title="BBQ & Grills" items={menuData.pakistani.bbq} />
              <CategorySection title="Traditional Curries" items={menuData.pakistani.mains} />
              <CategorySection title="Rice & Bread" items={[...menuData.pakistani.rice, ...menuData.pakistani.bread]} />
              <CategorySection title="Desi Desserts" items={menuData.pakistani.desserts} />
              <CategorySection title="Desi Beverages" items={menuData.pakistani.beverages} />
            </>
          )}
          {activeTab === 'fusion' && (
            <>
              <CategorySection title="Fusion Starters" items={menuData.fusion.starters} />
              <CategorySection title="Fusion Mains" items={menuData.fusion.mains} />
              <CategorySection title="Fusion Rice & Bowls" items={menuData.fusion.rice} />
              <CategorySection title="Fusion Desserts" items={menuData.fusion.desserts} />
              <CategorySection title="Fusion Beverages" items={menuData.fusion.beverages} />
            </>
          )}
          {activeTab === 'deals' && (
            <CategorySection title="Exclusive Deals & Combos" items={menuData.deals} />
          )}
        </div>
      </div>
    </div>
  );
}
