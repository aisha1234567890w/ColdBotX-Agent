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
  Sparkles,
  Utensils,
  Camera,
  Music,
  Wine,
  Maximize2
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const EXPERIENCES = [
  {
    title: "The Nordic Lounge",
    desc: "Sip curated cocktails in an atmosphere of frozen elegance and warmth.",
    image: "https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=1200",
    tag: "Atmosphere"
  },
  {
    title: "Chef's Tasting",
    desc: "An 8-course journey through fusion gastronomy led by Ayesha Altaf.",
    image: "https://images.unsplash.com/photo-1550966841-3ecfcdac896a?auto=format&fit=crop&q=80&w=1200",
    tag: "Culinary"
  },
  {
    title: "Private Vault",
    desc: "Exclusive dining for your most intimate and important moments.",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1200",
    tag: "Exclusive"
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

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
        setTimeout(() => setLoading(false), 2000);
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
      <div className="min-h-screen flex items-center justify-center bg-[#080808]">
        <div className="flex flex-col items-center">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl font-serif italic text-amber-500 tracking-[0.2em] mb-4"
          >
            Aifur
          </motion.div>
          <div className="w-32 h-[1px] bg-white/10 relative">
            <motion.div 
              animate={{ left: ["0%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute top-0 w-8 h-full bg-amber-500"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden font-sans">
      
      {/* Immersive Parallax Header */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-50 scale-110" 
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/80 via-transparent to-[#080808]" />
        </motion.div>

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.8em] text-amber-500 mb-6 block">The Private Collection</span>
            <h1 className="text-7xl md:text-9xl font-serif italic mb-8 tracking-tighter">
              Welcome, <span className="text-amber-500">{user?.name?.split(' ')[0]}</span>
            </h1>
            <div className="flex items-center justify-center gap-8">
              <div className="h-px w-12 bg-white/20" />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Curating your evening</p>
              <div className="h-px w-12 bg-white/20" />
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30"
        >
          <span className="text-[8px] font-black uppercase tracking-widest">Scroll to Explore</span>
          <div className="w-px h-12 bg-white" />
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-32 space-y-40">
        
        {/* Reservation Section - Always Premium */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 border-b border-white/5 pb-12">
            <div className="max-w-xl">
              <h2 className="text-4xl font-serif italic mb-4">Your Table Awaits</h2>
              <p className="text-gray-500 text-sm leading-relaxed">Experience the convergence of Nordic purity and Oriental spice. Every seat at Aifur is a front-row ticket to a culinary performance.</p>
            </div>
            <Link to="/reservations" className="group flex items-center gap-4 px-10 py-5 bg-amber-500 text-black rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-2xl shadow-amber-500/20">
              New Experience <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {reservations.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative rounded-[4rem] overflow-hidden group aspect-[21/9] flex items-end p-12 md:p-20 shadow-2xl shadow-black/50 border border-white/5"
            >
              <img src="https://images.unsplash.com/photo-1550966841-3ecfcdac896a?auto=format&fit=crop&q=80&w=1500" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[5s]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-end">
                <div>
                  <div className="flex items-center gap-3 text-amber-500 mb-6 font-black text-[10px] uppercase tracking-widest">
                    <Sparkles size={14} /> Confirmed Booking
                  </div>
                  <h3 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
                    {new Date(reservations[0].date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} <span className="text-amber-500">@</span> {reservations[0].time}
                  </h3>
                  <div className="flex items-center gap-6 text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                     <span className="flex items-center gap-2"><Users size={14} /> {reservations[0].guests} Guests</span>
                     <span className="flex items-center gap-2"><MapPin size={14} /> Main Lounge</span>
                  </div>
                </div>
                <div className="flex md:justify-end gap-4">
                   <button className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Modify</button>
                   <button className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Cancel</button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[500px]">
               <div className="md:col-span-2 relative rounded-[3rem] overflow-hidden group">
                  <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-50" />
                  <div className="absolute inset-0 bg-black/40 p-12 flex flex-col justify-end">
                     <h3 className="text-3xl font-serif italic mb-2">Reserve Your Moment</h3>
                     <p className="text-gray-400 text-xs mb-8">No active bookings found. Discover the magic of Aifur today.</p>
                     <Link to="/reservations" className="w-fit px-8 py-4 bg-amber-500 text-black rounded-full font-black text-[10px] uppercase tracking-widest">Book Now</Link>
                  </div>
               </div>
               <div className="bg-[#111] rounded-[3rem] p-12 flex flex-col justify-center text-center border border-white/5">
                  <Wine size={48} className="mx-auto mb-8 text-amber-500" />
                  <h4 className="text-xl font-serif italic mb-4">Cellar List</h4>
                  <p className="text-gray-500 text-xs leading-relaxed mb-8">Our sommelier has selected 12 new vintage wines for this weekend.</p>
                  <button className="text-[10px] font-black uppercase tracking-widest text-amber-500 hover:underline">View List</button>
               </div>
            </div>
          )}
        </section>

        {/* Discovery Grid - The "Exciting Stuff" */}
        <section>
          <div className="text-center mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-4 block">Unforgettable</span>
            <h2 className="text-5xl font-serif italic mb-4 tracking-tight">The Aifur Experiences</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {EXPERIENCES.map((exp, idx) => (
              <motion.div 
                key={idx}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.2 }}
                className="group cursor-pointer"
              >
                <div className="relative h-[500px] rounded-[3rem] overflow-hidden mb-8 shadow-2xl">
                  <img src={exp.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  <div className="absolute top-8 right-8 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-[8px] font-black uppercase tracking-widest text-amber-500">
                    {exp.tag}
                  </div>
                  <div className="absolute bottom-12 left-12 right-12">
                    <h3 className="text-3xl font-serif italic mb-2">{exp.title}</h3>
                    <div className="w-0 group-hover:w-full h-[1px] bg-amber-500 transition-all duration-500 mb-4" />
                    <p className="text-xs text-gray-400 font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {exp.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Sensory Footer Section */}
        <section className="relative h-[600px] rounded-[4rem] overflow-hidden flex flex-col items-center justify-center text-center p-12 border border-white/5">
          <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1500" className="absolute inset-0 w-full h-full object-cover opacity-20" />
          <div className="relative z-10 max-w-2xl">
            <ChefHat size={40} className="text-amber-500 mx-auto mb-10" />
            <h2 className="text-5xl md:text-7xl font-serif italic mb-8">Leave the world behind.</h2>
            <p className="text-gray-400 font-medium mb-12 italic">"We don't just serve food. We create memories that linger like the scent of burning cedar."</p>
            <div className="flex flex-wrap justify-center gap-8">
               <div className="flex flex-col items-center gap-2">
                 <Music size={20} className="text-amber-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Live Jazz</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <Wine size={20} className="text-amber-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Sommelier</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <Maximize2 size={20} className="text-amber-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Grand Hall</span>
               </div>
            </div>
          </div>
        </section>

        {/* Global Controls */}
        <div className="flex justify-between items-center border-t border-white/5 pt-20">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-amber-500 font-black tracking-widest italic border border-white/10">A</div>
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Aifur Islamabad</span>
          </div>
          <button 
            onClick={handleLogout}
            className="px-8 py-3 rounded-full border border-white/10 text-gray-500 hover:text-white hover:bg-red-500 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            End Session
          </button>
        </div>
      </main>
    </div>
  );
}
