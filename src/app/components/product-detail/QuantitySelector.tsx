"use client";

import { useState, useEffect } from "react";

interface QuantitySelectorProps {
  initialValue?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  className?: string;
}

export default function QuantitySelector({
  initialValue = 1,
  min = 1,
  max = 10,
  onChange,
  className = "",
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialValue);

  // Ensure the value is always between min and max
  const updateQuantity = (newValue: number) => {
    const clampedValue = Math.min(Math.max(newValue, min), max);
    setQuantity(clampedValue);
    if (onChange) {
      onChange(clampedValue);
    }
  };

  // Handle direct input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      updateQuantity(value);
    }
  };

  // Initialize with initialValue
  useEffect(() => {
    setQuantity(initialValue);
  }, [initialValue]);

  return (
    <div
      className={`custom-number-input flex items-center border border-gray-200 rounded-lg ${className}`}
    >
      <button
        className="h-full w-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg transition"
        onClick={() => updateQuantity(quantity - 1)}
        aria-label="Decrease quantity"
      >
        <i className="fas fa-minus text-xs"></i>
      </button>
      <input
        type="number"
        value={quantity}
        min={min}
        max={max}
        className="w-16 h-full text-center border-0 bg-transparent text-gray-700 focus:ring-0"
        onChange={handleInputChange}
        aria-label="Quantity"
      />
      <button
        className="h-full w-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg transition"
        onClick={() => updateQuantity(quantity + 1)}
        aria-label="Increase quantity"
      >
        <i className="fas fa-plus text-xs"></i>
      </button>
    </div>
  );
}
