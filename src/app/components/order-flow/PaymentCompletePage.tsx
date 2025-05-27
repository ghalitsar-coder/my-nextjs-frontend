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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-purple-600 text-4xl mb-4">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
          <p className="text-xl text-gray-700">Loading order information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <i className="fas fa-mug-hot text-3xl text-purple-600 mr-3"></i>
          <h1 className="text-2xl font-bold text-gray-800">Coffee Haven</h1>
        </div>
        <div className="text-sm text-gray-500">
          <span className="hidden md:inline">Order Confirmation</span>
          <i className="fas fa-check-circle ml-2 text-green-500"></i>
        </div>
      </header>{" "}
      {/* Progress Steps */}
      <ProgressSteps
        steps={ORDER_FLOW_STEPS}
        currentStep={3}
        allowNavigation={true}
      />
      {/* Confirmation Card */}
      <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
        <div className="confirmation-animation text-green-500 text-6xl mb-4">
          <i className="fas fa-check-circle"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Order Confirmed!
        </h2>
        <p className="text-gray-600 mb-6">
          Thank you for your order. We&apos;re preparing your coffee with love.
        </p>

        <div className="bg-purple-50 rounded-lg p-4 inline-block mb-6">
          <p className="text-sm text-gray-600">Order Number</p>
          <p className="text-xl font-bold text-purple-600">
            {orderInfo.orderNumber}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition duration-200">
            <i className="fas fa-receipt mr-2"></i> View Receipt
          </button>{" "}
          <Link
            href={getStepInfo(3).prevStepRoute}
            className="bg-white border border-purple-600 text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-purple-50 transition duration-200"
          >
            <i className="fas fa-arrow-left mr-2"></i> Back to Payment
          </Link>
        </div>
      </div>
      {/* Order Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <i className="fas fa-info-circle mr-2 text-purple-600"></i>
          Order Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Info */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3 flex items-center">
              <i className="fas fa-user mr-2 text-purple-600"></i>
              Customer Information
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Name:</span> John Doe
              </p>
              <p>
                <span className="font-medium">Email:</span> john.doe@example.com
              </p>
              <p>
                <span className="font-medium">Phone:</span> (555) 123-4567
              </p>
            </div>
          </div>

          {/* Pickup Info */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3 flex items-center">
              <i className="fas fa-store mr-2 text-purple-600"></i>
              Pickup Information
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Location:</span> Coffee Haven
                Downtown
              </p>
              <p>
                <span className="font-medium">Address:</span> 123 Main Street,
                Suite 100
              </p>
              <p>
                <span className="font-medium">Time:</span> Today at 3:45 PM
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <i className="fas fa-coffee mr-2 text-purple-600"></i>
          Your Order
        </h2>

        <div className="space-y-4 mb-6">
          {orderInfo.items.map((item, index) => (
            <div
              key={index}
              className="order-item flex justify-between items-start border-b pb-4 transition duration-200"
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
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">
                ${orderInfo.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (8%)</span>
              <span className="font-medium">${orderInfo.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Fee</span>
              <span className="font-medium">
                ${orderInfo.serviceFee.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium text-green-600">
                -${orderInfo.discount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between pt-2 font-bold text-lg">
              <span className="text-gray-800">Total Paid</span>
              <span className="text-purple-600">${orderInfo.total}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-800 mb-2 flex items-center">
            <i className="fas fa-credit-card mr-2 text-purple-600"></i>
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
              } text-2xl mr-3`}
            ></i>
            <div>
              <p className="text-gray-800">
                {orderInfo.paymentMethod === "cash"
                  ? "Cash payment"
                  : orderInfo.paymentMethod === "card"
                  ? "Visa ending in 4242"
                  : "Digital Wallet"}
              </p>
              <p className="text-sm text-gray-500">
                Payment completed at {formatDate(orderInfo.orderDate)}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Order Status */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <i className="fas fa-truck mr-2 text-purple-600"></i>
          Order Status
        </h2>

        <div className="space-y-6">
          {/* Status Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>

            {/* Timeline items */}
            <div className="relative pl-10 pb-6">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                <i className="fas fa-check"></i>
              </div>
              <div className="ml-2">
                <h3 className="font-medium text-gray-800">Order Received</h3>
                <p className="text-sm text-gray-500">
                  {formatDate(orderInfo.orderDate)}
                </p>
              </div>
            </div>

            <div className="relative pl-10 pb-6">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                <i className="fas fa-coffee"></i>
              </div>
              <div className="ml-2">
                <h3 className="font-medium text-gray-800">
                  Preparing Your Order
                </h3>
                <p className="text-sm text-gray-500">
                  Estimated completion: 3:45 PM
                </p>
              </div>
            </div>

            <div className="relative pl-10">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                <i className="fas fa-store"></i>
              </div>
              <div className="ml-2">
                <h3 className="font-medium text-gray-500">Ready for Pickup</h3>
                <p className="text-sm text-gray-400">
                  We&apos;ll notify you when ready
                </p>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-start">
              <i className="fas fa-bell text-purple-600 mt-1 mr-3"></i>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Get Notified</h3>
                <p className="text-sm text-gray-600">
                  We&apos;ll send you updates about your order status via SMS
                  and email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer CTA */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">Need help with your order?</p>
        <button className="bg-white border border-purple-600 text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-purple-50 transition duration-200">
          <i className="fas fa-headset mr-2"></i> Contact Support
        </button>
      </div>
    </div>
  );
}
