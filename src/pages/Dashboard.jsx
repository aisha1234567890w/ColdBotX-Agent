import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "Guest", email: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(userData);
      setLoading(false);
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('user');
      localStorage.removeItem('supabase_session');
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 pt-12 pb-24 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Premium Welcome Banner */}
        <div className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-[2rem] p-8 md:p-16 shadow-2xl border border-gray-100 dark:border-gray-800 mb-10 group">
          {/* Decorative Gradient Blob */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full -mr-48 -mt-48 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                ✨ Aifur Elite Member
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{user.name}!</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-xl font-medium">
                {user.name === 'Guest' || !user.name ? "Explore our authentic Nordic and Pakistani fusion cuisine." : "It's a pleasure to have you back. Your preferred table in the main hall is just a click away."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link to="/reservations" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-200 dark:shadow-none transition-all transform hover:-translate-y-1 text-center">
                Book a Table
              </Link>
              <button onClick={handleLogout} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-8 py-4 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-center">
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Column: Reservations & Offers */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Conditional Reservation Section */}
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-xl border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <span className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">📅</span>
                  Your Next Visit
                </h2>
                <Link to="/reservations" className="text-sm font-bold text-indigo-600 hover:underline">Manage All</Link>
              </div>
              
              {/* Check if user has reservations (mocking empty for new user) */}
              {false ? ( // Change this to actual check later
                <div className="relative group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative p-8 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center min-w-[90px]">
                        <div className="text-sm font-bold text-indigo-600 uppercase tracking-tighter">May</div>
                        <div className="text-4xl font-black text-gray-900 dark:text-white">12</div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Dinner for 2</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Aifur Main Hall • 07:30 PM</p>
                      </div>
                    </div>
                    <button className="text-sm font-bold text-red-500 hover:underline">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 px-6 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem] bg-gray-50/50 dark:bg-gray-900/30">
                  <div className="text-5xl mb-4">🏠</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No upcoming visits?</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">Don't miss out on our seasonal specials. Book your next table and start earning Aifur Rewards.</p>
                  <Link to="/reservations" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all">
                    Book Now <span>→</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Suggested for You Section */}
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-xl border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <span className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">👨‍🍳</span>
                Chef's Suggestions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: "Masala Swedish Meatballs", desc: "Our signature fusion dish.", image: "/images/menu/masala_meatballs.jpeg" },
                  { name: "Toast Skagen", desc: "A classic Swedish starter.", image: "/images/menu/toast_skagen.jpeg" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:scale-[1.02] transition-transform cursor-pointer">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{item.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exclusive Offers */}
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-xl border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <span className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl">🎁</span>
                Member Perks
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-8 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/10 dark:to-gray-900 rounded-3xl border border-indigo-100 dark:border-indigo-900/30 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-600/10 rounded-full blur-xl"></div>
                  <div className="text-xs font-black text-indigo-600 uppercase mb-2 tracking-widest">New Member</div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Free Toast Skagen</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Claim your complimentary starter on your first booking.</p>
                  <div className="inline-block bg-white dark:bg-gray-800 px-4 py-2 rounded-xl text-indigo-600 font-mono font-bold border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                    WELCOME-AIFUR
                  </div>
                </div>
                <div className="p-8 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/10 dark:to-gray-900 rounded-3xl border border-purple-100 dark:border-purple-900/30 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-purple-600/10 rounded-full blur-xl"></div>
                  <div className="text-xs font-black text-purple-600 uppercase mb-2 tracking-widest">Limited Time</div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">15% Off Sunday</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enjoy a cozy Sunday dinner with a special discount.</p>
                  <div className="inline-block bg-white dark:bg-gray-800 px-4 py-2 rounded-xl text-purple-600 font-mono font-bold border border-purple-100 dark:border-purple-900/50 shadow-sm">
                    SUNDAY-15
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Rewards & Profile */}
          <div className="space-y-10">
            
            {/* Loyalty Points Card */}
            <div className="bg-gray-900 dark:bg-gray-800 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl"></div>
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="text-yellow-400 text-2xl">⭐</span> Rewards
                </h2>
                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">Beta</span>
              </div>
              <div className="mb-8">
                <div className="text-6xl font-black mb-2 tracking-tighter">0</div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Points Collected</div>
              </div>
              <div className="space-y-5">
                <div className="flex justify-between text-[10px] font-bold uppercase text-gray-500">
                  <span>First Milestone</span>
                  <span>0/500</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full" style={{ width: '5%' }}></div>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <h5 className="text-xs font-bold mb-3 text-indigo-400 uppercase tracking-wide">Upcoming Perks:</h5>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-xs text-gray-400 group">
                      <span className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-[10px] group-hover:bg-indigo-600 group-hover:text-white transition-colors">1</span>
                      Priority Table Booking
                    </li>
                    <li className="flex items-center gap-3 text-xs text-gray-400 group">
                      <span className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-[10px] group-hover:bg-indigo-600 group-hover:text-white transition-colors">2</span>
                      Birthday Special Dessert
                    </li>
                    <li className="flex items-center gap-3 text-xs text-gray-400 group">
                      <span className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-[10px] group-hover:bg-indigo-600 group-hover:text-white transition-colors">3</span>
                      VIP Event Access
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Redemption Coming Soon</span>
              </div>
            </div>

            {/* Quick Support Card */}
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-xl border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Need Assistance?</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">Our AI Concierge is available 24/7 to help with your bookings.</p>
              <Link to="/reservations" className="block text-center w-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold py-4 rounded-2xl hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all">
                Talk to Agent
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}