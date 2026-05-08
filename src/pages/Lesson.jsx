import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { apiCall, API_BASE_URL } from '../utils/api';
import FlashcardDeck from '../components/FlashcardDeck';
import logo from '../assets/logo.png';
import CodeLab from '../components/CodeLab';
import AiTutor from '../components/AiTutor';
import SocraticReview from '../components/SocraticReview';
import html2pdf from 'html2pdf.js';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// Custom Markdown Components for Styling
const MarkdownComponents = {
    h1: ({ children }) => (
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            {children}
        </h1>
    ),
    h2: ({ children }) => {
        const text = String(children);
        const isAnalogy = text.includes('Analogy');
        return (
            <h2 className={`text-2xl font-bold mt-8 mb-4 flex items-center gap-2 ${isAnalogy ? 'text-orange-600 dark:text-orange-400' : 'text-gray-800 dark:text-gray-100'}`}>
                <span className={isAnalogy ? 'text-orange-500' : 'text-indigo-500'}>
                    {isAnalogy ? '🧠' : '✨'}
                </span>
                {children}
            </h2>
        );
    },
    h3: ({ children }) => (
        <h3 className="text-xl font-bold mt-6 mb-3 text-gray-800 dark:text-gray-100 border-l-4 border-indigo-500 pl-3">
            {children}
        </h3>
    ),
    p: ({ children }) => (
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {children}
        </p>
    ),
    code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        const language = match ? match[1] : 'text';

        return !inline && match ? (
            <div className="relative group my-8 rounded-xl overflow-hidden bg-[#1e1e1e] border border-gray-700 shadow-2xl code-block-wrapper">
                <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-gray-700">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{language}</span>
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"></div>
                    </div>
                </div>
                <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={language}
                    PreTag="div"
                    className="!bg-transparent !m-0 !p-6 overflow-x-auto custom-scrollbar"
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            </div>
        ) : (
            <code className="text-pink-600 dark:text-pink-400 font-mono text-sm font-bold" {...props}>
                {children}
            </code>
        );
    },
    table: ({ children }) => (
        <div className="overflow-x-auto my-8 w-full border border-gray-200 dark:border-gray-700/60 rounded-xl shadow-sm bg-white dark:bg-[#1e1e1e]/40">
            <table className="w-full text-sm text-left">{children}</table>
        </div>
    ),
    thead: ({ children }) => (
        <thead className="bg-gray-50/80 dark:bg-[#252526] border-b border-gray-200 dark:border-gray-700/60 uppercase text-xs tracking-wider text-gray-500 dark:text-gray-400">
            {children}
        </thead>
    ),
    th: ({ children }) => (
        <th className="px-6 py-4 font-semibold whitespace-nowrap">{children}</th>
    ),
    td: ({ children }) => (
        <td className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/40 text-gray-600 dark:text-gray-300">{children}</td>
    ),
    tr: ({ children }) => (
        <tr className="hover:bg-gray-50/50 dark:hover:bg-[#2a2d31] transition-colors last:border-0">{children}</tr>
    ),
    pre: ({ children }) => <>{children}</>,
    ul: ({ children }) => (
        <ul className="space-y-3 my-6 list-none">
            {children}
        </ul>
    ),
    li: ({ children }) => (
        <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
            <span className="mt-1.5 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
            <span>{children}</span>
        </li>
    ),
    blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-r-lg my-6 italic text-gray-700 dark:text-gray-300">
            {children}
        </blockquote>
    )
};

