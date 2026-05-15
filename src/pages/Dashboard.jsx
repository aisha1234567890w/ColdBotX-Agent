import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { menuData } from "../data/menu";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ChefHat, 
  ArrowRight,
  LogOut,
  Sparkles,
  Utensils,
  ShoppingBag,
  Star,
  Gift,
  HelpCircle,
  Truck,
  CreditCard,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (!storedUser) { navigate('/login'); return; }
      setUser(storedUser);

      try {
        const { data, error } = await supabase
          .from('reservations_main')
          .select('*')
          .eq('email', storedUser.email)
          .order('date', { ascending: false });
        
        if (error) throw error;
        setReservations(data || []);
        setIsFirstTime((data || []).length === 0);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.clear();
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Real data from menuData for "Popular Picks"
  const popularPicks = [
    { ...menuData.swedish.mains[0], category: 'Swedish Favorite' },
    { ...menuData.pakistani.mains[0], category: 'Indus Special' },
    { ...menuData.fusion.mains[0], category: 'Signature Fusion' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-bold animate-pulse tracking-widest uppercase text-[10px]">Curating your Aifur Experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      
      {/* 1. Welcome Banner */}
      <section className="bg-white dark:bg-gray-900 pt-32 pb-12 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2"
            >
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                👋 Welcome to Aifur, <span className="text-indigo-600 dark:text-indigo-400">{user?.name?.split(' ')[0]}!</span>
              </h1>
              <p className="text-gray-500 font-medium">Let's get you started with a premium dining experience.</p>
            </motion.div>
            
            {user?.role === 'manager' && (
              <Link 
                to="/admin-ops" 
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all"
              >
                <Sparkles size={16} /> Enter Ops Center
              </Link>
            )}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        
        {/* 2. Welcome Offer / Recent Activity */}
        <AnimatePresence mode="wait">
          {isFirstTime ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden group rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-purple-700 p-8 md:p-12 text-white shadow-2xl"
            >
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="max-w-xl text-center md:text-left">
                  <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">First Order Reward</span>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">🎉 Get 20% OFF your first culinary journey!</h2>
                  <p className="text-indigo-100 text-lg font-medium mb-8">Use code <span className="bg-white/20 px-3 py-1 rounded-lg font-mono">WELCOME20</span> at checkout.</p>
                  <button className="px-10 py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl">Claim Your Offer</button>
                </div>
                <div className="hidden lg:block relative">
                   <div className="w-64 h-64 bg-white/10 rounded-full animate-pulse blur-3xl absolute -inset-4"></div>
                   <Gift size={180} className="text-white/20 relative" />
                </div>
              </div>
              {/* Decorative shapes */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl"></div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-center mb-8 relative z-10">
                  <h3 className="text-xl font-black flex items-center gap-3">
                    <Calendar className="text-indigo-600" /> Recent Reservation
                  </h3>
                  <Link to="/reservations" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">View All</Link>
                </div>
                {reservations[0] && (
                  <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                    <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shadow-lg">
                      <img src="https://images.unsplash.com/photo-1550966841-3ecfcdac896a?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Table" />
                    </div>
                    <div className="flex-1 space-y-2 text-center md:text-left">
                      <div className="text-3xl font-black text-indigo-600">
                        {new Date(reservations[0].date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} <span className="text-gray-400 font-medium">@</span> {reservations[0].time}
                      </div>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Users size={14} /> {reservations[0].guests} Guests</span>
                        <span className="flex items-center gap-1"><MapPin size={14} /> Main Lounge</span>
                      </div>
                      <div className="pt-4 flex gap-3 justify-center md:justify-start">
                        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">Confirmed</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-center items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 shadow-xl shadow-amber-500/10">
                  <Star size={32} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Aifur Rewards</h4>
                  <div className="text-4xl font-black">1,250 <span className="text-sm font-bold text-gray-500">Pts</span></div>
                </div>
                <p className="text-[10px] text-gray-500 font-medium px-4">You're 250 points away from a FREE signature appetizer!</p>
                <button className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black text-[10px] uppercase tracking-widest">Rewards Store</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Quick Actions */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'View Menu', icon: Utensils, to: '/menu', color: 'bg-indigo-500' },
            { label: 'Reserve Table', icon: Calendar, to: '/reservations', color: 'bg-amber-500' },
            { label: 'Our Story', icon: ChefHat, to: '/about', color: 'bg-purple-500' },
            { label: 'Get Support', icon: HelpCircle, to: '/contact', color: 'bg-emerald-500' },
          ].map((action) => (
            <Link 
              key={action.label} 
              to={action.to}
              className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col items-center gap-4 text-center"
            >
              <div className={`p-4 rounded-2xl ${action.color} text-white shadow-lg shadow-black/5 group-hover:scale-110 transition-transform`}>
                <action.icon size={24} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-300">{action.label}</span>
            </Link>
          ))}
        </section>

        {/* 4. Popular Dishes / Your Cart */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-black tracking-tight mb-1">🔥 Popular Right Now</h3>
                <p className="text-gray-500 text-sm font-medium">Most ordered by our regular patrons.</p>
              </div>
              <Link to="/menu" className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:translate-x-1 transition-transform">
                Browse Full Menu <ChevronRight size={14} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularPicks.map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all group">
                  <div className="h-32 overflow-hidden relative">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                    <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur shadow-sm rounded-lg text-[8px] font-black uppercase tracking-widest text-indigo-600">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-black text-sm mb-1 truncate">{item.name}</h4>
                    <div className="text-indigo-600 dark:text-indigo-400 font-bold text-xs mb-4">PKR {item.price.toLocaleString()}</div>
                    <button className="w-full py-2 bg-gray-50 dark:bg-white/5 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">Add to Favorites</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-black tracking-tight mb-8 flex items-center gap-3">
              <ShoppingBag className="text-indigo-600" /> Your Cart
            </h3>
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm text-center py-16">
               <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                 <ShoppingBag size={32} />
               </div>
               <h4 className="text-sm font-black mb-2 uppercase tracking-widest">Your cart is empty</h4>
               <p className="text-xs text-gray-500 font-medium mb-8">Ready to taste the fusion?</p>
               <Link to="/menu" className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-500/20">👉 Browse Menu</Link>
            </div>
          </div>
        </section>

        {/* 5. Onboarding Tips / Info */}
        <section className="bg-white dark:bg-gray-900 rounded-[3rem] p-10 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
               <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-2xl"><MapPin size={24} /></div>
               <div>
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Check Delivery</h4>
                 <p className="text-xs font-bold">Wah Cantt & Environs</p>
               </div>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
               <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-2xl"><Truck size={24} /></div>
               <div>
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Avg Time</h4>
                 <p className="text-xs font-bold">25 - 35 Minutes</p>
               </div>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
               <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 rounded-2xl"><CreditCard size={24} /></div>
               <div>
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Payment</h4>
                 <p className="text-xs font-bold">Online or COD</p>
               </div>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
               <div className="p-3 bg-purple-50 dark:bg-purple-500/10 text-purple-600 rounded-2xl"><CheckCircle2 size={24} /></div>
               <div>
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Loyalty Perk</h4>
                 <p className="text-xs font-bold">2x Points on 1st order!</p>
               </div>
            </div>
          </div>
        </section>

        {/* Global Control: Logout */}
        <div className="flex justify-center pt-12">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-8 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <LogOut size={16} /> End Session
          </button>
        </div>

      </main>
    </div>
  );
}
