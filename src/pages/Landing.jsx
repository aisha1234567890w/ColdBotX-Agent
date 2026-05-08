import RestaurantHero from '../components/RestaurantHero';
import FeaturedMenu from '../components/FeaturedMenu';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const WhyAifur = () => {
  return (
    <section className="py-32 bg-white dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-indigo-600 dark:text-indigo-400 font-black tracking-[0.4em] uppercase text-xs mb-4 block"
            >
              The Aifur Experience
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-[1.1]"
            >
              Mastering the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Art of Fusion.</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 dark:text-gray-400 font-medium max-w-xs"
          >
            Where Scandinavian minimalism meets the soul of the Indus.
          </motion.p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 h-auto md:h-[850px]">
          
          {/* Main Story Box (Large) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-8 relative rounded-[2rem] md:rounded-[3rem] overflow-hidden group shadow-2xl min-h-[400px] md:min-h-0"
          >
            <img 
              src="/images/philosophy-fusion.png" 
              alt="Fusion Dish" 
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12 md:right-12 text-white">
              <h3 className="text-2xl md:text-4xl font-black mb-3 md:mb-4">The Secret of Aifur</h3>
              <p className="text-lg text-white/80 font-medium max-w-xl">
                The most daring flavors happen when precision meets passion. 
                We source the finest Nordic salmon and pair it with organic Indus spices.
              </p>
            </div>
          </motion.div>

          {/* New Visual Spotlight Box (Replacing the Stat Box) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-4 relative rounded-[2rem] md:rounded-[3rem] overflow-hidden group shadow-2xl min-h-[300px] md:min-h-0"
          >
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800" 
              alt="Culinary Detail" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-indigo-600/20 mix-blend-multiply group-hover:bg-transparent transition-colors"></div>
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="text-white font-black text-2xl uppercase tracking-tighter leading-none opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-500">
                  Precision <br /> Meets <br /> Soul
                </div>
              </div>
            </div>
          </motion.div>

          {/* Roots Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 bg-gray-50 dark:bg-gray-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 group relative overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800"
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-2xl shadow-lg border border-gray-100 dark:border-gray-700">🇸🇪</div>
              <div className="space-y-2">
                <h4 className="text-2xl font-black text-gray-900 dark:text-white">Nordic Roots</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Minimalist precision & fresh Atlantic sourcing.</p>
              </div>
            </div>
          </motion.div>

          {/* Indus Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-4 bg-gray-50 dark:bg-gray-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 group relative overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800"
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-2xl shadow-lg border border-gray-100 dark:border-gray-700">🇵🇰</div>
              <div className="space-y-2">
                <h4 className="text-2xl font-black text-gray-900 dark:text-white">Indus Soul</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Vibrant aromatics & soul-stirring spices.</p>
              </div>
            </div>
          </motion.div>

          {/* CTA Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-4 bg-gray-900 dark:bg-indigo-600 rounded-[2rem] md:rounded-[3rem] p-8 flex items-center justify-center group shadow-2xl relative overflow-hidden min-h-[150px] md:min-h-0"
          >
            <Link to="/about" className="relative z-10 text-center">
              <div className="text-white font-black text-2xl mb-2 group-hover:scale-105 transition-transform">Explore Our Story</div>
              <div className="text-white/60 text-xs font-bold uppercase tracking-widest">About Aifur</div>
            </Link>
            <div className="absolute inset-0 bg-indigo-600 dark:bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default function Landing() {
  return (
    <div className="overflow-hidden">
      <RestaurantHero />
      <WhyAifur />
      <FeaturedMenu />
    </div>
  );
}
