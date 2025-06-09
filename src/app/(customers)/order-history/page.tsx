"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  IconCoffee,
  IconCalendar,
  IconReceipt,
  IconEye,
  IconRefresh,
  IconShoppingBag,
  IconClock,
  IconCheck,
  IconTruck,
  IconX,
} from "@tabler/icons-react";
import { format, isValid, parseISO } from "date-fns";

interface OrderItem {
  detailId: number;
  product: {
    productId: number;
    name: string;
    price: number;
  };
  quantity: number;
  unitPrice: number;
  discount: number;
}

interface Payment {
  paymentId: number;
  type: string;
  amount: number;
  status: string;
  paymentDate?: string;
}

interface Order {
  orderId: number;
  userId: string; // Updated to match API response
  status: string;
  orderDate: string; // Changed from createdAt
  orderDetails: OrderItem[]; // Changed from items
  payments: Payment[];
}

const statusConfig = {
  PENDING: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: IconClock,
    label: "Pending",
  },
  CONFIRMED: {
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: IconCheck,
    label: "Confirmed",
  },
  PREPARING: {
    color: "bg-orange-100 text-orange-800 border-orange-300",
    icon: IconCoffee,
    label: "Preparing",
  },
  READY: {
    color: "bg-purple-100 text-purple-800 border-purple-300",
    icon: IconShoppingBag,
    label: "Ready",
  },
  DELIVERED: {
    color: "bg-green-100 text-green-800 border-green-300",
    icon: IconTruck,
    label: "Delivered",
  },
  CANCELLED: {
    color: "bg-red-100 text-red-800 border-red-300",
    icon: IconX,
    label: "Cancelled",
  },
};

export default function OrderHistoryPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
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
  };

  useEffect(() => {
    fetchOrders();
  }, [session?.user?.id]);

  const getStatusInfo = (status: string) => {
    return (
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  // Helper function to safely format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown Date";
    try {
      // Remove microseconds if present
      const cleanedDateString = dateString.replace(/(\.\d{3})\d+/, "$1");
      const date = parseISO(cleanedDateString);
      if (!isValid(date)) return "Invalid Date";
      return format(date, "dd MMM yyyy, HH:mm");
    } catch {
      console.error("Failed to parse date:", dateString);
      return "Invalid Date";
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <IconCoffee className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Please Login
          </h2>
          <p className="text-gray-600">
            You need to be logged in to view your order history.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
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

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <IconX className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <IconShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Orders Yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders yet. Start exploring our coffee
                menu!
              </p>
              <Button onClick={() => (window.location.href = "/coffee-list")}>
                <IconCoffee className="h-4 w-4 mr-2" />
                Browse Coffee
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Orders List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Orders
              </h2>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {orders.map((order) => {
                    const statusInfo = getStatusInfo(order.status);
                    const StatusIcon = statusInfo.icon;

                    return (
                      <Card
                        key={order.orderId}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedOrder?.orderId === order.orderId
                            ? "ring-2 ring-orange-500 border-orange-500"
                            : ""
                        }`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-orange-100 p-2 rounded-lg">
                                <IconReceipt className="h-5 w-5 text-orange-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  Order #{order.orderId}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <IconCalendar className="h-4 w-4" />
                                  {formatDate(order.orderDate)}
                                </div>
                              </div>
                            </div>
                            <Badge
                              className={`${statusInfo.color} flex items-center gap-1`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {statusInfo.label}
                            </Badge>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                Items:
                              </span>
                              <span className="text-sm font-medium">
                                {order.orderDetails.length} item(s)
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                Total Amount:
                              </span>
                              <span className="text-lg font-bold text-gray-900">
                                {formatCurrency(
                                  order.orderDetails.reduce(
                                    (sum, item) =>
                                      sum + item.unitPrice * item.quantity,
                                    0
                                  )
                                )}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                Payment Status:
                              </span>
                              <Badge
                                variant={
                                  order.payments[0]?.status === "COMPLETED"
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {order.payments[0]?.status || "Pending"}
                              </Badge>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <IconEye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* Order Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Details
              </h2>
              {selectedOrder ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <IconReceipt className="h-5 w-5" />
                        Order #{selectedOrder.orderId}
                      </CardTitle>
                      <Badge
                        className={`${
                          getStatusInfo(selectedOrder.status).color
                        } flex items-center gap-1`}
                      >
                        {React.createElement(
                          getStatusInfo(selectedOrder.status).icon,
                          { className: "h-3 w-3" }
                        )}
                        {getStatusInfo(selectedOrder.status).label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Order Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Order Date:</span>
                        <p className="font-medium">
                          {formatDate(selectedOrder.orderDate)}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Items */}
                    <div>
                      <h4 className="font-semibold mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {selectedOrder.orderDetails.map((item) => (
                          <div
                            key={item.detailId}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-orange-100 p-2 rounded-lg">
                                <IconCoffee className="h-4 w-4 text-orange-600" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {item.product.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {formatCurrency(item.unitPrice * item.quantity)}
                              </p>
                              <p className="text-sm text-gray-600">
                                {formatCurrency(item.unitPrice)} each
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Payment Info */}
                    <div>
                      <h4 className="font-semibold mb-3">
                        Payment Information
                      </h4>
                      {selectedOrder.payments.length > 0 ? (
                        selectedOrder.payments.map((payment) => (
                          <div
                            key={payment.paymentId}
                            className="p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">
                                Payment Method:
                              </span>
                              <Badge variant="outline">{payment.type}</Badge>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Status:</span>
                              <Badge
                                variant={
                                  payment.status === "COMPLETED"
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {payment.status}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Amount:</span>
                              <span className="font-bold">
                                {formatCurrency(payment.amount)}
                              </span>
                            </div>
                            {payment.paymentDate && (
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Paid At:</span>
                                <span className="text-sm">
                                  {formatDate(payment.paymentDate)}
                                </span>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">
                          No payment information available.
                        </p>
                      )}
                    </div>

                    <Separator />

                    {/* Total */}
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">
                          Total Amount:
                        </span>
                        <span className="text-2xl font-bold text-orange-600">
                          {formatCurrency(
                            selectedOrder.orderDetails.reduce(
                              (sum, item) =>
                                sum + item.unitPrice * item.quantity,
                              0
                            )
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-64 text-gray-500">
                    <div className="text-center">
                      <IconEye className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p>Select an order to view details</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
