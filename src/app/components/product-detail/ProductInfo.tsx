"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuantitySelector from "./QuantitySelector";
import { Product, ProductSize, GrindOption } from "./types";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    product.sizes.find((size) => size.default) || product.sizes[0]
  );
  const [selectedGrind, setSelectedGrind] = useState<GrindOption>(
    product.grindOptions.find((grind) => grind.default) ||
      product.grindOptions[0]
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(selectedSize.price);
  const router = useRouter();

  // Update total price when quantity or size changes
  useEffect(() => {
    setTotalPrice(selectedSize.price * quantity);
  }, [selectedSize, quantity]);

  const handleSizeSelect = (size: ProductSize) => {
    setSelectedSize(size);
  };

  const handleGrindSelect = (grind: GrindOption) => {
    setSelectedGrind(grind);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const addToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: selectedSize.price,
      quantity: quantity,
      size: selectedSize.name,
      grind: selectedGrind.name,
      image: product.images[0].url,
    };

    // Get current cart from localStorage or initialize an empty array
    const currentCart = JSON.parse(localStorage.getItem("coffee-cart") || "[]");

    // Check if item with same id, size, and grind already exists
    const existingItemIndex = currentCart.findIndex(
      (item: any) =>
        item.id === cartItem.id &&
        item.size === cartItem.size &&
        item.grind === cartItem.grind
    );

    if (existingItemIndex !== -1) {
      // Update existing item
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      currentCart.push(cartItem);
    }

    // Save updated cart
    localStorage.setItem("coffee-cart", JSON.stringify(currentCart));

    // Show confirmation message
    alert("Added to cart!");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-32">
      <h1 className="font-serif text-3xl font-bold text-[#3a3226] mb-2">
        {product.name}
      </h1>

      <div className="flex items-center mb-6">
        <div className="flex text-[#f8c324] mr-3">
          {Array.from({ length: 5 }).map((_, index) => {
            const starValue = index + 1;
            // Full star
            if (starValue <= product.rating) {
              return <i key={index} className="fas fa-star"></i>;
            }
            // Half star
            else if (starValue - 0.5 <= product.rating) {
              return <i key={index} className="fas fa-star-half-alt"></i>;
            }
            // Empty star
            else {
              return <i key={index} className="far fa-star"></i>;
            }
          })}
        </div>
        <span className="text-sm text-gray-600">
          {product.rating} ({product.reviewCount} reviews)
        </span>
      </div>

      <div className="flex items-center mb-6">
        <span className="font-serif text-2xl font-bold text-[#9c7c5b] mr-4">
          ${selectedSize.price.toFixed(2)}
        </span>
        <span className="text-sm text-gray-500">{selectedSize.name} bag</span>
      </div>

      <p className="text-gray-700 mb-6 leading-relaxed">
        {product.description}
      </p>

      {/* Tasting Notes */}
      <div className="mb-8">
        <h3 className="font-bold text-[#3a3226] mb-3">Tasting Notes</h3>
        <div className="flex flex-wrap gap-2">
          {product.tastingNotes.map((note, index) => (
            <span
              key={index}
              className="bg-[#f1ece4] text-[#9c7c5b] text-sm px-3 py-1 rounded-full"
            >
              {note}
            </span>
          ))}
        </div>
      </div>

      {/* Grind Options */}
      <div className="border-t border-gray-200 pt-6 mb-8">
        <h3 className="font-bold text-[#3a3226] mb-4">Grind Options</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {product.grindOptions.map((grind) => (
            <button
              key={grind.id}
              onClick={() => handleGrindSelect(grind)}
              className={`border ${
                selectedGrind.id === grind.id
                  ? "border-[#9c7c5b] bg-[#f1ece4]"
                  : "border-gray-200 hover:bg-[#f1ece4] hover:border-[#9c7c5b]"
              } rounded-lg py-2 px-3 text-sm transition`}
            >
              {grind.name}
            </button>
          ))}
        </div>
      </div>

      {/* Size Options */}
      <div className="border-t border-gray-200 pt-6 mb-8">
        <h3 className="font-bold text-[#3a3226] mb-4">Size</h3>
        <div className="grid grid-cols-3 gap-3">
          {product.sizes.map((size) => (
            <button
              key={size.id}
              onClick={() => handleSizeSelect(size)}
              className={`border ${
                selectedSize.id === size.id
                  ? "border-[#9c7c5b] bg-[#f1ece4]"
                  : "border-gray-200 hover:bg-[#f1ece4] hover:border-[#9c7c5b]"
              } rounded-lg py-2 text-sm transition`}
            >
              {size.name}
              <br />${size.price.toFixed(2)}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity and Add to Cart */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <QuantitySelector
          initialValue={1}
          onChange={handleQuantityChange}
          className="h-14"
        />

        <button
          onClick={addToCart}
          className="flex-1 bg-[#9c7c5b] hover:bg-[#8a6b4d] text-white font-semibold py-3 px-6 rounded-lg shadow-md transition flex items-center justify-center h-14"
        >
          <i className="fas fa-shopping-bag mr-2"></i>
          Add to Cart - ${totalPrice.toFixed(2)}
        </button>
      </div>

      {/* Stock Info */}
      <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2">
        <div className="flex items-center">
          <i className="fas fa-check-circle text-green-500 mr-2"></i>
          <span>In Stock ({product.stockCount} left)</span>
        </div>
        <div className="flex items-center">
          <i className="fas fa-truck text-[#9c7c5b] mr-2"></i>
          <span>Free shipping over $30</span>
        </div>
      </div>
    </div>
  );
}
