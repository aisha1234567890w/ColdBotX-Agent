import { useState, useEffect } from 'react';
import { 
  Save, Store, Clock, Bell, Smartphone, CheckCircle2, Megaphone, Zap, Power, 
  AlertTriangle, MapPin, Phone, Mail, Instagram, Facebook,
  Flame, Coffee, Wind
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

export default function Settings() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState('restaurant');
  
  const [config, setConfig] = useState({
    restaurant_name: 'Aifur',
    contact_phone: '+92 300 1234567',
    contact_email: 'hello@aifur.pk',
    address: 'Plot 12, Block A, Blue Area, Islamabad',
    site_announcement: 'Welcome to Aifur! Open for Lunch & Dinner from 11 AM.',
    service_intensity: 'Normal',
    restaurant_mood: 'Warm',
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(config).map(([key, value]) => ({
        key,
        value: value?.toString() || ''
      }));

      const { error } = await supabase.from('restaurant_config').upsert(updates);
      if (error) throw error;

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error(err);
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
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto p-4">
      {showToast && (
        <div className="fixed top-8 right-8 bg-black text-white px-8 py-4 rounded-2xl shadow-2xl font-black flex items-center gap-3 z-50 border border-white/20">
          <CheckCircle2 size={16} className="text-emerald-500" />
          CORE SYSTEM SYNCED
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tight mb-2 italic">Control Hub.</h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Linked & Live</span>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-12 py-5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 shadow-2xl disabled:opacity-50"
        >
          {saving ? 'SYNCING...' : 'SAVE CONFIGURATION'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
        <div className="lg:col-span-3 space-y-4">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full p-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-4 transition-all duration-300 border-2 ${
                activeTab === tab.id ? 'bg-white text-black border-black shadow-xl' : 'bg-transparent text-gray-400 border-transparent'
              }`}
            >
              <tab.icon size={20} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-9">
          {activeTab === 'restaurant' && (
            <div className="space-y-10">
              <div className="bg-white border-2 border-black rounded-[3rem] p-10 shadow-xl">
                <h3 className="text-2xl font-black italic uppercase mb-10">Service Intensity.</h3>
                <div className="grid grid-cols-3 gap-6">
                  {['Normal', 'Busy', 'Rush Hour'].map(mode => (
                    <button 
                      key={mode}
                      onClick={() => setConfig({...config, service_intensity: mode})}
                      className={`p-8 rounded-[2.5rem] border-2 transition-all ${
                        config.service_intensity === mode ? 'border-black bg-black text-white' : 'border-gray-100'
                      }`}
                    >
                      <Zap size={24} className="mb-4" />
                      <div className="text-[10px] font-black uppercase">{mode}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 text-white rounded-[3rem] p-10 shadow-2xl">
                <h3 className="text-2xl font-black italic uppercase mb-10">Restaurant Mood.</h3>
                <div className="flex gap-4">
                  {['Warm', 'Dimmed', 'Energetic'].map(m => (
                    <button 
                      key={m}
                      onClick={() => setConfig({...config, restaurant_mood: m})}
                      className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase transition-all ${
                        config.restaurant_mood === m ? 'bg-white text-black' : 'bg-white/5 text-gray-400'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'identity' && (
            <div className="bg-white border-2 border-black rounded-[3rem] p-10 shadow-xl space-y-10">
              <h3 className="text-2xl font-black italic uppercase">Public Identity.</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone</label>
                  <input type="text" value={config.contact_phone} onChange={e => setConfig({...config, contact_phone: e.target.value})} className="w-full px-8 py-5 bg-gray-50 rounded-2xl font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</label>
                  <input type="text" value={config.contact_email} onChange={e => setConfig({...config, contact_email: e.target.value})} className="w-full px-8 py-5 bg-gray-50 rounded-2xl font-bold" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Address</label>
                  <input type="text" value={config.address} onChange={e => setConfig({...config, address: e.target.value})} className="w-full px-8 py-5 bg-gray-50 rounded-2xl font-bold" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hours' && (
            <div className="bg-white border-2 border-black rounded-[3rem] p-12 shadow-xl space-y-10">
              <h3 className="text-2xl font-black italic uppercase">Operating Hours.</h3>
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase block text-center">Open</label>
                  <input type="time" value={config.opening_time} onChange={e => setConfig({...config, opening_time: e.target.value})} className="w-full px-6 py-6 bg-gray-50 rounded-3xl font-black text-4xl text-center" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase block text-center">Close</label>
                  <input type="time" value={config.closing_time} onChange={e => setConfig({...config, closing_time: e.target.value})} className="w-full px-6 py-6 bg-gray-50 rounded-3xl font-black text-4xl text-center" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'display' && (
            <div className="bg-white border-2 border-black rounded-[3rem] p-12 shadow-xl space-y-10">
              <h3 className="text-2xl font-black italic uppercase">Public Announcement.</h3>
              <textarea 
                value={config.site_announcement}
                onChange={e => setConfig({...config, site_announcement: e.target.value})}
                rows={6}
                className="w-full px-10 py-10 bg-gray-50 rounded-[3rem] font-black text-2xl resize-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
