"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProgressSteps from "./ProgressSteps";
import { ORDER_FLOW_STEPS, getStepInfo } from "./StepsConfig";
import { useCartStore } from "@/store/cart-store";

// Define payment method type
type PaymentMethod = "cash" | "card" | "digital";

// Midtrans payment result interface
interface MidtransPaymentResult {
  order_id: string;
  transaction_id: string;
  payment_type: string;
  transaction_status: string;
  fraud_status?: string;
  status_message?: string;
  transaction_time?: string;
}

// Midtrans configuration
declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          onSuccess: (result: MidtransPaymentResult) => void;
          onPending: (result: MidtransPaymentResult) => void;
          onError: (result: MidtransPaymentResult) => void;
          onClose: () => void;
        }
      ) => void;
    };
  }
}

export default function PaymentPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [notes, setNotes] = useState("");
  const [promoCode, setPromoCode] = useState("");

  // Load discount from localStorage
  useEffect(() => {
    const savedDiscount = localStorage.getItem("coffee-discount");
    if (savedDiscount) {
      const parsedDiscount = parseFloat(savedDiscount);
      if (parsedDiscount > 0) {
        setDiscountAmount(parsedDiscount);
      }
    }
  }, []);

  // Load Midtrans Snap script
  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey || "");
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Using shared steps configuration from StepsConfig
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  }); // Convert cart items to order items format
  const orderItems = items.map((item) => ({
    id: item.id, // Add id field for backend
    name: item.name,
    image: item.image,
    size: "Regular", // Default size since cart doesn't store size info
    options: [], // Could be extended to include customizations
    price: item.price,
    quantity: item.quantity,
  }));

  // Select payment method
  const selectPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };
  // Calculate subtotal
  const calculateSubtotal = () => {
    return totalPrice; // Use totalPrice from cart store
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

  // Create Midtrans transaction
  const createMidtransTransaction = async () => {
    try {
      const orderData = {
        transaction_details: {
          order_id: `ORDER-${Date.now()}`,
          gross_amount: Math.round(parseFloat(calculateTotal()) * 100) / 100,
        },
        customer_details: {
          first_name: "Customer",
          email: "customer@example.com",
          phone: "08123456789",
        },
        item_details: orderItems.map((item) => ({
          id: item.name.replace(/\s/g, "_").toLowerCase(),
          price: item.price,
          quantity: item.quantity,
          name: item.name,
        })),
      };

      const response = await fetch("/api/midtrans/create-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      return result.token;
    } catch (error) {
      console.error("Error creating Midtrans transaction:", error);
      throw error;
    }
  };
  // Process payment
  const processPayment = async () => {
    if (items.length === 0) {
      alert("Your cart is empty. Please add items before checkout.");
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === "cash") {
        // For cash payment, save order directly and redirect
        await saveCashOrder();
      } else if (paymentMethod === "digital") {
        // For digital payment, use Midtrans
        await processMidtransPayment();
      } else if (paymentMethod === "card") {
        // For card payment, also use Midtrans
        await processMidtransPayment();
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      alert("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  // Process cash payment
  const saveCashOrder = async () => {
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
      paymentStatus: "pending", // Cash payment is pending until pickup
    }; // Save to backend
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderItems: orderItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
          totalAmount: parseFloat(calculateTotal()),
          paymentMethod: paymentMethod,
          paymentStatus: "pending",
          notes: notes,
        }),
      });

      if (response.ok) {
        localStorage.setItem(
          "coffee-completed-order",
          JSON.stringify(orderInfo)
        );
        clearCart(); // Clear cart after successful order
        const { nextStepRoute } = getStepInfo(2);
        router.push(nextStepRoute);
      } else {
        throw new Error("Failed to save order");
      }
    } catch (error) {
      console.error("Error saving cash order:", error);
      // Fallback to localStorage for now
      localStorage.setItem("coffee-completed-order", JSON.stringify(orderInfo));
      clearCart();
      const { nextStepRoute } = getStepInfo(2);
      router.push(nextStepRoute);
    }
  };

  // Process Midtrans payment
  const processMidtransPayment = async () => {
    try {
      const token = await createMidtransTransaction();

      if (!window.snap) {
        throw new Error("Midtrans Snap not loaded");
      }
      window.snap.pay(token, {
        onSuccess: async (result: MidtransPaymentResult) => {
          console.log("Payment success:", result);
          await handlePaymentSuccess(result);
        },
        onPending: (result: MidtransPaymentResult) => {
          console.log("Payment pending:", result);
          alert("Payment is pending. Please complete your payment.");
          setIsProcessing(false);
        },
        onError: (result: MidtransPaymentResult) => {
          console.error("Payment error:", result);
          alert("Payment failed. Please try again.");
          setIsProcessing(false);
        },
        onClose: () => {
          console.log("Payment popup closed");
          setIsProcessing(false);
        },
      });
    } catch (error) {
      console.error("Midtrans payment error:", error);
      throw error;
    }
  };
  // Handle successful payment
  const handlePaymentSuccess = async (paymentResult: MidtransPaymentResult) => {
    const orderInfo = {
      items: orderItems,
      subtotal: calculateSubtotal(),
      tax: calculateTax(calculateSubtotal()),
      discount: discountAmount,
      serviceFee: serviceFee,
      total: calculateTotal(),
      paymentMethod: paymentMethod,
      notes: notes,
      orderNumber:
        paymentResult.order_id ||
        `COFFEE-${new Date().getFullYear()}-${Math.floor(
          1000 + Math.random() * 9000
        )}`,
      orderDate: new Date().toISOString(),
      paymentStatus: "completed",
      transactionId: paymentResult.transaction_id,
      paymentType: paymentResult.payment_type,
    };

    try {
      // Save successful payment to backend
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderItems: orderItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
          totalAmount: parseFloat(calculateTotal()),
          paymentMethod: paymentMethod,
          paymentStatus: "completed",
          notes: notes,
          transactionId: paymentResult.transaction_id,
          paymentType: paymentResult.payment_type,
        }),
      });

      if (response.ok) {
        localStorage.setItem(
          "coffee-completed-order",
          JSON.stringify(orderInfo)
        );
        clearCart(); // Clear cart after successful payment
        const { nextStepRoute } = getStepInfo(2);
        router.push(nextStepRoute);
      } else {
        throw new Error("Failed to save order");
      }
    } catch (error) {
      console.error("Error saving successful order:", error);
      // Even if backend fails, still proceed since payment was successful
      localStorage.setItem("coffee-completed-order", JSON.stringify(orderInfo));
      clearCart();
      const { nextStepRoute } = getStepInfo(2);
      router.push(nextStepRoute);
    }
  };
  // Load discount from localStorage on component mount
  useEffect(() => {
    const savedDiscount = localStorage.getItem("coffee-discount");

    if (savedDiscount) {
      setDiscountAmount(parseFloat(savedDiscount));
    }
  }, []);
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
              <p className="text-gray-500 text-sm">Secure payment processing</p>
            </div>
          </div>
          <div className="hidden md:flex items-center bg-white px-4 py-2 rounded-full shadow-md">
            <span className="text-gray-600 mr-2">Secure Payment</span>
            <div className="bg-green-100 p-2 rounded-full">
              <i className="fas fa-lock text-green-600"></i>
            </div>
          </div>
        </header>
        {/* Progress Steps */}
        <div className="mb-12">
          <ProgressSteps
            steps={ORDER_FLOW_STEPS}
            currentStep={2}
            allowNavigation={true}
          />
        </div>{" "}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Order Summary */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-lg mr-4">
                  <i className="fas fa-receipt text-white"></i>
                </div>
                Order Summary
                <span className="ml-auto text-sm bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">
                  {orderItems.length} items
                </span>
              </h2>
              {/* Order Items */}
              <div className="space-y-6 mb-8">
                {orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start">
                      <div className="w-20 h-20 relative rounded-xl overflow-hidden mr-6 shadow-md">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg mb-1">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 mb-2">{item.size}</p>
                        {item.options && item.options.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.options.map((option, i) => (
                              <span
                                key={i}
                                className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-lg font-medium"
                              >
                                + {option}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-purple-600 mb-1">
                        ${item.price.toFixed(2)}
                      </p>
                      <p className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>{" "}
              {/* Order Notes */}
              <div className="mb-8">
                {" "}
                <label
                  htmlFor="notes"
                  className="text-sm font-semibold text-gray-700 mb-3 flex items-center"
                >
                  <i className="fas fa-sticky-note mr-2 text-purple-600"></i>
                  Special Instructions
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                  placeholder="Any special requests for your order? (e.g., extra hot, oat milk, etc.)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
              {/* Promo Code */}
              <div className="mb-8">
                {" "}
                <label
                  htmlFor="promo"
                  className="text-sm font-semibold text-gray-700 mb-3 flex items-center"
                >
                  <i className="fas fa-ticket-alt mr-2 text-purple-600"></i>
                  Promo Code
                </label>
                <div className="flex rounded-xl overflow-hidden border-2 border-gray-200 focus-within:border-purple-600 transition-colors">
                  <input
                    type="text"
                    id="promo"
                    className="flex-1 px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none"
                    placeholder="Enter your promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-semibold">
                    Apply
                  </button>
                </div>
              </div>
            </div>{" "}
            {/* Payment Methods */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-lg mr-4">
                  <i className="fas fa-credit-card text-white"></i>
                </div>
                Payment Method
              </h2>

              <div className="space-y-6">
                {/* Cash */}
                <div
                  className={`payment-method border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-md ${
                    paymentMethod === "cash"
                      ? "border-purple-600 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-lg"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                  onClick={() => selectPaymentMethod("cash")}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      id="cash"
                      className="w-5 h-5 text-purple-600 mr-4"
                      checked={paymentMethod === "cash"}
                      onChange={() => selectPaymentMethod("cash")}
                    />
                    <div className="flex items-center mr-auto">
                      <div className="bg-green-100 p-3 rounded-lg mr-4">
                        <i className="fas fa-money-bill-wave text-2xl text-green-600"></i>
                      </div>
                      <div>
                        <label
                          htmlFor="cash"
                          className="font-semibold text-gray-800 cursor-pointer text-lg"
                        >
                          Cash Payment
                        </label>
                        <p className="text-gray-600 mt-1">
                          Pay with cash when you pick up your order
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-50 px-3 py-1 rounded-lg">
                      <span className="text-green-700 text-sm font-medium">
                        No fees
                      </span>
                    </div>
                  </div>
                </div>
                {/* Card */}
                <div
                  className={`payment-method border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-md ${
                    paymentMethod === "card"
                      ? "border-purple-600 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-lg"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                  onClick={() => selectPaymentMethod("card")}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      id="card"
                      className="w-5 h-5 text-purple-600 mr-4"
                      checked={paymentMethod === "card"}
                      onChange={() => selectPaymentMethod("card")}
                    />
                    <div className="flex items-center mr-auto">
                      <div className="bg-blue-100 p-3 rounded-lg mr-4">
                        <i className="fas fa-credit-card text-2xl text-blue-600"></i>
                      </div>
                      <div>
                        <label
                          htmlFor="card"
                          className="font-semibold text-gray-800 cursor-pointer text-lg"
                        >
                          Credit/Debit Card
                        </label>
                        <p className="text-gray-600 mt-1">
                          Pay securely with your card
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <i className="fab fa-cc-visa text-2xl text-blue-600"></i>
                      <i className="fab fa-cc-mastercard text-2xl text-red-500"></i>
                      <i className="fab fa-cc-amex text-2xl text-blue-500"></i>
                    </div>
                  </div>

                  {/* Card Form */}
                  {paymentMethod === "card" && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="space-y-6">
                        <div>
                          <label
                            htmlFor="card-number"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                          >
                            Card Number
                          </label>
                          <input
                            type="text"
                            id="card-number"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
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
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="expiry"
                              className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              id="expiry"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
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
                              className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                              CVV
                            </label>
                            <input
                              type="text"
                              id="cvv"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
                              placeholder="123"
                              value={cardInfo.cvv}
                              onChange={(e) =>
                                setCardInfo({
                                  ...cardInfo,
                                  cvv: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="card-name"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                          >
                            Name on Card
                          </label>
                          <input
                            type="text"
                            id="card-name"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
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
                </div>{" "}
                {/* Digital Wallet */}
                <div
                  className={`payment-method border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-md ${
                    paymentMethod === "digital"
                      ? "border-purple-600 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-lg"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                  onClick={() => selectPaymentMethod("digital")}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      id="digital"
                      className="w-5 h-5 text-purple-600 mr-4"
                      checked={paymentMethod === "digital"}
                      onChange={() => selectPaymentMethod("digital")}
                    />
                    <div className="flex items-center mr-auto">
                      <div className="bg-purple-100 p-3 rounded-lg mr-4">
                        <i className="fas fa-mobile-alt text-2xl text-purple-600"></i>
                      </div>
                      <div>
                        <label
                          htmlFor="digital"
                          className="font-semibold text-gray-800 cursor-pointer text-lg"
                        >
                          Digital Wallet
                        </label>
                        <p className="text-gray-600 mt-1">
                          Pay with your mobile wallet
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <i className="fab fa-google-pay text-2xl text-blue-500"></i>
                      <i className="fab fa-apple-pay text-2xl text-gray-800"></i>
                      <i className="fab fa-paypal text-2xl text-blue-600"></i>
                    </div>
                  </div>

                  {/* Digital Wallet Options */}
                  {paymentMethod === "digital" && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="space-y-4">
                        <div className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
                          <div className="bg-blue-100 p-2 rounded-lg mr-4">
                            <i className="fab fa-google-pay text-2xl text-blue-600"></i>
                          </div>
                          <span className="font-semibold text-gray-800">
                            Google Pay
                          </span>
                          <i className="fas fa-chevron-right ml-auto text-gray-400"></i>
                        </div>
                        <div className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-gray-600 hover:bg-gray-50 transition-all duration-200">
                          <div className="bg-gray-100 p-2 rounded-lg mr-4">
                            <i className="fab fa-apple-pay text-2xl text-gray-800"></i>
                          </div>
                          <span className="font-semibold text-gray-800">
                            Apple Pay
                          </span>
                          <i className="fas fa-chevron-right ml-auto text-gray-400"></i>
                        </div>
                        <div className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all duration-200">
                          <div className="bg-blue-100 p-2 rounded-lg mr-4">
                            <i className="fab fa-paypal text-2xl text-blue-600"></i>
                          </div>
                          <span className="font-semibold text-gray-800">
                            PayPal
                          </span>
                          <i className="fas fa-chevron-right ml-auto text-gray-400"></i>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>{" "}
          {/* Right Column - Order Total */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-lg mr-4">
                  <i className="fas fa-file-invoice-dollar text-white"></i>
                </div>
                Order Total
              </h2>
              <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl p-6 border border-gray-200 mb-8">
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ${calculateSubtotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <span className="font-semibold">
                      ${calculateTax(calculateSubtotal()).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Service Fee</span>
                    <span className="font-semibold">
                      ${serviceFee.toFixed(2)}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                      <span className="flex items-center">
                        <i className="fas fa-tag mr-2"></i>Discount
                      </span>
                      <span className="font-semibold">
                        -${discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800">
                        Total
                      </span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        ${calculateTotal()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6 mb-8">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-store text-purple-600 mr-3"></i>
                    <span className="font-semibold text-purple-800">
                      Pickup Location
                    </span>
                  </div>
                  <p className="text-purple-700 ml-6">
                    Coffee Haven Downtown
                    <br />
                    123 Main Street, Suite 100
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-clock text-green-600 mr-3"></i>
                    <span className="font-semibold text-green-800">
                      Estimated Pickup Time
                    </span>
                  </div>
                  <p className="text-green-700 ml-6 flex items-center">
                    <span className="font-bold">Today at 3:45 PM</span>
                    <span className="ml-2 bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">
                      15-20 min
                    </span>
                  </p>
                </div>
              </div>{" "}
              <div className="flex gap-4 mb-6">
                <button
                  className="flex-1 py-4 px-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center 
                  border-2 border-purple-600 text-purple-600 hover:bg-purple-50 hover:shadow-md transform hover:-translate-y-0.5"
                  onClick={() => {
                    const { prevStepRoute } = getStepInfo(2); // 2 is the current step for PaymentPage
                    router.push(prevStepRoute);
                  }}
                  disabled={isProcessing}
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  <span>Back</span>
                </button>

                <button
                  id="pay-button"
                  className={`flex-[2] py-4 px-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                    isProcessing
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  } text-white`}
                  onClick={processPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-3"></i>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-credit-card mr-3"></i>
                      <span>Complete Payment</span>
                      <i className="fas fa-arrow-right ml-3"></i>
                    </>
                  )}
                </button>
              </div>
              <div className="text-center mb-6">
                <p className="text-xs text-gray-500">
                  By placing your order, you agree to our{" "}
                  <a
                    href="#"
                    className="text-purple-600 hover:underline font-medium"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-purple-600 hover:underline font-medium"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
              <div className="flex justify-center items-center space-x-4 pt-4 border-t border-gray-200">
                <div className="flex items-center text-green-600">
                  <i className="fas fa-shield-alt mr-2"></i>
                  <span className="text-sm font-medium">Secure Payment</span>
                </div>
                <div className="flex space-x-3">
                  <i className="fab fa-cc-visa text-2xl text-blue-600"></i>
                  <i className="fab fa-cc-mastercard text-2xl text-red-500"></i>
                  <i className="fab fa-cc-amex text-2xl text-blue-500"></i>
                  <i className="fab fa-cc-discover text-2xl text-orange-500"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
