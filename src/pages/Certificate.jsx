import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import logo from '../assets/logo.png';

export default function Certificate() {
    const navigate = useNavigate();
    const certificateRef = useRef(null);
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [containerSize, setContainerSize] = useState({ width: 1000, height: 707, scale: 1 });

    // Scale Logic: Fit 1000px design into available width
    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const availableWidth = containerRef.current.offsetWidth;
                // Clamp width to avoid weird zero/infinity issues
                if (availableWidth === 0) return;

                const scale = availableWidth / 1000;
                setContainerSize({
                    width: availableWidth,
                    height: availableWidth / 1.414,
                    scale: scale
                });
            }
        };

        const observer = new ResizeObserver(updateScale);
        if (containerRef.current) observer.observe(containerRef.current);

        // Initial call
        updateScale();

        return () => observer.disconnect();
    }, []);

    const [userData, setUserData] = useState({
        name: 'Student Name',
        course: 'Course Name',
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        id: 'LX-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    });

    useEffect(() => {
        // Load specific user data
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const course = localStorage.getItem('course') || 'Computer Science';

        if (user.name) {
            setUserData(prev => ({
                ...prev,
                name: user.name,
                course: course
            }));
        }
    }, []);

    const handleDownload = () => {
        setLoading(true);
        const element = certificateRef.current;

        // Configure PDF options
        const opt = {
            margin: 0,
            filename: `${userData.name.replace(/\s+/g, '_')}_Certificate.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2pdf: { scale: 2 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            setLoading(false);
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
            {/* Navigation & Actions */}
            <div className="w-full max-w-5xl flex justify-between items-center mb-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                </button>

                <button
                    onClick={handleDownload}
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg transition-all flex items-center gap-2 transform hover:scale-105"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    )}
                    Download Certificate PDF
                </button>
            </div>

            {/* Certificate Frame - Scale-Based Responsive */}
            <div
                ref={containerRef}
                className="relative shadow-2xl rounded-sm bg-white text-gray-900 w-full max-w-5xl mx-auto overflow-hidden bg-gray-50 dark:bg-gray-800"
                style={{
                    height: containerSize.height,
                    transition: 'height 0.1s ease-out'
                }}
            >
                {/* 
                    FIXED DIMENSION INNER CONTAINER 
                    We design this ONCE at "1000px" width.
                    The transform ensures it fits any screen.
                */}
                <div
                    ref={certificateRef}
                    className="absolute top-0 left-1/2 bg-white flex flex-col items-center justify-between border-[20px] border-double border-yellow-600/20 shadow-lg"
                    style={{
                        width: '1000px',
                        height: '707px', // 1000 / 1.414
                        transform: `translateX(-50%) scale(${containerSize.scale})`,
                        transformOrigin: 'top center',
                        padding: '3rem' // fixed desktop padding
                    }}
                >

                    {/* QR Code - Top Right Absolute Position */}
                    <div className="absolute top-6 right-6 z-10 opacity-80">
                        <div className="bg-white p-1 border border-gray-200 shadow-sm">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${userData.id}`}
                                alt="Validation QR"
                                className="w-12 h-12"
                                crossOrigin="anonymous"
                            />
                        </div>
                        <p className="text-[10px] text-center text-gray-400 mt-1 tracking-wider">VALIDATION</p>
                    </div>

                    {/* Ornamental Background Pattern */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 20px 20px, #000 2px, transparent 0)',
                            backgroundSize: '40px 40px'
                        }}>
                    </div>

                    {/* Corner Ornaments */}
                    <div className="absolute top-0 left-0 w-32 h-32 border-t-[8px] border-l-[8px] border-yellow-600"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 border-t-[8px] border-r-[8px] border-yellow-600"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 border-b-[8px] border-l-[8px] border-yellow-600"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[8px] border-r-[8px] border-yellow-600"></div>

                    {/* Header */}
                    <div className="text-center mt-2">
                        <div className="flex flex-col items-center justify-center gap-1 mb-1">
                            <img src={logo} alt="Learnoviax" className="h-20 w-20 object-contain" />
                            <span className="text-sm font-bold tracking-[0.3em] text-gray-400 uppercase mt-1">Learnoviax</span>
                        </div>
                        <h1 className="text-5xl font-serif text-yellow-700 tracking-wider uppercase mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Certificate
                        </h1>
                        <h2 className="text-xl font-serif text-yellow-600 uppercase tracking-[0.2em] mb-2">
                            of Achievement
                        </h2>
                    </div>

                    {/* Body */}
                    <div className="text-center flex-1 flex flex-col justify-center w-full max-w-4xl py-2">
                        <p className="text-lg text-gray-500 italic mb-2 font-serif">This certifies that</p>

                        <h3 className="text-4xl font-bold text-gray-800 mb-2 border-b-2 border-gray-200 pb-2 mx-20 font-serif capitalize">
                            {userData.name}
                        </h3>

                        <p className="text-lg text-gray-500 italic mt-4 mb-2 font-serif">has successfully completed the comprehensive course</p>

                        <h4 className="text-3xl font-bold text-indigo-900 mb-6 font-serif">
                            {userData.course} Mastery
                        </h4>

                        <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed font-serif">
                            Demonstrating dedication, perseverance, and control over core concepts and practical applications required for this subject matter.
                        </p>
                    </div>

                    {/* Footer / Signatures */}
                    <div className="w-full flex justify-between items-end mt-4 px-12 pb-4">
                        <div className="text-center">
                            <div className="text-xl text-blue-900 mb-1 font-cursive" style={{ fontFamily: 'Cursive', fontStyle: 'italic' }}>
                                Alexander V.
                            </div>
                            <div className="w-48 h-px bg-gray-400 mb-1"></div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Director of Education</p>
                        </div>

                        <div className="flex flex-col items-center mb-2">
                            <div className="w-20 h-20 mb-1 opacity-80">
                                <div className="w-full h-full rounded-full border-[6px] border-yellow-500 flex items-center justify-center bg-yellow-50 text-yellow-600 relative">
                                    <div className="absolute inset-1 border border-yellow-500 rounded-full border-dashed"></div>
                                    <span className="text-3xl">🏅</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-400 font-mono tracking-widest">{userData.id}</p>
                        </div>

                        <div className="text-center">
                            <div className="text-lg text-gray-600 mb-1 font-serif">
                                {userData.date}
                            </div>
                            <div className="w-48 h-px bg-gray-400 mb-1"></div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Date Issued</p>
                        </div>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-gray-500 text-sm">
                This certificate is verified by Learnoviax AI Education Systems.
            </p>
        </div >
    );
}
