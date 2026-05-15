import { useState, useEffect } from 'react';
import { 
  Save, Store, Clock, Bell, Smartphone, CheckCircle2, Megaphone, Zap, 
  MapPin, Phone, Mail, Globe, MessageSquare, Shield, Target
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

export default function Settings() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false); // Forced false for instant load
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
    try {
      const { data } = await supabase.from('restaurant_config').select('*');
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
      {showToast && (
        <div className="fixed bottom-10 right-10 bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-3 z-50">
          <CheckCircle2 size={18} /> System Synchronized
        </div>
      )}

      <div className="flex justify-between items-center border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-1">System Control</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global Configuration v1.6</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg disabled:opacity-50"
        >
          {saving ? 'Syncing...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
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
                    config.service_intensity === mode ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-transparent bg-gray-50 text-gray-400'
                  }`}
                >
                  <Zap size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{mode}</span>
                </button>
              ))}
           </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
           <div className="flex items-center gap-3 mb-8">
              <Shield size={18} className="text-indigo-600" />
              <h3 className="text-sm font-black uppercase tracking-widest">Protocols</h3>
           </div>
           <button 
              onClick={() => setConfig({...config, vvip_recognition: !config.vvip_recognition})}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                config.vvip_recognition ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-transparent bg-gray-50 text-gray-400'
              }`}
           >
              <div className="text-[10px] font-black uppercase tracking-widest">VVIP Recon</div>
              <div className={`w-10 h-5 rounded-full relative transition-all ${config.vvip_recognition ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                 <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.vvip_recognition ? 'left-6' : 'left-1'}`} />
              </div>
           </button>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
           <div className="flex items-center gap-3 mb-8">
              <Store size={18} className="text-indigo-600" />
              <h3 className="text-sm font-black uppercase tracking-widest">Identity</h3>
           </div>
           <div className="space-y-4">
              <input type="text" value={config.contact_phone} onChange={e => setConfig({...config, contact_phone: e.target.value})} className="w-full px-5 py-3 bg-gray-50 rounded-xl font-bold text-xs outline-none" placeholder="Phone" />
              <input type="text" value={config.address} onChange={e => setConfig({...config, address: e.target.value})} className="w-full px-5 py-3 bg-gray-50 rounded-xl font-bold text-xs outline-none" placeholder="Address" />
           </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex gap-10">
           <div className="w-1/3">
              <h3 className="text-sm font-black uppercase tracking-widest mb-4">Radius</h3>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Operational window</p>
           </div>
           <div className="w-2/3 grid grid-cols-2 gap-4">
              <input type="time" value={config.opening_time} onChange={e => setConfig({...config, opening_time: e.target.value})} className="w-full py-4 bg-gray-50 rounded-xl font-black text-2xl text-center outline-none" />
              <input type="time" value={config.closing_time} onChange={e => setConfig({...config, closing_time: e.target.value})} className="w-full py-4 bg-gray-50 rounded-xl font-black text-2xl text-center outline-none" />
           </div>
        </div>

        <div className="lg:col-span-3 bg-gray-900 text-white rounded-3xl p-8 shadow-2xl">
           <h3 className="text-sm font-black uppercase tracking-widest mb-6">Global Broadcast</h3>
           <textarea 
              value={config.site_announcement}
              onChange={e => setConfig({...config, site_announcement: e.target.value})}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-6 font-bold text-lg text-white outline-none resize-none"
           />
        </div>

      </div>
    </div>
  );
}
