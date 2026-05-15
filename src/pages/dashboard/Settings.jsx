import { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, Save, Store, Clock, Users, Bell, 
  Shield, Smartphone, CheckCircle2, Megaphone, Zap, Power, AlertTriangle
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
    address: 'Main Boulevard, Gulberg III, Lahore',
    site_announcement: 'Welcome to Aifur! Open for Lunch & Dinner from 11 AM.',
    is_emergency_paused: false,
    max_party_size: '8',
    auto_confirm: true,
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
            newConfig[item.key] = item.value === 'true' ? true : item.value === 'false' ? false : item.value;
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
      alert("Failed to save settings. Check console.");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'restaurant', label: 'Command Center', icon: Zap },
    { id: 'hours', label: 'Business Hours', icon: Clock },
    { id: 'ai', label: 'AI Intelligence', icon: Smartphone },
    { id: 'display', label: 'Public Display', icon: Megaphone },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 right-8 bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl shadow-emerald-500/20 font-black flex items-center gap-3 z-50 border border-white/20 backdrop-blur-xl"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
            SYSTEM UPDATED SUCCESSFULLY
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">System Control Hub</h1>
          <p className="text-gray-500 font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            Global configuration for Aifur operational ecosystem
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="group relative flex items-center gap-3 px-10 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/30 disabled:opacity-50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <Save size={18} />
          {saving ? 'UPDATING...' : 'SYNC ALL CHANGES'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Navigation - Glass Sidebar */}
        <div className="md:col-span-3 space-y-3">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full p-5 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center gap-4 transition-all duration-300 border ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-500/20 scale-[1.02]' 
                  : 'bg-white dark:bg-white/5 text-gray-500 border-transparent hover:border-gray-200 dark:hover:border-white/10'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'animate-pulse' : ''} /> 
              {tab.label}
            </button>
          ))}

          {/* Dangerous Zone */}
          <div className="mt-10 p-6 rounded-[2.5rem] bg-red-500/5 border border-red-500/10">
             <div className="flex items-center gap-2 text-red-500 mb-4">
                <AlertTriangle size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Emergency Zone</span>
             </div>
             <button 
               onClick={() => setConfig({...config, is_emergency_paused: !config.is_emergency_paused})}
               className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all ${config.is_emergency_paused ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-white/5 text-red-500'}`}
             >
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {config.is_emergency_paused ? 'BOOKINGS PAUSED' : 'PAUSE ALL BOOKINGS'}
                </span>
                <Power size={16} />
             </button>
          </div>
        </div>

        {/* Form Area */}
        <div className="md:col-span-9 space-y-8">
          {activeTab === 'restaurant' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[3rem] p-10 shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600"><Store size={24} /></div>
                 <h3 className="text-xl font-black tracking-tight uppercase tracking-widest">Core Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Trading Name</label>
                  <input 
                    type="text" 
                    value={config.restaurant_name} 
                    onChange={(e) => setConfig({...config, restaurant_name: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl font-black text-sm focus:ring-2 ring-indigo-500/20 outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Operational Hotline</label>
                  <input 
                    type="text" 
                    value={config.contact_phone} 
                    onChange={(e) => setConfig({...config, contact_phone: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl font-black text-sm focus:ring-2 ring-indigo-500/20 outline-none transition-all" 
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Global HQ Address</label>
                  <input 
                    type="text" 
                    value={config.address} 
                    onChange={(e) => setConfig({...config, address: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl font-black text-sm focus:ring-2 ring-indigo-500/20 outline-none transition-all" 
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'hours' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[3rem] p-10 shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                 <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600"><Clock size={24} /></div>
                 <div>
                    <h3 className="text-xl font-black uppercase tracking-widest">Business Hours</h3>
                    <p className="text-[10px] font-bold text-gray-400">Currently synced to all 7 days of operations</p>
                 </div>
              </div>
              
              <div className="p-8 bg-gray-50 dark:bg-black/20 rounded-[2.5rem] border border-gray-100 dark:border-white/5">
                <div className="grid grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block">Daily Start Time</label>
                      <input 
                        type="time" 
                        value={config.opening_time} 
                        onChange={(e) => setConfig({...config, opening_time: e.target.value})}
                        className="w-full px-8 py-5 bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-3xl font-black text-2xl outline-none focus:ring-4 ring-indigo-500/10 transition-all" 
                      />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block">Daily Close Time</label>
                      <input 
                        type="time" 
                        value={config.closing_time} 
                        onChange={(e) => setConfig({...config, closing_time: e.target.value})}
                        className="w-full px-8 py-5 bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-3xl font-black text-2xl outline-none focus:ring-4 ring-indigo-500/10 transition-all" 
                      />
                   </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/5 flex items-center gap-4 text-emerald-500">
                   <CheckCircle2 size={16} />
                   <span className="text-[10px] font-black uppercase tracking-[0.15em]">Propagating to all Aifur AI Agents</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'display' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[3rem] p-10 shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                 <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-600"><Megaphone size={24} /></div>
                 <h3 className="text-xl font-black uppercase tracking-widest">Public Announcement</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center block">Site-Wide Header Message</label>
                  <textarea 
                    value={config.site_announcement}
                    onChange={(e) => setConfig({...config, site_announcement: e.target.value})}
                    rows={4}
                    className="w-full px-8 py-6 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-[2rem] font-bold text-lg focus:ring-2 ring-pink-500/20 outline-none transition-all resize-none"
                    placeholder="E.g. We are closed for private event today..."
                  />
                </div>
                <div className="p-6 bg-pink-500/5 rounded-3xl border border-pink-500/10 flex items-center gap-4">
                   <Bell size={24} className="text-pink-500" />
                   <p className="text-[10px] font-bold text-pink-600/80 leading-relaxed uppercase tracking-widest text-center">
                     * THIS MESSAGE WILL APPEAR AT THE VERY TOP OF YOUR WEBSITE IMMEDIATELY AFTER SAVING.
                   </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[3rem] p-10 shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                 <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-600"><Smartphone size={24} /></div>
                 <h3 className="text-xl font-black uppercase tracking-widest">AI Intelligence Rules</h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-8 bg-gray-50 dark:bg-black/20 rounded-[2.5rem] border border-gray-100 dark:border-white/5">
                  <div className="space-y-1">
                    <h4 className="font-black text-sm uppercase tracking-widest">Auto-Pilot Mode</h4>
                    <p className="text-[10px] font-bold text-gray-500">Enable AI to instantly book tables without manual approval</p>
                  </div>
                  <button 
                    onClick={() => setConfig({...config, auto_confirm: !config.auto_confirm})}
                    className={`w-16 h-8 rounded-full relative transition-colors ${config.auto_confirm ? 'bg-indigo-600' : 'bg-gray-300'}`}
                  >
                    <motion.div 
                      animate={{ x: config.auto_confirm ? 34 : 4 }}
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-8 bg-gray-50 dark:bg-black/20 rounded-[2.5rem] border border-gray-100 dark:border-white/5">
                  <div className="space-y-1">
                    <h4 className="font-black text-sm uppercase tracking-widest">Max Party Scale</h4>
                    <p className="text-[10px] font-bold text-gray-500">Parties larger than this will be sent to the manager</p>
                  </div>
                  <select 
                    value={config.max_party_size}
                    onChange={(e) => setConfig({...config, max_party_size: e.target.value})}
                    className="px-6 py-3 bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-2xl font-black outline-none appearance-none cursor-pointer hover:border-indigo-500 transition-colors"
                  >
                    {[2,4,6,8,10,12,15,20].map(n => <option key={n} value={n.toString()}>{n} GUESTS</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
