import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors selection:bg-indigo-500/30">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-gray-950">
        <img 
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000" 
          alt="Restaurant Ambiance" 
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        {/* Darker overlay for better text legibility */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-600/30 border border-indigo-400/30 text-indigo-100 text-xs font-black uppercase tracking-widest mb-8 backdrop-blur-md">
              Our Journey & Heritage
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              The Art of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Fusion</span>
            </h1>
            <p className="text-xl md:text-2xl text-white font-semibold max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Aifur is where Scandinavian minimalism meets the vibrant, 
              soul-stirring spices of the Indus Valley.
            </p>
          </motion.div>
        </div>
        {/* Gradient that doesn't wash out the bottom text */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50 dark:to-gray-950"></div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-indigo-900 dark:text-indigo-300 font-black tracking-[0.2em] uppercase text-xs">Philosophy</h2>
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                  Two Worlds, <br />One Singular Vision.
                </h3>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                In the heart of Stockholm, we learned the importance of quality and simplicity. 
                In the bustling streets of Lahore, we discovered the magic of complex aromatics. 
                Aifur is the bridge between these two extremes.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl">
                  <div className="text-3xl mb-4">🇸🇪</div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Nordic Precision</h4>
                  <p className="text-sm text-gray-500">Freshness, balance, and the art of 'Lagom'.</p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl">
                  <div className="text-3xl mb-4">🇵🇰</div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Indus Soul</h4>
                  <p className="text-sm text-gray-500">Bold spices and the warmth of hospitality.</p>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <img 
                src="/images/fusion-special.png" 
                alt="Chef's Special Fusion Dish" 
                className="relative rounded-[2rem] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] border-4 border-white dark:border-gray-800 w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Story Sections - Alternating */}
      <section className="py-24 bg-white dark:bg-gray-900/50 transition-colors">
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          {/* Nordic Inspiration */}
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 order-2 md:order-1">
              <img 
                src="https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?auto=format&fit=crop&q=80&w=1000" 
                alt="Nordic landscape" 
                className="rounded-3xl shadow-xl border-8 border-white dark:border-gray-800"
              />
            </div>
            <div className="flex-1 space-y-6 order-1 md:order-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">The Viking Legacy</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                Named after the legendary Viking ship, Aifur embodies the spirit of exploration. 
                Our journey began with a simple question: Can the clean flavors of the north 
                harmonize with the fiery heat of the east? The answer lies in our kitchen.
              </p>
              <div className="pt-4">
                <blockquote className="border-l-4 border-indigo-500 pl-6 italic text-gray-500 dark:text-gray-400">
                  "Food is the only universal language that needs no translation, only an open heart and a hungry soul."
                </blockquote>
              </div>
            </div>
          </div>

          {/* Fusion Innovation */}
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">A New Culinary Map</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                We don't just mix ingredients; we curate experiences. From our signature 
                Masala Swedish Meatballs to our Dill-infused Karahis, every dish is a 
                carefully crafted bridge across two continents.
              </p>
              <ul className="space-y-4">
                {[
                  'Hand-picked spices from local markets',
                  'Sustainably sourced Atlantic seafood',
                  'Traditional slow-cooking techniques',
                  'Modern presentation with a desi heart'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1">
              <div className="relative group overflow-hidden rounded-3xl shadow-xl border-8 border-white dark:border-gray-800">
                <img 
                  src="/images/fusion-innovation.png" 
                  alt="Fusion Innovation Dish" 
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent flex items-end p-8">
                  <p className="text-white font-medium text-lg">Where every bite tells a story of two worlds.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-indigo-900 py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: 'Years of Passion', value: '10+' },
              { label: 'Signature Dishes', value: '25+' },
              { label: 'Happy Guests', value: '50k+' },
              { label: 'Expert Chefs', value: '12' },
            ].map((stat, i) => (
              <div key={i} className="text-white">
                <div className="text-5xl font-black mb-2 tracking-tight">{stat.value}</div>
                <div className="text-indigo-200 text-sm font-bold uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 text-center px-6">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Ready to taste the journey?</h2>
        <div className="flex justify-center gap-6">
          <Link to="/reservations">
            <button className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none">
              Book Your Table
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
