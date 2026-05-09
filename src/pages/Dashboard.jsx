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
  Bell
} from "lucide-react";

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
        setLoading(false);
      }
    };
    fetchUserDataAndReservations();
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('supabase_session');
    localStorage.removeItem('isLoggedIn');
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-500">Loading your world...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#030712] pt-8 pb-24 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Premium Welcome Banner */}
        <div className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-16 shadow-2xl border border-gray-100 dark:border-white/5 mb-12 group transition-all">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full -mr-48 -mt-48 blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
          
          <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-12">
            <div className="text-center xl:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
                <Star size={12} className="fill-current" /> Aifur Elite Member
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter leading-tight">
                Welcome back, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{user?.name || 'Guest'}</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-xl font-medium leading-relaxed">
                Your table at the crossroads of Sweden and Pakistan is waiting. Ready for your next culinary adventure?
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-5 w-full xl:w-auto">
              <Link to="/reservations" className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/30 transition-all transform hover:-translate-y-1 active:scale-95 text-center text-sm">
                Book a Table
              </Link>
              <button onClick={handleLogout} className="bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-white/10 transition-all border border-gray-200 dark:border-white/10 text-center text-sm flex items-center justify-center gap-2">
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left: Reservations & Suggestions */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Reservations Section */}
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-gray-100 dark:border-white/5">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
                    <Calendar className="text-purple-600 dark:text-purple-400" size={24} />
                  </div>
                  Your Bookings
                </h2>
                <Link to="/reservations" className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] hover:underline">New Request</Link>
              </div>
              
              {reservations.length > 0 ? (
                <div className="space-y-6">
                  {reservations.map((res) => (
                    <div key={res.id} className="relative group cursor-pointer overflow-hidden rounded-3xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] hover:bg-white dark:hover:bg-white/[0.05] transition-all p-6 md:p-8">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-8">
                          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/10 text-center min-w-[100px]">
                            <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">{new Date(res.date).toLocaleString('default', { month: 'short' })}</div>
                            <div className="text-4xl font-black text-gray-900 dark:text-white">{new Date(res.date).getDate()}</div>
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{res.guests} Guests • {res.time}</h3>
                            <div className="flex flex-wrap gap-4">
                              <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-tight">
                                <MapPin size={14} className="text-indigo-500" /> Aifur Main Hall
                              </span>
                              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                res.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                              }`}>
                                {res.status || 'Confirmed'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-[0.2em] transition-colors">Modify Booking</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 px-8 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[2rem] bg-gray-50/30 dark:bg-white/[0.01]">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Calendar size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">No plans yet?</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm mx-auto font-medium">Don't miss out on our signature Swedish meatballs and Lahore spices. Book your table now.</p>
                  <Link to="/reservations" className="inline-flex items-center gap-3 bg-indigo-600 text-white px-10 py-4 rounded-[1.25rem] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all text-xs">
                    Start Your Journey <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </div>

            {/* Suggestions Section */}
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-gray-100 dark:border-white/5">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
                  <ChefHat className="text-emerald-600 dark:text-emerald-400" size={24} />
                </div>
                Chef's Picks For You
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { name: "Nordic Masala", price: "PKR 1,850", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=400" },
                  { name: "Toast Skagen Elite", price: "PKR 1,200", image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=400" }
                ].map((item, idx) => (
                  <div key={idx} className="group cursor-pointer overflow-hidden rounded-3xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] hover:scale-[1.02] transition-all">
                    <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tight">{item.name}</h4>
                        <span className="text-[10px] font-black text-indigo-500">{item.price}</span>
                      </div>
                      <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Recommended based on your history</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Perks & Profile */}
          <div className="space-y-12">
            
            {/* Rewards Card */}
            <div className="bg-gray-900 dark:bg-[#111827] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
              <div className="flex justify-between items-start mb-10 relative z-10">
                <h2 className="text-xl font-black uppercase tracking-[0.2em] flex items-center gap-3">
                  <Star className="text-yellow-400 fill-yellow-400" size={20} /> Rewards
                </h2>
                <span className="px-3 py-1 bg-white/10 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10">Active</span>
              </div>
              <div className="mb-10 relative z-10">
                <div className="text-7xl font-black mb-2 tracking-tighter">750</div>
                <div className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">Points Collected</div>
              </div>
              <div className="space-y-6 relative z-10">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <span>Silver Tier</span>
                  <span>750/1000</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-3 p-1">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{ width: '75%' }}></div>
                </div>
                <div className="pt-8 border-t border-white/5 space-y-5">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Available Benefits:</h5>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <Gift size={20} className="text-purple-400" />
                    <div>
                      <div className="text-xs font-bold">Priority Seating</div>
                      <div className="text-[8px] text-gray-500 uppercase font-black">Ready to use</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 shadow-xl border border-gray-100 dark:border-white/5">
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">Concierge</h2>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-5 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/20 group">
                  <div className="flex items-center gap-4">
                    <UserIcon size={20} className="text-gray-400 group-hover:text-indigo-500" />
                    <span className="text-xs font-bold uppercase tracking-widest">Update Profile</span>
                  </div>
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-indigo-500" />
                </button>
                <button className="w-full flex items-center justify-between p-5 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/20 group">
                  <div className="flex items-center gap-4">
                    <Bell size={20} className="text-gray-400 group-hover:text-indigo-500" />
                    <span className="text-xs font-bold uppercase tracking-widest">Notification Prefs</span>
                  </div>
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-indigo-500" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}