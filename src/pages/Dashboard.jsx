import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ChefHat, 
  ArrowRight,
  LogOut,
  Bell,
  Sparkles,
  Utensils,
  Camera,
  PlayCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000",
  salmon: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000",
  interior: "https://images.unsplash.com/photo-1550966841-3ecfcdac896a?auto=format&fit=crop&q=80&w=1000",
  plating: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1000"
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setLoading(false), 1500);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.clear();
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-20 h-0.5 bg-gold-500/20 relative overflow-hidden mb-8">
            <motion.div 
              initial={{ left: "-100%" }}
              animate={{ left: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-amber-500 to-transparent"
            />
          </div>
          <h2 className="text-white text-xs font-black uppercase tracking-[0.6em] animate-pulse">Setting your table</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-amber-500/30">
      
      {/* Cinematic Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-end overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0"
        >
          <img src={IMAGES.hero} className="w-full h-full object-cover" alt="Aifur Atmosphere" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/50" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full pb-20 relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-[1px] bg-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Welcome Back</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 leading-none">
              {user?.name?.split(' ')[0]}<span className="text-amber-500">.</span>
            </h1>
            <p className="text-gray-400 max-w-lg text-sm md:text-base font-medium leading-relaxed">
              Your table at Aifur is more than a seat—it's a journey through the Nordic soul and the spirit of the East.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        
        {/* Main Experience Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Next Adventure - Cinematic Card */}
          <div className="lg:col-span-8 space-y-12">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-4">
                  Your Next Adventure
                  <Sparkles size={18} className="text-amber-500" />
                </h2>
                <Link to="/reservations" className="text-[10px] font-black uppercase tracking-widest text-amber-500 hover:tracking-[0.2em] transition-all">New Booking</Link>
              </div>

              {reservations.length > 0 ? (
                <div className="group relative overflow-hidden rounded-[3rem] bg-[#111] border border-white/5 h-[450px]">
                  <img src={IMAGES.interior} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-[3s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  
                  <div className="absolute inset-0 p-12 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest">
                        {reservations[0].status || 'Confirmed'}
                      </div>
                      <div className="flex items-center gap-2 text-amber-500">
                        <Clock size={16} />
                        <span className="text-xs font-black italic">{reservations[0].time}</span>
                      </div>
                    </div>

                    <div>
                       <div className="text-5xl font-black mb-4 tracking-tighter">
                         {new Date(reservations[0].date).toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}
                       </div>
                       <div className="flex items-center gap-6 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                         <span className="flex items-center gap-2"><Users size={14} /> {reservations[0].guests} Guests</span>
                         <span className="flex items-center gap-2"><MapPin size={14} /> Aifur Lounge</span>
                       </div>
                       <div className="mt-8 flex gap-4">
                         <button className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-500 transition-colors">Modify Experience</button>
                         <button className="px-8 py-4 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-colors">Directions</button>
                       </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-[3rem] bg-[#111] border border-dashed border-white/10 p-20 text-center">
                  <Utensils size={48} className="mx-auto mb-8 text-white/20" />
                  <h3 className="text-2xl font-black mb-4 tracking-tight">The table is set.</h3>
                  <p className="text-gray-500 mb-10 max-w-xs mx-auto text-sm font-medium">You haven't booked your next experience yet. Let's change that.</p>
                  <Link to="/reservations" className="inline-flex px-10 py-5 bg-amber-500 text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-2xl shadow-amber-500/20">Book a Table</Link>
                </div>
              )}
            </motion.div>

            {/* Visual Gallery: From the Kitchen */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-black tracking-tight mb-8 flex items-center gap-4">
                From the Kitchen
                <Camera size={18} className="text-amber-500" />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group relative h-[300px] rounded-[2.5rem] overflow-hidden">
                  <img src={IMAGES.salmon} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <h4 className="text-lg font-black tracking-tight mb-1">Nordic Salmon</h4>
                    <p className="text-xs text-amber-500 font-black uppercase tracking-widest">Seasonal Special</p>
                  </div>
                </div>
                <div className="group relative h-[300px] rounded-[2.5rem] overflow-hidden">
                  <img src={IMAGES.plating} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <h4 className="text-lg font-black tracking-tight mb-1">Art of Plating</h4>
                    <p className="text-xs text-amber-500 font-black uppercase tracking-widest">Visual Experience</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Side Content: Experience Highlights */}
          <div className="lg:col-span-4 space-y-12">
            
            {/* Chef's Note */}
            <motion.div 
              initial={{ x: 40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-[#111] rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden"
            >
              <ChefHat className="text-amber-500 mb-8" size={32} />
              <h3 className="text-xl font-black mb-4 tracking-tight">Chef's Choice</h3>
              <p className="text-sm text-gray-400 font-medium leading-relaxed mb-10">
                "This month, we are focusing on the raw purity of Arctic waters combined with the warmth of Pakistani saffron."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10" />
                <div>
                  <div className="text-xs font-black tracking-tight text-white uppercase">Ayesha Altaf</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase">Executive Chef</div>
                </div>
              </div>
            </motion.div>

            {/* Visual Teaser */}
            <motion.div 
              initial={{ x: 40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[2.5rem] h-[350px] overflow-hidden group"
            >
              <img src={IMAGES.interior} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-amber-900/40 mix-blend-multiply" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <PlayCircle size={48} className="text-white mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-black text-xl tracking-tight leading-tight">The Aifur <br/>Atmosphere</h4>
              </div>
            </motion.div>

            {/* End Session */}
            <button 
              onClick={handleLogout}
              className="w-full py-8 border border-white/5 rounded-[2.5rem] flex items-center justify-center gap-4 text-gray-500 hover:text-white hover:bg-red-500 transition-all font-black text-[10px] uppercase tracking-[0.4em]"
            >
              <LogOut size={16} /> End Journey
            </button>
          </div>

        </div>
      </div>
      
      {/* Footer Decoration */}
      <div className="py-20 flex flex-col items-center opacity-20">
        <div className="w-px h-20 bg-gradient-to-b from-amber-500 to-transparent mb-8" />
        <span className="text-[10px] font-black uppercase tracking-[0.8em] text-gray-500">AIFUR ISLAMABAD</span>
      </div>

    </div>
  );
}