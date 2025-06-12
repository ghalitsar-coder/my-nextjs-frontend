"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <i className="fas fa-coffee mr-2"></i> Brew Haven
            </h3>
            <p className="text-gray-400">
              Specialty coffee and artisanal bakery since 2015. Every cup tells
              a story.
            </p>
            <div className="mt-4 flex space-x-3 text-lg">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Our Locations</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <i className="fas fa-map-marker-alt mr-2"></i> 242 Bean Street
              </li>
              <li className="flex items-center">
                <i className="fas fa-map-marker-alt mr-2"></i> 10 Roastery Lane
              </li>
              <li className="flex items-center">
                <i className="fas fa-map-marker-alt mr-2"></i> 77 Espresso
                Avenue
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Hours</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex justify-between">
                <span>Weekdays</span> <span>6AM-7PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span> <span>7AM-8PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span> <span>7AM-6PM</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-2"></i> (555) 123-4567
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-2"></i> hello@brewhaven.com
              </li>
              <li className="flex items-center">
                <i className="fas fa-shipping-fast mr-2"></i> Delivery Info
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; 2025 Brew Haven. All rights reserved.</p>
          <p className="mt-2 text-xs">
            Pair your menu with our mobile app for faster ordering and rewards!
          </p>
        </div>
      </div>
    </footer>
  );
}
