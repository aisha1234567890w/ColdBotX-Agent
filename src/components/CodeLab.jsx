import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { apiCall } from '../utils/api';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-csharp';

export default function CodeLab({ challenge, subject }) {
    const [code, setCode] = useState(challenge?.starterCode || '// Write your code here');
    const [feedback, setFeedback] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    // Initial highlighter run fix
    useEffect(() => {
        if (typeof window !== 'undefined') {
            Prism.highlightAll();
        }
    }, []);

    const getPistonLanguage = (subj) => {
        // Map our subjects to Piston languages
        const map = {
            'Python': 'python',
            'JavaScript': 'javascript',
            'C++': 'c++',
            'Java': 'java',
            'C#': 'csharp',
            'TypeScript': 'typescript'
        };
        return map[subj] || 'python';
    };

    const handleRun = async () => {
        setIsRunning(true);
        setFeedback(null);
        try {
            const lang = getPistonLanguage(subject);

            // AI Code Evaluation Call
            const data = await apiCall('/evaluate-code', {
                method: 'POST',
                body: JSON.stringify({
                    code: code,
                    challengeTitle: challenge.title,
                    subject: subject
                })
            });

            if (data.success) {
                setFeedback({
                    passed: data.passed,
                    consoleOutput: data.consoleOutput,
                    feedback: data.feedback,
                    tips: data.tips || []
                });
            } else {
                setFeedback({ 
                    passed: false, 
                    feedback: 'Error: Could not get evaluation.', 
                    tips: ['Please try again later.'] 
                });
            }

        } catch (error) {
            setFeedback({ passed: false, feedback: 'Error connecting to code evaluation engine.', tips: ['Check your connection.'] });
        } finally {
            setIsRunning(false);
        }
    };

    if (!challenge) return <div>No challenge available.</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 min-h-[600px]">
            {/* Editor Side */}
            <div className="flex flex-col h-[400px] lg:min-h-[600px] lg:h-full bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                <div className="bg-[#252526] px-3 md:px-4 py-2 md:py-3 flex items-center justify-between border-b border-gray-700">
                    <div className="flex space-x-1.5 md:space-x-2">
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500"></div>
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-[10px] md:text-xs text-gray-400 font-mono tracking-wide">main.{getPistonLanguage(subject) === 'python' ? 'py' : getPistonLanguage(subject) === 'javascript' ? 'js' : 'cs'}</span>
                </div>

                <div className="flex-1 overflow-auto relative font-mono text-sm custom-scrollbar" style={{ backgroundColor: '#2d2d2d' }}>
                    <Editor
                        value={code}
                        onValueChange={code => setCode(code)}
                        highlight={code => Prism.highlight(code, Prism.languages.csharp || Prism.languages.extend('clike', {}), 'csharp')}
                        padding={window.innerWidth < 768 ? 16 : 24}
                        style={{
                            fontFamily: '"Fira Code", "Source Code Pro", monospace',
                            fontSize: window.innerWidth < 768 ? 13 : 14,
                            lineHeight: '1.5',
                            backgroundColor: '#2d2d2d', // Match Tomorrow Night theme roughly
                            color: '#ccc',
                            counterReset: 'line'
                        }}
                        className="min-h-full"
                        textareaClassName="focus:outline-none"
                    />
                </div>
            </div>

            {/* Panel Side */}
            <div className="flex flex-col gap-4 md:gap-6 h-full min-h-0">
                {/* Task Description */}
                <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex-none lg:flex-1 overflow-y-auto max-h-[300px] lg:max-h-none min-h-0">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-3 md:mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                        🚀 Challenge: {challenge.title}
                    </h3>
                    <div className="prose dark:prose-invert prose-sm md:prose-base max-w-none text-gray-600 dark:text-gray-300">
                        <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                                code: ({ node, inline, className, children, ...props }) => (
                                    <code className="bg-gray-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-mono text-[10px] md:text-xs" {...props}>
                                        {children}
                                    </code>
                                )
                            }}
                        >
                            {challenge.description.replace(/\\n/g, '\n')}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Controls & Console */}
                <div className="flex flex-col gap-3 md:gap-4">
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className={`w-full py-3 md:py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm md:text-base ${isRunning
                            ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 hover:scale-[1.02]'
                            }`}
                    >
                        {isRunning ? 'Analyzing...' : 'Run Code ▶'}
                    </button>

                    {/* Output Console */}
                    <div className="h-40 md:h-48 bg-black rounded-2xl p-4 md:p-6 font-mono text-xs md:text-sm border border-gray-800 overflow-y-auto custom-scrollbar">
                        <div className="text-gray-500 mb-2 border-b border-gray-800 pb-2 text-[10px] md:text-xs uppercase tracking-wider">Console Output</div>

                        {!feedback && !isRunning && (
                            <span className="text-gray-600 italic">Ready to run...</span>
                        )}

                        {isRunning && (
                            <span className="text-indigo-400 animate-pulse">Running code remotely...</span>
                        )}

                        {feedback && (
                            <div className="space-y-2 md:space-y-3 animate-fade-in">
                                <div className={`font-bold flex items-center gap-2 ${feedback.passed ? 'text-green-400' : 'text-red-400'}`}>
                                    {feedback.passed ? '✅ Evaluation:' : '❌ Execution Error:'}
                                </div>
                                {feedback.consoleOutput && (
                                    <pre className="text-gray-300 whitespace-pre-wrap bg-gray-900/50 p-3 rounded-lg border border-gray-700 font-mono text-[10px] md:text-xs my-2">
                                        <span className="text-gray-500 select-none">&gt; </span>
                                        {feedback.consoleOutput}
                                    </pre>
                                )}
                                <p className="text-indigo-200 text-sm">{feedback.feedback}</p>

                                {feedback.tips && feedback.tips.length > 0 && (
                                    <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-800">
                                        <span className="text-yellow-500 text-[10px] md:text-xs uppercase tracking-wider block mb-1 md:mb-2">Debug Tips</span>
                                        <ul className="text-gray-400 space-y-1 list-disc list-inside">
                                            {feedback.tips.map((tip, i) => (
                                                <li key={i}>{tip}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
