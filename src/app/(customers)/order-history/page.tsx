"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { IconReceipt, IconRefresh } from "@tabler/icons-react";

// Import our new components
import { type Order } from "@/components/order-history/types";
import { UnauthenticatedState } from "@/components/order-history/UnauthenticatedState";
import { LoadingState } from "@/components/order-history/LoadingState";
import { ErrorState } from "@/components/order-history/ErrorState";
import {
  EmptyOrdersState,
  EmptyDetailsState,
} from "@/components/order-history/EmptyStates";
import { OrderList } from "@/components/order-history/OrderList";
import { OrderDetailsPanel } from "@/components/order-history/OrderDetailsPanel";

export default function OrderHistoryPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_SPRING_BOOT_URL || "http://localhost:8080"
        }/orders/user/${session.user.id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched orders:", data); // Keep for debugging
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);
  useEffect(() => {
    fetchOrders();
  }, [session?.user?.id, fetchOrders]);

  const handleBrowseCoffee = () => {
    window.location.href = "/coffee-list";
  };

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
  };

  // Authentication check
  if (!session) {
    return <UnauthenticatedState />;
  }

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <IconReceipt className="h-8 w-8 text-orange-500" />
                Order History
              </h1>
              <p className="text-gray-600 mt-2">
                Track your coffee orders and purchase history
              </p>
            </div>
            <Button onClick={fetchOrders} variant="outline" size="sm">
              <IconRefresh className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && <ErrorState error={error} />}

        {/* Main Content */}
        {orders.length === 0 ? (
          <EmptyOrdersState onBrowseCoffee={handleBrowseCoffee} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Orders List */}
            <OrderList
              orders={orders}
              selectedOrder={selectedOrder}
              onOrderSelect={handleOrderSelect}
            />

            {/* Order Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Details
              </h2>
              {selectedOrder ? (
                <OrderDetailsPanel order={selectedOrder} />
              ) : (
                <EmptyDetailsState />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
