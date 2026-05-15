import { useState, useEffect } from 'react';
import { 
  Save, Store, Clock, Bell, Smartphone, CheckCircle2, Megaphone, Zap, Power, 
  AlertTriangle, MapPin, Phone, Mail, Instagram, Facebook,
  Flame, Coffee, Wind, Eye, Shield, Target, Cpu
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

export default function Settings() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  
  const [config, setConfig] = useState({
    restaurant_name: 'Aifur',
    contact_phone: '+92 300 1234567',
    contact_email: 'hello@aifur.pk',
    address: 'Plot 12, Block A, Blue Area, Islamabad',
    site_announcement: 'Welcome to Aifur! Open for Lunch & Dinner from 11 AM.',
    service_intensity: 'Normal',
    restaurant_mood: 'Warm',
    accent_color: 'Indigo',
    vvip_recognition: true,
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

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-16 h-1 w-32 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-600 animate-slide-infinite" style={{ width: '30%' }}></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-32 max-w-[1400px] mx-auto px-6">
      {showToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-black text-white px-10 py-5 rounded-[2rem] shadow-2xl font-black flex items-center gap-4 z-50 border border-white/20 backdrop-blur-2xl animate-in slide-in-from-top-10">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
            <CheckCircle2 size={16} />
          </div>
          GLOBAL CONFIGURATION DEPLOYED
        </div>
      )}

      {/* TACTICAL HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-indigo-500 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-md shadow-lg shadow-indigo-500/20">Operational Level 4</div>
             <div className="h-px w-8 bg-gray-200 dark:bg-white/10" />
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Database Linked</span>
             </div>
          </div>
          <h1 className="text-7xl font-black tracking-tighter italic uppercase leading-[0.8]">Master<br/>Control.</h1>
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className="group relative px-16 py-8 bg-black dark:bg-white text-white dark:text-black rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          {saving ? 'UPDATING CORE...' : 'DEPLOY CHANGES'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
        
        {/* TILE 1: SERVICE INTENSITY */}
        <div className="lg:col-span-2 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[3.5rem] p-10 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-12 relative z-10">
             <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-500/10 text-indigo-600 flex items-center justify-center"><Zap size={28} /></div>
                <div>
                   <h3 className="text-2xl font-black uppercase tracking-tight">Intensity Level</h3>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Adjust the throughput of the establishment</p>
                </div>
             </div>
             <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 bg-indigo-500/5 px-4 py-2 rounded-full border border-indigo-500/10">Dynamic Mode</div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 relative z-10">
            {[
              { id: 'Normal', icon: Wind, label: 'Silent Flow' },
              { id: 'Busy', icon: Coffee, label: 'Peak Traffic' },
              { id: 'Rush Hour', icon: Flame, label: 'Overload' }
            ].map(mode => (
              <button 
                key={mode.id}
                onClick={() => setConfig({...config, service_intensity: mode.id})}
                className={`flex flex-col items-center justify-center p-10 rounded-[3rem] border-2 transition-all duration-500 ${
                  config.service_intensity === mode.id 
                    ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black scale-[1.05] shadow-2xl' 
                    : 'border-transparent bg-gray-50 dark:bg-white/5 text-gray-400 hover:bg-gray-100'
                }`}
              >
                <mode.icon size={36} className="mb-6" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{mode.label}</span>
              </button>
            ))}
          </div>
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full group-hover:bg-indigo-500/10 transition-all duration-700"></div>
        </div>

        {/* TILE 2: SYSTEM PROTOCOLS */}
        <div className="bg-black text-white rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden group border border-white/5">
           <div className="relative z-10">
             <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white"><Shield size={24} /></div>
                <h3 className="text-xl font-black uppercase tracking-tight">Protocols</h3>
             </div>
             
             <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/10 hover:border-white/20 transition-all cursor-pointer" onClick={() => setConfig({...config, vvip_recognition: !config.vvip_recognition})}>
                   <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">VVIP Recon</div>
                      <div className="text-xs font-bold text-gray-300">Identify repeat guests</div>
                   </div>
                   <div className={`w-12 h-6 rounded-full relative transition-all ${config.vvip_recognition ? 'bg-indigo-500' : 'bg-white/10'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.vvip_recognition ? 'left-7' : 'left-1'}`} />
                   </div>
                </div>

                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 space-y-4">
                   <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Interface Accent</div>
                   <div className="flex justify-between">
                     {['Indigo', 'Emerald', 'Ruby', 'Gold'].map(c => (
                       <div 
                         key={c}
                         onClick={() => setConfig({...config, accent_color: c})}
                         className={`w-10 h-10 rounded-full border-4 cursor-pointer transition-all ${config.accent_color === c ? 'border-white scale-110' : 'border-transparent opacity-40 hover:opacity-100'}`}
                         style={{ backgroundColor: c === 'Indigo' ? '#6366f1' : c === 'Emerald' ? '#10b981' : c === 'Ruby' ? '#ef4444' : '#f59e0b' }}
                       />
                     ))}
                   </div>
                </div>
             </div>
           </div>
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        </div>

        {/* TILE 3: IDENTITY HUD */}
        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[3.5rem] p-12 shadow-sm">
           <div className="flex items-center gap-5 mb-12">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center"><Target size={24} /></div>
              <h3 className="text-2xl font-black uppercase tracking-tight italic leading-tight">Digital<br/>Identity.</h3>
           </div>
           
           <div className="space-y-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Hotline</label>
                 <input type="text" value={config.contact_phone} onChange={e => setConfig({...config, contact_phone: e.target.value})} className="w-full px-8 py-5 bg-gray-50 dark:bg-black/20 rounded-[2rem] font-bold text-sm border-2 border-transparent focus:border-black outline-none transition-all" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">HQ Address</label>
                 <input type="text" value={config.address} onChange={e => setConfig({...config, address: e.target.value})} className="w-full px-8 py-5 bg-gray-50 dark:bg-black/20 rounded-[2rem] font-bold text-sm border-2 border-transparent focus:border-black outline-none transition-all" />
              </div>
              <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
                 <div className="flex-1 p-5 bg-pink-500/5 rounded-2xl border border-pink-500/10 text-center">
                    <Instagram size={20} className="mx-auto mb-2 text-pink-500" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-pink-600">Active</span>
                 </div>
                 <div className="flex-1 p-5 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 text-center">
                    <Facebook size={20} className="mx-auto mb-2 text-indigo-500" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-indigo-600">Active</span>
                 </div>
              </div>
           </div>
        </div>

        {/* TILE 4: OPERATIONAL RADIUS */}
        <div className="lg:col-span-2 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[3.5rem] p-12 shadow-sm flex flex-col md:flex-row gap-12">
           <div className="md:w-1/3">
              <div className="w-16 h-16 rounded-[1.5rem] bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6 shadow-xl shadow-amber-500/10"><Clock size={28} /></div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-2 leading-tight">Operating<br/>Radius.</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Synced globally across all Aifur AI terminals</p>
           </div>
           
           <div className="md:w-2/3 grid grid-cols-2 gap-8">
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center block">System Up</label>
                 <input type="time" value={config.opening_time} onChange={e => setConfig({...config, opening_time: e.target.value})} className="w-full py-8 bg-gray-50 dark:bg-black/20 rounded-[2.5rem] font-black text-5xl text-center outline-none border-2 border-transparent focus:border-black" />
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center block">System Down</label>
                 <input type="time" value={config.closing_time} onChange={e => setConfig({...config, closing_time: e.target.value})} className="w-full py-8 bg-gray-50 dark:bg-black/20 rounded-[2.5rem] font-black text-5xl text-center outline-none border-2 border-transparent focus:border-black" />
              </div>
           </div>
        </div>

        {/* TILE 5: GLOBAL BROADCAST */}
        <div className="lg:col-span-3 bg-indigo-600 text-white rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden group">
           <div className="relative z-10">
              <div className="flex items-center gap-5 mb-10">
                 <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center"><Megaphone size={24} /></div>
                 <h3 className="text-2xl font-black uppercase tracking-tight italic leading-tight">Global<br/>Broadcast.</h3>
              </div>
              <textarea 
                value={config.site_announcement}
                onChange={e => setConfig({...config, site_announcement: e.target.value})}
                rows={4}
                className="w-full bg-white/10 border-none rounded-[2.5rem] p-8 font-bold text-xl text-white placeholder-white/40 focus:ring-4 ring-white/10 outline-none resize-none transition-all shadow-inner"
                placeholder="Broadcast a new message to the world..."
              />
              <div className="mt-8 flex items-center gap-3 text-white/50">
                 <Cpu size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Instant Edge Propagation Enabled</span>
              </div>
           </div>
           <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-white/10 blur-[100px] rounded-full animate-pulse"></div>
        </div>

      </div>
    </div>
  );
}
