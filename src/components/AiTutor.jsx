import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { apiCall } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function AiTutor({ topic, subject, lessonContext }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: `Hi! I'm your AI Tutor. Ask me anything about ${topic}!` }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsTyping(true);

        try {
            const data = await apiCall('/chat-lesson', {
                method: 'POST',
                body: JSON.stringify({
                    question: userMsg,
                    topic,
                    subject,
                    lessonContext
                })
            });

            if (data && data.success) {
                // Fix: React Error "Objects are not valid as a React child"
                // If answer is an object (common with some LLM wrappers), extract text
                let aiResponse = data.answer;
                if (typeof aiResponse === 'object' && aiResponse !== null) {
                    aiResponse = aiResponse.text || aiResponse.content || JSON.stringify(aiResponse);
                }
                setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
            } else {
                setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble thinking right now." }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', text: "Connection error." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-8 right-8 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <span className="text-2xl">💬</span>
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-8 z-40 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-indigo-600 p-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">AI</div>
                            <div>
                                <h3 className="text-white font-bold text-sm">Professor AI</h3>
                                <p className="text-indigo-200 text-xs">Always here to help</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 space-y-4">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700 rounded-tl-none'
                                        }`}>
                                        <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                                            <ReactMarkdown 
                                                remarkPlugins={[remarkMath]}
                                                rehypePlugins={[rehypeKatex]}
                                                components={{
                                                    p: ({ node, ...props }) => <p className="mb-0" {...props} />
                                                }}>
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-2xl rounded-tl-none flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask a question..."
                                    className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-200"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    disabled={!input.trim()}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
