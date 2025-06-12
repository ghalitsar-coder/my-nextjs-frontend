"use client";

import Header from "@/app/components/coffee-list/Header";
import HeroSection from "@/app/components/coffee-list/HeroSection";
import MainContent from "@/app/components/coffee-list/MainContent";
import LoyaltyBanner from "@/app/components/coffee-list/LoyaltyBanner";
import Footer from "@/app/components/coffee-list/Footer";
import { useState } from "react";

// Define a type for a product customization option
export type CustomizationOption = {
  name: string;
  options: { label: string; price?: number }[];
};

// Define a type for our product
export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  status: "available" | "sold out" | "limited";
  statusLabel?: string;
  badge?: string;
  rating: number;
  reviews: number;
  origin?: string;
  customizations?: CustomizationOption[];
  availableTime?: string;
  selectedCustomizations?: Record<string, string>;
};

export default function CoffeeList() {
  const [cartCount, setCartCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All Drinks");
  const [searchTerm, setSearchTerm] = useState("");
  // Function to handle adding items to cart
  const handleAddToCart = (product: Product) => {
    setCartCount((prevCount) => prevCount + 1);
    console.log("Added to cart:", product.name, product.selectedCustomizations);
    // Here you could also add more complex cart logic, like storing the selected items in state
  };

  return (
    <div className="min-h-screen bg-amber-50 font-sans">
      <Header cartCount={cartCount} />
      <HeroSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <MainContent
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchTerm={searchTerm}
        onAddToCart={handleAddToCart}
      />
      <LoyaltyBanner />
      <Footer />
    </div>
  );
}
