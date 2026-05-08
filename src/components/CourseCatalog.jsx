import CourseCard from './CourseCard';

const sampleCourses = [
  {
    id: 1,
    title: 'Master Python',
    level: 'All Levels',
    lessons: 19,
    duration: '15h',
    description: 'Complete path from Absolute Beginner to Expert. Covers syntax, OOP, and async programming.'
  },
  {
    id: 2,
    title: 'Advanced C# Patterns',
    level: 'Advanced',
    lessons: 30,
    duration: '25h',
    description: 'Deep dive into OOP, Inheritance, Polymorphism, and File I/O serialization.'
  },
  {
    id: 3,
    title: 'Java Essentials',
    level: 'Beginner',
    lessons: 2,
    duration: '2h',
    description: 'Core concepts including operators and string manipulation for new developers.'
  }
];

export default function CourseCatalog() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Explore Courses</h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">Sort: Popular</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleCourses.map(c => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
