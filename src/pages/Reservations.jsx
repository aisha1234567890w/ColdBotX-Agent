import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import VapiAssistant from '../components/VapiAssistant';
import N8nChat, { openN8nChat } from '../components/N8nChat';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '2',
    date: '',
    time: '',
    requests: ''
  });
  const [status, setStatus] = useState('idle');

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!/^[a-zA-Z\s]{3,50}$/.test(formData.name)) {
      newErrors.name = "Please enter a valid name (letters only)";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    // Strict phone validation for Pakistan and International
    if (!/^(\+92|0)?3[0-9]{9}$/.test(formData.phone.replace(/[\s\-]/g, ''))) {
      newErrors.phone = "Please enter a valid Pakistani phone number (e.g., 03001234567)";
    }
    if (!formData.date) {
      newErrors.date = "Please select a date";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0,0,0,0);
      if (selectedDate < today) {
        newErrors.date = "Date cannot be in the past";
      }
    }
    if (!formData.time) {
      newErrors.time = "Please select a time";
    } else {
      const [hours, minutes] = formData.time.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      const openTime = 11 * 60; // 11:00 AM
      const closeTime = 23 * 60; // 11:00 PM
      
      if (totalMinutes < openTime || totalMinutes > closeTime) {
        newErrors.time = "We are open from 11:00 AM to 11:00 PM only";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus('sending');
    
    try {
      // 1. Find an available table that fits the guest count
      const guestCount = parseInt(formData.guests);
      let assignedTableId = null;
      let assignedTableNumber = 'TBD';

      try {
        const { data: availableTables, error: tableError } = await supabase
          .from('restaurant_tables')
          .select('*')
          .eq('status', 'free')
          .gte('capacity', guestCount)
          .order('capacity', { ascending: true });

        if (!tableError && availableTables && availableTables.length > 0) {
          const table = availableTables[0];
          assignedTableId = table.id;
          assignedTableNumber = table.table_number;

          // 2. Mark the table as reserved
          await supabase
            .from('restaurant_tables')
            .update({ status: 'reserved' })
            .eq('id', assignedTableId);
        }
      } catch (err) {
        console.warn("Table assignment failed but continuing with reservation", err);
      }

      // 3. Save reservation to reservations_main
      // SAFE MODE: Only use columns we are 100% sure about
      const payload = {
        customer_name: formData.name,
        phone_number: formData.phone,
        reservation_date: formData.date,
        reservation_time: formData.time,
        guests_count: guestCount,
        source: 'Web Form',
        status: 'confirmed'
      };

      console.log("Attempting Safe Mode insert with payload:", payload);

      const { error: resError } = await supabase
        .from('reservations_main')
        .insert([payload]);

      if (resError) {
        console.error("CRITICAL: Supabase Insert Failed!");
        console.error("Error Message:", resError.message);
        console.error("Error Code:", resError.code);
        console.error("Error Details:", resError.details);
        throw resError;
      }

      // 4. Optional: Notify n8n for email confirmation
      fetch("https://bokafynaveed.app.n8n.cloud/webhook/book-table", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(e => console.warn("n8n notification failed", e));

      setStatus('success');
    } catch (error) {
      console.error('Reservation Error:', error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 text-4xl">
          ✓
        </div>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Reservation Confirmed!</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Thank you for choosing Aifur. We've received your request and look forward to serving you.
        </p>
        <button 
          onClick={() => setStatus('idle')}
          className="text-indigo-600 font-bold hover:underline"
        >
          Make another reservation
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
          <input 
            type="text" 
            className={`w-full bg-gray-50 dark:bg-gray-800/50 border ${errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:bg-white dark:focus:bg-gray-800 shadow-sm`}
            placeholder="John Doe"
            onChange={(e) => {
              setFormData({...formData, name: e.target.value});
              if (errors.name) setErrors({...errors, name: null});
            }}
          />
          {errors.name && <p className="text-red-500 text-xs font-bold ml-1 animate-pulse">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
          <input 
            type="email" 
            className={`w-full bg-gray-50 dark:bg-gray-800/50 border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:bg-white dark:focus:bg-gray-800 shadow-sm`}
            placeholder="john@example.com"
            onChange={(e) => {
              setFormData({...formData, email: e.target.value});
              if (errors.email) setErrors({...errors, email: null});
            }}
          />
          {errors.email && <p className="text-red-500 text-xs font-bold ml-1 animate-pulse">{errors.email}</p>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Phone Number</label>
          <input 
            type="tel" 
            className={`w-full bg-gray-50 dark:bg-gray-800/50 border ${errors.phone ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:bg-white dark:focus:bg-gray-800 shadow-sm`}
            placeholder="+92 300 1234567"
            onChange={(e) => {
              setFormData({...formData, phone: e.target.value});
              if (errors.phone) setErrors({...errors, phone: null});
            }}
          />
          {errors.phone && <p className="text-red-500 text-xs font-bold ml-1 animate-pulse">{errors.phone}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Guests</label>
          <select 
            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:bg-white dark:focus:bg-gray-800 shadow-sm appearance-none"
            onChange={(e) => setFormData({...formData, guests: e.target.value})}
          >
            {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Persons</option>)}
            <option value="9+">9+ Persons</option>
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Date</label>
          <input 
            type="date" 
            className={`w-full bg-gray-50 dark:bg-gray-800/50 border ${errors.date ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:bg-white dark:focus:bg-gray-800 shadow-sm`}
            onChange={(e) => {
              setFormData({...formData, date: e.target.value});
              if (errors.date) setErrors({...errors, date: null});
            }}
          />
          {errors.date && <p className="text-red-500 text-xs font-bold ml-1 animate-pulse">{errors.date}</p>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Time</label>
          <input 
            type="time" 
            className={`w-full bg-gray-50 dark:bg-gray-800/50 border ${errors.time ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:bg-white dark:focus:bg-gray-800 shadow-sm`}
            onChange={(e) => {
              setFormData({...formData, time: e.target.value});
              if (errors.time) setErrors({...errors, time: null});
            }}
          />
          {errors.time && <p className="text-red-500 text-xs font-bold ml-1 animate-pulse">{errors.time}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Special Requests</label>
        <textarea 
          className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:bg-white dark:focus:bg-gray-800 shadow-sm h-32 resize-none"
          placeholder="Any allergies or special occasions?"
          onChange={(e) => setFormData({...formData, requests: e.target.value})}
        ></textarea>
      </div>
      <button 
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-indigo-700 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
      >
        {status === 'sending' ? 'Processing...' : 'Confirm Reservation'}
      </button>
      {status === 'error' && (
        <p className="text-red-500 text-center text-sm font-medium">Something went wrong. Please try our AI assistant.</p>
      )}
    </form>
  );
};

export default function Reservations() {
  const [method, setMethod] = useState('form');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden bg-gray-900">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2000" 
          alt="Restaurant Interior" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 text-center px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
          >
            Reserve Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Experience</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-indigo-200 font-medium max-w-2xl mx-auto px-4"
          >
            Secure your spot at the heart of fusion dining.
          </motion.p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16 relative z-20">
        {/* Method Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12">
          {[
            { id: 'call', label: 'Call AI Agent', icon: '📞', desc: 'Instant Voice Booking', color: 'indigo' },
            { id: 'chat', label: 'Live AI Chat', icon: '💬', desc: 'Interactive Chatbot', color: 'purple' },
            { id: 'whatsapp', label: 'WhatsApp', icon: '🟢', desc: 'Message Reservation', color: 'emerald' },
            { id: 'form', label: 'Online Form', icon: '📝', desc: 'Traditional Booking', color: 'orange' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setMethod(item.id)}
              className={`p-4 md:p-6 rounded-2xl md:rounded-3xl border-2 transition-all duration-500 text-left group flex flex-col items-start ${
                method === item.id 
                  ? 'border-indigo-500 bg-white dark:bg-gray-800 shadow-2xl scale-[1.02] md:scale-105' 
                  : 'border-white dark:border-gray-800 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md hover:border-indigo-200'
              }`}
            >
              <div className="text-2xl md:text-3xl mb-2 md:mb-4 transform transition-transform group-hover:scale-110 duration-300">
                {item.icon}
              </div>
              <div className="font-black text-sm md:text-lg text-gray-900 dark:text-white mb-1 leading-tight">{item.label}</div>
              <div className="text-[8px] md:text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">{item.desc}</div>
              {method === item.id && (
                <motion.div 
                  layoutId="active-indicator"
                  className="w-6 md:w-8 h-1 bg-indigo-500 rounded-full mt-3 md:mt-4"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <motion.div 
          key={method}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl p-6 md:p-16 border border-gray-100 dark:border-gray-800"
        >
          {method === 'call' && (
            <div className="text-center py-10 space-y-8">
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">Our Voice AI is Ready</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">Speak naturally, just like a real phone call.</p>
              </div>
              <div className="inline-block p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
                <VapiAssistant />
              </div>
              <div className="flex justify-center gap-12 pt-8 text-gray-400">
                <div className="text-center">
                  <div className="text-2xl mb-1">⚡</div>
                  <div className="text-xs uppercase font-bold tracking-widest">Instant</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🛡️</div>
                  <div className="text-xs uppercase font-bold tracking-widest">Secure</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🤖</div>
                  <div className="text-xs uppercase font-bold tracking-widest">Smart</div>
                </div>
              </div>
            </div>
          )}

          {method === 'chat' && (
            <div className="text-center py-12 space-y-8">
              <div className="w-28 h-28 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mx-auto shadow-inner text-5xl">
                💬
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">Chat with Aifur</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">Our intelligent chatbot is online and ready.</p>
              </div>
              <button 
                onClick={openN8nChat}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black px-12 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95"
              >
                Start Chat Now
              </button>
            </div>
          )}

          {method === 'whatsapp' && (
            <div className="text-center py-12 space-y-8">
              <div className="w-28 h-28 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto shadow-inner text-5xl text-emerald-600">
                <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">Book via WhatsApp</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">Our concierge team is available to assist you via message.</p>
              </div>
              <a 
                href="https://wa.me/923705575773?text=Hello%20Aifur%20Restaurant,%20I%20would%20like%20to%20make%20a%20reservation."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-emerald-600 text-white font-black px-12 py-5 rounded-2xl shadow-xl hover:shadow-emerald-500/20 hover:shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95"
              >
                Send Message
              </a>
            </div>
          )}

          {method === 'form' && (
            <div className="space-y-12">
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">Traditional Booking</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">Fill out the details below and we'll handle the rest.</p>
              </div>
              <BookingForm />
            </div>
          )}
        </motion.div>
      </div>
      <N8nChat />
    </div>
  );
}
