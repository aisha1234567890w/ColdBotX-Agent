import { Link } from "react-router-dom";
import { useState } from "react";
import { ROADMAPS } from "../data/roadmaps";

const courseCategories = {
  "Programming Languages": [
    { name: "Python", icon: "🐍", color: "bg-blue-500 hover:bg-blue-600", description: "Master Python from scratch" },
    { name: "JavaScript", icon: "⚡", color: "bg-yellow-500 hover:bg-yellow-600", description: "Master web development with JavaScript" },
    { name: "Java", icon: "☕", color: "bg-red-500 hover:bg-red-600", description: "Object-oriented programming with Java" },
    { name: "Programming Fundamentals (C++)", icon: "⚙️", color: "bg-purple-500 hover:bg-purple-600", description: "System programming and data structures" },
    { name: "C#", icon: "🔷", color: "bg-indigo-500 hover:bg-indigo-600", description: "Microsoft .NET development" },
    { name: "Go", icon: "🚀", color: "bg-cyan-500 hover:bg-cyan-600", description: "Modern systems programming" }
  ],
  "Mathematics": [
    { name: "Algebra (Grade 9)", icon: "📐", color: "bg-green-500 hover:bg-green-600", description: "Linear equations and basic algebra" },
    { name: "Geometry (Grade 10)", icon: "📏", color: "bg-teal-500 hover:bg-teal-600", description: "Shapes, areas, and geometric proofs" },
    { name: "Calculus", icon: "∫", color: "bg-emerald-500 hover:bg-emerald-600", description: "Derivatives and integrals" },
    { name: "Statistics", icon: "📊", color: "bg-lime-500 hover:bg-lime-600", description: "Data analysis and probability" },
    { name: "Discrete Math", icon: "🧮", color: "bg-orange-500 hover:bg-orange-600", description: "Logic, sets, and graph theory" }
  ],
  "Science": [
    { name: "Physics", icon: "⚛️", color: "bg-blue-600 hover:bg-blue-700", description: "Mechanics, waves, and energy" },
    { name: "Chemistry", icon: "🧪", color: "bg-pink-500 hover:bg-pink-600", description: "Chemical reactions and compounds" },
    { name: "Biology", icon: "🧬", color: "bg-green-600 hover:bg-green-700", description: "Living organisms and life processes" }
  ],
  "Computer Science": [
    { name: "Data Structures", icon: "🗂️", color: "bg-gray-600 hover:bg-gray-700", description: "Arrays, trees, graphs, and algorithms" },
    { name: "Algorithms", icon: "🔍", color: "bg-violet-500 hover:bg-violet-600", description: "Problem-solving and optimization" },
    { name: "Machine Learning (Python) 🤖", icon: "🤖", color: "bg-rose-500 hover:bg-rose-600", description: "AI and predictive modeling" },
    { name: "Database Systems", icon: "💾", color: "bg-slate-500 hover:bg-slate-600", description: "SQL and database design" },
    { name: "Web Development", icon: "🌐", color: "bg-sky-500 hover:bg-sky-600", description: "Frontend and backend development" }
  ]
};

export default function CourseSelect() {
  const [activeTab, setActiveTab] = useState("roadmaps"); // 'roadmaps' or 'courses'
  const [selectedCategory, setSelectedCategory] = useState("Programming Languages");

  const handleSelectCourse = (courseName, courseIcon) => {
    localStorage.setItem("course", courseName);
    localStorage.setItem("courseIcon", courseIcon);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Start Your Learning Journey
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose a comprehensive career roadmap or explore individual skills.
          </p>

          {/* Main Toggle */}
          <div className="mt-8 flex justify-center">
            <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-xl inline-flex">
              <button
                onClick={() => setActiveTab("roadmaps")}
                className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "roadmaps"
                  ? "bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
              >
                Career Roadmaps 🚀
              </button>
              <button
                onClick={() => setActiveTab("courses")}
                className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "courses"
                  ? "bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
              >
                Individual Courses 📚
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ROADMAPS VIEW */}
        {activeTab === "roadmaps" && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ROADMAPS.map((roadmap) => (
                <div key={roadmap.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
                  <div className={`h-32 bg-gradient-to-r ${roadmap.color} p-6 relative`}>
                    <div className="text-4xl absolute bottom-[-20px] left-6 bg-white dark:bg-gray-700 p-3 rounded-2xl shadow-md">
                      {roadmap.icon}
                    </div>
                  </div>
                  <div className="pt-10 px-6 pb-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                        {roadmap.title}
                      </h3>
                      <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs px-2 py-1 rounded-full font-semibold">
                        {roadmap.duration}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-3">
                      {roadmap.description}
                    </p>

                    {/* Timeline Visualization */}
                    <div className="relative space-y-0 mb-6 ml-2">
                      {/* Connecting Line */}
                      <div className="absolute top-2 left-[7px] h-[calc(100%-20px)] w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                      {roadmap.steps.slice(0, 4).map((step, idx) => (
                        <div key={idx} className="relative flex items-start group/step pb-4">
                          {/* Node */}
                          <div className={`z-10 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 flex-shrink-0 mt-1 transition-colors duration-300 ${idx === 0
                            ? "bg-indigo-500 ring-4 ring-indigo-100 dark:ring-indigo-900/30"
                            : "bg-gray-300 dark:bg-gray-600 group-hover/card:bg-indigo-400"
                            }`}></div>

                          {/* Content */}
                          <div className="ml-4 flex-1">
                            <h4 className={`text-sm font-semibold transition-colors ${idx === 0 ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 group-hover/card:text-gray-700 dark:group-hover/card:text-gray-300"
                              }`}>
                              {step.title}
                            </h4>
                            {idx === 0 && (
                              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                                Start Here
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                      {roadmap.steps.length > 4 && (
                        <div className="relative flex items-center pt-1 pl-0.5">
                          <div className="z-10 w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700 ml-[2px]"></div>
                          <span className="ml-5 text-xs text-gray-400 italic">
                            + {roadmap.steps.length - 4} more milestones...
                          </span>
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/roadmap/${roadmap.id}`}
                      className="block w-full text-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
                    >
                      View Details & Start
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COURSES VIEW */}
        {activeTab === "courses" && (
          <div className="animate-fade-in">
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center mb-10 gap-2">
              {Object.keys(courseCategories).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${selectedCategory === category
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courseCategories[selectedCategory].map((course, i) => (
                <Link to="/level" key={i} onClick={() => handleSelectCourse(course.name, course.icon)}>
                  <div className={`group bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${course.color.split(' ')[0]} bg-opacity-10 text-white`}>
                      {course.icon} {/* Simplified icon rendering for cleanliness */}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-500 transition-colors">{course.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{course.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

