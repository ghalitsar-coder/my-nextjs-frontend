"use client";

import { useState, useEffect } from "react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
    closeMenu();
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled ? "bg-gray-900/95 backdrop-blur-md shadow-lg" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-white display-font">
              Lavazza
            </span>
          </div>

          <div className="hidden lg:block">
            <div className="ml-10 flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("home")}
                className="text-white px-3 py-2 text-sm font-medium hover:bg-white/10 rounded-lg transition"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("menu")}
                className="text-white/70 px-3 py-2 text-sm font-medium hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                Menu
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-white/70 px-3 py-2 text-sm font-medium hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("locations")}
                className="text-white/70 px-3 py-2 text-sm font-medium hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                Locations
              </button>
              <button
                onClick={() => scrollToSection("order")}
                className="ml-6 bg-white/90 text-gray-900 px-6 py-2 rounded-full text-sm font-medium hover:bg-white transition"
              >
                Order Online
              </button>
            </div>
          </div>

          <div className="lg:hidden flex items-center">
            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden bg-gray-900/95 backdrop-blur-md ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-2">
          <button
            onClick={() => scrollToSection("home")}
            className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 w-full text-left"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection("menu")}
            className="text-white/70 block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 w-full text-left"
          >
            Menu
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="text-white/70 block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 w-full text-left"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection("locations")}
            className="text-white/70 block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 w-full text-left"
          >
            Locations
          </button>
          <button
            onClick={() => scrollToSection("order")}
            className="mt-2 block w-full bg-white text-gray-900 px-4 py-3 rounded-lg text-center font-medium"
          >
            Order Online
          </button>
        </div>
      </div>
    </nav>
  );
}
