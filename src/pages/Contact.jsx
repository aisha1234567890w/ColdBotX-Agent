import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('idle');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
            {/* Hero Section */}
            <section className="relative h-[45vh] flex items-center justify-center overflow-hidden bg-gray-900">
                <img 
                    src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=2000" 
                    alt="Restaurant Ambiance" 
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="relative z-10 text-center px-6">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
                    >
                        Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Touch</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-2xl text-orange-100 font-medium max-w-2xl mx-auto px-4"
                    >
                        We're here to help with reservations, feedback, or any inquiries.
                    </motion.p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Contact Info Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 h-full flex flex-col justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8">Visit Aifur</h2>
                                
                                <div className="space-y-10">
                                    <div className="flex items-start gap-5">
                                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-sm">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs mb-1">Location</h3>
                                            <p className="text-gray-600 dark:text-gray-400 font-medium">
                                                Plot 12, Block A, Blue Area<br />
                                                Islamabad, Pakistan
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-5">
                                        <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-2xl text-purple-600 dark:text-purple-400 shadow-sm">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs mb-1">Direct Contact</h3>
                                            <p className="text-gray-600 dark:text-gray-400 font-medium">hello@aifur.pk</p>
                                            <p className="text-gray-600 dark:text-gray-400 font-medium">+92 300 1234567</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-5">
                                        <div className="p-4 bg-orange-50 dark:bg-orange-900/30 rounded-2xl text-orange-600 dark:text-orange-400 shadow-sm">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs mb-1">Operating Hours</h3>
                                            <p className="text-gray-600 dark:text-gray-400 font-medium">Daily: 11:00 AM - 11:00 PM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                                <p className="text-sm text-gray-500 italic">Experience the Viking spirit every single day.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form & Map */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 space-y-6 md:space-y-8"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl p-6 md:p-12 border border-gray-100 dark:border-gray-800">
                            {status === 'success' ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-16"
                                >
                                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 text-3xl">
                                        ✓
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Message Received!</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">We'll get back to you shortly. Thank you for reaching out.</p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="text-indigo-600 font-bold hover:underline"
                                    >
                                        Send another message
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Your Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:bg-white dark:focus:bg-gray-800 shadow-sm"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:bg-white dark:focus:bg-gray-800 shadow-sm"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            required
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:bg-white dark:focus:bg-gray-800 shadow-sm"
                                            placeholder="Event inquiry, feedback, etc."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Message</label>
                                        <textarea
                                            name="message"
                                            required
                                            rows="4"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all focus:bg-white dark:focus:bg-gray-800 shadow-sm resize-none"
                                            placeholder="Tell us what's on your mind..."
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 disabled:opacity-50 active:scale-95"
                                    >
                                        {status === 'sending' ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Live Map */}
                        <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-[2rem] overflow-hidden relative border border-gray-100 dark:border-gray-800 shadow-2xl group">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3318.591048866755!2d73.0526!3d33.71!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbf90163337a7%3A0xc3412a8e805d2146!2sBlue%20Area%2C%20Islamabad%2C%20Islamabad%20Capital%20Territory!5e0!3m2!1sen!2spk!4v1715150000000!5m2!1sen!2spk" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Aifur Restaurant Location"
                                className="grayscale contrast-125 dark:opacity-80 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                            ></iframe>
                            <div className="absolute top-4 left-4 pointer-events-none">
                                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                                    Interactive Map
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
