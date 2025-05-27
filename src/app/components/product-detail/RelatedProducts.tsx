"use client";

import Link from "next/link";
import Image from "next/image";
import { RelatedProduct } from "./types";

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const addToCart = (product: RelatedProduct, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // Get current cart from localStorage or initialize an empty array
    const currentCart = JSON.parse(localStorage.getItem("coffee-cart") || "[]");

    // Check if item already exists
    const existingItemIndex = currentCart.findIndex(
      (item: any) => item.id === product.id && item.size === "12oz" // Default size
    );

    if (existingItemIndex !== -1) {
      // Update existing item
      currentCart[existingItemIndex].quantity += 1;
    } else {
      // Add new item
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        size: "12oz", // Default size
        grind: "Whole Bean", // Default grind
        image: product.image,
      });
    }

    // Save updated cart
    localStorage.setItem("coffee-cart", JSON.stringify(currentCart));

    // Show confirmation message
    alert(`Added ${product.name} to cart!`);
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <>
      <h2 className="font-serif text-2xl font-bold text-[#3a3226] mb-8">
        You Might Also Enjoy
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            href={`/product/${product.id}`}
            key={product.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 menu-card-hover"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition duration-500 hover:scale-105"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-white/90 text-[#9c7c5b] text-xs font-medium px-2 py-1 rounded">
                  {product.badge}
                </span>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-bold text-[#3a3226] mb-1">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-3">
                {product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-serif text-lg font-bold text-[#9c7c5b]">
                  ${product.price.toFixed(2)}
                </span>
                <button
                  className="text-[#9c7c5b] hover:text-[#8a6b4d] transition"
                  onClick={(e) => addToCart(product, e)}
                  aria-label={`Add ${product.name} to cart`}
                >
                  <i className="fas fa-plus-circle text-xl"></i>
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
