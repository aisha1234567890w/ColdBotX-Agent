import { useState, useEffect } from 'react';
import { 
  Save, Store, Clock, Bell, Smartphone, CheckCircle2, Megaphone, Zap, 
  MapPin, Phone, Mail, Globe, MessageSquare, Shield, Target
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
      <div className="w-12 h-12 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
      {showToast && (
        <div className="fixed bottom-10 right-10 bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={18} /> Settings Synchronized
        </div>
      )}

      {/* COMPACT HEADER */}
      <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white mb-1">System Control</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global Configuration Hub</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Syncing...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* INTENSITY PANEL */}
        <div className="lg:col-span-2 bg-white dark:bg-white/5 rounded-3xl p-8 border border-gray-100 dark:border-white/10 shadow-sm">
           <div className="flex items-center gap-3 mb-8">
              <Zap size={18} className="text-indigo-600" />
              <h3 className="text-sm font-black uppercase tracking-widest">Service Intensity</h3>
           </div>
           <div className="grid grid-cols-3 gap-4">
              {['Normal', 'Busy', 'Rush Hour'].map(mode => (
                <button 
                  key={mode}
                  onClick={() => setConfig({...config, service_intensity: mode})}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                    config.service_intensity === mode 
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-600/10 text-indigo-600' 
                      : 'border-transparent bg-gray-50 dark:bg-white/5 text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${config.service_intensity === mode ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    <Zap size={16} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{mode}</span>
                </button>
              ))}
           </div>
        </div>

        {/* PROTOCOLS PANEL */}
        <div className="bg-white dark:bg-white/5 rounded-3xl p-8 border border-gray-100 dark:border-white/10 shadow-sm">
           <div className="flex items-center gap-3 mb-8">
              <Shield size={18} className="text-indigo-600" />
              <h3 className="text-sm font-black uppercase tracking-widest">Protocols</h3>
           </div>
           <div className="space-y-4">
              <button 
                onClick={() => setConfig({...config, vvip_recognition: !config.vvip_recognition})}
                className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                  config.vvip_recognition ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600' : 'border-transparent bg-gray-50 text-gray-400'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <Target size={18} />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest">VVIP Recon</div>
                    <div className="text-[9px] font-medium opacity-60 uppercase">Auto-Guest Identification</div>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-all ${config.vvip_recognition ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                   <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.vvip_recognition ? 'left-6' : 'left-1'}`} />
                </div>
              </button>
           </div>
        </div>

        {/* IDENTITY PANEL */}
        <div className="bg-white dark:bg-white/5 rounded-3xl p-8 border border-gray-100 dark:border-white/10 shadow-sm">
           <div className="flex items-center gap-3 mb-8">
              <Store size={18} className="text-indigo-600" />
              <h3 className="text-sm font-black uppercase tracking-widest">Brand Identity</h3>
           </div>
           <div className="space-y-5">
              <div className="space-y-1.5">
                 <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Official Hotline</label>
                 <input type="text" value={config.contact_phone} onChange={e => setConfig({...config, contact_phone: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 rounded-xl font-bold text-xs outline-none border border-transparent focus:border-indigo-600" />
              </div>
              <div className="space-y-1.5">
                 <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Restaurant Address</label>
                 <input type="text" value={config.address} onChange={e => setConfig({...config, address: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 rounded-xl font-bold text-xs outline-none border border-transparent focus:border-indigo-600" />
              </div>
              <div className="flex gap-2 pt-4">
                 <div className="flex-1 flex flex-col items-center gap-1.5 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
                    <Globe size={16} className="text-gray-400" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-indigo-600">Web</span>
                 </div>
                 <div className="flex-1 flex flex-col items-center gap-1.5 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
                    <MessageSquare size={16} className="text-gray-400" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-indigo-600">Social</span>
                 </div>
              </div>
           </div>
        </div>

        {/* RADIUS PANEL */}
        <div className="lg:col-span-2 bg-white dark:bg-white/5 rounded-3xl p-8 border border-gray-100 dark:border-white/10 shadow-sm flex flex-col md:flex-row gap-10">
           <div className="md:w-1/3">
              <div className="flex items-center gap-3 mb-6">
                <Clock size={18} className="text-indigo-600" />
                <h3 className="text-sm font-black uppercase tracking-widest">Radius</h3>
              </div>
              <p className="text-[10px] font-medium text-gray-400 leading-relaxed uppercase tracking-widest">Operational window for all active AI agents and web booking terminals.</p>
           </div>
           <div className="md:w-2/3 grid grid-cols-2 gap-6">
              <div className="space-y-3">
                 <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 text-center block">System Up</label>
                 <input type="time" value={config.opening_time} onChange={e => setConfig({...config, opening_time: e.target.value})} className="w-full py-6 bg-gray-50 dark:bg-white/5 rounded-2xl font-black text-4xl text-center outline-none border-2 border-transparent focus:border-indigo-600" />
              </div>
              <div className="space-y-3">
                 <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 text-center block">System Down</label>
                 <input type="time" value={config.closing_time} onChange={e => setConfig({...config, closing_time: e.target.value})} className="w-full py-6 bg-gray-50 dark:bg-white/5 rounded-2xl font-black text-4xl text-center outline-none border-2 border-transparent focus:border-indigo-600" />
              </div>
           </div>
        </div>

        {/* BROADCAST PANEL */}
        <div className="lg:col-span-3 bg-gray-900 text-white rounded-3xl p-10 shadow-2xl relative overflow-hidden group">
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                 <Megaphone size={18} className="text-indigo-400" />
                 <h3 className="text-sm font-black uppercase tracking-widest">Global Broadcast</h3>
              </div>
              <textarea 
                value={config.site_announcement}
                onChange={e => setConfig({...config, site_announcement: e.target.value})}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 font-bold text-lg text-white outline-none focus:ring-2 ring-indigo-500/50 transition-all resize-none"
                placeholder="Broadcast a new message to the world..."
              />
              <p className="mt-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">PROPAGATION: INSTANT EDGE ENABLED</p>
           </div>
           <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full"></div>
        </div>

      </div>
    </div>
  );
}
