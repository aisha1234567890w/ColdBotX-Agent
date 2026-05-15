import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { Search, User, Phone, MapPin, Calendar, Clock, Filter, MoreVertical, Star, ShieldCheck } from 'lucide-react';

export default function Customers() {
  const [allCustomers, setAllCustomers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    let filtered = allCustomers.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.phone.includes(searchTerm)
    );
    
    if (filterType === 'vip') {
      filtered = filtered.filter(c => c.isLoyal);
    } else if (filterType === 'new') {
      filtered = filtered.filter(c => c.totalVisits === 1);
    }
    
    setCustomers(filtered);
  }, [searchTerm, filterType, allCustomers]);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations_main')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by phone number to create CRM profiles
      const crmProfiles = {};
      
      if (data && data.length > 0) {
        data.forEach(res => {
          const phone = res.phone_number || res.phone || 'Unknown';
          if (phone === 'Unknown' && !res.customer_name) return;

          if (!crmProfiles[phone]) {
            crmProfiles[phone] = {
              id: phone,
              name: res.customer_name || 'Guest',
              phone: phone,
              totalVisits: 1,
              lastVisit: res.reservation_date || res.created_at,
              totalGuests: parseInt(res.guests_count || 1),
              source: res.source || 'Direct',
              isLoyal: false
            };
          } else {
            crmProfiles[phone].totalVisits += 1;
            crmProfiles[phone].totalGuests += parseInt(res.guests_count || 1);
            crmProfiles[phone].isLoyal = crmProfiles[phone].totalVisits >= 3;
            if (new Date(res.reservation_date) > new Date(crmProfiles[phone].lastVisit)) {
              crmProfiles[phone].lastVisit = res.reservation_date;
            }
          }
        });
      }
      
      const customerArray = Object.values(crmProfiles);
      setAllCustomers(customerArray);
      setCustomers(customerArray);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 flex items-center justify-center min-h-[500px]">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-indigo-100 rounded-full"></div>
        <div className="text-gray-400 font-bold">Synchronizing CRM...</div>
      </div>
    </div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Customer CRM</h1>
          <p className="text-gray-500 font-bold">Manage guest profiles and loyalty insights</p>
        </div>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-72 pl-10 pr-4 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold focus:outline-none transition-all cursor-pointer"
          >
            <option value="all">All Guests</option>
            <option value="vip">VIPs Only</option>
            <option value="new">First Timers</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              <tr>
                <th className="p-8">Guest Profile</th>
                <th className="p-8">Phone</th>
                <th className="p-8 text-center">Visits</th>
                <th className="p-8 text-center">Avg Party Size</th>
                <th className="p-8">Last Visit</th>
                <th className="p-8">Loyalty Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-500/20">
                        {(c.name || 'U').charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-gray-900 dark:text-white">{c.name}</div>
                        <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{c.source} Booking</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-8 font-bold text-sm text-gray-600 dark:text-gray-400">{c.phone}</td>
                  <td className="p-8 text-center">
                    <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg font-black text-lg">
                      {c.totalVisits}
                    </span>
                  </td>
                  <td className="p-8 text-center text-sm font-black text-gray-500">
                    {Math.round(c.totalGuests / c.totalVisits)} guests
                  </td>
                  <td className="p-8 text-sm font-bold text-gray-500">
                    {new Date(c.lastVisit).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-8">
                    {c.isLoyal ? (
                      <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 w-fit px-4 py-2 rounded-xl border border-amber-500/20">
                        <Star size={14} fill="currentColor" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Aifur VIP</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-400 bg-gray-100 dark:bg-white/5 w-fit px-4 py-2 rounded-xl">
                        <span className="text-[10px] font-black uppercase tracking-widest">Standard Guest</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {customers.length === 0 && !loading && (
          <div className="p-20 text-center flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-300">
              <Search size={40} />
            </div>
            <div>
              <h3 className="text-xl font-black mb-1">No matches found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your search or filters to find the right guest.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
  );
}
