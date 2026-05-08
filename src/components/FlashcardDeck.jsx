import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FlashcardDeck({ cards }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    if (!cards || cards.length === 0) {
        return <div className="text-center p-10 text-gray-500">No flashcards available for this lesson.</div>;
    }

    const currentCard = cards[currentIndex];

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 200);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
        }, 200);
    };

    return (
        <div className="flex flex-col items-center justify-center py-6 md:py-10">
            <div className="w-full max-w-sm md:max-w-md h-56 md:h-64 perspective-1000 cursor-pointer group px-4 md:px-0" onClick={() => setIsFlipped(!isFlipped)}>
                <motion.div
                    className="relative w-full h-full text-center transition-all duration-500 transform-style-3d shadow-xl rounded-2xl"
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Front */}
                    <div
                        className="absolute inset-0 w-full h-full bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center p-4 md:p-6"
                        style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                    >
                        <span className="text-[10px] md:text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2 md:mb-4">Question</span>
                        <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white px-2">{currentCard.front}</h3>
                        <p className="absolute bottom-3 md:bottom-4 text-[10px] md:text-xs text-gray-400">Tap to flip ↻</p>
                    </div>

                    {/* Back */}
                    <div
                        className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl flex flex-col items-center justify-center p-4 md:p-6 overflow-y-auto"
                        style={{
                            transform: 'rotateY(180deg)',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden'
                        }}
                    >
                        <span className="text-[10px] md:text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2 md:mb-4">Answer</span>
                        <p className="text-base md:text-lg font-medium leading-relaxed px-2">{currentCard.back}</p>
                    </div>
                </motion.div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex items-center gap-6">
                <button
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className="p-3 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
                >
                    ←
                </button>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {currentIndex + 1} / {cards.length}
                </span>
                <button
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="p-3 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
                >
                    →
                </button>
            </div>
        </div>
    );
}
