import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
    {
        id: 'goal',
        title: 'What is your main goal?',
        subtitle: 'This helps us tailor the curriculum urgency.',
        options: [
            { id: 'career', label: 'Career Switch', icon: '💼', desc: 'Get hired as a developer' },
            { id: 'school', label: 'School / Exam', icon: '🎓', desc: 'Ace my exams' },
            { id: 'hobby', label: 'Just for Fun', icon: '🎨', desc: 'Explore a new hobby' },
            { id: 'upskill', label: 'Upskilling', icon: '🚀', desc: 'Improve my current skills' }
        ]
    },
    {
        id: 'background',
        title: 'What is your experience?',
        subtitle: 'This helps us decide where to start explaining.',
        options: [
            { id: 'zero', label: 'Zero Experience', icon: '🌱', desc: 'Never wrote code before' },
            { id: 'dabbler', label: 'Dabbler', icon: '🤔', desc: 'Tried tutorials, got stuck' },
            { id: 'student', label: 'Student', icon: '📚', desc: 'Know loops & variables' },
            { id: 'pro', label: 'Pro', icon: '⚡', desc: 'I code in other languages' }
        ]
    },
    {
        id: 'interests',
        title: 'What are your interests?',
        subtitle: 'We will use these to create analogies you understand.',
        multiSelect: true,
        options: [
            { id: 'gaming', label: 'Gaming', icon: '🎮' },
            { id: 'music', label: 'Music', icon: '🎵' },
            { id: 'sports', label: 'Sports', icon: '⚽' },
            { id: 'movies', label: 'Movies/TV', icon: '🎬' },
            { id: 'tech', label: 'Tech/Gadgets', icon: '📱' },
            { id: 'art', label: 'Art/Design', icon: '🖌️' }
        ]
    },
    {
        id: 'pace',
        title: 'How much time can you dedicate daily?',
        subtitle: 'We\'ll adjust your daily goals to match your schedule.',
        options: [
            { id: 'casual', label: 'Casual', icon: '🐢', desc: '5 min / day' },
            { id: 'regular', label: 'Regular', icon: '🚶', desc: '15 min / day' },
            { id: 'intensive', label: 'Intensive', icon: '🏃', desc: '30 min / day' },
            { id: 'hardcore', label: 'Hardcore', icon: '🔥', desc: '60 min / day' }
        ]
    },
    {
        id: 'plan',
        title: 'Choose your learning experience',
        subtitle: 'You can always upgrade later from your profile.',
        isPlanStep: true
    }
];

// Feature lists for plan comparison
const FREE_FEATURES = [
    { text: '2 AI-generated lessons per day', included: true },
    { text: 'Pre-generated lesson library', included: true },
    { text: 'Unlimited quizzes & XP', included: true },
    { text: 'Streaks & achievements', included: true },
    { text: 'Basic Code Lab', included: true },
    { text: 'Socratic AI Chat tutor', included: false },
    { text: 'AI-powered code feedback', included: false },
    { text: 'Personalized difficulty', included: false },
    { text: 'Shareable certificates', included: false },
    { text: 'Clean PDF exports', included: false },
];

const PREMIUM_FEATURES = [
    { text: 'Unlimited AI lessons', included: true },
    { text: 'Full lesson library', included: true },
    { text: 'Unlimited quizzes & XP', included: true },
    { text: 'Streaks & achievements', included: true },
    { text: 'Advanced Code Lab + AI feedback', included: true },
    { text: 'Socratic AI Chat tutor', included: true, highlight: true },
    { text: 'AI-powered code feedback', included: true, highlight: true },
    { text: 'Personalized difficulty', included: true, highlight: true },
    { text: 'Shareable certificates', included: true, highlight: true },
    { text: 'Clean PDF exports', included: true, highlight: true },
];

