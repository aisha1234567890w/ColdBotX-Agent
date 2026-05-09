import { useState } from 'react';
import { Settings as SettingsIcon, Save, Store, Clock, Users, Bell, Shield, Smartphone, CheckCircle2 } from 'lucide-react';

export default function Settings() {
  const [saving, setSaving] = useState(false);

  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-5xl relative">
      {showToast && (
        <div className="fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-xl font-bold flex items-center gap-2 animate-in slide-in-from-top-4 z-50">
          <CheckCircle2 size={18} /> Settings saved successfully!
        </div>
      )}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Settings & Config</h1>
          <p className="text-gray-500 font-bold">Configure Aifur AI, operational hours, and system preferences</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-70"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Settings Navigation */}
        <div className="space-y-2">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl font-bold flex items-center gap-3 cursor-pointer">
            <Store size={20} /> Restaurant Details
          </div>
          <div className="p-4 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl font-bold flex items-center gap-3 cursor-pointer transition-colors">
            <Clock size={20} /> Operational Hours
          </div>
          <div className="p-4 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl font-bold flex items-center gap-3 cursor-pointer transition-colors">
            <Smartphone size={20} /> AI Agent Rules
          </div>
          <div className="p-4 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl font-bold flex items-center gap-3 cursor-pointer transition-colors">
            <Bell size={20} /> Notifications
          </div>
          <div className="p-4 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl font-bold flex items-center gap-3 cursor-pointer transition-colors">
            <Shield size={20} /> Access Control
          </div>
        </div>

        {/* Settings Form Area */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-lg font-black tracking-tight mb-6 flex items-center gap-2">
              <Store className="text-indigo-600" /> Basic Information
            </h3>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Restaurant Name</label>
                  <input type="text" defaultValue="Aifur" className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-xl font-medium focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Contact Phone</label>
                  <input type="text" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-xl font-medium focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Address</label>
                <input type="text" defaultValue="123 Nordic Way, Gothenburg" className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-xl font-medium focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-lg font-black tracking-tight mb-6 flex items-center gap-2">
              <Smartphone className="text-indigo-600" /> AI Agent Configuration
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/10">
                <div>
                  <h4 className="font-bold">Auto-Confirm Reservations</h4>
                  <p className="text-xs text-gray-500">Allow AI to confirm bookings without human review</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/10">
                <div>
                  <h4 className="font-bold">Max Party Size for AI</h4>
                  <p className="text-xs text-gray-500">Parties larger than this will be escalated to staff</p>
                </div>
                <select className="px-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-white/20 rounded-xl font-bold outline-none">
                  <option>4 Guests</option>
                  <option>6 Guests</option>
                  <option selected>8 Guests</option>
                  <option>10 Guests</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
