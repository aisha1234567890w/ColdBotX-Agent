import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Gift, 
  ChefHat, 
  ArrowRight,
  LogOut,
  User as UserIcon,
  Bell,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Crown,
  Settings,
  Search,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDataAndReservations = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (!storedUser) {
        navigate('/login');
        return;
      }
      setUser(storedUser);

      try {
        const { data, error } = await supabase
          .from('reservations_main')
          .select('*')
          .eq('email', storedUser.email)
          .order('date', { ascending: false });

        if (error) throw error;
        setReservations(data || []);
      } catch (err) {
        console.error("Error fetching reservations:", err);
      } finally {
        setTimeout(() => setLoading(false), 1200); // Luxury wait
      }
    };
    fetchUserDataAndReservations();
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.clear();
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#030712] overflow-hidden">
        {/* Animated Background Blobs for Loader */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 rounded-[2.5rem] border-[3px] border-indigo-100/50 dark:border-indigo-900/30"
            ></motion.div>
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-24 h-24 rounded-[2.5rem] border-t-[3px] border-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
            ></motion.div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-black uppercase tracking-[0.4em] text-gray-900 dark:text-white mb-2">Aifur</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500 animate-pulse">Crafting your luxury experience</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#030712] transition-colors duration-1000 relative overflow-hidden">
      
      {/* Abstract Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 relative z-10">
        
        {/* Superior Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-16">
          <div className="flex items-center gap-6 group">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-indigo-500/40 group-hover:rotate-6 transition-transform duration-500">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-4 border-white dark:border-[#030712] rounded-full flex items-center justify-center">
                <CheckCircle2 size={14} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-2">
                Welcome, {user?.name?.split(' ')[0]}
              </h1>
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                <Crown size={12} className="text-amber-500" /> Platinum Member since 2026
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
             <div className="flex items-center bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl px-4 py-2 shadow-sm">
               <Search size={16} className="text-gray-400 mr-2" />
               <input type="text" placeholder="Search your history..." className="bg-transparent border-none focus:outline-none text-xs font-bold w-40" />
             </div>
             <div className="flex gap-3">
               <button className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-500 hover:text-indigo-600 transition-all shadow-sm">
                 <Bell size={20} />
               </button>
               <button className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-500 hover:text-indigo-600 transition-all shadow-sm">
                 <Settings size={20} />
               </button>
             </div>
          </div>
        </div>

        {/* The Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          
          {/* Virtual Membership Card (Large) */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="lg:col-span-2 xl:col-span-2 bg-gray-900 dark:bg-[#111827] rounded-[3rem] p-10 text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col justify-between h-[400px]"
          >
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
              <div className="absolute top-[-20%] right-[-10%] w-80 h-80 bg-indigo-600/20 rounded-full blur-[80px]"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-purple-600/10 rounded-full blur-[60px]"></div>
              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            </div>

            <div className="flex justify-between items-start relative z-10">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-2">Aifur Elite Pass</span>
                <div className="text-2xl font-black italic tracking-tighter">PLATINUM LEVEL</div>
              </div>
              <div className="w-14 h-10 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 flex items-center justify-center overflow-hidden">
                <div className="w-6 h-6 bg-amber-500/40 rounded-full -mr-2"></div>
                <div className="w-6 h-6 bg-amber-600/40 rounded-full"></div>
              </div>
            </div>

            <div className="relative z-10">
               <div className="text-3xl font-mono tracking-[0.2em] mb-10 text-gray-300">
                 **** **** **** {user?.id?.slice(-4) || '2026'}
               </div>
               <div className="flex justify-between items-end">
                 <div>
                   <div className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Card Holder</div>
                   <div className="text-lg font-black tracking-tight">{user?.name?.toUpperCase()}</div>
                 </div>
                 <div className="text-right">
                   <div className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Reward Points</div>
                   <div className="text-3xl font-black text-indigo-400 tracking-tighter leading-none">1,240</div>
                 </div>
               </div>
            </div>
          </motion.div>

          {/* Quick Action: New Reservation */}
          <Link 
            to="/reservations"
            className="group relative bg-white dark:bg-gray-900/50 backdrop-blur-xl rounded-[3rem] p-10 border border-gray-100 dark:border-white/5 shadow-2xl flex flex-col justify-between h-[400px] transition-all hover:bg-indigo-600 dark:hover:bg-indigo-600"
          >
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
              <Plus size={32} />
            </div>
            <div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4 group-hover:text-white transition-colors tracking-tighter">Reserve a <br/>Table</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed group-hover:text-indigo-100 transition-colors">Experience the cross-cultural magic of Aifur today.</p>
            </div>
            <ArrowRight size={24} className="text-gray-300 group-hover:text-white group-hover:translate-x-2 transition-all" />
          </Link>

          {/* Points Progress (Small) */}
          <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl rounded-[3rem] p-10 border border-gray-100 dark:border-white/5 shadow-xl flex flex-col justify-between h-[400px]">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8">Points Progress</h4>
              <div className="relative w-32 h-32 mx-auto mb-8">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle className="text-gray-100 dark:text-gray-800" strokeWidth="10" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                  <circle className="text-indigo-600" strokeWidth="10" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * 75) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-gray-900 dark:text-white">75%</span>
                </div>
              </div>
              <p className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">250 pts to Gold Tier</p>
            </div>
            <button className="w-full py-4 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
              Redeem Now
            </button>
          </div>

          {/* Latest Reservation (Large) */}
          <div className="lg:col-span-3 xl:col-span-3 bg-white dark:bg-gray-900/50 backdrop-blur-xl rounded-[3rem] p-10 md:p-12 border border-gray-100 dark:border-white/5 shadow-2xl min-h-[400px]">
            <div className="flex items-center justify-between mb-12">
               <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Your Next Experience</h2>
               <div className="flex gap-2">
                 <button className="p-2 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><Settings size={16} /></button>
               </div>
            </div>

            {reservations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-black text-indigo-500 uppercase">{new Date(reservations[0].date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-2xl font-black text-gray-900 dark:text-white">{new Date(reservations[0].date).getDate()}</span>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Confirmed Date</div>
                      <div className="text-lg font-black text-gray-900 dark:text-white">{new Date(reservations[0].date).toLocaleDateString(undefined, { weekday: 'long' })}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl">
                       <div className="flex items-center gap-2 text-indigo-500 mb-2 font-black text-[10px] uppercase tracking-widest">
                         <Clock size={12} /> Time
                       </div>
                       <div className="text-lg font-black text-gray-900 dark:text-white">{reservations[0].time}</div>
                    </div>
                    <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl">
                       <div className="flex items-center gap-2 text-indigo-500 mb-2 font-black text-[10px] uppercase tracking-widest">
                         <Users size={12} /> Size
                       </div>
                       <div className="text-lg font-black text-gray-900 dark:text-white">{reservations[0].guests} People</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div className="p-6 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-3xl border border-emerald-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Ready for Service</span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                      We've prepared your table in the Nordic Lounge. Your preferences have been shared with Chef Ayesha.
                    </p>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button className="flex-1 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform">Get Directions</button>
                    <button className="flex-1 py-4 border border-gray-200 dark:border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-500">Cancel</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                   <AlertCircle size={32} className="text-gray-300" />
                </div>
                <p className="text-gray-500 font-bold text-sm">No upcoming bookings found.</p>
              </div>
            )}
          </div>

          {/* Chef's Curated Recommendation */}
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-[2000ms]">
               <img src="https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" />
             </div>
             <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <ChefHat className="text-indigo-300 mb-6" size={32} />
                  <h3 className="text-2xl font-black tracking-tight mb-4">Chef's Pick for You</h3>
                  <p className="text-indigo-100 text-sm font-medium leading-relaxed mb-8">
                    Based on your previous visit, you'll love our Smoked Nordic Masala Salmon.
                  </p>
                </div>
                <button className="w-fit px-6 py-3 bg-white text-indigo-600 rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform shadow-xl">
                  Add to Booking
                </button>
             </div>
          </div>

          {/* End Session Button (Fixed) */}
          <div className="lg:col-span-4 xl:col-span-4 mt-8">
             <button 
              onClick={handleLogout}
              className="w-full py-8 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[2.5rem] flex items-center justify-center gap-4 group transition-all hover:bg-red-500 hover:border-red-500"
             >
               <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 group-hover:bg-white group-hover:text-red-500 transition-colors">
                 <LogOut size={20} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 group-hover:text-white transition-colors">Securely End Session</span>
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}