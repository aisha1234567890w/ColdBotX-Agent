import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import { apiCall, API_BASE_URL } from "../utils/api";
import { supabase } from "../utils/supabaseClient";
import ReactMarkdown from "react-markdown";
import StreakModal from "../components/StreakModal";
import AchievementModal from "../components/AchievementModal";
import { checkNewAchievements } from "../utils/achievementLogic";
import { ACHIEVEMENTS } from "../data/achievements";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// Fallback questions in case API fails (10 questions)
const fallbackQuestions = [
  { text: "Which data structure uses FIFO?", options: ["Stack", "Queue", "Tree", "Array"], answer: "Queue", explanation: "Queue follows First In First Out principle" },
  { text: "Which OSI layer handles routing?", options: ["Transport", "Network", "Session", "Physical"], answer: "Network", explanation: "Network layer is responsible for routing packets" },
  { text: "Time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"], answer: "O(log n)", explanation: "Binary search divides search space in half each time" },
  { text: "Which protocol is used for sending emails?", options: ["SMTP", "HTTP", "FTP", "TCP"], answer: "SMTP", explanation: "SMTP (Simple Mail Transfer Protocol) is used for email" },
  { text: "Primary key in DB must be?", options: ["Unique", "Nullable", "Duplicated", "Optional"], answer: "Unique", explanation: "Primary key must be unique to identify records" },
  { text: "Supervised ML Algorithm?", options: ["K-Means", "Linear Regression", "Apriori", "DBSCAN"], answer: "Linear Regression", explanation: "Linear regression uses labeled training data" },
  { text: "React hook for state?", options: ["useEffect", "useState", "useReducer", "useMemo"], answer: "useState", explanation: "useState hook manages component state" },
  { text: "C++ supports which paradigm?", options: ["OOP", "Functional Only", "Procedural Only", "Assembly"], answer: "OOP", explanation: "C++ supports Object-Oriented Programming" },
  { text: "Python list is implemented as?", options: ["Linked List", "Dynamic Array", "Hash Table", "Stack"], answer: "Dynamic Array", explanation: "Python lists are implemented as resizable arrays" },
  { text: "In Java, JVM stands for?", options: ["Java Virtual Machine", "Java Visual Model", "Joint Variable Manager", "Java Version Manager"], answer: "Java Virtual Machine", explanation: "JVM executes Java bytecode" }
];

// Helper to preprocess math delimeters
const preprocessMath = (text) => {
  if (!text) return "";
  return text
    // Ensure $$ block math has newlines before and after
    // Map block math \\[ \\] to $$ ... $$ properly
    .replace(/\\\[/g, '$$$$')
    .replace(/\\\]/g, '$$$$')
    // Map inline math \\( \\) to $ ... $ properly
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$')
    // Fix backslash escapes that get doubled from the LLM JSON (e.g. \\\\theta -> \\theta)
    .replace(/\\\\([A-Za-z])/g, '\\$1');
};

const MarkdownComponents = {
  p: ({ children }) => <span className="leading-relaxed">{children}</span>, // Render paragraphs as spans to avoid block issues in some contexts
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <div className="relative group my-4 rounded-xl overflow-hidden bg-[#1e1e1e] border border-gray-700 shadow-xl text-left">
        <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-gray-700">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{match[1]}</span>
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          className="!bg-transparent !m-0 !p-4 overflow-x-auto custom-scrollbar"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className="bg-gray-100 dark:bg-gray-700 text-pink-600 dark:text-pink-400 px-1 py-0.5 rounded font-mono text-sm font-bold" {...props}>
        {children}
      </code>
    );
  }
};

const QuestionFormatter = ({ text, codeBlock }) => {
  // Combine text and codeBlock if present (legacy support)
  let content = text;
  if (codeBlock) {
    content += `\n\n\`\`\`python\n${codeBlock}\n\`\`\``;
  }

  return (
    <ReactMarkdown
      components={{
        ...MarkdownComponents,
        p: ({ children }) => <p className="leading-relaxed mb-4">{children}</p> // Use P tags for questions for spacing
      }}
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {preprocessMath(content)}
    </ReactMarkdown>
  );
};

const MathText = ({ text }) => (
  <ReactMarkdown
    components={{
      p: ({ children }) => <span className="leading-relaxed">{children}</span>,
      // Simplify code blocks in buttons/options
      code: ({ children }) => <code className="font-mono bg-gray-200 dark:bg-gray-900 px-1 rounded">{children}</code>
    }}
    remarkPlugins={[remarkMath]}
    rehypePlugins={[rehypeKatex]}
  >
    {preprocessMath(text)}
  </ReactMarkdown>
);

