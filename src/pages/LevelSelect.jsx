import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { COURSES } from "../data/courses";
import { supabase } from "../utils/supabaseClient";

const levels = [
  {
    name: "Absolute Beginner",
    icon: "🌱",
    color: "bg-green-500 hover:bg-green-600",
    description: "No prior experience needed. Start from the very basics.",
    estimatedTime: "2-3 weeks"
  },
  {
    name: "Beginner",
    icon: "🌿",
    color: "bg-lime-500 hover:bg-lime-600",
    description: "Know some basics. Ready to build on fundamentals.",
    estimatedTime: "3-4 weeks"
  },
  {
    name: "Intermediate",
    icon: "🌳",
    color: "bg-yellow-500 hover:bg-yellow-600",
    description: "Comfortable with basics. Ready for complex concepts.",
    estimatedTime: "4-6 weeks"
  },
  {
    name: "Advanced",
    icon: "🚀",
    color: "bg-orange-500 hover:bg-orange-600",
    description: "Strong foundation. Ready for advanced applications.",
    estimatedTime: "6-8 weeks"
  },
  {
    name: "Expert",
    icon: "👑",
    color: "bg-purple-500 hover:bg-purple-600",
    description: "Master level. Complex problem-solving and optimization.",
    estimatedTime: "8+ weeks"
  }
];

export default function LevelSelect() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courseIcon, setCourseIcon] = useState("📚");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const course = localStorage.getItem("course") || "Programming";
    const icon = localStorage.getItem("courseIcon") || "📚";
    setSelectedCourse(course);
    setCourseIcon(icon);
  }, []);

  const handleLevelSelect = async (level) => {
    // 1. Save locally for fallback/UI
    localStorage.setItem("level", level.name);
    localStorage.setItem("estimatedTime", level.estimatedTime);

    // 2. Check auth
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // 3. Logged in? Update profile and go to Dashboard
      try {
        await supabase
          .from('profiles')
          .update({
            course: selectedCourse,
            level: level.name,
            updated_at: new Date()
          })
          .eq('id', user.id);

        // Also update local user object so Dashboard sees the change immediately
        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...localUser,
          course: selectedCourse,
          level: level.name
        }));

        alert(`Course updated to ${selectedCourse} (${level.name})!`);
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to update course:', err);
        navigate('/quiz'); // Fallback
      }
    } else {
      // 4. Guest? Go to Quiz (Placement) -> Signup flow
      navigate('/quiz');
    }
  };

  const handleInfoClick = (e, level) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();

    // Fetch curriculum from COURSES data
    const courseData = COURSES[selectedCourse];
    const levelData = courseData ? courseData[level.name] : [];

    setModalContent({
      title: `${level.name} Syllabus`,
      course: selectedCourse,
      units: levelData || []
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {/* Header */}
      <div className="pt-8 pb-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <span className="text-4xl mr-3">{courseIcon}</span>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">{selectedCourse}</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg">Choose your starting level to get personalized content</p>
      </div>

      {/* Level Selection */}
      <div className="max-w-4xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level, i) => (
            <div key={i} className="relative group">
              <div onClick={() => handleLevelSelect(level)} className="block h-full cursor-pointer">
                <div className={`${level.color} text-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-200 h-full relative overflow-hidden flex flex-col justify-between`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white transform translate-x-6 -translate-y-6"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white transform -translate-x-4 translate-y-4"></div>
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl">{level.icon}</span>
                      {/* Info Button - Positioned absolutely in top right to clear other elements */}
                      <button
                        onClick={(e) => handleInfoClick(e, level)}
                        className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full transition-all text-white z-20"
                        title="View Syllabus"
                      >
                        ℹ️
                      </button>
                    </div>

                    <h3 className="text-xl font-bold mb-2">{level.name}</h3>
                    <p className="text-white text-opacity-90 text-sm mb-4">{level.description}</p>

                    <div className="flex justify-between items-center text-xs opacity-80 mt-auto">
                      <span>⏱️ {level.estimatedTime}</span>
                      <div className="bg-white bg-opacity-20 rounded-full px-3 py-1">
                        Start Now →
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Not Sure Button */}
        <div className="mt-8 text-center">
          <div onClick={() => handleLevelSelect({ name: "Assessment", estimatedTime: "15 min" })}>
            <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-8 py-4 rounded-2xl font-semibold shadow-lg transition-all border border-gray-300 dark:border-gray-600 cursor-pointer">
              🤔 Not sure? Take a placement test
            </button>
          </div>
        </div>
      </div>

      {/* Syllabus Modal */}
      {showModal && modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col animate-fadeIn">

            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{modalContent.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Curriculum for {modalContent.course}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                &times;
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-6 overflow-y-auto">
              {modalContent.units && modalContent.units.length > 0 ? (
                <div className="space-y-6">
                  {modalContent.units.map((unit, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-100 dark:border-gray-600">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 text-green-600 dark:text-green-400">
                        {unit.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 italic">{unit.description}</p>

                      <ul className="space-y-2">
                        {unit.lessons.map((lesson, lIdx) => (
                          <li key={lIdx} className="flex items-start text-sm text-gray-700 dark:text-gray-200">
                            <span className="mr-2 text-green-500">•</span>
                            <div>
                              <span className="font-semibold">{lesson.title}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 block ml-0">{lesson.description}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p>Curriculum details coming soon!</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
