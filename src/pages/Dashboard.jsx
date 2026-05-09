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
  AlertCircle
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
        setTimeout(() => setLoading(false), 800); // Smooth transition
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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#030712]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl border-4 border-indigo-100 dark:border-indigo-900/30 animate-pulse"></div>
            <div className="absolute inset-0 w-16 h-16 rounded-2xl border-t-4 border-indigo-600 animate-spin"></div>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-900 dark:text-white mb-2">Aifur</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Personalizing your experience...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#030712] pt-8 pb-32 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile & Notifications Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-indigo-500/20">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                Hello, {user?.name?.split(' ')[0]}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-sm tracking-wide">Elite Member since May 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-500 hover:text-indigo-600 transition-colors shadow-sm">
               <Bell size={20} />
             </button>
             <Link to="/reservations" className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform shadow-xl shadow-black/10 dark:shadow-white/5">
               New Reservation
             </Link>
          </div>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Main Content Area (8 columns) */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* Active Bookings Card */}
            <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-gray-100 dark:border-white/5 shadow-2xl shadow-indigo-500/5">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Your Culinary Journey</h2>
                  <p className="text-sm font-medium text-gray-500">Manage your upcoming visits and history</p>
                </div>
                <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  {reservations.length} Bookings
                </div>
              </div>

              {reservations.length > 0 ? (
                <div className="space-y-6">
                  {reservations.map((res, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      key={res.id} 
                      className="group relative bg-gray-50/50 dark:bg-white/[0.02] hover:bg-white dark:hover:bg-white/[0.05] border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 md:p-8 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer"
                    >
                      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-8 w-full md:w-auto">
                          <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-2xl shadow-lg flex flex-col items-center justify-center border border-gray-100 dark:border-white/10 shrink-0">
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{new Date(res.date).toLocaleString('default', { month: 'short' })}</span>
                            <span className="text-3xl font-black text-gray-900 dark:text-white">{new Date(res.date).getDate()}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{res.guests} Guests</h3>
                              <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                                res.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                              }`}>
                                {res.status || 'Pending'}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-500 uppercase tracking-tight">
                              <span className="flex items-center gap-2"><Clock size={14} className="text-indigo-500" /> {res.time}</span>
                              <span className="flex items-center gap-2"><MapPin size={14} className="text-indigo-500" /> Aifur Main Hall</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <button className="flex-1 md:flex-none px-6 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white hover:bg-gray-50 transition-colors">
                            Modify
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center">
                  <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <Calendar size={40} className="text-gray-300" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">No table booked yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm mx-auto font-medium">Your next memorable dinner at Aifur is just a few clicks away.</p>
                  <Link to="/reservations" className="inline-flex items-center gap-3 bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform shadow-xl shadow-indigo-500/20">
                    Book Your First Table <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </div>

            {/* Recommendations Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform"></div>
                <ChefHat className="mb-8 text-indigo-200" size={32} />
                <h3 className="text-2xl font-black mb-4 tracking-tight">Today's Special</h3>
                <p className="text-indigo-100 font-medium mb-8 leading-relaxed">Try our new Nordic Masala Salmon, smoked with applewood and glazed with Pakistani spices.</p>
                <Link to="/menu" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all">
                  View Special <ArrowRight size={12} />
                </Link>
              </div>
              <div className="bg-white dark:bg-gray-900/50 rounded-[2.5rem] p-10 border border-gray-100 dark:border-white/5 shadow-xl flex flex-col justify-between">
                <div>
                   <Star className="mb-8 text-yellow-500" size={32} fill="currentColor" />
                   <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">VIP Priority</h3>
                   <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">As an elite member, you get priority seating during peak hours in Islamabad.</p>
                </div>
                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mt-8 flex items-center gap-2">
                  Learn More <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Side Column (4 columns) */}
          <div className="xl:col-span-4 space-y-8">
            
            {/* Rewards Progress */}
            <div className="bg-gray-900 dark:bg-[#111827] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-[100px]"></div>
               <div className="flex justify-between items-center mb-10 relative z-10">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Aifur Points</h4>
                 <Gift size={20} className="text-indigo-400" />
               </div>
               <div className="mb-10 relative z-10">
                 <div className="text-6xl font-black tracking-tighter mb-2">840</div>
                 <div className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-500">Points available</div>
               </div>
               <div className="space-y-4 relative z-10">
                 <div className="w-full bg-white/5 rounded-full h-2">
                   <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full" style={{ width: '84%' }}></div>
                 </div>
                 <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-500">
                    <span>Current: Silver</span>
                    <span>Next: Gold (1000)</span>
                 </div>
               </div>
               <button className="w-full mt-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                 Redeem Perks
               </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-900/50 rounded-[2.5rem] p-10 border border-gray-100 dark:border-white/5 shadow-xl">
               <h3 className="text-lg font-black text-gray-900 dark:text-white mb-8 tracking-tight">Your Activity</h3>
               <div className="space-y-8">
                 <div className="flex items-center gap-5">
                   <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600">
                     <Calendar size={20} />
                   </div>
                   <div>
                     <div className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wide">{reservations.length}</div>
                     <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Visits</div>
                   </div>
                 </div>
                 <div className="flex items-center gap-5">
                   <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600">
                     <Star size={20} />
                   </div>
                   <div>
                     <div className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wide">4.9/5.0</div>
                     <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Review Rating</div>
                   </div>
                 </div>
               </div>
            </div>

            {/* Sign Out Section */}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 py-6 rounded-[2rem] bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.3em] border border-red-500/10"
            >
              <LogOut size={18} /> End Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}