import { useParams, useNavigate } from "react-router-dom";
import { ROADMAPS } from "../data/roadmaps";
import { supabase } from "../utils/supabaseClient";

export default function RoadmapDetails() {
    const { roadmapId } = useParams();
    const navigate = useNavigate();

    const roadmap = ROADMAPS.find((r) => r.id === roadmapId);

    if (!roadmap) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Roadmap Not Found</h2>
                    <button
                        onClick={() => navigate('/course')}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                        &larr; Back to Courses
                    </button>
                </div>
            </div>
        );
    }

    const handleStartPath = async () => {
        // Set local storage for Signup flow context (or for immediate update if logged in)
        localStorage.setItem("course", roadmap.title);
        localStorage.setItem("level", roadmap.level || "Beginner");
        localStorage.setItem("courseIcon", roadmap.icon);
        localStorage.removeItem("quizScore");

        // Check if user is already logged in
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            try {
                // Update profile in Supabase
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        course: roadmap.title,
                        level: roadmap.level || "Beginner",
                        updated_at: new Date()
                    })
                    .eq('id', user.id);

                if (error) throw error;

                // Update local storage user object to reflect change immediately
                const localUser = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({
                    ...localUser,
                    course: roadmap.title,
                    level: roadmap.level || "Beginner"
                }));

                // Redirect to dashboard
                navigate("/dashboard");
            } catch (err) {
                console.error("Error updating course:", err);
                alert("Failed to update course. Please try again.");
            }
        } else {
            // Not logged in -> Go to Signup
            navigate("/signup");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors pb-20">
            {/* Header / Hero */}
            <div className={`bg-gradient-to-r ${roadmap.color} text-white pt-16 md:pt-20 pb-20 md:pb-24 px-4 md:px-6 relative`}>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <span className="text-5xl md:text-6xl mb-4 md:mb-6 block animate-bounce-slow">
                        {roadmap.icon}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-3 md:mb-4 drop-shadow-md px-2">
                        {roadmap.title}
                    </h1>
                    <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto font-medium px-4">
                        {roadmap.description}
                    </p>

                    <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 mt-6 md:mt-8">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 md:px-6 py-1.5 md:py-2 text-sm md:text-base font-semibold border border-white/30">
                            ⏱️ {roadmap.duration}
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 md:px-6 py-1.5 md:py-2 text-sm md:text-base font-semibold border border-white/30">
                            📊 {roadmap.level}
                        </div>
                    </div>
                </div>

                {/* Decorative Wave/Curve at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-10 md:h-16 bg-gray-50 dark:bg-gray-900 rounded-t-[50%_100%] transform translate-y-1/2 scale-110"></div>
            </div>

            {/* Curriculum Content */}
            <div className="max-w-4xl mx-auto px-4 md:px-6 mt-[-30px] md:mt-[-40px] relative z-20">
                <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-xl p-5 md:p-8 mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <span className="mr-2 md:mr-3 text-indigo-500">🗺️</span>
                        Curriculum Path
                    </h2>

                    <div className="space-y-6 md:space-y-8 relative">
                        {/* Connecting Line for the timeline */}
                        <div className="absolute top-4 left-[21px] md:left-[27px] bottom-4 w-1 bg-gray-100 dark:bg-gray-700 rounded-full"></div>

                        {roadmap.steps.map((phase, index) => (
                            <div key={index} className="relative pl-10 md:pl-12">
                                {/* Timeline Node */}
                                <div className={`absolute left-0 top-0 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-lg md:text-xl border-4 border-white dark:border-gray-800 z-10 shadow-sm ${index === 0 ? 'bg-indigo-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                    }`}>
                                    {index + 1}
                                </div>

                                {/* Phase Content */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors">
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1">
                                        {phase.title}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mb-4">
                                        {phase.description}
                                    </p>

                                    <div className="space-y-3 md:space-y-4">
                                        {phase.items.map((item, idx) => (
                                            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                                                <div className="flex items-start mb-2 md:mb-3">
                                                    <span className="mr-2 md:mr-3 mt-0.5 md:mt-1 text-lg md:text-xl">
                                                        {item.type === 'project' ? '🛠️' : '📚'}
                                                    </span>
                                                    <div>
                                                        <span className="text-[10px] md:text-xs uppercase font-bold text-indigo-500 tracking-wider block mb-0.5">
                                                            {item.type || 'Unit'}
                                                        </span>
                                                        <span className="text-gray-900 dark:text-white font-bold text-sm md:text-lg leading-tight">
                                                            {item.title}
                                                        </span>
                                                    </div>
                                                </div>

                                                {item.lessons && (
                                                    <ul className="ml-9 space-y-2 border-l-2 border-gray-50 dark:border-gray-700 pl-4">
                                                        {item.lessons.map((lesson, lIdx) => (
                                                            <li key={lIdx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                                                {lesson.title}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Bar */}
                <div className="sticky bottom-6 mx-auto max-w-md">
                    <button
                        onClick={handleStartPath}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-4 rounded-2xl shadow-2xl hover:shadow-indigo-500/30 transform hover:-translate-y-1 transition-all flex items-center justify-center"
                    >
                        Start Learning Path 🚀
                    </button>
                </div>
            </div>
        </div>
    );
}
