"use client";

import { useState, useEffect } from "react";
import CategoryTabs from "./CategoryTabs";
import ProductCard from "./ProductCard";
import PromotionalBanner from "./PromotionalBanner";
import Pagination from "./Pagination";
import { Product } from "../../coffee-list/page";

// Sample product data
const products: Product[] = [
  {
    id: 1,
    name: "Cappuccino",
    description: "Espresso with steamed milk foam, dusted with cocoa powder.",
    price: 4.5,
    image:
      "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Hot Coffee",
    status: "available",
    rating: 4.5,
    reviews: 92,
    origin: "Single Origin Ethiopia",
    customizations: [
      {
        name: "Size",
        options: [{ label: "Regular" }, { label: "Large", price: 0.75 }],
      },
      {
        name: "Milk",
        options: [
          { label: "Whole" },
          { label: "Almond", price: 0.5 },
          { label: "Oat", price: 0.5 },
          { label: "Soy", price: 0.5 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Cold Brew",
    description:
      "Slow steeped for 18 hours with notes of chocolate and caramel.",
    price: 5.25,
    originalPrice: 6.0,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d200?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Iced Coffee",
    status: "available",
    badge: "Today's Special",
    rating: 5.0,
    reviews: 147,
    origin: "Colombia Dark Roast",
    customizations: [
      {
        name: "Size",
        options: [{ label: "Regular" }, { label: "Large", price: 1.0 }],
      },
      {
        name: "Sweetness",
        options: [
          { label: "None" },
          { label: "Light" },
          { label: "Medium", price: 0.25 },
          { label: "Sweet", price: 0.5 },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Matcha Latte",
    description: "Traditional Japanese matcha whisked with steamed milk.",
    price: 5.75,
    image:
      "https://images.unsplash.com/photo-1517701550925-1835c07dfd5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Teas",
    status: "sold out",
    rating: 4.0,
    reviews: 68,
    origin: "Premium Ceremonial Grade",
    availableTime: "tomorrow after 8AM",
  },
  {
    id: 4,
    name: "Double Espresso",
    description: "Rich and intense with crema, perfect coffee essence.",
    price: 3.5,
    image:
      "https://images.unsplash.com/photo-1612927601601-6638404737ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Hot Coffee",
    status: "available",
    rating: 5.0,
    reviews: 113,
    origin: "Brazil Santos Blend",
    customizations: [
      {
        name: "Options",
        options: [{ label: "Regular" }, { label: "With Sugar", price: 0.25 }],
      },
    ],
  },
  {
    id: 5,
    name: "Butter Croissant",
    description: "Flaky, buttery layers baked fresh daily.",
    price: 3.25,
    image:
      "https://images.unsplash.com/photo-1601000938251-d6d96adfc1e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Bakery",
    status: "available",
    rating: 3.5,
    reviews: 42,
    customizations: [
      {
        name: "Options",
        options: [{ label: "As is" }, { label: "Warmed", price: 0.0 }],
      },
    ],
  },
  {
    id: 6,
    name: "Spiced Chai Latte",
    description: "Black tea infused with cinnamon, cardamom, and vanilla.",
    price: 4.75,
    image:
      "https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Teas",
    status: "available",
    rating: 5.0,
    reviews: 87,
    origin: "House Blend",
    customizations: [
      {
        name: "Temperature",
        options: [{ label: "Hot" }, { label: "Iced", price: 0.25 }],
      },
      {
        name: "Sweetness",
        options: [{ label: "Regular" }, { label: "Light" }, { label: "None" }],
      },
    ],
  },
  {
    id: 7,
    name: "Pour Over",
    description: "Handcrafted single cup with floral and citrus notes.",
    price: 6.5,
    image:
      "https://images.unsplash.com/photo-1532024802178-20dbc87a312a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Hot Coffee",
    status: "available",
    badge: "New",
    rating: 4.0,
    reviews: 34,
    origin: "Costa Rica Tarrazú",
    customizations: [
      {
        name: "Grind",
        options: [{ label: "Medium" }, { label: "Fine", price: 0.0 }],
      },
      {
        name: "Strength",
        options: [{ label: "Balanced" }, { label: "Strong", price: 0.0 }],
      },
    ],
  },
  {
    id: 8,
    name: "Cinnamon Roll",
    description: "Sweet dough swirled with cinnamon, topped with icing.",
    price: 4.25,
    image:
      "https://images.unsplash.com/photo-1583075299913-67fdb550a79d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Bakery",
    status: "limited",
    statusLabel: "Last 2",
    rating: 4.5,
    reviews: 78,
    customizations: [
      {
        name: "Options",
        options: [{ label: "Regular" }, { label: "Extra Icing", price: 0.5 }],
      },
    ],
  },
];

// Define available categories
const categories = [
  "All Drinks",
  "Hot Coffee",
  "Iced Coffee",
  "Teas",
  "Bakery",
  "Specials",
];

interface MainContentProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchTerm: string;
  onAddToCart: (product: Product) => void;
}

export default function MainContent({
  activeCategory,
  setActiveCategory,
  searchTerm,
  onAddToCart,
}: MainContentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const productsPerPage = 8;

  // Filter products based on category and search term
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (activeCategory !== "All Drinks") {
      if (activeCategory === "Specials") {
        // Show products with badge or discounted price
        filtered = filtered.filter(
          (product) => product.badge || product.originalPrice
        );
      } else {
        filtered = filtered.filter(
          (product) => product.category === activeCategory
        );
      }
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          (product.origin && product.origin.toLowerCase().includes(term))
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [activeCategory, searchTerm]);

  // Calculate pagination values
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);

    // Scroll back to the top of the products section
    window.scrollTo({
      top: document.getElementById("products-grid")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Category Navigation */}
      <CategoryTabs
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={categories}
      />

      {/* Promotional Banner */}
      <PromotionalBanner />

      {/* Products Grid */}
      <div
        id="products-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {currentProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {/* No results message */}
      {currentProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-4xl mb-4">
            <i className="fas fa-mug-hot"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            No products found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria to find what you're
            looking for.
          </p>
        </div>
      )}

      {/* Pagination */}
      {filteredProducts.length > productsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
}
