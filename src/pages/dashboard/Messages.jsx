import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { Mail, MessageSquare, Clock, CheckCircle, Trash2, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setMessages(messages.map(m => 
        m.id === id ? { ...m, status: newStatus } : m
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessages(messages.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const filteredMessages = messages.filter(m => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Customer Inquiries</h1>
          <p className="text-gray-500 font-bold">Manage messages from the Aifur contact form</p>
        </div>
        
        <div className="flex gap-2 bg-white dark:bg-white/5 p-1 rounded-2xl border border-gray-100 dark:border-white/10">
          {['all', 'unread', 'read'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === f 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={msg.id}
                className={`p-6 rounded-3xl border transition-all ${
                  msg.status === 'unread' 
                    ? 'bg-white dark:bg-white/5 border-indigo-200 dark:border-indigo-500/30 shadow-xl shadow-indigo-500/5' 
                    : 'bg-white/50 dark:bg-white/2 border-gray-100 dark:border-white/5 grayscale-[0.5] opacity-80'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                        msg.status === 'unread' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <Mail size={20} />
                      </div>
                      <div>
                        <h3 className="font-black text-lg leading-tight">{msg.name}</h3>
                        <p className="text-sm font-bold text-gray-500">{msg.email}</p>
                      </div>
                      {msg.status === 'unread' && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest animate-pulse">New</span>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Subject: {msg.subject || 'General Inquiry'}</div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed bg-gray-50 dark:bg-black/20 p-4 rounded-2xl">
                        {msg.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <span className="flex items-center gap-1"><Clock size={12} /> {new Date(msg.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2 justify-end">
                    <button 
                      onClick={() => toggleStatus(msg.id, msg.status)}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                        msg.status === 'unread'
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                          : 'bg-gray-100 dark:bg-white/10 text-gray-500'
                      }`}
                    >
                      <CheckCircle size={16} /> {msg.status === 'unread' ? 'Mark as Read' : 'Unread'}
                    </button>
                    <button 
                      onClick={() => deleteMessage(msg.id)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 bg-white dark:bg-white/5 rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10">
              <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="font-black text-xl mb-1">No messages found</h3>
              <p className="text-gray-500 font-bold">When customers contact you, their messages will appear here.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
