"use client";

import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";

export default function CartButton() {
  const { totalItems, isOpen, toggleCart } = useCartStore();
  const router = useRouter();

  const handleCartClick = () => {
    // Navigate to order page instead of toggling cart
    router.push("/order");
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCart();
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Toggle Cart Sidebar Button */}
      <button
        onClick={handleToggleClick}
        className="relative bg-white hover:bg-gray-50 p-2 rounded-lg shadow-md transition-all duration-200 border border-gray-200 group"
        title="Toggle Cart"
      >
        <i
          className={`fas fa-shopping-bag text-gray-700 group-hover:text-purple-600 transition-colors ${
            isOpen ? "text-purple-600" : ""
          }`}
        ></i>

        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </button>

      {/* Go to Order Page Button */}
      <button
        onClick={handleCartClick}
        className="relative bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 group flex items-center space-x-2"
        title="Go to Order Page"
      >
        <i className="fas fa-shopping-cart"></i>
        <span className="text-sm font-medium">Order</span>

        {totalItems > 0 && (
          <span className="bg-white text-purple-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </button>
    </div>
  );
}
