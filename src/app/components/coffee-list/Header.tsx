"use client";

import Link from "next/link";

interface HeaderProps {
  cartCount: number;
}

export default function Header({ cartCount }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <i className="fas fa-coffee text-purple-700 text-2xl"></i>
          <h1 className="text-xl font-bold text-gray-800">Brew Haven</h1>
        </div>

        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-gray-600 hover:text-purple-700 transition"
          >
            <i className="fas fa-home"></i>
          </Link>
          <Link
            href="/cart"
            className="text-gray-600 hover:text-purple-700 transition relative"
          >
            <i className="fas fa-shopping-cart"></i>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-purple-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
          <Link
            href="/role-test"
            className="text-gray-600 hover:text-purple-700 transition"
          >
            <i className="fas fa-user"></i>
          </Link>
        </div>
      </div>
    </header>
  );
}
