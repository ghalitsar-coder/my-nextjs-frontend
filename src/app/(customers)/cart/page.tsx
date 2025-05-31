"use client";

import { useState, useEffect } from "react";

interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Cart {
  userId: number;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userId = 1; // Mock user ID

  // Fetch cart data
  const fetchCart = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/cart/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Cart = await response.json();
      setCart(data);
    } catch (err) {
      setError(
        `Failed to load cart: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId: number, name: string, price: number) => {
    setError("");
    try {
      const response = await fetch(`/api/cart/${userId}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          name,
          price,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Item added:", result);

      // Refresh cart
      fetchCart();
    } catch (err) {
      setError(
        `Failed to add item: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-gray-600 mb-8">Powered by Hono API</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Sample Products to Add */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Sample Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium">Ethiopian Coffee</h3>
              <p className="text-gray-600">$15.99</p>
              <button
                onClick={() => addToCart(1, "Ethiopian Coffee", 15.99)}
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Add to Cart
              </button>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium">Colombian Blend</h3>
              <p className="text-gray-600">$12.99</p>
              <button
                onClick={() => addToCart(2, "Colombian Blend", 12.99)}
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Add to Cart
              </button>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium">French Roast</h3>
              <p className="text-gray-600">$14.99</p>
              <button
                onClick={() => addToCart(3, "French Roast", 14.99)}
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Cart Display */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Cart</h2>

          {cart ? (
            <div>
              {cart.items.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Your cart is empty
                </p>
              ) : (
                <div>
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-4 border-b"
                    >
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold">Total:</span>
                      <span className="text-xl font-bold">
                        ${cart.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Failed to load cart</p>
          )}
        </div>

        {/* API Test Section */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Hono Cart API Features</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>GET /api/cart/{userId} - Fetch user cart</li>
            <li>POST /api/cart/{userId}/add - Add item to cart</li>
            <li>PUT /api/cart/{userId}/update - Update cart item</li>
            <li>DELETE /api/cart/{userId}/remove - Remove item from cart</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
