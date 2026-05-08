export default function CoursePlayerPlaceholder() {
  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-lg">Course Player</h4>
            <div className="text-sm text-gray-500">Duration: 8h • 24 Lessons</div>
          </div>
          <div className="bg-black rounded-lg h-64 flex items-center justify-center text-white">Video / Interactive Content Placeholder</div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded">Chapter 1 • Intro</div>
            <div className="p-3 bg-gray-50 rounded">Chapter 2 • Basics</div>
            <div className="p-3 bg-gray-50 rounded">Chapter 3 • Practice</div>
          </div>
        </div>
      </div>
    </section>
  );
}
