import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { Search, User, Phone, MapPin, Calendar, Clock, Filter, MoreVertical, Star, ShieldCheck } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      // In a real app, you might have a dedicated customers table.
      // Here, we derive unique customers from reservations_main for CRM purposes.
      const { data, error } = await supabase
        .from('reservations_main')
        .select('customer_name, phone_number, reservation_date, guests_count, source')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by phone number to create CRM profiles
      let crmProfiles = {};
      try {
        crmProfiles = data.reduce((acc, current) => {
          const phone = current.phone_number || current.phone || `unknown_${Math.random()}`;
          if (!acc[phone]) {
            acc[phone] = {
              id: phone,
              name: current.customer_name || current.name || 'Unknown Guest',
              phone: current.phone_number || current.phone || 'No Phone',
              totalVisits: 1,
              lastVisit: current.reservation_date || current.date || new Date().toLocaleDateString(),
              totalGuests: parseInt(current.guests_count || current.guests) || 1,
              source: current.source || 'Web',
              isLoyal: false
            };
          } else {
            acc[phone].totalVisits += 1;
            acc[phone].totalGuests += (parseInt(current.guests_count || current.guests) || 0);
            acc[phone].isLoyal = acc[phone].totalVisits >= 3;
          }
          return acc;
        }, {});
      } catch (e) {
        console.error("Error parsing CRM profiles", e);
      }
      
      const customerArray = Object.values(crmProfiles);
      
      if (customerArray.length === 0) {
        setCustomers([
          { id: '1', name: 'John Doe', phone: '+123456789', totalVisits: 4, lastVisit: '2026-05-09', totalGuests: 8, source: 'Web', isLoyal: true }
        ]);
      } else {
        setCustomers(customerArray);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 flex items-center justify-center min-h-[500px]">Loading CRM data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Customer CRM</h1>
          <p className="text-gray-500 font-bold">Manage guest profiles and loyalty</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="pl-10 pr-4 py-2 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500 w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10 text-xs font-black uppercase tracking-widest text-gray-500">
            <tr>
              <th className="p-6">Guest Profile</th>
              <th className="p-6">Phone</th>
              <th className="p-6">Visits</th>
              <th className="p-6">Avg Party Size</th>
              <th className="p-6">Last Visit</th>
              <th className="p-6">Status</th>
              <th className="p-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center font-black uppercase">
                      {(c.name || 'U').charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold">{c.name || 'Unknown Guest'}</div>
                      <div className="text-xs text-gray-500">From {c.source || 'Web'}</div>
                    </div>
                  </div>
                </td>
                <td className="p-6 font-medium text-sm">{c.phone}</td>
                <td className="p-6">
                  <div className="font-black text-lg">{c.totalVisits}</div>
                </td>
                <td className="p-6 text-sm font-bold">
                  {Math.round(c.totalGuests / c.totalVisits)} guests
                </td>
                <td className="p-6 text-sm text-gray-500">
                  {new Date(c.lastVisit).toLocaleDateString()}
                </td>
                <td className="p-6">
                  {c.isLoyal ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-widest">
                      <Star size={12} fill="currentColor" /> VIP
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-xs font-black uppercase tracking-widest">
                      Standard
                    </span>
                  )}
                </td>
                <td className="p-6 text-right">
                  <button className="p-2 text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
