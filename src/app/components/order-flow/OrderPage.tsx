"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressSteps from "./ProgressSteps";
import { ORDER_FLOW_STEPS, getStepInfo } from "./StepsConfig";
import { useCartStore } from "@/store/cart-store";

// Define type for API product
type ApiProduct = {
  productId: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  category: {
    categoryId: number;
    name: string;
    description: string;
  };
};

export default function OrderPage() {
  const router = useRouter();
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
    // Promotion state and actions
    availablePromotions,
    selectedPromotions,
    discountAmount,
    isLoadingPromotions,
    togglePromotion,
    fetchAvailablePromotions, // Use centralized fetch function
  } = useCartStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All Items");
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await fetch("http://localhost:8080/api/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter menu items
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All Items" || product.category.name === filter;
    return matchesSearch && matchesFilter && product.isAvailable;
  });

  // Group items by category
  const productsByCategory: Record<string, ApiProduct[]> = {};
  filteredProducts.forEach((product) => {
    const categoryName = product.category.name;
    if (!productsByCategory[categoryName]) {
      productsByCategory[categoryName] = [];
    }
    productsByCategory[categoryName].push(product);
  });
  // Get unique categories for filter dropdown
  const availableCategories = [...new Set(products.map(p => p.category.name))];

  // Helper function to get category icon
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'coffee': return 'coffee';
      case 'tea': return 'leaf';
      case 'pastry': return 'bread-slice';
      case 'sandwich': return 'hamburger';
      case 'merchandise': return 'shopping-bag';
      default: return 'utensils';
    }
  };

  // Add to cart function for menu items
  const addToCartFromMenu = (productId: number, name: string, price: number) => {
    const product = products.find((p) => p.productId === productId);
    if (!product) return;    const productForCart = {
      id: productId,
      name,
      price: price, // Use the price directly from API since it's already in IDR
      image: "/placeholder-coffee.jpg", // Default image since API doesn't provide images
      description: product.description,
      category: product.category.name,
      available: product.isAvailable,
    };

    addItem(productForCart, 1);
  };

  // Helper functions for cart management
  const updateQuantityHandler = (id: number, change: number) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      const newQuantity = item.quantity + change;
      updateQuantity(item.uniqueKey, newQuantity);
    }
  };

  const removeFromCartHandler = (id: number) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      removeItem(item.uniqueKey);
    }
  };
  // Handle promotion selection toggle
  const handlePromotionToggle = (promotionId: number) => {
    togglePromotion(promotionId);
  };
  // Calculate subtotal (using Zustand store)
  const calculateSubtotal = () => {
    return totalPrice;
  };
  // Calculate total with promotion discount
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - discountAmount;
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    if (items.length > 0) {
      // Use our StepsConfig helper to navigate to the next step
      const { nextStepRoute } = getStepInfo(1); // 1 is the current step for OrderPage
      router.push(nextStepRoute);
    }
  };
  // Fetch promotions when cart changes using Zustand store
  useEffect(() => {
    if (totalPrice > 0) {
      fetchAvailablePromotions();
    }
  }, [totalPrice, fetchAvailablePromotions]);

  // Save selected promotions to localStorage when they change
  useEffect(() => {
    if (selectedPromotions.length > 0) {
      localStorage.setItem(
        "coffee-selected-promotions",
        JSON.stringify(selectedPromotions)
      );
    } else {
      localStorage.removeItem("coffee-selected-promotions");
    }
  }, [selectedPromotions]);
  // Load saved selected promotions from localStorage on component mount
  useEffect(() => {
    const savedPromotions = localStorage.getItem("coffee-selected-promotions");
    if (savedPromotions) {
      try {
        const promotionIds = JSON.parse(savedPromotions);
        if (Array.isArray(promotionIds)) {
          // Apply saved promotions - the cart store will handle discount calculation
          promotionIds.forEach((id) => {
            if (!selectedPromotions.includes(id)) {
              togglePromotion(id);
            }
          });
        }
      } catch (error) {
        console.error("Error loading saved promotions:", error);
      }
    }
  }, [selectedPromotions, togglePromotion]); // Include dependencies

  // Helper for formatting currency to IDR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

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
                </div>                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-600">
                    Filter:
                  </label>
                  <select
                    className="text-sm border-2 border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 bg-white"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option>All Items</option>
                    {availableCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>            {/* Menu Categories */}
            <div className="space-y-10">
              {isLoadingProducts ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-spinner fa-spin text-purple-600 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Loading products...
                  </h3>
                  <p className="text-gray-500">
                    Please wait while we fetch the latest menu items
                  </p>
                </div>
              ) : (
                Object.entries(productsByCategory).map(
                  ([category, categoryProducts]) => (
                    <div
                      key={category}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                    >
                      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-lg mr-4">
                          <i
                            className={`fas fa-${getCategoryIcon(category)} text-white`}
                          ></i>
                        </div>
                        {category}
                        <span className="ml-auto text-sm bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">
                          {categoryProducts.length} items
                        </span>
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {categoryProducts.map((product) => (
                          <div
                            key={product.productId}
                            className="group bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-xl border border-gray-100 p-6 transition-all duration-300 cursor-pointer hover:-translate-y-1"
                            onClick={() =>
                              addToCartFromMenu(product.productId, product.name, product.price)
                            }
                          >
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="font-semibold text-gray-800 text-lg group-hover:text-purple-600 transition-colors">
                                {product.name}
                              </h3>
                              <span className="text-purple-600 font-bold text-lg bg-purple-50 px-3 py-1 rounded-lg">
                                {formatCurrency(product.price)}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                              {product.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-gray-500 space-x-4">
                                <span className="flex items-center bg-green-50 px-2 py-1 rounded-lg">
                                  <i className="fas fa-check text-green-500 mr-1"></i>
                                  In Stock ({product.stock})
                                </span>
                                <span className="flex items-center bg-blue-50 px-2 py-1 rounded-lg">
                                  <i className="fas fa-tag text-blue-600 mr-1"></i>
                                  {product.category.name}
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
                )
              )}

              {!isLoadingProducts && Object.keys(productsByCategory).length === 0 && (
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
                            {formatCurrency(item.price)} each
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
                            {formatCurrency(item.subtotal)}
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
                  {" "}
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        {formatCurrency(calculateSubtotal())}
                      </span>
                    </div>{" "}
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                        <span className="flex items-center">
                          <i className="fas fa-tag mr-2"></i>Promotion Discount
                        </span>
                        <span className="font-semibold">
                          -{formatCurrency(discountAmount)}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-300 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-800">
                          Total
                        </span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                          {formatCurrency(calculateTotal())}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}{" "}
              {/* Available Promotions */}
              {items.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <i className="fas fa-tags mr-2 text-purple-600"></i>
                    Available Promotions
                    {isLoadingPromotions && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        Loading...
                      </span>
                    )}
                  </label>

                  {isLoadingPromotions ? (
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <div className="animate-spin bg-purple-600 w-6 h-6 rounded-full border-2 border-purple-200 border-t-transparent mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">
                        Loading promotions...
                      </p>
                    </div>
                  ) : availablePromotions.length > 0 ? (
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {availablePromotions.map((promotion) => (
                        <div
                          key={promotion.promotionId}
                          className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                            selectedPromotions.includes(promotion.promotionId)
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 bg-white hover:border-purple-300"
                          }`}
                          onClick={() =>
                            handlePromotionToggle(promotion.promotionId)
                          }
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-1">
                                <input
                                  type="checkbox"
                                  checked={selectedPromotions.includes(
                                    promotion.promotionId
                                  )}
                                  onChange={() => {}} // Handled by div onClick
                                  className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <h4 className="font-semibold text-gray-800">
                                  {promotion.name}
                                </h4>
                              </div>
                              <p className="text-sm text-gray-600 ml-7 mb-2">
                                {promotion.description}
                              </p>
                              {promotion.minimumPurchaseAmount > 0 && (
                                <p className="text-xs text-gray-500 ml-7">
                                  Minimum purchase: {formatCurrency(promotion.minimumPurchaseAmount)}
                                </p>
                              )}
                            </div>{" "}
                            <div className="text-right ml-4">
                              <span className="text-lg font-bold text-purple-600">
                                {promotion.promotionType === "FIXED_AMOUNT"
                                  ? `${formatCurrency(promotion.discountValue)} OFF`
                                  : `${promotion.discountValue > 1 ? promotion.discountValue : promotion.discountValue * 100}% OFF`}
                              </span>
                              {promotion.promotionType === "PERCENTAGE" &&
                                promotion.maxDiscountAmount && (
                                  <p className="text-xs text-gray-500">
                                    Max: {formatCurrency(promotion.maxDiscountAmount)}
                                  </p>
                                )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <i className="fas fa-info-circle text-gray-400 mb-2"></i>
                      <p className="text-sm text-gray-600">
                        {totalPrice > 0
                          ? "No promotions available for your current order"
                          : "Add items to see available promotions"}
                      </p>
                    </div>
                  )}
                </div>
              )}
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
