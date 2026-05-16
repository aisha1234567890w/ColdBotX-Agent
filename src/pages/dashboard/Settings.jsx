import { useState, useEffect } from 'react';
import { 
  Save, Store, Clock, Bell, Smartphone, CheckCircle2, Megaphone, Zap, 
  MapPin, Phone, Mail, Globe, MessageSquare, Shield, Target, Server,
  Power, Lock, Unlock, Database, Bot, Activity
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { motion } from 'framer-motion';

export default function Settings() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  
  const [config, setConfig] = useState({
    site_announcement: 'Welcome to Aifur! Open for Lunch & Dinner from 11 AM.',
    service_intensity: 'Normal',
    vvip_recognition: true,
    opening_time: '11:00',
    closing_time: '23:00',
    maintenance_mode: false,
    ai_agent_active: true,
    auto_release_tables: true,
    max_capacity_cap: 100,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('restaurant_config').select('*');
      if (data) {
        const newConfig = { ...config };
        data.forEach(item => {
          if (item.key in newConfig) {
            newConfig[item.key] = item.value === 'true' ? true : item.value === 'false' ? false : !isNaN(item.value) && item.value !== '' ? Number(item.value) : item.value;
          }
        });
        setConfig(newConfig);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(config).map(([key, value]) => ({
        key,
        value: value.toString()
      }));
      await supabase.from('restaurant_config').upsert(updates);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const Toggle = ({ label, description, checked, onChange, icon: Icon, colorClass }) => (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all duration-300 relative overflow-hidden group ${
        checked ? `border-${colorClass}-500/50 bg-${colorClass}-50 dark:bg-${colorClass}-500/10` : 'border-gray-200 dark:border-white/5 bg-white dark:bg-[#0f1115]'
      }`}
    >
      {checked && <div className={`absolute -right-10 -bottom-10 w-40 h-40 blur-[50px] bg-${colorClass}-500/20 rounded-full`} />}
      <div className="flex items-start gap-4 relative z-10 text-left">
         <div className={`p-3 rounded-2xl ${checked ? `bg-${colorClass}-500 text-white shadow-lg shadow-${colorClass}-500/30` : 'bg-gray-100 dark:bg-white/5 text-gray-500'}`}>
            <Icon size={20} />
         </div>
         <div>
            <div className={`text-sm font-black uppercase tracking-widest ${checked ? `text-${colorClass}-700 dark:text-${colorClass}-400` : 'text-gray-900 dark:text-white'}`}>{label}</div>
            <div className="text-[10px] font-bold text-gray-500 mt-1 max-w-[200px]">{description}</div>
         </div>
      </div>
      <div className={`w-12 h-6 rounded-full relative transition-all duration-500 shadow-inner ${checked ? `bg-${colorClass}-500` : 'bg-gray-300 dark:bg-gray-700'}`}>
         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-500 shadow-md ${checked ? 'left-7' : 'left-1'}`} />
      </div>
    </motion.button>
  );

  if (loading) return <div className="p-10 flex justify-center"><div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter mb-1">System Configuration</h1>
          <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Global master control online
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {saving ? <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> SYNCING...</> : <><Save size={16} /> COMMIT CHANGES</>}
        </button>
      </div>

      {showToast && (
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed bottom-10 right-10 bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-black flex items-center gap-3 z-50 tracking-widest uppercase text-xs">
          <CheckCircle2 size={18} /> Master System Updated
        </motion.div>
      )}

      {/* CORE CRITICAL TOGGLES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Toggle 
          label="AI Voice/Chat Agent" 
          description="Enables automated reservations via web chat and incoming calls."
          checked={config.ai_agent_active} 
          onChange={v => setConfig({...config, ai_agent_active: v})} 
          icon={Bot} colorClass="emerald" 
        />
        <Toggle 
          label="Smart Table Release" 
          description="Auto-frees tables 2 hours after reservation time if no action taken."
          checked={config.auto_release_tables} 
          onChange={v => setConfig({...config, auto_release_tables: v})} 
          icon={Database} colorClass="indigo" 
        />
        <Toggle 
          label="Maintenance Mode" 
          description="Locks down the frontend website for updates. Ops center remains active."
          checked={config.maintenance_mode} 
          onChange={v => setConfig({...config, maintenance_mode: v})} 
          icon={Lock} colorClass="red" 
        />
      </div>

      {/* DETAILED SETTINGS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Service Controller */}
        <div className="lg:col-span-2 bg-white dark:bg-white/5 rounded-[3rem] p-10 border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-5">
             <Activity size={200} />
           </div>
           <div className="flex items-center gap-3 mb-10 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                 <Zap size={20} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Service Intensity Matrix</h3>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
              {[
                { mode: 'Normal', desc: 'Standard staff pacing' }, 
                { mode: 'Busy', desc: 'Accelerated turnover' }, 
                { mode: 'Rush Hour', desc: 'Maximum efficiency protocol' }
              ].map(item => (
                <button 
                  key={item.mode}
                  onClick={() => setConfig({...config, service_intensity: item.mode})}
                  className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col gap-3 text-left ${
                    config.service_intensity === item.mode 
                      ? 'border-indigo-600 bg-indigo-600 shadow-xl shadow-indigo-600/20 text-white scale-105' 
                      : 'border-transparent bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500'
                  }`}
                >
                  <span className="text-xs font-black uppercase tracking-widest">{item.mode}</span>
                  <span className={`text-[10px] font-bold ${config.service_intensity === item.mode ? 'text-indigo-200' : 'text-gray-400'}`}>{item.desc}</span>
                </button>
              ))}
           </div>
        </div>

        {/* Operating Window */}
        <div className="bg-white dark:bg-white/5 rounded-[3rem] p-10 border border-gray-100 dark:border-white/5 shadow-sm">
           <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                 <Clock size={20} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Op Window</h3>
           </div>
           <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">System Online</label>
                <input type="time" value={config.opening_time} onChange={e => setConfig({...config, opening_time: e.target.value})} className="w-full py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-transparent rounded-2xl font-black text-2xl text-center outline-none focus:ring-2 focus:ring-amber-500 dark:text-white transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">System Offline</label>
                <input type="time" value={config.closing_time} onChange={e => setConfig({...config, closing_time: e.target.value})} className="w-full py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-transparent rounded-2xl font-black text-2xl text-center outline-none focus:ring-2 focus:ring-amber-500 dark:text-white transition-all" />
              </div>
           </div>
        </div>

        {/* Global Broadcast Banner */}
        <div className="lg:col-span-3 bg-gray-900 text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden border border-white/10">
           <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
           <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                 <Megaphone size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest">Global Broadcast Beacon</h3>
                <p className="text-[10px] text-gray-400 font-bold tracking-widest mt-1">Projects across all live client interfaces</p>
              </div>
           </div>
           <div className="relative z-10">
              <textarea 
                value={config.site_announcement}
                onChange={e => setConfig({...config, site_announcement: e.target.value})}
                rows={2}
                placeholder="Enter urgent announcement or promotion..."
                className="w-full bg-black/50 border border-white/20 rounded-2xl p-6 font-black text-xl text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all resize-none shadow-inner"
              />
           </div>
        </div>

      </div>
    </div>
  );
}
