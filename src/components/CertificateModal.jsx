import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

const CertificateModal = ({ isOpen, onClose, courseName }) => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    // Handle animation state
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen && !isVisible) return null;

    return createPortal(
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
            >
                {/* Confetti Background Effect */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
                    <div className="absolute top-10 left-10 w-4 h-4 rounded-full bg-yellow-400 animate-[bounce_2s_infinite]"></div>
                    <div className="absolute top-20 right-20 w-3 h-3 rounded-full bg-blue-400 animate-[ping_1.5s_infinite]"></div>
                    <div className="absolute bottom-10 left-1/3 w-5 h-5 rounded-full bg-red-400 animate-[pulse_2s_infinite]"></div>
                    <div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-green-400 animate-[bounce_3s_infinite]"></div>
                    <div className="absolute bottom-20 right-10 w-6 h-6 rounded-full bg-purple-400 animate-[ping_2s_infinite]"></div>
                </div>

                <div className="text-center p-8 relative z-10">
                    {/* Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-2 border-white dark:border-gray-700">
                        <span className="text-4xl animate-[bounce_1s_ease-in-out_1]">🎓</span>
                    </div>

                    {/* Text */}
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3 tracking-tight">
                        Congratulations!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        You have successfully completed the
                        <span className="block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mt-1">
                            {courseName}
                        </span>
                        course!
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => { onClose(); navigate('/certificate'); }}
                            className="w-full py-3.5 px-6 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold rounded-2xl shadow-xl shadow-yellow-500/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all text-lg group"
                        >
                            <span className="flex items-center justify-center gap-2">
                                View Certificate
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full py-3 px-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium transition-colors text-sm hover:underline"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CertificateModal;
