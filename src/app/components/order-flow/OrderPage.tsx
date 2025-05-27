"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ProgressSteps from "./ProgressSteps";
import { ORDER_FLOW_STEPS, getStepInfo } from "./StepsConfig";

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

// Define type for a cart item
type CartItem = {
  id: number;
  name: string;
  price: number;
  size: string;
  quantity: number;
  options?: string[];
};

export default function OrderPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All Items");
  // Use shared steps configuration from StepsConfig

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

  // Add to cart function
  const addToCart = (id: number, name: string, price: number, size: string) => {
    const existingItem = cart.find(
      (item) => item.id === id && item.size === size
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { id, name, price, size, quantity: 1 }]);
    }
  };

  // Remove from cart function
  const removeFromCart = (id: number, size: string) => {
    setCart(cart.filter((item) => !(item.id === id && item.size === size)));
  };

  // Update quantity function
  const updateQuantity = (id: number, size: string, change: number) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === id && item.size === size) {
          const newQuantity = item.quantity + change;
          return newQuantity <= 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    setCart(updatedCart);
  };

  // Apply promo code
  const applyPromo = () => {
    if (
      promoCode.toUpperCase() === "COFFEE10" &&
      !discountApplied &&
      cart.length > 0
    ) {
      setDiscountApplied(true);
      setDiscountAmount(calculateSubtotal() * 0.1); // 10% discount
      alert("Promo code applied! 10% discount added.");
    } else if (discountApplied) {
      alert("Promo code already applied.");
    } else if (cart.length === 0) {
      alert("Add items to cart before applying promo code.");
    } else {
      alert("Invalid promo code.");
    }
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
    if (cart.length > 0) {
      // Store cart data in localStorage
      localStorage.setItem("coffee-cart", JSON.stringify(cart));
      localStorage.setItem("coffee-discount", String(discountAmount));

      // Use our StepsConfig helper to navigate to the next step
      const { nextStepRoute } = getStepInfo(1); // 1 is the current step for OrderPage
      router.push(nextStepRoute);
    }
  };

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("coffee-cart");
    const savedDiscount = localStorage.getItem("coffee-discount");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    if (savedDiscount) {
      const parsedDiscount = parseFloat(savedDiscount);
      if (parsedDiscount > 0) {
        setDiscountApplied(true);
        setDiscountAmount(parsedDiscount);
      }
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <i className="fas fa-mug-hot text-3xl text-purple-600 mr-3"></i>
          <h1 className="text-2xl font-bold text-gray-800">Coffee Haven</h1>
        </div>
        <div className="text-sm text-gray-500">
          <span className="hidden md:inline">Your Order</span>
          <i className="fas fa-shopping-basket ml-2 text-purple-500"></i>
        </div>
      </header>{" "}
      {/* Progress Steps */}
      <ProgressSteps
        steps={ORDER_FLOW_STEPS}
        currentStep={1}
        allowNavigation={false}
      />
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Menu Section */}
        <div className="lg:col-span-2">
          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search menu..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Filter:</label>
                <select
                  className="text-sm border rounded-lg px-3 py-1 focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
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
          <div className="space-y-8">
            {Object.entries(itemsByCategory).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <i
                    className={`fas fa-${
                      category === "Coffee" ? "coffee" : "bread-slice"
                    } mr-2 text-purple-600`}
                  ></i>
                  {category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="menu-item bg-white rounded-lg shadow-md p-4 transition duration-200 cursor-pointer"
                      onClick={() =>
                        addToCart(item.id, item.name, item.price, item.size)
                      }
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-800">
                          {item.name}
                        </h3>
                        <span className="text-purple-600 font-medium">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        {item.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-3">
                          <i className="fas fa-fire text-red-400 mr-1"></i>{" "}
                          {item.calories} cal
                        </span>
                        <span>
                          <i className="fas fa-mug-hot text-yellow-600 mr-1"></i>{" "}
                          {item.size}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {Object.keys(itemsByCategory).length === 0 && (
              <div className="text-center py-8">
                <i className="fas fa-search text-gray-300 text-4xl mb-3"></i>
                <p className="text-gray-500">No items match your search.</p>
                <button
                  className="mt-3 text-purple-600 underline"
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
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-shopping-basket mr-2 text-purple-600"></i>
              Your Cart
              <span className="ml-auto bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </h2>

            {/* Cart Items */}
            <div className="mb-6 max-h-96 overflow-y-auto custom-scrollbar space-y-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  <i className="fas fa-shopping-basket text-3xl mb-2"></i>
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div
                    key={`${item.id}-${item.size}-${index}`}
                    className="cart-item flex justify-between items-start border-b pb-3"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.size}</p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.id, item.size, -1);
                          }}
                          className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center"
                        >
                          <i className="fas fa-minus text-xs"></i>
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.id, item.size, 1);
                          }}
                          className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center"
                        >
                          <i className="fas fa-plus text-xs"></i>
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromCart(item.id, item.size);
                        }}
                        className="text-red-500 text-sm mt-2"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Order Totals */}
            {cart.length > 0 && (
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ${calculateSubtotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">
                    ${calculateTax(calculateSubtotal()).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-green-600">
                    -${discountAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 font-bold text-lg">
                  <span className="text-gray-800">Total</span>
                  <span className="text-purple-600">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Promo Code */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Promo Code
              </label>
              <div className="flex">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border rounded-l-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button
                  onClick={applyPromo}
                  className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 transition duration-200"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={proceedToCheckout}
              className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={cart.length === 0}
            >
              <i className="fas fa-arrow-right mr-2"></i> Proceed to Payment
            </button>

            {/* Pickup Info */}
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <h3 className="text-sm font-medium text-purple-800 mb-1 flex items-center">
                <i className="fas fa-store mr-2"></i> Pickup at:
              </h3>
              <p className="text-xs text-purple-700">
                123 Coffee Street, Downtown
              </p>
              <p className="text-xs text-purple-700">
                Estimated ready in 15-20 min
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
