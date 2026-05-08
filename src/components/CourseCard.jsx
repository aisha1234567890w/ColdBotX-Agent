import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{course.title}</h4>
          <div className="text-xs text-gray-500 dark:text-gray-400">{course.level} · {course.lessons} lessons</div>
        </div>
        <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{course.duration}</div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>

      <div className="flex items-center justify-between">
        <Link to="/course" className="text-sm text-gray-700 dark:text-gray-300 hover:underline">View course</Link>
        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-lg text-sm hover:shadow-lg transition-transform hover:scale-105">Start</button>
      </div>
    </article>
  );
}
