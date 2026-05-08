import { Link } from 'react-router-dom';

export default function Footer(){
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-white font-bold mb-3">Aifur Swedish Restaurant</h4>
          <p className="text-sm">Experience the authentic fusion of Swedish heritage and Pakistani spice. A journey of flavors across continents.</p>
        </div>

        <div>
          <h5 className="font-semibold mb-2">Explore</h5>
          <ul className="text-sm space-y-1">
            <li><Link to="/menu" className="hover:underline">Our Menu</Link></li>
            <li><Link to="/reservations" className="hover:underline">Reservations</Link></li>
            <li><Link to="/about" className="hover:underline">Our Story</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold mb-2">Support</h5>
          <ul className="text-sm space-y-1">
            <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
            <li><Link to="/login" className="hover:underline">Sign In</Link></li>
            <li><Link to="/signup" className="hover:underline">Join Us</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">© {new Date().getFullYear()} Aifur Swedish Restaurant — All rights reserved.</div>
    </footer>
  );
}
