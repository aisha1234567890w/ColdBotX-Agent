import { motion, AnimatePresence } from 'framer-motion';

export default function AchievementModal({ isOpen, achievement, onClose }) {
    if (!isOpen || !achievement) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-yellow-200 dark:border-yellow-600 relative overflow-hidden"
                >
                    {/* Confetti / Ray Effect Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 -z-10"></div>

                    <div className="mb-6 relative">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                            className="text-8xl filter drop-shadow-lg"
                        >
                            {achievement.icon}
                        </motion.div>
                    </div>

                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                        Achievement Unlocked!
                    </h2>

                    <h3 className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">
                        {achievement.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg font-medium">
                        {achievement.description}
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-2xl shadow-lg transform transition hover:scale-105 active:scale-95 text-lg"
                    >
                        Awesome! 🚀
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