export default function Onboarding() {
    const [currentStep, setCurrentStep] = useState(0);
    const [selections, setSelections] = useState({
        goal: '',
        background: '',
        interests: [],
        pace: '',
        plan: 'free'
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSelect = (optionId) => {
        const step = STEPS[currentStep];

        if (step.multiSelect) {
            setSelections(prev => {
                const current = prev[step.id];
                if (current.includes(optionId)) {
                    return { ...prev, [step.id]: current.filter(i => i !== optionId) };
                } else {
                    if (current.length >= 3) return prev; // Max 3
                    return { ...prev, [step.id]: [...current, optionId] };
                }
            });
        } else {
            setSelections(prev => ({ ...prev, [step.id]: optionId }));
            // Auto-advance for single select after small delay
            setTimeout(() => {
                if (currentStep < STEPS.length - 1) {
                    setCurrentStep(c => c + 1);
                }
            }, 300);
        }
    };

    const handlePlanSelect = (plan) => {
        setSelections(prev => ({ ...prev, plan }));
    };

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(c => c + 1);
        } else {
            handleFinish();
        }
    };

    const handleFinish = async () => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Combine interests with specifics
                const interestsWithSpecifics = selections.interests.map(interestId => {
                    const label = STEPS[2].options.find(o => o.id === interestId)?.label || interestId;
                    const specific = selections.specifics?.[interestId];
                    return specific ? `${label} (${specific})` : label;
                });

                const interestsString = interestsWithSpecifics.join(', ');

                // Check for guest XP to claim
                const guestXP = parseInt(localStorage.getItem('guestXP') || '0');
                let newXP = 0;

                if (guestXP > 0) {
                    const { data: profile } = await supabase.from('profiles').select('xp').eq('id', user.id).single();
                    const currentXP = profile?.xp || 0;
                    newXP = currentXP + guestXP;
                    localStorage.removeItem('guestXP');
                    alert(`🎉 You've claimed your ${guestXP} Bonus XP!`);
                }

                const updatePayload = {
                    goal: selections.goal,
                    background: selections.background,
                    bio: interestsString,
                    learning_pace: selections.pace,
                    tier: selections.plan,
                    updated_at: new Date()
                };

                if (guestXP > 0) {
                    updatePayload.xp = newXP;
                }

                await supabase.from('profiles').update(updatePayload).eq('id', user.id);

                // Update Local Storage
                const localUser = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({
                    ...localUser,
                    goal: selections.goal,
                    background: selections.background,
                    interests: interestsString,
                    learning_pace: selections.pace,
                    tier: selections.plan
                }));
            }
            navigate('/dashboard');
        } catch (error) {
            console.error('Onboarding save failed:', error);
            alert('Failed to save preferences. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const stepData = STEPS[currentStep];
    const totalSteps = STEPS.length;

    // Determine if the Next/Finish button should be disabled
    const isNextDisabled = () => {
        if (isLoading) return true;
        if (stepData.isPlanStep) return false; // Plan defaults to 'free', always valid
        if (stepData.multiSelect) return selections[stepData.id].length === 0;
        return !selections[stepData.id];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 w-full max-w-2xl min-h-[500px] flex flex-col relative overflow-hidden transition-colors">

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gray-100 dark:bg-gray-700">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                </div>

                {/* Step Counter */}
                <div className="text-center mt-2 mb-2">
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                        Step {currentStep + 1} of {totalSteps}
                    </span>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full"
                        >
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{stepData.title}</h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-8">{stepData.subtitle}</p>

                            {/* Regular option grid (Steps 1-4) */}
                            {!stepData.isPlanStep && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
                                    {stepData.options.map(opt => {
                                        const isSelected = stepData.multiSelect
                                            ? selections[stepData.id].includes(opt.id)
                                            : selections[stepData.id] === opt.id;

                                        return (
                                            <div key={opt.id} className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => handleSelect(opt.id)}
                                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 hover:scale-105 active:scale-95 text-center w-full ${isSelected
                                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                                                        }`}
                                                >
                                                    <span className="text-4xl">{opt.icon}</span>
                                                    <div>
                                                        <div className="font-bold text-gray-800 dark:text-white">{opt.label}</div>
                                                        {opt.desc && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{opt.desc}</div>}
                                                    </div>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Plan Selection (Step 5) */}
                            {stepData.isPlanStep && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                    {/* Free Plan Card */}
                                    <button
                                        onClick={() => handlePlanSelect('free')}
                                        className={`relative p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] ${
                                            selections.plan === 'free'
                                                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 dark:border-blue-400 shadow-lg'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-3xl">🆓</span>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Free</h3>
                                                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">$0<span className="text-sm font-normal text-gray-500">/forever</span></p>
                                            </div>
                                        </div>
                                        <ul className="space-y-2.5">
                                            {FREE_FEATURES.map((f, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm">
                                                    {f.included ? (
                                                        <svg className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4 mt-0.5 text-gray-300 dark:text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    )}
                                                    <span className={f.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600 line-through'}>{f.text}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </button>

                                    {/* Premium Plan Card */}
                                    <button
                                        onClick={() => handlePlanSelect('premium')}
                                        className={`relative p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] ${
                                            selections.plan === 'premium'
                                                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 dark:border-indigo-400 shadow-lg'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                                        }`}
                                    >
                                        {/* Popular badge */}
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                                            ✨ Recommended
                                        </div>

                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-3xl">👑</span>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Premium</h3>
                                                <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">$9.99<span className="text-sm font-normal text-gray-500">/month</span></p>
                                            </div>
                                        </div>
                                        <ul className="space-y-2.5">
                                            {PREMIUM_FEATURES.map((f, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm">
                                                    <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${f.highlight ? 'text-indigo-500' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span className={`text-gray-700 dark:text-gray-300 ${f.highlight ? 'font-semibold' : ''}`}>{f.text}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-4 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl p-2 text-center">
                                            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">🎁 Start with a 7-day free trial</span>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Controls */}
                <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-100 dark:border-gray-700 w-full">
                    {currentStep > 0 ? (
                        <button
                            onClick={() => setCurrentStep(c => c - 1)}
                            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white font-medium px-4 py-2"
                        >
                            Back
                        </button>
                    ) : <div></div>}

                    <button
                        onClick={handleNext}
                        disabled={isNextDisabled()}
                        className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${isNextDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Saving...' : currentStep === STEPS.length - 1 
                            ? (selections.plan === 'premium' ? '🚀 Start Free Trial' : '✅ Continue Free')
                            : 'Next'}
                    </button>
                </div>

            </div>
        </div>
    );
}
