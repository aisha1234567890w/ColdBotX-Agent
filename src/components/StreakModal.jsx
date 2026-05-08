import { motion, AnimatePresence } from 'framer-motion';

export default function StreakModal({ isOpen, streak, onClose }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-orange-100 dark:border-orange-900/30 relative overflow-hidden"
                >
                    {/* Confetti / background effects could go here */}

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6 relative"
                    >
                        <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                        <span className="text-8xl relative z-10 drop-shadow-lg">🔥</span>
                    </motion.div>

                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-black text-orange-500 mb-2 uppercase tracking-wide"
                    >
                        Streak Increased!
                    </motion.h2>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="py-4"
                    >
                        <div className="text-6xl font-black text-gray-800 dark:text-white mb-1">
                            {streak}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 font-bold text-lg uppercase tracking-wider">
                            Days
                        </div>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-gray-600 dark:text-gray-300 mb-8 mt-2"
                    >
                        You're on fire! Keep the habit going tomorrow.
                    </motion.p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-2xl shadow-lg border-b-4 border-orange-700 hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all"
                    >
                        CONTINUE
                    </motion.button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
