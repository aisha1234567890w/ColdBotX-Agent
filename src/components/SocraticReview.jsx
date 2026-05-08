import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';
import { apiCall } from '../utils/api';

// XP feedback config
const XP_FEEDBACK = {
    correct:       { color: 'bg-emerald-500', glow: 'shadow-emerald-400/50', label: 'Correct!', emoji: '🎯' },
    partial:       { color: 'bg-amber-500',   glow: 'shadow-amber-400/50',   label: 'On track!', emoji: '💡' },
    misconception: { color: 'bg-rose-400',    glow: 'shadow-rose-400/50',    label: 'Keep going!', emoji: '🔄' },
};

export default function SocraticReview({ topic, subject, level, lessonContent, onComplete }) {
    const [socraticData, setSocraticData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Chat state
    const [currentNodeId, setCurrentNodeId] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [totalXP, setTotalXP] = useState(0);
    const [xpPopup, setXpPopup] = useState(null);
    const [showCompletionBonus, setShowCompletionBonus] = useState(false);
    const scrollRef = useRef(null);

    // Fetch Socratic tree from backend
    useEffect(() => {
        async function fetchSocratic() {
            try {
                setLoading(true);
                setError(null);

                const data = await apiCall('/generate-socratic', {
                    method: 'POST',
                    body: JSON.stringify({ subject, topic, level, lessonContent })
                });

                if (data && data.success && data.socratic) {
                    setSocraticData(data.socratic);
                    setCurrentNodeId(data.socratic.start);
                    setChatHistory([
                        { type: 'ai', text: data.socratic.nodes[data.socratic.start].tutor }
                    ]);
                } else {
                    setError('Failed to generate review questions.');
                }
            } catch (err) {
                console.error('Socratic fetch error:', err);
                setError('Could not connect to the AI Tutor.');
            } finally {
                setLoading(false);
            }
        }

        if (lessonContent && lessonContent.length > 50) {
            fetchSocratic();
        }
    }, [topic, subject, level]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [chatHistory, isTyping]);

    const handleOptionClick = (option) => {
        setChatHistory(prev => [...prev, { type: 'user', text: option.text }]);

        // Award XP
        const earnedXP = option.xp || 0;
        const quality = option.quality || 'partial';
        if (earnedXP > 0) {
            setTotalXP(prev => prev + earnedXP);
            setXpPopup({ amount: earnedXP, quality });
            setTimeout(() => setXpPopup(null), 2000);
        }

        // Simulate AI thinking
        setIsTyping(true);
        setTimeout(() => {
            const nextNode = socraticData.nodes[option.next];
            setChatHistory(prev => [...prev, { type: 'ai', text: nextNode.tutor }]);
            setCurrentNodeId(option.next);
            setIsTyping(false);

            // Completion bonus
            if (nextNode.isEnd) {
                setTimeout(() => {
                    const bonus = socraticData.completionBonusXP || 20;
                    setTotalXP(prev => prev + bonus);
                    setShowCompletionBonus(true);
                }, 600);
            }
        }, 1200);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-900 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Generating your Socratic review...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <div className="text-5xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Couldn't Load Review</h3>
                <p className="text-gray-500 dark:text-gray-400">{error}</p>
            </div>
        );
    }

    if (!socraticData) return null;

    const currentNode = socraticData.nodes[currentNodeId];
    const maxXP = socraticData.totalPossibleXP || 170;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-xl overflow-hidden ring-1 ring-black/5">
            {/* Header */}
            <div className="bg-indigo-600 p-4 md:p-5 flex items-center gap-3 text-white relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-lg">🧠</span>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base">Socratic Review</h3>
                    <p className="text-indigo-200 text-xs font-medium">{topic}</p>
                </div>

                {/* XP Counter */}
                <motion.div
                    className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-xl px-3 py-1.5"
                    animate={xpPopup ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.3 }}
                >
                    <span className="text-yellow-300 text-sm">⚡</span>
                    <motion.span
                        key={totalXP}
                        initial={{ y: -8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-sm font-bold tabular-nums"
                    >
                        {totalXP}
                    </motion.span>
                    <span className="text-xs text-indigo-200">XP</span>
                </motion.div>
            </div>

            {/* XP Progress Bar */}
            <div className="bg-gray-100 dark:bg-gray-700 h-1.5 relative">
                <motion.div
                    className="h-full bg-gradient-to-r from-yellow-400 via-emerald-400 to-emerald-500 rounded-r-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${Math.min((totalXP / maxXP) * 100, 100)}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                />
            </div>

            {/* XP Popup Toast */}
            <div className="relative">
                <AnimatePresence>
                    {xpPopup && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.8 }}
                            className="absolute top-2 left-1/2 -translate-x-1/2 z-50"
                        >
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-white font-bold text-sm shadow-lg ${XP_FEEDBACK[xpPopup.quality].color} ${XP_FEEDBACK[xpPopup.quality].glow}`}>
                                <span>{XP_FEEDBACK[xpPopup.quality].emoji}</span>
                                <span>{XP_FEEDBACK[xpPopup.quality].label}</span>
                                <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs">+{xpPopup.amount} XP</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="h-[400px] overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50 dark:bg-gray-900/50 scroll-smooth">
                <AnimatePresence initial={false}>
                    {chatHistory.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex gap-3 max-w-[85%] ${msg.type === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                        >
                            <div className={`w-7 h-7 flex-shrink-0 mt-1 rounded-full flex items-center justify-center text-xs ${
                                msg.type === 'user' ? 'bg-gray-800 text-white' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
                            }`}>
                                {msg.type === 'user' ? '👤' : '🧠'}
                            </div>

                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                msg.type === 'user'
                                    ? 'bg-gray-800 text-white rounded-tr-sm'
                                    : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm'
                            }`}>
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkMath, remarkGfm]}
                                        rehypePlugins={[rehypeKatex]}
                                        components={{
                                            p: ({node, ...props}) => <p className="m-0 mb-2 last:mb-0" {...props} />
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 max-w-[80%]">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs">🧠</div>
                        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Options / Completion Area */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                {!isTyping && currentNode.options && currentNode.options.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col gap-2"
                    >
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 ml-1">Your answer:</p>
                        {currentNode.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleOptionClick(opt)}
                                className="w-full text-left px-4 py-3 bg-indigo-50/50 dark:bg-indigo-900/20 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800 hover:border-indigo-300 text-indigo-900 dark:text-indigo-100 rounded-xl transition-all duration-200 flex items-center justify-between group text-sm"
                            >
                                <span className="font-medium flex-1 mr-2 prose prose-sm dark:prose-invert max-w-none [&>p]:m-0 [&_p]:inline-block">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkMath, remarkGfm]}
                                        rehypePlugins={[rehypeKatex]}
                                    >
                                        {opt.text}
                                    </ReactMarkdown>
                                </span>
                                <svg className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        ))}
                    </motion.div>
                )}

                {!isTyping && currentNode.isEnd && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center p-6 text-center"
                    >
                        <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
                            <span className="text-2xl">🏆</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Review Complete!</h3>

                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-yellow-500">⚡</span>
                            <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{totalXP}</span>
                            <span className="text-sm text-gray-400">/ {maxXP} XP</span>
                        </div>

                        {showCompletionBonus && (
                            <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-1">
                                🎁 +{socraticData.completionBonusXP} Completion Bonus!
                            </motion.p>
                        )}

                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                            {totalXP >= maxXP * 0.9
                                ? '🌟 Perfect score! You truly mastered this topic.'
                                : totalXP >= maxXP * 0.6
                                ? '👏 Great job! You have a solid understanding.'
                                : '💪 Good effort! Review the lesson to strengthen your knowledge.'}
                        </p>

                        {onComplete && (
                            <button
                                onClick={() => onComplete(totalXP)}
                                className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:opacity-90 transition-all shadow-lg text-sm"
                            >
                                Continue to Code Lab →
                            </button>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
