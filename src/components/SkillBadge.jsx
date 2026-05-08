export default function SkillBadge({ name, level }) {
  return (
    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-pink-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
      <span className="w-6 h-6 rounded-full bg-yellow-300 flex items-center justify-center text-xs">★</span>
      <span>{name}</span>
      <span className="text-xs text-gray-600 ml-2">{level}</span>
    </div>
  );
}
