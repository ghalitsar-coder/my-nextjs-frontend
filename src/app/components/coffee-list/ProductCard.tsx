"use client";

import { useState, useEffect } from "react";
import { Product } from "../../coffee-list/page";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  // Store customization selections
  const [customizations, setCustomizations] = useState<Record<string, string>>(
    {}
  );
  const [isAnimated, setIsAnimated] = useState(false);

  // Handle customization change
  const handleCustomizationChange = (name: string, value: string) => {
    setCustomizations((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddToCart = () => {
    // Pass product and selected customizations
    onAddToCart({ ...product, selectedCustomizations: customizations });

    // Show notification
    showAddedToCartNotification(product.name);
  };

  // Animation for "Added to cart" notification
  const showAddedToCartNotification = (itemName: string) => {
    // Create notification element
    const notification = document.createElement("div");
    notification.className =
      "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center animate-fade-in-up z-50";
    notification.innerHTML = `
      <i class="fas fa-check-circle mr-2"></i> ${itemName} added to cart!
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Remove after delay
    setTimeout(() => {
      notification.classList.add("animate-fade-out");
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  };

  // Apply animation when component mounts
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAnimated(true);
    }, product.id * 100); // Staggered animation based on product ID

    return () => clearTimeout(timeout);
  }, [product.id]);

  // Generate star rating display
  const renderRating = () => {
    const stars = [];
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }

    return stars;
  };

  const isAvailable = product.status !== "sold out";
  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden coffee-card transition duration-300 relative ${
        isAnimated ? "opacity-100 transform-none" : "opacity-0 translate-y-5"
      }`}
      style={{ transitionDelay: `${product.id * 0.1}s` }}
    >
      <div className="relative h-48">
        {product.status === "sold out" && (
          <div className="absolute inset-0 sold-out-overlay z-10"></div>
        )}
        <div className="relative w-full h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            priority={product.id < 5} // Prioritize loading first few images
          />
        </div>

        <div
          className={`absolute top-2 right-2 z-20 ${
            product.status === "available"
              ? "bg-green-500"
              : product.status === "sold out"
              ? "bg-red-500"
              : "bg-yellow-500"
          } text-white text-xs font-bold px-2 py-1 rounded-full`}
        >
          {product.statusLabel ||
            (product.status === "available"
              ? "Available"
              : product.status === "sold out"
              ? "Sold Out"
              : "Limited")}
        </div>

        {product.badge && (
          <div className="absolute top-2 left-2 special-badge text-white text-xs font-bold px-2 py-1 rounded">
            {product.badge}
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
            {product.origin && (
              <p className="text-sm text-gray-500">{product.origin}</p>
            )}
          </div>
          <div>
            <span className="text-lg font-bold text-purple-700">
              ${product.price.toFixed(2)}
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through ml-1">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </span>
          </div>
        </div>

        <p className="text-gray-600 mb-4">{product.description}</p>

        <div className="flex justify-between items-center">
          <div className="flex items-center text-yellow-400">
            {renderRating()}
            <span className="text-gray-500 text-sm ml-1">
              ({product.reviews})
            </span>
          </div>

          {isAvailable ? (
            <button
              onClick={handleAddToCart}
              className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-full transition flex items-center"
            >
              <i className="fas fa-plus mr-1"></i> Add
            </button>
          ) : (
            <button
              className="bg-gray-300 text-gray-500 px-4 py-2 rounded-full cursor-not-allowed"
              disabled
            >
              <i className="fas fa-ban mr-1"></i> Not Available
            </button>
          )}
        </div>

        {product.customizations &&
          product.customizations.length > 0 &&
          isAvailable && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Customizations:
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {product.customizations.map((custom) => (
                  <div key={custom.name}>
                    <label className="block text-xs text-gray-500 mb-1">
                      {custom.name}
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:border-purple-500"
                      value={customizations[custom.name] || ""}
                      onChange={(e) =>
                        handleCustomizationChange(custom.name, e.target.value)
                      }
                    >
                      {custom.options.map((option) => (
                        <option key={option.label} value={option.label}>
                          {option.label}
                          {option.price
                            ? ` (+$${option.price.toFixed(2)})`
                            : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

        {product.status === "sold out" && product.availableTime && (
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-purple-700 text-sm font-medium">
              Available {product.availableTime}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