// Simple Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Quiz Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 text-red-900 rounded-xl m-4 border-2 border-red-200">
          <h2 className="text-xl font-bold mb-4">⚠️ Something went wrong displaying the quiz.</h2>
          <details className="whitespace-pre-wrap text-sm font-mono bg-white p-4 rounded border border-red-100">
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [streakDays, setStreakDays] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [hearts, setHearts] = useState(3);
  const [isGuest, setIsGuest] = useState(true);
  const [course, setCourse] = useState("");
  const [level, setLevel] = useState("");
  const [originalLevel, setOriginalLevel] = useState("");
  const [startTime, setStartTime] = useState(Date.now());
  const [userAnswers, setUserAnswers] = useState([]);
  const [assessedLevel, setAssessedLevel] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [showLevelSuggestion, setShowLevelSuggestion] = useState(false);
  const [suggestedLevel, setSuggestedLevel] = useState(null);
  const [isSavingPerformance, setIsSavingPerformance] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const [previousBest, setPreviousBest] = useState(null); // Previous best percentage
  const navigate = useNavigate();
  const location = useLocation();
  const isLessonMode = location.state?.quizMode === 'lesson';
  // Ref to prevent duplicate generateQuestions calls in StrictMode (dev only)
  const generateOnceRef = useRef(false);

  useEffect(() => {
    // 1. Check for navigation state (from Lesson page)
    const navState = location.state || {};
    // 2. Fallback to localStorage
    const savedCourse = navState.subject || localStorage.getItem("course") || "Programming";
    const savedLevel = navState.level || localStorage.getItem("level") || "Beginner";

    // If we have a specific topic from the lesson, use that as the "subject" context for the quiz generator
    // This tricks the AI into generating specific questions (e.g. "C#: Constructors") rather than generic ones
    const quizContext = navState.topic || savedCourse;
    const lessonContent = navState.lessonContent || '';

    setCourse(savedCourse); // Display normal course name in UI
    setLevel(savedLevel);
    setOriginalLevel(savedLevel); // Preserve original level for results display

    // Determine if this is an initial/guest evaluation: treat missing user as guest
    const checkAuthStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setIsGuest(false);
          // console.log("✅ Quiz: Verified Auth User", user.id);
        } else {
          // Fallback to local storage check (less reliable but faster for initial render)
          const userJson = localStorage.getItem('user');
          const userObj = userJson ? JSON.parse(userJson) : null;
          const hasSession = !!localStorage.getItem('sb-wakjdonqbcugnpljqypt-auth-token');
          const isLoggedIn = userObj && userObj.email && (hasSession || userObj.supabase_user_id);
          setIsGuest(!isLoggedIn);
          // console.log("⚠️ Quiz: Auth User verification failed, falling back to local check:", { isLoggedIn });
        }
      } catch (e) {
        console.warn("Error checking auth status:", e);
        setIsGuest(true);
      }
    };
    checkAuthStatus();

    if (!generateOnceRef.current) {
      generateOnceRef.current = true;
      // Pass the specific context (Topic) and actual Lesson Content
      generateQuestions(quizContext, savedLevel, lessonContent);
    }
  }, [location.state]);

  const generateQuestions = async (subject, difficulty, context = '') => {
    setIsLoading(true);

    try {
      // Use backend API for quiz generation (secure approach)
      const response = await apiCall('/generate-quiz', {
        method: 'POST',
        body: JSON.stringify({
          subject: subject,
          level: difficulty,
          questionCount: 5,
          lessonContext: context
        })
      });

      if (response.questions && Array.isArray(response.questions) && response.questions.length > 0) {
        // Sanitize questions
        const validQuestions = response.questions.filter(q => q && typeof q === 'object' && q.text && Array.isArray(q.options));

        if (validQuestions.length > 0) {
          setQuestions(validQuestions);
          setIsLoading(false);
          console.log(`✅ Quiz generated successfully with ${validQuestions.length} questions.`);
          return;
        }
      }

      // If backend fails or returns invalid questions, use fallback
      throw new Error('Backend returned invalid questions');

    } catch (error) {
      console.error('Failed to generate questions:', error);

      // Use subject-specific fallback questions
      const subjectQuestions = getSubjectFallbackQuestions(subject, difficulty);
      setQuestions(subjectQuestions);
      setIsLoading(false);
    }
  };

  // Get subject-specific topics for better AI prompts
  const getSubjectTopics = (subject) => {
    const topicMap = {
      "Python": "variables, functions, loops, data structures, OOP",
      "JavaScript": "variables, functions, DOM manipulation, async programming",
      "Java": "OOP concepts, inheritance, polymorphism, data structures",
      "C++": "pointers, memory management, classes, STL",
      "Calculus": "derivatives, integrals, limits, optimization",
      "Physics": "mechanics, thermodynamics, electromagnetism",
      "Chemistry": "atomic structure, chemical bonds, reactions",
      "Biology": "cell biology, genetics, evolution, ecology",
      "Data Structures": "arrays, trees, graphs, algorithms",
      "Machine Learning": "supervised learning, neural networks, model evaluation"
    };
    return topicMap[subject] || "fundamental concepts and applications";
  };

  // Get subject-specific fallback questions
  const getSubjectFallbackQuestions = (subject, difficulty) => {
    const questionSets = {
      "Python": [
        { text: "What is the correct way to create a list in Python?", options: ["list = []", "list = {}", "list = ()", "list = <>"], answer: "list = []", explanation: "Square brackets [] are used to create lists in Python." },
        { text: "Which keyword is used to define a function in Python?", options: ["function", "def", "func", "define"], answer: "def", explanation: "The 'def' keyword is used to define functions in Python." },
        { text: "What does the len() function do?", options: ["Returns length", "Deletes items", "Sorts items", "Copies items"], answer: "Returns length", explanation: "len() returns the number of items in an object." }
      ],
      "JavaScript": [
        { text: "How do you declare a variable in JavaScript?", options: ["var x", "variable x", "declare x", "x variable"], answer: "var x", explanation: "Variables in JavaScript are declared using var, let, or const keywords." },
        { text: "Which method adds an element to the end of an array?", options: ["push()", "add()", "append()", "insert()"], answer: "push()", explanation: "The push() method adds elements to the end of an array." }
      ],
      "Calculus": [
        { text: "What is the derivative of x²?", options: ["2x", "x", "2", "x²"], answer: "2x", explanation: "Using the power rule: d/dx(x²) = 2x." },
        { text: "What does ∫dx equal?", options: ["x + C", "1", "0", "x"], answer: "x + C", explanation: "The integral of 1 with respect to x is x plus a constant of integration." }
      ]
    };

    return questionSets[subject] || fallbackQuestions.slice(0, 5);
  };

  const handleAnswer = (option) => {
    if (showAnswer) return;

    setSelectedAnswer(option);
    setShowAnswer(true);

    const isCorrect = option === questions[current].answer;

    // Record the answer
    const answerRecord = {
      questionId: current,
      question: questions[current].text,
      selectedAnswer: option,
      correctAnswer: questions[current].answer,
      isCorrect: isCorrect,
      timestamp: Date.now()
    };

    setUserAnswers(prev => [...prev, answerRecord]);

    if (isCorrect) {
      setScore(prev => prev + 1);
      setXp(prev => prev + 20);
      setStreak(prev => prev + 1);
      setFeedback(`🎉 Excellent! +20 XP ${questions[current].explanation ? '\n' + questions[current].explanation : ''}`);

      setTimeout(() => {
        if (current + 1 < questions.length) {
          setCurrent(c => c + 1);
          setFeedback("");
          setSelectedAnswer("");
          setShowAnswer(false);
        } else {
          // Pass the final, accurate score directly to avoid stale state issues in closure
          savePerformanceAndFinish(score + 1);
        }
      }, 3000);
    } else {
      setStreak(0);
      // Show feedback immediately, but delay finish/advance to allow user to see it
      setFeedback(`😔 Not quite right. The correct answer is: ${questions[current].answer}${questions[current].explanation ? '\n' + questions[current].explanation : ''}`);

      if (!isGuest) {
        // For logged-in/gamified users, decrement hearts (cosmetic) but do not force restart for initial evaluation
        setHearts(prev => Math.max(0, prev - 1));
      }

      setTimeout(() => {
        // Always advance to the next question (or finish) — do not terminate the assessment early based on hearts
        if (current + 1 < questions.length) {
          setCurrent(c => c + 1);
          setFeedback("");
          setSelectedAnswer("");
          setShowAnswer(false);
        } else {
          savePerformanceAndFinish(score); // Pass current score (no increase)
        }
      }, 3000);
    }
  };

  // Save performance to backend and finish quiz
  // Accepting calculatedScore explicitly to bypass closure staleness
  const savePerformanceAndFinish = async (calculatedScore = null) => {
    setIsSavingPerformance(true);
    let timeTaken = 0;

    try {
      timeTaken = Math.round((Date.now() - startTime) / 1000); // in seconds

      // Use passed score if available, otherwise calculate fallback
      const finalScore = calculatedScore !== null ? calculatedScore : score;
      const validQuestionsCount = questions?.length || 5; // Prevent div by zero
      const percentage = finalScore / validQuestionsCount;
      const gainedXP = finalScore * 20; // 20 XP per correct answer

      // Get user email from localStorage
      const userObj = JSON.parse(localStorage.getItem('user') || '{}');
      const userEmail = userObj.email || 'guest@example.com';

      console.log('🏁 Finishing Quiz:', { finalScore, percentage, gainedXP });

      // --- CRITICAL FIX: UNLOCK LESSON LOCALLY FIRST ---
      try {
        const currentLessonTitle = location.state?.lessonTitle;
        const passThreshold = 0.5;

        if (currentLessonTitle && percentage >= passThreshold) {
          console.log(`🔓 Attempting to unlock lesson: "${currentLessonTitle}"`);

          const savedLessons = localStorage.getItem('completedLessons');
          const completedLessons = savedLessons ? JSON.parse(savedLessons) : [];

          if (Array.isArray(completedLessons)) {
            if (!completedLessons.includes(currentLessonTitle)) {
              completedLessons.push(currentLessonTitle);
              localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
              console.log(`✅ SUCCESS: Lesson "${currentLessonTitle}" marked as complete! New list:`, completedLessons);
            } else {
              console.log(`ℹ️ Lesson "${currentLessonTitle}" was already complete.`);
            }
          }
        } else {
          console.warn('❌ Lesson NOT unlocked:', {
            hasTitle: !!currentLessonTitle,
            title: currentLessonTitle,
            percentage,
            passThreshold
          });
        }
      } catch (localError) {
        console.error('🔥 FATAL: Failed to update local lesson progress:', localError);
      }

      // --- 1. SAVE TO POSTGRES (Performance History) via Backend ---
      // We wrap this in its own try/catch so it doesn't block the UI if it fails
      // 1. SAVE TO POSTGRES (Performance History) via Backend
      let backendXP = 0; // Default to 0 until confirmed by backend
      let response = null;

      try {
        const performanceData = {
          email: userEmail,
          subject: course,
          level: level,
          score: finalScore,
          totalQuestions: validQuestionsCount,
          timeTaken: timeTaken,
          answers: userAnswers,
          topic: location.state?.topic || course // Pass specific topic if available
        };

        response = await apiCall('/save-performance', {
          method: 'POST',
          body: JSON.stringify(performanceData)
        });

        console.log('🔍 DEBUG: /save-performance Response:', JSON.stringify(response, null, 2));

        console.log('💾 Performance saved. Result:', response);

        // --- KEY LOGIC UPDATE: Use Backend's Calculated XP ---
        if (response && typeof response.xpEarned === 'number') {
          backendXP = response.xpEarned;
          console.log(`🧠 Smart XP Logic: Backend awarded ${backendXP} XP (Client estimated ${gainedXP})`);

          // Capture previous best for UI
          if (typeof response.previousBest === 'number') {
            setPreviousBest(response.previousBest);
          }

          // CRITICAL: Update visual XP to match backend (e.g. 0 if practice)
          setXp(backendXP);

        } else {
          // Fallback for Guest or Offline: Use client estimate
          // Only if backend didn't return a value
          backendXP = gainedXP;
        }

      } catch (backendError) {
        console.error('⚠️ Backend save failed (checking network/server):', backendError);
        // Fallback: If backend fails, we assume standard XP for now so user doesn't feel cheated
        // But preventing farming is harder offline.
        backendXP = gainedXP;
      }

      // --- 2. UPDATE PROFILE XP (Supabase) ---
      try {
        // Force refresh session to ensure we have the latest user state
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

        if (authError) console.warn("Auth check warning:", authError);

        if (authUser) {
          console.log(`👤 Auth User Detected: ${authUser.id}`);

          // Fetch current Stats including Streak and Last Active and Achievements
          const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('xp, streak, lessons_completed, last_active_date, achievements')
            .eq('id', authUser.id)
            .single();

          // ... (fetch legacy logic) ...


          const currentTotalXP = profile?.xp || 0;
          let currentStreak = profile?.streak || 0;
          let lessonsCompleted = profile?.lessons_completed || 0;
          const lastActiveDate = profile?.last_active_date; // YYYY-MM-DD

          const today = new Date().toISOString().split('T')[0];
          let streakIncreased = false;

          // Streak Logic
          // Rule: To extend streak, you must EARN XP (Improve score or learn new topic)
          // Exception: If streak is already active today, no change
          if (backendXP > 0) {
            if (lastActiveDate !== today) {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              const yesterdayStr = yesterday.toISOString().split('T')[0];

              if (lastActiveDate === yesterdayStr) {
                // Perfect continuation
                currentStreak += 1;
                streakIncreased = true;
                console.log(`🔥 Streak continued! New streak: ${currentStreak}`);
              } else {
                // Streak broken or first time
                currentStreak = 1;
                streakIncreased = true; // New streak started
              }
            } else {
              console.log("🔥 Already active today. Keeping streak.");
            }
          } else {
            console.log("⚠️ No XP earned (Practice Mode) - Streak NOT updated.");
          }

          // Use the BACKEND VERIFIED XP for the update. Since the backend's `/save-performance`
          // API synchronously updates the Supabase `profiles` table before returning,
          // `currentTotalXP` natively contains the added XP! Adding it again would double it.
          const newXP = currentTotalXP; // DO NOT add backendXP here to avoid 1600 XP bug.

          // Only increment lessons/streak if this was a meaningful attempt?
          // For now, we still increment "lessons_completed" count even if 0 XP (practice counts as a lesson!)
          lessonsCompleted += 1;

          console.log(`🔄 Syncing Stats: XP=${newXP}, Streak=${currentStreak}, Lessons=${lessonsCompleted}`);
          // 2a. Sync to Custom Backend (Removed as it is now redundant, handled in Step 1)


          // 2b. Sync to Supabase
          // Use upsert instead of update to handle missing profile rows
          const { error: upsertError } = await supabase
            .from('profiles')
            .upsert({
              id: authUser.id,
              xp: newXP,
              streak: currentStreak,
              lessons_completed: lessonsCompleted,
              last_active_date: today,
              updated_at: new Date()
            });

          if (upsertError) {
            throw upsertError;
          }
          console.log('⭐ Stats synced to Supabase successfully');

          if (streakIncreased) {
            setStreakDays(currentStreak);
            setShowStreakModal(true);
          }

          // --- 3. CHECK ACHIEVEMENTS ---
          try {
            // Fetch current achievements
            const currentAchievements = profile?.achievements || [];

            // Prepare stats object for checking
            const statsForCheck = {
              xp: newXP,
              streak: currentStreak,
              lessonsCompleted: lessonsCompleted,
              isPerfectScore: percentage === 1 // 100%
            };

            const unlocked = checkNewAchievements(statsForCheck, currentAchievements);

            if (unlocked.length > 0) {
              const newIds = unlocked.map(a => a.id);
              console.log("🏆 New Achievements Unlocked:", newIds);

              // Update DB with new merged list
              const updatedList = [...currentAchievements, ...newIds];

              await supabase
                .from('profiles')
                .update({ achievements: updatedList })
                .eq('id', authUser.id);

              // Show Modal for the FIRST unlocked achievement (keep it simple for now)
              if (unlocked.length > 0) {
                setCurrentAchievement(unlocked[0]);
                setShowAchievementModal(true);

                // CRITICAL: Update Local Storage immediately so Dashboard/Profile reflects change
                const currentUserLocal = JSON.parse(localStorage.getItem('user') || '{}');
                const updatedUserLocal = { ...currentUserLocal, achievements: updatedList };
                localStorage.setItem('user', JSON.stringify(updatedUserLocal));
                console.log("✅ Local Storage synced with new achievements");
              }
            }
          } catch (achError) {
            console.error("Achievement check failed:", achError);
          }

        } else {
          // Guest user: save XP locally
          console.log("👤 No Auth User Detected - Saving as Guest");
          const currentGuestXP = parseInt(localStorage.getItem('guestXP') || '0');
          localStorage.setItem('guestXP', currentGuestXP + gainedXP);

          // Save valid performance data for migration upon signup
          const guestPerf = {
            score: finalScore,
            totalQuestions: validQuestionsCount,
            level: level,
            course: course,
            timestamp: Date.now()
          };
          localStorage.setItem('guestPerformance', JSON.stringify(guestPerf));
          // Legacy support for signup UI
          localStorage.setItem('quizScore', `${finalScore}/${validQuestionsCount}`);

          console.log('⭐ Guest XP and Performance saved locally');
        }
      } catch (xpError) {
        console.error('⚠️ XP sync failed:', xpError);
        // Alert user if XP saving fails so they know why
        alert(`Warning: XP could not be saved to your profile. (Error: ${xpError.message})`);
      }

      // --- Process Assessment Results (from backend or fallback) ---
      if (response && response.assessedLevel) {
        setAssessedLevel(response.assessedLevel);
        setRecommendation(response.recommendation);

        // Save assessment results to localStorage (fallback for next load)
        localStorage.setItem('assessedLevel', response.assessedLevel);
      }

      // --- AI Feedback (Async, don't await blocking) ---
      if (response) {
        // Only request feedback if we successfully saved performance
        const mistakes = userAnswers.filter(a => !a.isCorrect).map(a => a.question);
        apiCall('/generate-feedback', {
          method: 'POST',
          body: JSON.stringify({
            email: userEmail,
            subject: course,
            level: level,
            score: finalScore,
            totalQuestions: validQuestionsCount,
            mistakes: mistakes
          })
        }).then(res => {
          if (res?.feedback) setAiFeedback(res.feedback);
        }).catch(e => console.warn('AI Feedback skipped:', e));
      }

    } catch (error) {
      console.error('🚨 Error in finish process:', error);
    } finally {
      setIsSavingPerformance(false);
      setFinished(true);
    }
  };

  // Apply suggested level: either update localStorage and optionally restart assessment
  const applySuggestedLevel = (newLevel, restart = false) => {
    localStorage.setItem('level', newLevel);
    setLevel(newLevel);
    setShowLevelSuggestion(false);
    if (restart) {
      // restart assessment at the new level
      setFinished(false);
      setCurrent(0);
      setScore(0);
      setXp(0);
      setStreak(0);
      setHearts(3);
      setUserAnswers([]);
      generateQuestions(course, newLevel);
    }
  };

  const classifyStudent = () => {
    if (score >= 8) return "Advanced Learner 🚀";
    if (score >= 5) return "Intermediate Learner 📘";
    return "Beginner Learner 🌱";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Generating Your Quiz</h2>
          <p className="text-gray-600 dark:text-gray-400">AI is creating personalized questions for {course} ({level} level)...</p>
        </div>
      </div>
    );
  }

  // Debug: trace render state
  console.log('Quiz Render:', { finished, current, total: questions?.length, isSavingPerformance, aiFeedback });

  // Safety: ensure questions is always valid for render logic
  const validQuestions = Array.isArray(questions) ? questions : [];

  // Safety: auto-detect finished state if out of bounds (fallback)
  if (!finished && validQuestions.length > 0 && current >= validQuestions.length) {
    setFinished(true);
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">

        {/* Header Bar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={logo} alt="Learnoviax Logo" className="w-10 h-10 mr-3" />
                <div>
                  <h1 className="text-xl font-bold text-gray-800 dark:text-white">{course} Quiz</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Level: {level}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Hearts (hidden for guest/initial evaluation) */}
                {!isGuest && (
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className={`text-xl ${i < hearts ? 'text-red-500' : 'text-gray-300 dark:text-gray-600'}`}>
                        ❤️
                      </span>
                    ))}
                  </div>
                )}

                {/* XP */}
                <div className="flex items-center bg-blue-100 dark:bg-blue-900/40 rounded-full px-3 py-1">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mr-1">⭐</span>
                  <span className="font-semibold text-blue-700 dark:text-blue-300">{xp}</span>
                </div>

                {/* Streak */}
                <div className="flex items-center bg-orange-100 dark:bg-orange-900/40 rounded-full px-3 py-1">
                  <span className="text-orange-600 dark:text-orange-400 font-bold mr-1">🔥</span>
                  <span className="font-semibold text-orange-700 dark:text-orange-300">{streak}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {!finished && questions.length > 0 && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Question {current + 1} of {questions.length}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-6 py-8">
          {!questions || questions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 text-center transition-colors">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No Questions Loaded</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">We couldn't generate a quiz for this topic right now.</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : !finished && !isSavingPerformance ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 transition-colors">

              {/* Question */}
              <div className="mb-8">
                {console.log('🔍 Current Question Data:', questions[current])}
                <div className="text-2xl font-medium text-gray-800 dark:text-white mb-6">
                  <QuestionFormatter
                    text={questions[current].text}
                    codeBlock={questions[current].codeSnippet || questions[current].code || questions[current].codeBlock || questions[current].code_snippet}
                  />
                </div>
              </div>

              {/* Answer Options */}
              <div className="space-y-4">
                {questions[current].options.map((option, i) => {
                  let buttonClass = "w-full p-4 text-left rounded-2xl font-semibold transition-all transform hover:scale-105 border-2 ";

                  if (showAnswer) {
                    if (option === questions[current].answer) {
                      buttonClass += "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400";
                    } else if (option === selectedAnswer && option !== questions[current].answer) {
                      buttonClass += "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400";
                    } else {
                      buttonClass += "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed";
                    }
                  } else {
                    buttonClass += "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer";
                  }

                  // Check if option contains code or output - improved detection
                  const isCodeOption = option.includes('```') ||
                    (option.includes('(') && option.includes(')') && (option.includes('print') || option.includes('console') || option.includes('cout'))) ||
                    option.match(/^\s*[a-zA-Z_][a-zA-Z0-9_]*\s*=/) ||
                    option.includes('def ') || option.includes('function ') || option.includes('#include');

                  const isOutputOption = option.includes('Output:') ||
                    option.includes('Prints:') ||
                    option.match(/^[A-D]\).*\n/) ||
                    (option.includes('\\n') && !option.includes('code'));

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(option)}
                      disabled={showAnswer}
                      className={buttonClass}
                    >
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-4 font-bold text-gray-600 dark:text-gray-300 flex-shrink-0 mt-1">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <div className="flex-1 break-words">
                          <MathText text={option.replace(/^[A-D][).]\s*/, '').replace(/\\n/g, '\n')} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {feedback && (
                <div className={`mt-6 p-4 rounded-2xl text-center font-semibold ${selectedAnswer === questions[current].answer
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
                  }`}>
                  {feedback}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 text-center transition-colors">
              {/* Always show assessment/finished UI here */}
              {isSavingPerformance ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Analyzing...</h3>
                  <p className="text-gray-600 dark:text-gray-400">Saving your progress and generating insights</p>
                </div>
              ) : (
                <div>
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
                    {isLessonMode ? "Quiz Complete!" : "Assessment Complete!"}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                    {isLessonMode
                      ? `You've completed the quiz for ${course}!`
                      : `Great job completing the ${course} assessment!`}
                  </p>

                  {/* Lesson Cleared Badge */}
                  {isLessonMode && (score / questions.length) >= 0.5 && (
                    <div className="mb-6 animate-bounce">
                      <span className="bg-green-100 text-green-800 text-sm font-bold px-4 py-2 rounded-full border border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800">
                        ✅ Lesson Cleared! Path Unlocked.
                      </span>
                    </div>
                  )}

                  {questions && questions.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{score}/{questions.length}</div>
                        <div className="text-blue-600 dark:text-blue-400 text-sm">Score</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{Math.round((score / questions.length) * 100)}%</div>
                        <div className="text-green-600 dark:text-green-400 text-sm">Accuracy</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{xp}</div>
                        <div className="text-purple-600 dark:text-purple-400 text-sm">XP Earned</div>
                      </div>
                      {/* Previous Best Tile */}
                      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {previousBest !== null ? `${Math.round(previousBest)}%` : '-'}
                        </div>
                        <div className="text-orange-600 dark:text-orange-400 text-sm">Best Before</div>
                      </div>
                    </div>
                  )}

                  {/* AI Assessment Results - ONLY show if NOT in Lesson Mode */}
                  {!isLessonMode && (
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-6 mb-6 border border-indigo-200 dark:border-indigo-800">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">🤖</span>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">AI Level Assessment</h3>
                      </div>

                      {assessedLevel && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 dark:text-gray-300">Original Level:</span>
                            <span className="font-semibold text-gray-800 dark:text-white">{originalLevel}</span>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-600 dark:text-gray-300">Assessed Level:</span>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">{assessedLevel}</span>
                          </div>
                          {assessedLevel !== originalLevel && (
                            <div className="bg-white dark:bg-gray-700 bg-opacity-70 rounded-lg p-3 mb-3 border border-indigo-200 dark:border-indigo-700">
                              <p className="text-sm text-gray-700 dark:text-gray-200 mb-3">
                                📈 <strong>Recommendation:</strong> Based on your score, we suggest moving to <strong>{assessedLevel}</strong>.
                              </p>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => applySuggestedLevel(assessedLevel)}
                                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                                >
                                  Move to {assessedLevel}
                                </button>
                                <button
                                  onClick={() => setShowLevelSuggestion(false)}
                                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-lg text-sm transition-colors"
                                >
                                  Stay at {originalLevel}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Feedback Agent Display */}
                  {(aiFeedback || recommendation) && (
                    <div className="bg-white dark:bg-gray-700 bg-opacity-70 rounded-lg p-4 mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">💡</span>
                        <h4 className="font-bold text-gray-800 dark:text-white">AI Tutor Feedback</h4>
                      </div>

                      {aiFeedback ? (
                        <>
                          <p className="font-semibold text-gray-800 dark:text-gray-100 mb-3 italic">"{String(aiFeedback.message || '')}"</p>

                          {aiFeedback.analysis && Array.isArray(aiFeedback.analysis) && aiFeedback.analysis.length > 0 && (
                            <div className="mb-3 text-left">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Analysis</p>
                              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                {aiFeedback.analysis?.map((point, idx) => <li key={idx}>{point}</li>)}
                              </ul>
                            </div>
                          )}
                          {!isLessonMode && aiFeedback.nextSteps && Array.isArray(aiFeedback.nextSteps) && aiFeedback.nextSteps.length > 0 && (
                            <div className="text-left mt-3">
                              {/* Only show next steps if NOT in lesson mode */}
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Coming Up</p>
                              <div className="flex flex-wrap gap-2">
                                {aiFeedback.nextSteps?.map((step, idx) => (
                                  <span key={idx} className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs px-2 py-1 rounded">
                                    {step}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-left">
                          <p className="font-semibold text-gray-800 dark:text-white mb-2">{recommendation?.message || "Good effort! Review the lesson to improve your score."}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Performance Insights */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 mb-6">
                    <h4 className="font-bold text-gray-800 dark:text-white mb-2">📊 Performance Insights</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Time Taken:</span>
                        <span className="font-semibold ml-2 text-gray-800 dark:text-gray-200">{Math.round((Date.now() - startTime) / 60000)} min</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Streak:</span>
                        <span className="font-semibold ml-2 text-gray-800 dark:text-gray-200">{streak} correct</span>
                      </div>
                      {!isGuest && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Hearts Left:</span>
                          <span className="font-semibold ml-2 text-gray-800 dark:text-gray-200">{hearts}/3 ❤️</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Difficulty:</span>
                        <span className="font-semibold ml-2 text-gray-800 dark:text-gray-200">{level}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {isGuest ? (
                      <button
                        onClick={() => navigate("/signup")}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-4 px-6 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg mb-2"
                      >
                        ✨ Create Account to Save {xp} XP
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-4 px-6 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg"
                      >
                        🚀 Return to Dashboard
                      </button>
                    )}

                    {isGuest && (
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-2xl font-bold transition-all"
                      >
                        Continue as Guest
                      </button>
                    )}
                    {location.state?.quizMode === 'lesson' ? (
                      <button
                        onClick={() => navigate("/lesson", {
                          state: {
                            topic: location.state?.lessonTitle || location.state?.topic,
                            subject: course,
                            level: level
                          }
                        })}
                        className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white py-3 px-6 rounded-2xl font-bold transition-all"
                      >
                        📚 Back to Lesson
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate("/course")}
                        className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white py-3 px-6 rounded-2xl font-bold transition-all"
                      >
                        📚 Back to Curriculum
                      </button>
                    )}
                    <button
                      onClick={() => window.location.reload()}
                      className="w-full bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 py-3 px-6 rounded-2xl font-semibold transition-all"
                    >
                      🔄 Retake Quiz
                    </button>
                  </div>
                </div>
              )
              }
            </div >
          )}

          {/* Modal removed. Level update is now automatic and shown in the results card above. */}
        </div >
        <StreakModal
          isOpen={showStreakModal}
          streak={streakDays}
          onClose={() => setShowStreakModal(false)}
        />
        <AchievementModal
          isOpen={showAchievementModal}
          achievement={currentAchievement}
          onClose={() => setShowAchievementModal(false)}
        />
      </div>
    </ErrorBoundary>
  );
}
