import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { menuData } from "../data/menu";
import { useApp } from "../context/AppContext";
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
  ChevronRight,
  Heart,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();
  const { 
    cart, favorites, appliedOffer, addToCart, removeFromCart, 
    toggleFavorite, claimOffer, getSubtotal, getDiscount, getTotal, clearCart 
  } = useApp();
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");

  const fetchData = async (userObj) => {
    try {
      const phone = userObj.phone || localStorage.getItem('user_phone');
      const cleanPhone = phone ? phone.replace(/[\s\-\(\)\+]/g, '') : null;
      // Extract last 9 digits to be extremely safe with 0/92 prefixes
      const shortPhone = cleanPhone && cleanPhone.length >= 9 ? cleanPhone.slice(-9) : cleanPhone;

      let query = supabase.from('reservations_main').select('*');
      
      // Verified columns from your screenshot: customer_name, phone_number
      let orFilter = `customer_name.ilike.%${userObj.name.split(' ')[0]}%`;
      
      if (shortPhone) {
        orFilter += `,phone_number.ilike.%${shortPhone}%`;
      }

      console.log("Searching with filter:", orFilter);

      const { data, error } = await query.or(orFilter).order('id', { ascending: false });
      
      if (error) {
        console.error("Supabase error:", error);
      }

      if (!error) {
        setReservations(data || []);
        setIsFirstTime((data || []).length === 0);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!storedUser) { navigate('/login'); return; }
    setUser(storedUser);
    fetchData(storedUser);
  }, [navigate]);

  const handleSavePhone = () => {
    if (!phoneInput) return;
    localStorage.setItem('user_phone', phoneInput);
    const updatedUser = { ...user, phone: phoneInput };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setShowPhoneModal(false);
    setLoading(true);
    fetchData(updatedUser);
  };

  const handleLogout = async () => {
    localStorage.clear();
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleClaimOffer = () => {
    claimOffer('WELCOME20');
  };

  const handleCheckout = () => {
    setShowCheckoutSuccess(true);
    setTimeout(() => {
      setShowCheckoutSuccess(false);
      clearCart();
    }, 3000);
  };

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
      
      {/* Phone Number Modal */}
      <AnimatePresence>
        {showPhoneModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-indigo-100 dark:border-white/5">
              <h3 className="text-2xl font-black mb-2">Sync Your Bookings</h3>
              <p className="text-gray-500 text-sm mb-8 font-medium">Enter the phone number you use for AI Call or Chat reservations to see them here.</p>
              <input 
                type="tel" 
                placeholder="e.g. +92 300 1234567" 
                className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl mb-6 outline-none focus:ring-2 focus:ring-indigo-600 font-bold"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
              />
              <div className="flex gap-4">
                <button onClick={() => setShowPhoneModal(false)} className="flex-1 py-4 text-gray-400 font-black uppercase tracking-widest text-[10px]">Cancel</button>
                <button onClick={handleSavePhone} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-500/20">Sync Now</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Success Overlay */}
      <AnimatePresence>
        {showCheckoutSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-[3rem] p-12 text-center max-w-sm shadow-2xl border border-indigo-100 dark:border-indigo-500/20"
            >
              <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-3xl font-black mb-4">Order Placed!</h3>
              <p className="text-gray-500 font-medium mb-8">Your culinary journey has begun. We'll notify you when it's ready.</p>
              <div className="h-1 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3 }}
                  className="h-full bg-emerald-500"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            
            <div className="flex items-center gap-6">
              {!user?.phone && (
                <button onClick={() => setShowPhoneModal(true)} className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 rounded-xl font-black text-[10px] uppercase tracking-widest border border-amber-200">
                  ⚠️ Link Phone for AI Bookings
                </button>
              )}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {favorites.slice(0, 3).map((fav, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-100 overflow-hidden" title={fav.name}>
                      <img src={fav.image} className="w-full h-full object-cover" alt="" />
                    </div>
                  ))}
                  {favorites.length > 3 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-indigo-600 flex items-center justify-center text-[8px] font-black text-white">
                      +{favorites.length - 3}
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your Favorites</span>
              </div>
            </div>
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
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
                    {appliedOffer ? "🎉 Offer Applied Successfully!" : "🎉 Get 20% OFF your first culinary journey!"}
                  </h2>
                  <p className="text-indigo-100 text-lg font-medium mb-8">
                    {appliedOffer ? "Your 20% discount will be applied at checkout." : "Use code WELCOME20 at checkout."}
                  </p>
                  {!appliedOffer ? (
                    <button 
                      onClick={handleClaimOffer}
                      className="px-10 py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >
                      Claim Your Offer
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-300 font-black uppercase tracking-widest text-xs">
                      <CheckCircle2 size={20} /> WELCOME20 ACTIVE
                    </div>
                  )}
                </div>
                <div className="hidden lg:block relative">
                   <div className="w-64 h-64 bg-white/10 rounded-full animate-pulse blur-3xl absolute -inset-4"></div>
                   <Gift size={180} className={`relative transition-all duration-500 ${appliedOffer ? 'scale-110 text-emerald-300' : 'text-white/20'}`} />
                </div>
              </div>
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
                {(() => {
                  const now = new Date();
                  const upcoming = reservations.filter(r => new Date(r.reservation_date || r.date) >= now);
                  const past = reservations.filter(r => new Date(r.reservation_date || r.date) < now);
                  const latest = upcoming[0] || reservations[0];

                  if (!latest) return (
                    <div className="text-center py-12">
                      <p className="text-gray-400 font-medium mb-4">No reservations found for {user?.name}</p>
                      <Link to="/reservations" className="text-indigo-600 font-black text-xs uppercase tracking-widest border-b-2 border-indigo-600 pb-1">Book a Table Now</Link>
                    </div>
                  );

                  return (
                    <div className="space-y-8 relative z-10">
                      <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shadow-lg bg-gray-100 dark:bg-white/5">
                          <img 
                            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=600" 
                            className="w-full h-full object-cover" 
                            alt="Aifur Seating" 
                          />
                        </div>
                        <div className="flex-1 space-y-2 text-center md:text-left">
                          <div className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-2">
                            {new Date(latest.reservation_date || latest.date) >= now ? "Upcoming Reservation" : "Latest Visit"}
                          </div>
                          <div className="text-3xl font-black text-gray-900 dark:text-white">
                            {new Date(latest.reservation_date || latest.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} <span className="text-gray-400 font-medium">@</span> {latest.reservation_time || latest.time}
                          </div>
                          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Users size={14} /> {latest.guests_count || latest.guests} Guests</span>
                            <span className="flex items-center gap-1"><MapPin size={14} /> Main Lounge</span>
                          </div>
                          <div className="pt-4">
                            <span className={`px-3 py-1 ${latest.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'} dark:bg-white/10 text-[10px] font-black rounded-lg uppercase tracking-widest border border-gray-100`}>
                              {latest.status || 'Confirmed'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {past.length > 0 && (
                        <div className="pt-8 border-t border-gray-50 dark:border-white/5">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                             <Clock size={12} /> Dining History ({past.length})
                          </h4>
                          <div className="space-y-3">
                            {past.slice(0, 2).map((r, i) => (
                              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-2xl">
                                <div className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                  {new Date(r.reservation_date || r.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                  {r.guests_count || r.guests} Guests • {r.reservation_time || r.time}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
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
                <button 
                  onClick={() => alert("🎁 Rewards Store is launching soon! Keep earning points to redeem for free appetizers and exclusive Nordic-Pakistani fusion dishes.")}
                  className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-transform"
                >
                  Rewards Store
                </button>
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
                <p className="text-gray-500 text-sm font-medium">Click heart to save, plus to add to cart.</p>
              </div>
              <Link to="/menu" className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:translate-x-1 transition-transform">
                Browse Full Menu <ChevronRight size={14} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularPicks.map((item, idx) => {
                const isFav = favorites.some(f => f.name === item.name);
                return (
                  <div key={idx} className="bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all group">
                    <div className="h-32 overflow-hidden relative">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                      <button 
                        onClick={() => toggleFavorite(item)}
                        className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${isFav ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500'}`}
                      >
                        <Heart size={14} fill={isFav ? "currentColor" : "none"} />
                      </button>
                      <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur shadow-sm rounded-lg text-[8px] font-black uppercase tracking-widest text-indigo-600">
                        {item.category}
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-black text-sm mb-1 truncate">{item.name}</h4>
                      <div className="text-indigo-600 dark:text-indigo-400 font-bold text-xs mb-4">PKR {item.price.toLocaleString()}</div>
                      <button 
                        onClick={() => addToCart(item)}
                        className="w-full py-2 bg-gray-50 dark:bg-white/5 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={14} /> Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-black tracking-tight mb-8 flex items-center gap-3">
              <ShoppingBag className="text-indigo-600" /> Your Cart {cart.length > 0 && <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full">{cart.length}</span>}
            </h3>
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
               {cart.length > 0 ? (
                 <div className="space-y-4">
                   <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                     {cart.map((item, i) => (
                       <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-2xl group relative text-gray-900 dark:text-white">
                         <img src={item.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                         <div className="flex-1 min-w-0">
                           <h5 className="text-[10px] font-black truncate uppercase tracking-widest">{item.name}</h5>
                           <p className="text-[10px] font-bold text-indigo-600">PKR {item.price.toLocaleString()} x {item.quantity || 1}</p>
                         </div>
                         <button 
                           onClick={() => removeFromCart(item.name)}
                           className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                           <X size={14} />
                         </button>
                       </div>
                     ))}
                   </div>
                   <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                     <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Subtotal</span>
                       <span className="text-sm font-bold">PKR {getSubtotal().toLocaleString()}</span>
                     </div>
                     {getDiscount() > 0 && (
                       <div className="flex justify-between items-center text-emerald-500">
                         <span className="text-[10px] font-black uppercase tracking-widest">Discount (20%)</span>
                         <span className="text-sm font-bold">- PKR {getDiscount().toLocaleString()}</span>
                       </div>
                     )}
                     <div className="flex justify-between items-center pt-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Total</span>
                       <span className="text-lg font-black text-indigo-600">PKR {getTotal().toLocaleString()}</span>
                     </div>
                     <button 
                       onClick={handleCheckout}
                       className="w-full mt-4 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20"
                     >
                       Checkout Now
                     </button>
                   </div>
                 </div>
               ) : (
                 <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                      <ShoppingBag size={32} />
                    </div>
                    <h4 className="text-sm font-black mb-2 uppercase tracking-widest">Your cart is empty</h4>
                    <Link to="/menu" className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-500/20">👉 Browse Menu</Link>
                 </div>
               )}
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
