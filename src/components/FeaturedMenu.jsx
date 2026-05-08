import { Link } from 'react-router-dom';
import { menuData } from '../data/menu';
import { motion } from 'framer-motion';

export default function FeaturedMenu() {
  // Pick different items based on the day
  const day = new Date().getDate();
  
  const swedishItem = menuData.swedish.mains[day % menuData.swedish.mains.length];
  const pakistaniItem = menuData.pakistani.bbq[day % menuData.pakistani.bbq.length];
  const fusionItem = menuData.fusion.mains[day % menuData.fusion.mains.length];

  const featuredItems = [
    { ...swedishItem, tag: 'Nordic Classic', delay: 0.1 },
    { ...pakistaniItem, tag: 'Indus Grill', delay: 0.2 },
    { ...fusionItem, tag: 'Signature Fusion', delay: 0.3 }
  ];

  return (
    <section className="pb-16 md:pb-32 pt-12 bg-white dark:bg-gray-950 transition-colors relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4"
            >
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
              Live from the Kitchen
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-tight"
            >
              Chef's <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Recommendations</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 dark:text-gray-400 font-medium"
            >
              Our daily curated selection of the finest cross-cultural masterpieces.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/menu">
              <button className="group relative px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gray-200 dark:shadow-none overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  View Full Menu
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {featuredItems.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: item.delay }}
              className="group cursor-pointer relative"
            >
              <div className="relative h-[350px] sm:h-[450px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden mb-6 md:mb-8 shadow-2xl transition-all duration-500 group-hover:shadow-indigo-500/20 group-hover:-translate-y-2">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                />
                
                {/* Image Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                
                {/* Floating Tag */}
                <div className="absolute top-6 left-6">
                  <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest">
                    {item.tag}
                  </div>
                </div>

                {/* Content Overlay (Visible on Hover) */}
                <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white/90 text-sm font-medium leading-relaxed mb-6 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="h-1 w-0 bg-indigo-500 group-hover:w-full transition-all duration-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="px-2">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
                    {item.name}
                  </h3>
                  <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    <span className="text-xs mr-1 opacity-50 font-medium tracking-normal text-gray-500">PKR</span>
                    {item.price.toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Freshly Prepared
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