export default function Lesson() {
    const location = useLocation();
    const navigate = useNavigate();

    // Data State
    const [lessonData, setLessonData] = useState({ markdown: '', flashcards: [], challenge: null });
    const [loading, setLoading] = useState(true);
    // Audio State
    const [audioUrl, setAudioUrl] = useState(null);
    const [audioLoading, setAudioLoading] = useState(false);

    // UI State
    const [activeTab, setActiveTab] = useState('lesson'); // 'lesson', 'cards', 'lab'
    const contentRef = useRef(null);
    const dataFetchedRef = useRef(false);

    // Read user tier from localStorage
    const userTier = (() => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return user.tier || 'free';
        } catch { return 'free'; }
    })();

    const getBase64ImageFromUrl = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            };
            img.onerror = (error) => reject(error);
            img.src = url;
        });
    };



    const handlePlayAudio = async () => {
        if (audioUrl) return; // Already loaded

        try {
            setAudioLoading(true);
            const textToSpeak = contentRef.current.innerText; // Get raw text from DOM

            const response = await apiCall('/generate-audio', {
                method: 'POST',
                body: JSON.stringify({
                    text: textToSpeak,
                    topic: topic
                })
            });

            if (response.success) {
                setAudioUrl(API_BASE_URL + response.audioUrl);
            } else {
                alert('Audio generation failed. Please try again.');
            }
        } catch (error) {
            console.error('Audio generation failed:', error);
            alert('Could not generate audio for this lesson.');
        } finally {
            setAudioLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        const content = contentRef.current;

        // Clone the content to modify it for PDF generation without affecting the UI
        const clonedContent = content.cloneNode(true);

        // --- 1. Fix Heading Gradients (html2canvas struggles with clip-text) ---
        const titles = clonedContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
        titles.forEach(title => {
            // Force solid color for headings
            title.style.background = 'none';
            title.style.webkitTextFillColor = 'initial';
            title.style.color = '#4f46e5'; // Indigo-600
            if (title.tagName === 'H1') title.style.color = '#111827'; // Black for H1
        });

        // --- 2. Force Dark Text (Fix for Dark Mode -> White PDF) ---
        // We select all text containers and force dark color
        const textElements = clonedContent.querySelectorAll('p, li, span, div');
        textElements.forEach(el => {
            // Skip code blocks components (syntax highlighter spans)
            // We identify them by parents or classes usually, but simplistic check:
            if (el.closest('pre') || el.closest('code') || el.className.includes('syntax-highlighted')) return;

            // Force override potentially white text from dark mode
            el.style.color = '#1f2937'; // Gray-800
        });

        // --- 3. Fix Code Blocks ---
        // Ensure they wrap correctly and have valid contrast
        const codeBlocks = clonedContent.querySelectorAll('pre');
        codeBlocks.forEach(block => {
            block.style.whiteSpace = 'pre-wrap';
            block.style.wordBreak = 'break-word';
            block.style.overflow = 'visible';
            // Force a dark background for code blocks so light text is visible
            block.style.backgroundColor = '#1e1e1e';
            block.style.color = '#d4d4d4';
            block.style.padding = '1rem';
            block.style.borderRadius = '0.5rem';
        });

        // --- 4. Fix Page Breaks (Prevent slicing text in half) ---
        // We force paragraphs, headings, and lists to stay together.
        // This prevents text slicing but might leave some whitespace at the bottom of pages.
        const blockElements = clonedContent.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote, .code-block-wrapper, table, figure');
        blockElements.forEach(el => {
            el.style.pageBreakInside = 'avoid';
            el.style.breakInside = 'avoid';
            el.style.display = 'block';
            el.style.position = 'relative';
        });

        // --- 5. Fix Inline Code (Remove Box, Ensure Wrap) ---
        // User requested NO HIGHLIGHTS (no box/background). Just ensure text wraps.
        const inlineCode = clonedContent.querySelectorAll('code, span.highlight, span[class*="text-"], span[class*="bg-"]');
        inlineCode.forEach(el => {
            const isCode = el.tagName === 'CODE';
            const isSpan = el.tagName === 'SPAN';
            // CRITICAL FIX: Also check for our custom code block wrapper since PreTag="div"
            const insidePre = el.closest('pre') || el.closest('.code-block-wrapper');

            // Only apply to truly inline elements
            if ((isCode || isSpan) && !insidePre) {
                // RESET Styles for clean PDF print (No Box)
                el.style.backgroundColor = 'transparent';
                el.style.color = '#db2777'; // Pink-600 to match new UI style (or safe dark color)
                el.style.border = 'none';
                el.style.padding = '0';
                el.style.borderRadius = '0';

                // Ensure wrapping
                el.style.display = 'inline';
                el.style.whiteSpace = 'normal';
                el.style.wordBreak = 'break-word';
                el.style.boxShadow = 'none';
                el.style.margin = '0';

                // Remove potential dark mode classes impact
                el.className = el.className.replace(/dark:[^ ]+/g, '');
            }
        });

        // Create a wrapper for the printable content
        const wrapper = document.createElement('div');
        wrapper.className = 'pdf-container';
        // Explicit styles to ensure reset
        wrapper.style.padding = '20px';
        wrapper.style.backgroundColor = '#ffffff';
        wrapper.style.color = '#1f2937';
        wrapper.style.fontFamily = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
        // Global width constraint to prevent horizontal overflow
        wrapper.style.maxWidth = '100%';
        wrapper.style.width = '100%';
        wrapper.style.boxSizing = 'border-box';

        // Custom Header
        const header = document.createElement('div');
        header.style.marginBottom = '2rem';
        header.style.borderBottom = '2px solid #e5e7eb';
        header.style.paddingBottom = '1rem';
        header.innerHTML = `
            <div style="font-size: 0.875rem; color: #4f46e5; margin-bottom: 0.5rem; font-weight: 600;">
                📘 ${subject} • ${level}
            </div>
            <h1 style="font-size: 2.25rem; line-height: 2.5rem; font-weight: 800; color: #111827; margin: 0;">
                ${topic}
            </h1>
        `;

        wrapper.appendChild(header);
        wrapper.appendChild(clonedContent);

        const logoBase64 = await getBase64ImageFromUrl(logo);

        const opt = {
            margin: [0.4, 0.4], // Reduced margins
            filename: `${topic.replace(/\s+/g, '_')}_Lesson.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                backgroundColor: '#ffffff', // Crucial: Force white background
                scrollY: 0, // Reset scroll to ensure full capture
            },
            pagebreak: {
                mode: ['css', 'legacy'], // 'legacy' attempts to respect page-break properties
                before: '.page-break-before',
                after: '.page-break-after',
                avoid: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote', 'pre', 'table', 'figure', '.code-block-wrapper']
            },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(wrapper).toPdf().get('pdf').then((pdf) => {
            const totalPages = pdf.internal.getNumberOfPages();
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.saveGraphicsState();
                pdf.setGState(new pdf.GState({ opacity: 0.1 }));
                pdf.addImage(logoBase64, 'PNG', (pageWidth / 2) - 1.5, (pageHeight / 2) - 1.5, 3, 3);
                pdf.restoreGraphicsState();
            }
        }).save();
    };

    // Get params from navigation with robust fallback
    let state = location.state || {};

    // If state is missing critical data (e.g. refresh), try to recover from localStorage
    if (!state.topic) {
        const savedContext = localStorage.getItem('activeLesson');
        if (savedContext) {
            try {
                state = JSON.parse(savedContext);
                console.log("♻️ Restored lesson context from storage:", state);
            } catch (e) {
                console.warn("Failed to parse saved lesson context");
            }
        }
    }

    const topic = state.topic || 'Introduction';
    const subject = state.subject || localStorage.getItem('course') || 'Python';
    const level = state.level || localStorage.getItem('level') || 'Beginner';

    console.log("📌 Lesson Component Initialized");
    console.log("📍 Location State:", location.state);
    console.log("💾 LocalStorage activeLesson:", localStorage.getItem('activeLesson'));
    console.log("✅ Final Resolved Params:", { topic, subject, level });

    useEffect(() => {
        async function fetchLesson() {
            if (dataFetchedRef.current) return;
            dataFetchedRef.current = true;

            try {
                setLoading(true);
                // Get user interests for personalization
                let user = {};
                try {
                    user = JSON.parse(localStorage.getItem('user')) || {};
                } catch (e) {
                    console.warn("User parse error", e);
                }

                const userContext = {
                    interests: user.interests || user.bio || '',
                    goal: user.goal || ''
                };

                const payload = {
                    subject,
                    topic,
                    level,
                    userContext,
                    previousTopic: state.previousTopic || null,
                    nextTopic: state.nextTopic || null,
                    unitTitle: state.unitTitle || null
                };
                console.log("🚀 Calling /generate-lesson with payload:", payload);

                const data = await apiCall('/generate-lesson', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });

                if (data && data.success) {
                    let finalLesson = data.lesson;

                    // helper: try to parse if string
                    if (typeof finalLesson === 'string') {
                        try {
                            // Try parsing stringified JSON
                            const parsed = JSON.parse(finalLesson);
                            if (parsed && typeof parsed === 'object' && parsed.markdown) {
                                finalLesson = parsed;
                            }
                        } catch (e) {
                            // Not JSON, just regular markdown string
                        }
                    }

                    if (typeof finalLesson === 'object' && finalLesson.markdown) {
                        setLessonData(finalLesson);
                    } else {
                        // Fallback for legacy format or raw markdown failure
                        setLessonData({ markdown: finalLesson || '# Error\nNo content.', flashcards: [], challenge: null });
                    }
                } else {
                    setLessonData({ markdown: '# Error\nFailed to load lesson content.', flashcards: [], challenge: null });
                }
            } catch (error) {
                console.error('Lesson fetch error:', error);
                setLessonData({ markdown: '# Error\nCould not connect to the AI Tutor.', flashcards: [], challenge: null });
            } finally {
                setLoading(false);
            }
        }

        fetchLesson();
    }, [topic, subject, level]);

    const handleStartQuiz = () => {
        // Don't pass error messages as context to the quiz agent
        const validContent = lessonData?.markdown?.startsWith('# Error')
            ? ''
            : lessonData?.markdown;

        navigate('/quiz', {
            state: {
                topic: `${subject}: ${topic}`,
                lessonTitle: topic, // Pass raw lesson title for completion tracking
                subject: subject,
                level: level,
                lessonContent: validContent,
                quizMode: 'lesson'
            }
        });
    };

    const isPremium = true; // DEV MODE: All users get premium features during development
    // const isPremium = userTier === 'premium'; // PROD: Uncomment this for production

    const tabs = [
        { id: 'lesson', label: '📖 Lesson', count: null },
        { id: 'socratic', label: '🧠 Socratic Review', count: null, premium: true },
        { id: 'cards', label: '🃏 Flashcards', count: lessonData?.flashcards?.length || 0 }
    ];

    if (lessonData?.challenge) {
        tabs.push({ id: 'lab', label: '👨‍💻 Code Lab', count: 1 });
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 pb-24">

            {/* AI Tutor Widget */}
            {!loading && <AiTutor topic={topic} subject={subject} lessonContext={lessonData?.markdown} />}

            {/* Navbar / Header */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        <span className="font-medium text-sm">Dashboard</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest hidden sm:inline">
                            AI LIVE LESSON
                        </span>
                        {/* Mobile Tab Switcher partial view could go here, but let's keep it simple */}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-900 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Generating Lesson...</h3>
                            <p className="text-gray-500 dark:text-gray-400">Preparing your personalized content, flashcards, and labs ⚡</p>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Header Section */}
                        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs md:text-sm font-semibold mb-3 md:mb-4">
                                    <span>📘</span> {subject} &bull; {level}
                                </div>
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">{topic}</h1>
                            </div>

                            {activeTab === 'lesson' && (
                                <div className="flex flex-row md:flex-row items-center justify-center md:justify-end gap-2 w-full md:w-auto mt-2 md:mt-0">
                                    <button
                                        onClick={handleDownloadPDF}
                                        className="flex-1 md:flex-none px-3 py-2 md:px-4 md:py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm md:text-base font-medium shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                                    >
                                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        <span className="hidden sm:inline">Download</span> PDF
                                    </button>

                                    <div className="flex-1 md:flex-none flex items-center justify-center gap-2">
                                        {audioUrl ? (
                                            <audio
                                                controls
                                                autoPlay
                                                className="h-10 w-full max-w-[200px] md:w-64 rounded-lg shadow-md"
                                                src={audioUrl}
                                                onError={() => {
                                                    console.error('Audio file failed to load:', audioUrl);
                                                    setAudioUrl(null);
                                                    alert('Audio file could not be loaded. Click Listen to retry.');
                                                }}
                                            >
                                                Your browser does not support the audio element.
                                            </audio>
                                        ) : (
                                            <button
                                                onClick={handlePlayAudio}
                                                disabled={audioLoading}
                                                className="w-full md:w-auto px-3 py-2 md:px-4 md:py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm md:text-base font-medium shadow-lg hover:shadow-pink-500/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-wait"
                                            >
                                                {audioLoading ? (
                                                    <>
                                                        <svg className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        <span className="hidden sm:inline">Generating...</span>
                                                        <span className="sm:hidden">Wait...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>🔊</span> Listen
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="flex space-x-1 bg-gray-200 dark:bg-gray-800 p-1 rounded-xl mb-6 md:mb-8 overflow-x-auto scrollbar-hide">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        if (tab.premium && !isPremium) return; // Block click for locked tabs
                                        setActiveTab(tab.id);
                                    }}
                                    className={`relative min-w-[120px] flex-1 py-2 md:py-3 px-3 md:px-4 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-sm'
                                        : tab.premium && !isPremium
                                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                        }`}
                                >
                                    {tab.label}
                                    {tab.premium && !isPremium && (
                                        <span className="ml-1 text-[10px]">🔒</span>
                                    )}
                                    {tab.premium && isPremium && (
                                        <span className="ml-1 text-[10px]">👑</span>
                                    )}
                                    {tab.count > 0 && (
                                        <span className={`ml-1 md:ml-2 px-1.5 md:px-2 py-0.5 rounded-full text-[9px] md:text-[10px] ${activeTab === tab.id
                                            ? 'bg-indigo-100 text-indigo-700 dark:bg-gray-600 dark:text-white'
                                            : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                            }`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="min-h-[500px]">
                            <AnimatePresence mode="wait">
                                {activeTab === 'lesson' && (
                                    <motion.div
                                        key="lesson"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/50 overflow-hidden ring-1 ring-black/5"
                                    >
                                        <div className="h-1.5 md:h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                                        <div className="p-5 md:p-12" ref={contentRef}>
                                            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                                                <ReactMarkdown
                                                    components={MarkdownComponents}
                                                    remarkPlugins={[remarkMath, remarkGfm]}
                                                    rehypePlugins={[rehypeKatex]}
                                                >
                                                    {/* Preprocess to ensure block math has newlines and correct delimiters */}
                                                    {lessonData.markdown
                                                        // Map block math \\[ \\] to $$ ... $$ properly
                                                        .replace(/\\\[/g, '$$$$')
                                                        .replace(/\\\]/g, '$$$$')
                                                        // Map inline math \\( \\) to $ ... $ properly
                                                        .replace(/\\\(/g, '$')
                                                        .replace(/\\\)/g, '$')
                                                        // Fix backslash escapes that get doubled from the LLM JSON (e.g. \\\\theta -> \\theta)
                                                        .replace(/\\\\([A-Za-z])/g, '\\$1')
                                                    }
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'socratic' && (
                                    <motion.div
                                        key="socratic"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {isPremium ? (
                                            <SocraticReview
                                                topic={topic}
                                                subject={subject}
                                                level={level}
                                                lessonContent={lessonData?.markdown}
                                                onComplete={(xp) => {
                                                    console.log(`Socratic review complete! Earned ${xp} XP`);
                                                    setActiveTab('lab');
                                                }}
                                            />
                                        ) : (
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
                                                <div className="text-6xl mb-4">👑</div>
                                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Premium Feature</h3>
                                                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                                                    Socratic Review uses AI to test your understanding through guided questions.
                                                    Upgrade to Premium to unlock this interactive learning experience.
                                                </p>
                                                <button
                                                    onClick={() => window.location.href = '/pricing'}
                                                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
                                                >
                                                    ✨ Upgrade to Premium
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {activeTab === 'cards' && (
                                    <motion.div
                                        key="cards"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Flashcards</h2>
                                            <p className="text-gray-500">Test your recall before the code lab!</p>
                                        </div>
                                        <FlashcardDeck cards={lessonData.flashcards} />
                                    </motion.div>
                                )}

                                {activeTab === 'lab' && (
                                    <motion.div
                                        key="lab"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <CodeLab challenge={lessonData.challenge} subject={subject} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer Action */}
                        <div className="mt-12 flex justify-end border-t border-gray-200 dark:border-gray-800 pt-8">
                            <button
                                onClick={handleStartQuiz}
                                className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                            >
                                <span>Take Quiz & Finish</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>

                    </motion.div>
                )}
            </div>
        </div>
    );
}
