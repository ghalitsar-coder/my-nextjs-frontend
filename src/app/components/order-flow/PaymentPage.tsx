"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProgressSteps from "./ProgressSteps";
import { ORDER_FLOW_STEPS, getStepInfo } from "./StepsConfig";

// Define type for a cart item
type CartItem = {
  id: number;
  name: string;
  price: number;
  size: string;
  quantity: number;
  options?: string[];
};

// Define payment method type
type PaymentMethod = "cash" | "card" | "digital";

export default function PaymentPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [notes, setNotes] = useState("");
  const [promoCode, setPromoCode] = useState("");
  // Using shared steps configuration from StepsConfig
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  // Sample order items (would be replaced by actual cart items)
  const orderItems = [
    {
      name: "Cappuccino",
      image:
        "https://images.unsplash.com/photo-1517701550928-30cf4ba1dba5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      size: "Medium, Hot",
      options: ["Extra Shot"],
      price: 4.5,
      quantity: 1,
    },
    {
      name: "Latte",
      image:
        "https://images.unsplash.com/photo-1568649929103-28ffbefaca1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      size: "Large, Iced",
      options: ["Vanilla Syrup", "Almond Milk"],
      price: 5.75,
      quantity: 2,
    },
    {
      name: "Butter Croissant",
      image:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      size: "Regular",
      options: [],
      price: 3.25,
      quantity: 1,
    },
  ];

  // Select payment method
  const selectPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  // Calculate tax (8%)
  const calculateTax = (subtotal: number) => {
    return subtotal * 0.08;
  };

  // Service fee
  const serviceFee = 0.5;

  // Calculate total
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return (subtotal + tax + serviceFee - discountAmount).toFixed(2);
  };

  // Process payment
  const processPayment = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Save completed order info to localStorage
      const orderInfo = {
        items: orderItems,
        subtotal: calculateSubtotal(),
        tax: calculateTax(calculateSubtotal()),
        discount: discountAmount,
        serviceFee: serviceFee,
        total: calculateTotal(),
        paymentMethod: paymentMethod,
        notes: notes,
        orderNumber: `COFFEE-${new Date().getFullYear()}-${Math.floor(
          1000 + Math.random() * 9000
        )}`,
        orderDate: new Date().toISOString(),
      };

      localStorage.setItem("coffee-completed-order", JSON.stringify(orderInfo));
      // Navigate to completion page using our StepsConfig helper
      const { nextStepRoute } = getStepInfo(2); // 2 is the current step for PaymentPage
      router.push(nextStepRoute);
    }, 2000);
  };

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("coffee-cart");
    const savedDiscount = localStorage.getItem("coffee-discount");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    if (savedDiscount) {
      setDiscountAmount(parseFloat(savedDiscount));
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
          <span className="hidden md:inline">Secure Payment</span>
          <i className="fas fa-lock ml-2 text-purple-600"></i>
        </div>
      </header>{" "}
      {/* Progress Steps */}
      <ProgressSteps
        steps={ORDER_FLOW_STEPS}
        currentStep={2}
        allowNavigation={true}
      />
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Order Summary */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-receipt mr-2 text-purple-600"></i>
              Order Summary
            </h2>

            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start border-b pb-4"
                >
                  <div className="flex items-start">
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden mr-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.size}</p>
                      {item.options && item.options.length > 0 && (
                        <div className="mt-1">
                          {item.options.map((option, i) => (
                            <span
                              key={i}
                              className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded mr-1"
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">
                      ${item.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Notes */}
            <div className="mb-6">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Special Instructions
              </label>
              <textarea
                id="notes"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Any special requests for your order?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>

            {/* Promo Code */}
            <div className="mb-6">
              <label
                htmlFor="promo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Promo Code
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="promo"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700 transition duration-200">
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-credit-card mr-2 text-purple-600"></i>
              Payment Method
            </h2>

            <div className="space-y-4">
              {/* Cash */}
              <div
                className={`payment-method border rounded-lg p-4 cursor-pointer transition duration-200 ${
                  paymentMethod === "cash"
                    ? "border-purple-600 bg-purple-50"
                    : ""
                }`}
                onClick={() => selectPaymentMethod("cash")}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    id="cash"
                    className="custom-radio mr-3"
                    checked={paymentMethod === "cash"}
                    onChange={() => selectPaymentMethod("cash")}
                  />
                  <div className="flex items-center mr-auto">
                    <i className="fas fa-money-bill-wave payment-icon text-2xl text-green-500 mr-3"></i>
                    <div>
                      <label
                        htmlFor="cash"
                        className="font-medium text-gray-800 cursor-pointer"
                      >
                        Cash
                      </label>
                      <p className="text-sm text-gray-500">
                        Pay with cash when you pick up
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card */}
              <div
                className={`payment-method border rounded-lg p-4 cursor-pointer transition duration-200 ${
                  paymentMethod === "card"
                    ? "border-purple-600 bg-purple-50"
                    : ""
                }`}
                onClick={() => selectPaymentMethod("card")}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    id="card"
                    className="custom-radio mr-3"
                    checked={paymentMethod === "card"}
                    onChange={() => selectPaymentMethod("card")}
                  />
                  <div className="flex items-center mr-auto">
                    <i className="fas fa-credit-card payment-icon text-2xl text-blue-500 mr-3"></i>
                    <div>
                      <label
                        htmlFor="card"
                        className="font-medium text-gray-800 cursor-pointer"
                      >
                        Credit/Debit Card
                      </label>
                      <p className="text-sm text-gray-500">
                        Pay securely with your card
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <i className="fab fa-cc-visa text-gray-400"></i>
                    <i className="fab fa-cc-mastercard text-gray-400"></i>
                    <i className="fab fa-cc-amex text-gray-400"></i>
                  </div>
                </div>

                {/* Card Form */}
                {paymentMethod === "card" && (
                  <div className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="card-number"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="card-number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="1234 5678 9012 3456"
                          value={cardInfo.cardNumber}
                          onChange={(e) =>
                            setCardInfo({
                              ...cardInfo,
                              cardNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="expiry"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            id="expiry"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="MM/YY"
                            value={cardInfo.expiryDate}
                            onChange={(e) =>
                              setCardInfo({
                                ...cardInfo,
                                expiryDate: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="cvv"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            CVV
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="123"
                            value={cardInfo.cvv}
                            onChange={(e) =>
                              setCardInfo({ ...cardInfo, cvv: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="card-name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Name on Card
                        </label>
                        <input
                          type="text"
                          id="card-name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="John Doe"
                          value={cardInfo.cardName}
                          onChange={(e) =>
                            setCardInfo({
                              ...cardInfo,
                              cardName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Digital Wallet */}
              <div
                className={`payment-method border rounded-lg p-4 cursor-pointer transition duration-200 ${
                  paymentMethod === "digital"
                    ? "border-purple-600 bg-purple-50"
                    : ""
                }`}
                onClick={() => selectPaymentMethod("digital")}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    id="digital"
                    className="custom-radio mr-3"
                    checked={paymentMethod === "digital"}
                    onChange={() => selectPaymentMethod("digital")}
                  />
                  <div className="flex items-center mr-auto">
                    <i className="fas fa-mobile-alt payment-icon text-2xl text-purple-500 mr-3"></i>
                    <div>
                      <label
                        htmlFor="digital"
                        className="font-medium text-gray-800 cursor-pointer"
                      >
                        Digital Wallet
                      </label>
                      <p className="text-sm text-gray-500">
                        Pay with your mobile wallet
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <i className="fab fa-google-pay text-gray-400"></i>
                    <i className="fab fa-apple-pay text-gray-400"></i>
                    <i className="fab fa-paypal text-gray-400"></i>
                  </div>
                </div>

                {/* Digital Wallet Options */}
                {paymentMethod === "digital" && (
                  <div className="mt-4">
                    <div className="space-y-3">
                      <div className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <i className="fab fa-google-pay text-2xl text-blue-500 mr-3"></i>
                        <span className="font-medium">Google Pay</span>
                      </div>
                      <div className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <i className="fab fa-apple-pay text-2xl text-black mr-3"></i>
                        <span className="font-medium">Apple Pay</span>
                      </div>
                      <div className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <i className="fab fa-paypal text-2xl text-blue-400 mr-3"></i>
                        <span className="font-medium">PayPal</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Total */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-file-invoice-dollar mr-2 text-purple-600"></i>
              Order Total
            </h2>

            <div className="space-y-3 mb-6">
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
              <div className="flex justify-between">
                <span className="text-gray-600">Service Fee</span>
                <span className="font-medium">${serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium text-green-600">
                  -${discountAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6 py-3 border-t border-b">
              <span className="text-lg font-bold text-gray-800">Total</span>
              <span className="text-xl font-bold text-purple-600">
                ${calculateTotal()}
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <i className="fas fa-store text-purple-600 mr-2"></i>
                <span className="font-medium">Pickup Location</span>
              </div>
              <p className="text-sm text-gray-600 ml-6">
                Coffee Haven Downtown
                <br />
                123 Main Street, Suite 100
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <i className="fas fa-clock text-purple-600 mr-2"></i>
                <span className="font-medium">Estimated Pickup Time</span>
              </div>
              <p className="text-sm text-gray-600 ml-6">Today at 3:45 PM</p>
            </div>

            <div className="flex gap-4">
              <button
                className="w-1/3 py-3 px-4 rounded-lg font-bold transition duration-200 flex items-center justify-center 
                border border-purple-600 text-purple-600 hover:bg-purple-50"
                onClick={() => {
                  const { prevStepRoute } = getStepInfo(2); // 2 is the current step for PaymentPage
                  router.push(prevStepRoute);
                }}
                disabled={isProcessing}
              >
                <i className="fas fa-arrow-left mr-2"></i>
                <span>Back to Order</span>
              </button>

              <button
                id="pay-button"
                className={`w-2/3 py-3 px-4 rounded-lg font-bold transition duration-200 flex items-center justify-center ${
                  isProcessing
                    ? "bg-purple-500 hover:bg-purple-600"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white`}
                onClick={processPayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <span>Complete Payment</span>
                    <i className="fas fa-arrow-right ml-2"></i>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-3 text-center">
              By placing your order, you agree to our{" "}
              <a href="#" className="text-purple-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-600 hover:underline">
                Privacy Policy
              </a>
              .
            </p>

            <div className="mt-4 flex justify-center space-x-4">
              <i className="fas fa-shield-alt text-purple-600"></i>
              <i className="fab fa-cc-visa text-gray-400"></i>
              <i className="fab fa-cc-mastercard text-gray-400"></i>
              <i className="fab fa-cc-amex text-gray-400"></i>
              <i className="fab fa-cc-discover text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
