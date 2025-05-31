"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressSteps from "./ProgressSteps";
import { ORDER_FLOW_STEPS, getStepInfo } from "./StepsConfig";
import { useCartStore } from "@/store/cart-store";

// Define type for a menu item
type MenuItem = {
  id: number;
  name: string;
  price: number;
  description: string;
  size: string;
  calories: number;
  category: string;
  image?: string;
};

export default function OrderPage() {
  const router = useRouter();
  const { items, addItem, removeItem, updateQuantity, totalItems, totalPrice } =
    useCartStore();
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All Items");

  // Example menu items
  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: "Cappuccino",
      price: 4.5,
      description: "Espresso with steamed milk and foam",
      size: "Medium",
      calories: 120,
      category: "Coffee",
      image:
        "https://images.unsplash.com/photo-1517701550928-30cf4ba1dba5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    },
    {
      id: 2,
      name: "Latte",
      price: 5.25,
      description: "Espresso with a lot of steamed milk",
      size: "Large",
      calories: 190,
      category: "Coffee",
      image:
        "https://images.unsplash.com/photo-1568649929103-28ffbefaca1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    },
    {
      id: 3,
      name: "Americano",
      price: 3.75,
      description: "Espresso with hot water",
      size: "Small",
      calories: 15,
      category: "Coffee",
      image:
        "https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    },
    {
      id: 4,
      name: "Mocha",
      price: 5.75,
      description: "Espresso with chocolate and steamed milk",
      size: "Medium",
      calories: 250,
      category: "Coffee",
      image:
        "https://images.unsplash.com/photo-1519175182139-61037ab2d100?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    },
    {
      id: 5,
      name: "Butter Croissant",
      price: 3.25,
      description: "Flaky, buttery pastry",
      size: "Regular",
      calories: 310,
      category: "Pastries",
      image:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    },
    {
      id: 6,
      name: "Blueberry Muffin",
      price: 3.75,
      description: "Fresh blueberries in a sweet muffin",
      size: "Large",
      calories: 380,
      category: "Pastries",
      image:
        "https://images.unsplash.com/photo-1607958996333-41784c70b86f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    },
  ];

  // Filter menu items
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All Items" || item.category === filter;
    return matchesSearch && matchesFilter;
  });

  // Group items by category
  const itemsByCategory: Record<string, MenuItem[]> = {};
  filteredMenuItems.forEach((item) => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = [];
    }
    itemsByCategory[item.category].push(item);
  });

  // Add to cart function for menu items
  const addToCartFromMenu = (
    id: number,
    name: string,
    price: number,
    size: string
  ) => {
    const productForCart = {
      id,
      name,
      price,
      image:
        menuItems.find((item) => item.id === id)?.image ||
        "/placeholder-coffee.jpg",
      description: menuItems.find((item) => item.id === id)?.description || "",
      category: menuItems.find((item) => item.id === id)?.category || "Coffee",
      available: true,
    };

    addItem(productForCart, 1);
  };

  // Helper functions for cart management
  const updateQuantityHandler = (id: number, change: number) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      const newQuantity = item.quantity + change;
      updateQuantity(id, newQuantity);
    }
  };

  const removeFromCartHandler = (id: number) => {
    removeItem(id);
  };

  // Apply promo code
  const applyPromo = () => {
    if (
      promoCode.toUpperCase() === "COFFEE10" &&
      !discountApplied &&
      items.length > 0
    ) {
      setDiscountApplied(true);
      setDiscountAmount(totalPrice * 0.1); // 10% discount
      alert("Promo code applied! 10% discount added.");
    } else if (discountApplied) {
      alert("Promo code already applied.");
    } else if (items.length === 0) {
      alert("Add items to cart before applying promo code.");
    } else {
      alert("Invalid promo code.");
    }
  };

  // Calculate subtotal (using Zustand store)
  const calculateSubtotal = () => {
    return totalPrice;
  };

  // Calculate tax (8%)
  const calculateTax = (subtotal: number) => {
    return subtotal * 0.08;
  };

  // Calculate total
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax - discountAmount;
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    if (items.length > 0) {
      // Store discount amount in localStorage
      localStorage.setItem("coffee-discount", String(discountAmount));

      // Use our StepsConfig helper to navigate to the next step
      const { nextStepRoute } = getStepInfo(1); // 1 is the current step for OrderPage
      router.push(nextStepRoute);
    }
  };

  // Load discount from localStorage on component mount
  useEffect(() => {
    const savedDiscount = localStorage.getItem("coffee-discount");

    if (savedDiscount) {
      const parsedDiscount = parseFloat(savedDiscount);
      if (parsedDiscount > 0) {
        setDiscountApplied(true);
        setDiscountAmount(parsedDiscount);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center">
            <div className="bg-purple-600 p-3 rounded-xl shadow-lg mr-4">
              <i className="fas fa-mug-hot text-2xl text-white"></i>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Coffee Haven
              </h1>
              <p className="text-gray-500 text-sm">Premium coffee experience</p>
            </div>
          </div>
          <div className="hidden md:flex items-center bg-white px-4 py-2 rounded-full shadow-md">
            <span className="text-gray-600 mr-2">Your Order</span>
            <div className="bg-purple-100 p-2 rounded-full">
              <i className="fas fa-shopping-basket text-purple-600"></i>
            </div>
          </div>
        </header>

        {/* Progress Steps */}
        <div className="mb-12">
          <ProgressSteps
            steps={ORDER_FLOW_STEPS}
            currentStep={1}
            allowNavigation={false}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            {/* Search and Filter */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search for your favorite coffee..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all duration-200 bg-gray-50 focus:bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <i className="fas fa-search absolute left-4 top-4 text-gray-400"></i>
                </div>
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-600">
                    Filter:
                  </label>
                  <select
                    className="text-sm border-2 border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 bg-white"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option>All Items</option>
                    <option>Coffee</option>
                    <option>Pastries</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Menu Categories */}
            <div className="space-y-10">
              {Object.entries(itemsByCategory).map(
                ([category, categoryItems]) => (
                  <div
                    key={category}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                  >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-lg mr-4">
                        <i
                          className={`fas fa-${
                            category === "Coffee" ? "coffee" : "bread-slice"
                          } text-white`}
                        ></i>
                      </div>
                      {category}
                      <span className="ml-auto text-sm bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">
                        {categoryItems.length} items
                      </span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {categoryItems.map((item) => (
                        <div
                          key={item.id}
                          className="group bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-xl border border-gray-100 p-6 transition-all duration-300 cursor-pointer hover:-translate-y-1"
                          onClick={() =>
                            addToCartFromMenu(
                              item.id,
                              item.name,
                              item.price,
                              item.size
                            )
                          }
                        >
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-gray-800 text-lg group-hover:text-purple-600 transition-colors">
                              {item.name}
                            </h3>
                            <span className="text-purple-600 font-bold text-lg bg-purple-50 px-3 py-1 rounded-lg">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                              <span className="flex items-center bg-red-50 px-2 py-1 rounded-lg">
                                <i className="fas fa-fire text-red-500 mr-1"></i>
                                {item.calories} cal
                              </span>
                              <span className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                                <i className="fas fa-mug-hot text-yellow-600 mr-1"></i>
                                {item.size}
                              </span>
                            </div>
                            <div className="bg-purple-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                              <i className="fas fa-plus"></i>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}

              {Object.keys(itemsByCategory).length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-search text-gray-400 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No items found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  <button
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    onClick={() => {
                      setSearchTerm("");
                      setFilter("All Items");
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cart Section */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg mr-3">
                    <i className="fas fa-shopping-basket text-white"></i>
                  </div>
                  Your Cart
                </h2>
                <div className="bg-purple-100 text-purple-800 text-sm font-bold px-3 py-2 rounded-full border-2 border-purple-200">
                  {totalItems} items
                </div>
              </div>

              {/* Cart Items */}
              <div className="mb-6 max-h-96 overflow-y-auto space-y-4">
                {items.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-shopping-basket text-gray-400 text-2xl"></i>
                    </div>
                    <h3 className="font-semibold text-gray-600 mb-1">
                      Your cart is empty
                    </h3>
                    <p className="text-sm">
                      Add some delicious items to get started
                    </p>
                  </div>
                ) : (
                  items.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-3">
                            ${item.price.toFixed(2)} each
                          </p>
                          <div className="flex items-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantityHandler(item.id, -1);
                              }}
                              className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600 flex items-center justify-center hover:from-red-100 hover:to-red-200 hover:text-red-600 transition-all"
                            >
                              <i className="fas fa-minus text-xs"></i>
                            </button>
                            <span className="mx-4 font-semibold text-lg min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantityHandler(item.id, 1);
                              }}
                              className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white flex items-center justify-center hover:from-purple-600 hover:to-purple-700 transition-all"
                            >
                              <i className="fas fa-plus text-xs"></i>
                            </button>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-bold text-lg text-purple-600">
                            ${item.subtotal.toFixed(2)}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCartHandler(item.id);
                            }}
                            className="text-red-500 hover:text-red-700 text-sm mt-2 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg transition-all"
                          >
                            <i className="fas fa-trash-alt mr-1"></i>Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Order Totals */}
              {items.length > 0 && (
                <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl p-4 border border-gray-200">
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        ${calculateSubtotal().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (8%)</span>
                      <span className="font-semibold">
                        ${calculateTax(calculateSubtotal()).toFixed(2)}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                        <span className="flex items-center">
                          <i className="fas fa-tag mr-2"></i>Discount
                        </span>
                        <span className="font-semibold">
                          -${discountAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-300 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-800">
                          Total
                        </span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                          ${calculateTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Promo Code */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <i className="fas fa-ticket-alt mr-2 text-purple-600"></i>
                  Promo Code
                </label>
                <div className="flex rounded-xl overflow-hidden border-2 border-gray-200 focus-within:border-purple-600 transition-colors">
                  <input
                    type="text"
                    className="flex-1 px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button
                    onClick={applyPromo}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-semibold"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={proceedToCheckout}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                disabled={items.length === 0}
              >
                <i className="fas fa-credit-card mr-3"></i>
                Proceed to Payment
                <i className="fas fa-arrow-right ml-3"></i>
              </button>

              {/* Pickup Info */}
              <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-purple-800 mb-2 flex items-center">
                  <i className="fas fa-store mr-2"></i>
                  Pickup Information
                </h3>
                <div className="space-y-1">
                  <p className="text-sm text-purple-700 flex items-center">
                    <i className="fas fa-map-marker-alt mr-2 text-purple-500"></i>
                    123 Coffee Street, Downtown
                  </p>
                  <p className="text-sm text-purple-700 flex items-center">
                    <i className="fas fa-clock mr-2 text-purple-500"></i>
                    Ready in 15-20 minutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
