import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.png';
import { menuData } from '../data/menu';

export default function RestaurantHero() {
  // Get all main dishes from all categories
  const allMains = [
    ...menuData.swedish.mains,
    ...menuData.pakistani.mains,
    ...menuData.fusion.mains
  ];

  // Pick a different special every day based on current date
  const dayOfYear = new Date().getDate();
  const specialItem = allMains[dayOfYear % allMains.length];

  return (
    <section className="relative h-[90vh] flex items-center overflow-hidden bg-gray-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Restaurant Interior" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-900/80 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-2xl">
          <div className="inline-block px-4 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-sm font-bold mb-6 animate-fade-in">
            A Unique Fusion Experience
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6 animate-fade-in">
            Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Sweden</span> Meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Pakistan</span>.
          </h1>
          <p className="text-xl text-gray-300 mb-10 animate-fade-in delay-100">
            Aifur brings the authentic flavors of Swedish heritage and the vibrant spices of Pakistani cuisine together under one roof.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-200">
            <Link to="/menu">
              <button className="w-full sm:w-auto bg-white text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-xl">
                Explore Menu
              </button>
            </Link>
            <Link to="/reservations">
              <button className="w-full sm:w-auto bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-xl border border-indigo-500">
                Book a Table
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Elements / Decorative */}
      <div className="absolute bottom-12 right-12 hidden lg:block animate-bounce duration-[3000ms]">
        <Link to="/menu" className="block transform hover:scale-105 transition-transform">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl">
            <div className="text-indigo-400 font-bold text-sm mb-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
              Today's Special
            </div>
            <div className="text-white font-bold text-lg">{specialItem.name}</div>
            <div className="text-gray-400 text-sm">PKR {specialItem.price.toLocaleString()}</div>
          </div>
        </Link>
      </div>
    </section>
  );
}
