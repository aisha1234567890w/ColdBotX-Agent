import { useState, useEffect } from 'react';
import { 
  Save, Store, Clock, Bell, Smartphone, CheckCircle2, Megaphone, Zap, Power, 
  AlertTriangle, MapPin, Phone, Mail, Globe, MessageSquare,
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
            const val = item.value;
            newConfig[item.key] = val === 'true' ? true : val === 'false' ? false : val;
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
      <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-600 animate-pulse" style={{ width: '40%' }}></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-32 max-w-[1400px] mx-auto px-6 pt-10">
      {showToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-black text-white px-10 py-5 rounded-[2rem] shadow-2xl font-black flex items-center gap-4 z-50 border border-white/20">
          <CheckCircle2 size={16} className="text-emerald-500" />
          SYSTEM UPDATED
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-4">
          <h1 className="text-7xl font-black tracking-tighter italic uppercase leading-[0.8]">Master<br/>Control.</h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-16 py-8 bg-black text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl disabled:opacity-50"
        >
          {saving ? 'UPDATING...' : 'DEPLOY CHANGES'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
        <div className="lg:col-span-2 bg-white border-2 border-black rounded-[3.5rem] p-10 shadow-xl">
           <h3 className="text-2xl font-black uppercase mb-10">Intensity Level</h3>
           <div className="grid grid-cols-3 gap-6">
            {['Normal', 'Busy', 'Rush Hour'].map(mode => (
              <button 
                key={mode}
                onClick={() => setConfig({...config, service_intensity: mode})}
                className={`p-10 rounded-[3rem] border-2 transition-all ${
                  config.service_intensity === mode ? 'border-black bg-black text-white shadow-2xl' : 'border-gray-100 bg-gray-50'
                }`}
              >
                <Zap size={32} className="mx-auto mb-4" />
                <div className="text-[10px] font-black uppercase tracking-widest">{mode}</div>
              </button>
            ))}
           </div>
        </div>

        <div className="bg-gray-900 text-white rounded-[3.5rem] p-10 shadow-2xl">
           <h3 className="text-xl font-black uppercase mb-10">Protocols</h3>
           <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 flex justify-between items-center" onClick={() => setConfig({...config, vvip_recognition: !config.vvip_recognition})}>
                 <span className="text-[10px] font-black uppercase tracking-widest">VVIP Recon</span>
                 <div className={`w-12 h-6 rounded-full relative transition-all ${config.vvip_recognition ? 'bg-indigo-500' : 'bg-white/10'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.vvip_recognition ? 'left-7' : 'left-1'}`} />
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-white border-2 border-black rounded-[3.5rem] p-12 shadow-xl">
           <h3 className="text-2xl font-black uppercase mb-8 italic">Identity.</h3>
           <div className="space-y-6">
              <input type="text" value={config.contact_phone} onChange={e => setConfig({...config, contact_phone: e.target.value})} className="w-full px-8 py-5 bg-gray-50 rounded-2xl font-bold border-none outline-none" placeholder="Phone" />
              <input type="text" value={config.address} onChange={e => setConfig({...config, address: e.target.value})} className="w-full px-8 py-5 bg-gray-50 rounded-2xl font-bold border-none outline-none" placeholder="Address" />
           </div>
        </div>

        <div className="lg:col-span-2 bg-white border-2 border-black rounded-[3.5rem] p-12 shadow-xl flex flex-col md:flex-row gap-12">
           <div className="md:w-1/3">
              <h3 className="text-2xl font-black uppercase italic">Radius.</h3>
           </div>
           <div className="md:w-2/3 grid grid-cols-2 gap-8">
              <input type="time" value={config.opening_time} onChange={e => setConfig({...config, opening_time: e.target.value})} className="w-full py-8 bg-gray-50 rounded-[2.5rem] font-black text-5xl text-center outline-none" />
              <input type="time" value={config.closing_time} onChange={e => setConfig({...config, closing_time: e.target.value})} className="w-full py-8 bg-gray-50 rounded-[2.5rem] font-black text-5xl text-center outline-none" />
           </div>
        </div>
      </div>
    </div>
  );
}
