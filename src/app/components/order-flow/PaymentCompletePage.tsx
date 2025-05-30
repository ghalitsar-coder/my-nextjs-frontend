"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProgressSteps from "./ProgressSteps";
import { ORDER_FLOW_STEPS, getStepInfo } from "./StepsConfig";

type OrderItem = {
  name: string;
  image: string;
  size: string;
  options?: string[];
  price: number;
  quantity: number;
};

type OrderInfo = {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  serviceFee: number;
  discount: number;
  total: string;
  paymentMethod: "cash" | "card" | "digital";
  notes?: string;
  orderNumber: string;
  orderDate: string;
};

export default function PaymentCompletePage() {
  const router = useRouter();
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  // Using shared steps configuration from StepsConfig

  useEffect(() => {
    // Retrieve completed order info from localStorage
    const savedOrderInfo = localStorage.getItem("coffee-completed-order");

    if (savedOrderInfo) {
      setOrderInfo(JSON.parse(savedOrderInfo));
    } else {
      // If no order info, redirect back to order page
      router.push("/order");
    }
  }, [router]);

  // Format date for readable display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  // If no order info, show loading
  if (!orderInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
          <div className="text-purple-600 text-6xl mb-6">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
          <p className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Loading order information...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                <i className="fas fa-mug-hot text-xl text-white"></i>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Coffee Haven
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="hidden md:inline text-sm font-medium text-gray-600">Order Confirmation</span>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-check text-green-600"></i>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <ProgressSteps
            steps={ORDER_FLOW_STEPS}
            currentStep={3}
            allowNavigation={true}
          />
        </div>        {/* Confirmation Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center mb-12 border border-white/20">
          <div className="confirmation-animation text-green-500 text-8xl mb-6 drop-shadow-lg">
            <i className="fas fa-check-circle"></i>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Order Confirmed!
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
            Thank you for your order. We&apos;re preparing your coffee with love and care.
          </p>

          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-6 inline-block mb-8 shadow-lg border border-purple-200">
            <p className="text-sm font-medium text-gray-600 mb-2">Order Number</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {orderInfo.orderNumber}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 transform">
              <i className="fas fa-receipt mr-3"></i> View Receipt
            </button>
            <Link
              href={getStepInfo(3).prevStepRoute}
              className="bg-white/80 border-2 border-purple-300 text-purple-600 px-8 py-4 rounded-2xl font-semibold hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 transform backdrop-blur-sm"
            >
              <i className="fas fa-arrow-left mr-3"></i> Back to Payment
            </Link>
          </div>
        </div>        {/* Order Details */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6 flex items-center">
            <i className="fas fa-info-circle mr-3 text-purple-600"></i>
            Order Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Info */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 shadow-inner">
              <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                <i className="fas fa-user mr-3 text-purple-600"></i>
                Customer Information
              </h3>
              <div className="space-y-3 text-gray-600">
                <p className="flex items-center">
                  <span className="font-medium w-16">Name:</span> John Doe
                </p>
                <p className="flex items-center">
                  <span className="font-medium w-16">Email:</span> john.doe@example.com
                </p>
                <p className="flex items-center">
                  <span className="font-medium w-16">Phone:</span> (555) 123-4567
                </p>
              </div>
            </div>

            {/* Pickup Info */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-inner">
              <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                <i className="fas fa-store mr-3 text-purple-600"></i>
                Pickup Information
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>
                  <span className="font-medium">Location:</span> Coffee Haven Downtown
                </p>
                <p>
                  <span className="font-medium">Address:</span> 123 Main Street, Suite 100
                </p>
                <p>
                  <span className="font-medium">Time:</span> Today at 3:45 PM
                </p>
              </div>
            </div>
          </div>
        </div>        {/* Order Items */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6 flex items-center">
            <i className="fas fa-coffee mr-3 text-purple-600"></i>
            Your Order
          </h2>

          <div className="space-y-6 mb-8">
            {orderInfo.items.map((item, index) => (
              <div
                key={index}
                className="order-item flex justify-between items-start bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border-l-4 border-purple-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start">
                  <div className="w-20 h-20 relative rounded-2xl overflow-hidden mr-6 shadow-md">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                    <p className="text-gray-600 mb-2">{item.size}</p>
                    {item.options && item.options.length > 0 && (
                      <div className="mt-2">
                        {item.options.map((option, i) => (
                          <span
                            key={i}
                            className="text-xs bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 px-3 py-1 rounded-full mr-2 border border-purple-200"
                          >
                            {option}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-gray-800">
                    ${item.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-6 border border-purple-200 shadow-inner">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span className="font-medium">
                  ${orderInfo.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (8%)</span>
                <span className="font-medium">${orderInfo.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Service Fee</span>
                <span className="font-medium">
                  ${orderInfo.serviceFee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t border-purple-200 pt-3">
                <span className="text-gray-700">Discount</span>
                <span className="font-medium text-green-600">
                  -${orderInfo.discount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-purple-200">
                <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Total Paid</span>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">${orderInfo.total}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
            <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
              <i className="fas fa-credit-card mr-3 text-purple-600"></i>
              Payment Method
            </h3>
            <div className="flex items-center">
              <i
                className={`${
                  orderInfo.paymentMethod === "cash"
                    ? "fas fa-money-bill-wave text-green-500"
                    : orderInfo.paymentMethod === "card"
                    ? "fab fa-cc-visa text-blue-500"
                    : "fas fa-mobile-alt text-purple-500"
                } text-3xl mr-4`}
              ></i>
              <div>
                <p className="font-medium text-gray-800">
                  {orderInfo.paymentMethod === "cash"
                    ? "Cash payment"
                    : orderInfo.paymentMethod === "card"
                    ? "Visa ending in 4242"
                    : "Digital Wallet"}
                </p>
                <p className="text-sm text-gray-600">
                  Payment completed at {formatDate(orderInfo.orderDate)}
                </p>
              </div>
            </div>
          </div>
        </div>        {/* Order Status */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mt-8 border border-white/20">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-8 flex items-center">
            <i className="fas fa-truck mr-3 text-purple-600"></i>
            Order Status
          </h2>

          <div className="space-y-8">
            {/* Status Timeline */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 h-full w-1 bg-gradient-to-b from-green-200 to-purple-200 rounded-full"></div>

              {/* Timeline items */}
              <div className="relative pl-12 pb-8">
                <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white flex items-center justify-center shadow-lg">
                  <i className="fas fa-check"></i>
                </div>
                <div className="ml-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <h3 className="font-semibold text-gray-800">Order Received</h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(orderInfo.orderDate)}
                  </p>
                </div>
              </div>

              <div className="relative pl-12 pb-8">
                <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg animate-pulse">
                  <i className="fas fa-coffee"></i>
                </div>
                <div className="ml-2 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
                  <h3 className="font-semibold text-gray-800">
                    Preparing Your Order
                  </h3>
                  <p className="text-sm text-gray-600">
                    Estimated completion: 3:45 PM
                  </p>
                </div>
              </div>

              <div className="relative pl-12">
                <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                  <i className="fas fa-store"></i>
                </div>
                <div className="ml-2 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="font-medium text-gray-500">Ready for Pickup</h3>
                  <p className="text-sm text-gray-400">
                    We&apos;ll notify you when ready
                  </p>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-start">
                <i className="fas fa-bell text-purple-600 text-2xl mt-1 mr-4"></i>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Get Notified</h3>
                  <p className="text-gray-600">
                    We&apos;ll send you updates about your order status via SMS and email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <p className="text-xl text-gray-600 mb-6">Need help with your order?</p>
          <button className="bg-white/80 border-2 border-purple-300 text-purple-600 px-8 py-4 rounded-2xl font-semibold hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 transform backdrop-blur-sm">
            <i className="fas fa-headset mr-3"></i> Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
