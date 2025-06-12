"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { productApi } from "@/lib/api";

// Interface matching the backend Product entity
interface Product {
  productId: number;
  category: {
    categoryId: number;
    name: string;
    description: string;
  };
  name: string;
  description: string;
  price: number;
  stock: number;
  isAvailable: boolean;
}

// Interface for frontend display (with additional properties like image and rating)
interface MenuItem {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  rating: number;
  category: string;
}

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(["All"]);

  // Default coffee images for products that don't have images
  const getDefaultImage = (categoryName: string): string => {
    const imageMap: { [key: string]: string } = {
      Coffee:
        "https://images.unsplash.com/photo-1522992319-0365e5f11656?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      Tea: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      Pastry:
        "https://images.unsplash.com/photo-1555507036-ab794f4afe5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      Sandwich:
        "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      Merchandise:
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      // Fallback categories
      "Hot Coffee":
        "https://images.unsplash.com/photo-1522992319-0365e5f11656?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      "Cold Brew":
        "https://images.unsplash.com/photo-1596079890744-c1a0462d1605?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      Espresso:
        "https://images.unsplash.com/photo-1534778101976-6fa2976c6ae1?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    };
    return (
      imageMap[categoryName] ||
      "https://images.unsplash.com/photo-1522992319-0365e5f11656?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
    );
  };
  // Convert backend Product to frontend MenuItem
  const convertToMenuItem = (product: Product): MenuItem => ({
    id: product.productId,
    name: product.name,
    price: formatPrice(product.price),
    description: product.description || "Delicious coffee crafted with care",
    image: getDefaultImage(product.category.name),
    rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0 for demo
    category: product.category.name,
  });

  // Format price based on the currency (assuming Indonesian Rupiah for large numbers)
  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      // Format as Indonesian Rupiah for large numbers
      return `Rp ${price.toLocaleString("id-ID")}`;
    } else {
      // Format as USD for smaller numbers
      return `$${price.toFixed(2)}`;
    }
  };
  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const data: Product[] = await productApi.getAll();
        setProducts(data);

        // Extract unique categories from products
        const uniqueCategories = Array.from(
          new Set(data.map((product) => product.category.name))
        );
        setCategories(["All", ...uniqueCategories]);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load menu items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }

    return stars;
  };

  // Filter products based on active category
  const filteredProducts = products.filter(
    (product) =>
      activeCategory === "All" || product.category.name === activeCategory
  );

  // Convert filtered products to menu items
  const menuItems = filteredProducts.map(convertToMenuItem);

  // Loading state
  if (loading) {
    return (
      <section id="menu" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="display-font text-4xl font-bold mb-4">
              Our Signature Creations
            </h2>
            <div className="w-24 h-1 gradient-bg rounded-full mx-auto animate-gradient"></div>
            <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
              Loading our delicious menu items...
            </p>
          </div>

          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 p-5 animate-pulse"
              >
                <div className="h-56 rounded-xl bg-gray-200"></div>
                <div className="pt-5">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="menu" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="display-font text-4xl font-bold mb-4">
              Our Signature Creations
            </h2>
            <div className="w-24 h-1 gradient-bg rounded-full mx-auto animate-gradient"></div>
          </div>

          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <i className="fas fa-exclamation-triangle text-4xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 bg-[#c08450] text-white rounded-lg hover:bg-[#9a6c3e] transition-colors"
            >
              <i className="fas fa-redo mr-2"></i>
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id="menu" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="display-font text-4xl font-bold mb-4">
            Our Signature Creations
          </h2>
          <div className="w-24 h-1 gradient-bg rounded-full mx-auto animate-gradient"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Each cup is meticulously prepared by our trained baristas using the
            finest ingredients.
          </p>
        </div>

        {/* Menu Categories */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-lg bg-gray-100 p-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  activeCategory === category
                    ? "bg-white shadow-sm text-gray-900"
                    : "hover:bg-gray-200 text-gray-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        {menuItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <i className="fas fa-coffee text-4xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No items available
            </h3>
            <p className="text-gray-500">
              {activeCategory === "All"
                ? "No menu items are currently available."
                : `No items available in the ${activeCategory} category.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="block"
              >
                <div className="menu-item bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 p-5 transition-all duration-300 cursor-pointer">
                  <div className="h-56 rounded-xl overflow-hidden flex items-center justify-center bg-gray-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        // Fallback image if the image fails to load
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1522992319-0365e5f11656?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80";
                      }}
                    />
                  </div>
                  <div className="pt-5">
                    <div className="flex justify-between">
                      <h3 className="text-xl font-bold">{item.name}</h3>
                      <span className="text-[#c08450] font-bold">
                        {item.price}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2 text-sm">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex space-x-1 text-amber-400">
                        {renderStars(item.rating)}
                      </div>
                      <button
                        className="text-[#c08450] hover:text-[#9a6c3e] transition-colors"
                        title="Add to cart"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent navigation when clicking add to cart
                          e.stopPropagation();
                          // TODO: Add to cart functionality
                        }}
                      >
                        <i className="fas fa-plus-circle text-xl"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-flex items-center text-[#c08450] hover:text-[#9a6c3e] font-medium transition"
          >
            View Full Menu
            <i className="fas fa-chevron-right ml-2"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
