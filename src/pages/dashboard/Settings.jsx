import { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, Save, Store, Clock, Users, Bell, 
  Shield, Smartphone, CheckCircle2, Megaphone, Zap, Power, 
  AlertTriangle, MapPin, Phone, Mail, Instagram, Facebook,
  Flame, Coffee, Wind
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

export default function Settings() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState('restaurant');
  
  // Settings State
  const [config, setConfig] = useState({
    restaurant_name: 'Aifur',
    contact_phone: '+92 300 1234567',
    contact_email: 'hello@aifur.pk',
    address: 'Plot 12, Block A, Blue Area, Islamabad',
    site_announcement: 'Welcome to Aifur! Open for Lunch & Dinner from 11 AM.',
    service_intensity: 'Normal', // Normal, Busy, Rush Hour
    restaurant_mood: 'Warm', // Dimmed, Energetic, Warm
    instagram_link: 'https://instagram.com/aifur',
    facebook_link: 'https://facebook.com/aifur',
    opening_time: '11:00',
    closing_time: '23:00'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('restaurant_config').select('*');
      if (data) {
        const newConfig = { ...config };
        data.forEach(item => {
          if (item.key in newConfig) {
            newConfig[item.key] = item.value;
          }
        });
        setConfig(newConfig);
      }
    } catch (err) {
      console.error("Fetch Settings Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(config).map(([key, value]) => ({
        key,
        value: value.toString()
      }));

      const { error } = await supabase.from('restaurant_config').upsert(updates);
      if (error) throw error;

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Save Error:", err);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'restaurant', label: 'Command Center', icon: Zap },
    { id: 'identity', label: 'Brand Identity', icon: MapPin },
    { id: 'hours', label: 'Operating Hours', icon: Clock },
    { id: 'display', label: 'Public Display', icon: Megaphone },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 right-8 bg-black text-white px-8 py-4 rounded-2xl shadow-2xl font-black flex items-center gap-3 z-50 border border-white/20 backdrop-blur-xl"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
              <CheckCircle2 size={14} className="text-white" />
            </div>
            CORE SYSTEM SYNCED
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tight mb-2 italic">Control Hub.</h1>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Aifur Global Operations v2.0</span>
            <div className="h-px w-12 bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Linked & Live</span>
            </div>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="group relative flex items-center gap-3 px-12 py-5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-black/20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <Save size={18} />
          {saving ? 'SYNCING...' : 'SAVE CONFIGURATION'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
        {/* Navigation */}
        <div className="lg:col-span-3 space-y-4">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full p-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-4 transition-all duration-300 border-2 ${
                activeTab === tab.id 
                  ? 'bg-white text-black border-black shadow-2xl scale-[1.05] z-10' 
                  : 'bg-transparent text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              <tab.icon size={20} className={activeTab === tab.id ? 'text-indigo-600' : ''} /> 
              {tab.label}
            </button>
          ))}
          
          <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] mt-12 border border-dashed border-gray-200">
             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">System Health</h4>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase">
                   <span className="text-gray-400">Database</span>
                   <span className="text-emerald-500">Connected</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase">
                   <span className="text-gray-400">AI Agents</span>
                   <span className="text-emerald-500">Active</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase">
                   <span className="text-gray-400">Website</span>
                   <span className="text-indigo-500">Synced</span>
                </div>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          {activeTab === 'restaurant' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              {/* Service Intensity Selector */}
              <div className="bg-white dark:bg-white/5 border-2 border-black rounded-[3rem] p-10 shadow-xl">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-500/20"><Zap size={24} /></div>
                   <div>
                      <h3 className="text-2xl font-black italic uppercase">Service Intensity.</h3>
                      <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Set the operational pace of your restaurant</p>
                   </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { id: 'Normal', icon: Wind, label: 'Normal Flow', color: 'bg-emerald-500' },
                    { id: 'Busy', icon: Coffee, label: 'High Traffic', color: 'bg-amber-500' },
                    { id: 'Rush Hour', icon: Flame, label: 'Maximum Power', color: 'bg-red-500' }
                  ].map(mode => (
                    <button 
                      key={mode.id}
                      onClick={() => setConfig({...config, service_intensity: mode.id})}
                      className={`p-8 rounded-[2.5rem] border-2 transition-all group ${
                        config.service_intensity === mode.id 
                          ? `border-black bg-black text-white scale-105 shadow-2xl` 
                          : 'border-gray-100 dark:border-white/5 hover:border-gray-200'
                      }`}
                    >
                      <mode.icon size={32} className={`mb-6 transition-transform group-hover:scale-110 ${config.service_intensity === mode.id ? 'text-white' : 'text-gray-300'}`} />
                      <div className="text-[11px] font-black uppercase tracking-[0.2em]">{mode.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood Selector */}
              <div className="bg-gray-900 text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white"><Smartphone size={24} /></div>
                    <div>
                        <h3 className="text-2xl font-black italic uppercase">Restaurant Mood.</h3>
                        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Adjust the overall vibe of the establishment</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    {['Warm', 'Dimmed', 'Energetic', 'Classic'].map(m => (
                      <button 
                        key={m}
                        onClick={() => setConfig({...config, restaurant_mood: m})}
                        className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          config.restaurant_mood === m ? 'bg-white text-black scale-105' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {m} Vibe
                      </button>
                    ))}
                  </div>
                </div>
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/20 blur-[100px] rounded-full"></div>
              </div>
            </motion.div>
          )}

          {activeTab === 'identity' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              <div className="bg-white dark:bg-white/5 border-2 border-black rounded-[3rem] p-10 shadow-xl">
                 <div className="flex items-center gap-4 mb-12">
                   <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center"><MapPin size={24} /></div>
                   <h3 className="text-2xl font-black italic uppercase tracking-tighter">Public Identity.</h3>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <div className="flex items-center gap-2 text-gray-400">
                          <Phone size={14} />
                          <label className="text-[10px] font-black uppercase tracking-widest">Public Hotline</label>
                       </div>
                       <input 
                         type="text" 
                         value={config.contact_phone} 
                         onChange={(e) => setConfig({...config, contact_phone: e.target.value})}
                         className="w-full px-8 py-5 bg-gray-50 rounded-2xl font-bold text-lg outline-none focus:ring-2 ring-black/5" 
                       />
                    </div>
                    <div className="space-y-4">
                       <div className="flex items-center gap-2 text-gray-400">
                          <Mail size={14} />
                          <label className="text-[10px] font-black uppercase tracking-widest">Public Email</label>
                       </div>
                       <input 
                         type="text" 
                         value={config.contact_email} 
                         onChange={(e) => setConfig({...config, contact_email: e.target.value})}
                         className="w-full px-8 py-5 bg-gray-50 rounded-2xl font-bold text-lg outline-none focus:ring-2 ring-black/5" 
                       />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                       <div className="flex items-center gap-2 text-gray-400">
                          <Store size={14} />
                          <label className="text-[10px] font-black uppercase tracking-widest">Physical Address</label>
                       </div>
                       <input 
                         type="text" 
                         value={config.address} 
                         onChange={(e) => setConfig({...config, address: e.target.value})}
                         className="w-full px-8 py-5 bg-gray-50 rounded-2xl font-bold text-lg outline-none focus:ring-2 ring-black/5" 
                       />
                    </div>
                 </div>

                 <div className="mt-16 pt-16 border-t border-gray-100 flex flex-col md:flex-row gap-10">
                    <div className="flex-1 space-y-4">
                       <div className="flex items-center gap-2 text-pink-500">
                          <Instagram size={14} />
                          <label className="text-[10px] font-black uppercase tracking-widest">Instagram Link</label>
                       </div>
                       <input 
                         type="text" 
                         value={config.instagram_link} 
                         onChange={(e) => setConfig({...config, instagram_link: e.target.value})}
                         className="w-full px-6 py-4 bg-pink-500/5 rounded-xl font-bold text-sm outline-none border border-pink-500/10" 
                       />
                    </div>
                    <div className="flex-1 space-y-4">
                       <div className="flex items-center gap-2 text-indigo-500">
                          <Facebook size={14} />
                          <label className="text-[10px] font-black uppercase tracking-widest">Facebook Link</label>
                       </div>
                       <input 
                         type="text" 
                         value={config.facebook_link} 
                         onChange={(e) => setConfig({...config, facebook_link: e.target.value})}
                         className="w-full px-6 py-4 bg-indigo-500/5 rounded-xl font-bold text-sm outline-none border border-indigo-500/10" 
                       />
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'hours' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border-2 border-black rounded-[3rem] p-12 shadow-xl">
              <div className="flex items-center gap-4 mb-12">
                 <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shadow-lg"><Clock size={24} /></div>
                 <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">Operational Timeline.</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Synced globally across website and AI agents</p>
                 </div>
              </div>
              
              <div className="p-10 bg-gray-50 rounded-[3rem]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block text-center">Doors Open</label>
                      <input 
                        type="time" 
                        value={config.opening_time} 
                        onChange={(e) => setConfig({...config, opening_time: e.target.value})}
                        className="w-full px-10 py-8 bg-white border-2 border-gray-100 rounded-[2.5rem] font-black text-5xl text-center outline-none focus:border-black transition-all" 
                      />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block text-center">Doors Close</label>
                      <input 
                        type="time" 
                        value={config.closing_time} 
                        onChange={(e) => setConfig({...config, closing_time: e.target.value})}
                        className="w-full px-10 py-8 bg-white border-2 border-gray-100 rounded-[2.5rem] font-black text-5xl text-center outline-none focus:border-black transition-all" 
                      />
                   </div>
                </div>
              </div>
              <div className="mt-10 flex items-center justify-center gap-3 py-6 px-10 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 text-emerald-600">
                <CheckCircle2 size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Active Synchronized Protocol</span>
              </div>
            </motion.div>
          )}

          {activeTab === 'display' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border-2 border-black rounded-[3rem] p-12 shadow-xl">
              <div className="flex items-center gap-4 mb-12">
                 <div className="w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-600 flex items-center justify-center shadow-lg"><Megaphone size={24} /></div>
                 <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">Global Announcement.</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Update the header banner across the entire website</p>
                 </div>
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-6">Headline Message</label>
                  <textarea 
                    value={config.site_announcement}
                    onChange={(e) => setConfig({...config, site_announcement: e.target.value})}
                    rows={6}
                    className="w-full px-10 py-10 bg-gray-50 border-2 border-gray-100 rounded-[3rem] font-black text-2xl focus:border-black outline-none transition-all resize-none shadow-inner"
                    placeholder="E.g. Weekend special menu is now live!"
                  />
                </div>
                <div className="p-10 bg-gray-900 rounded-[2.5rem] text-white flex items-center gap-6 shadow-2xl relative overflow-hidden">
                   <Bell size={40} className="text-indigo-400 opacity-50" />
                   <div>
                      <h4 className="text-xs font-black uppercase tracking-widest mb-2">Real-Time Propagation</h4>
                      <p className="text-[10px] font-medium text-gray-400 leading-relaxed uppercase tracking-widest">
                        * YOUR CHANGES WILL BE VISIBLE TO GUESTS ON THE FRONTEND WITHIN 5 SECONDS OF SAVING.
                      </p>
                   </div>
                   <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-indigo-500/10 blur-[50px] rounded-full"></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
