import { Order } from "./types";
import { isToday, parseISO } from "date-fns";

// Status color mapping
export const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "PREPARED":
      return "bg-blue-100 text-blue-800";
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Payment status color mapping
export const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
    case "SETTLEMENT":
    case "CAPTURE":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "FAILED":
    case "DENY":
    case "CANCEL":
    case "EXPIRE":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Calculate order total
export const calculateOrderTotal = (order: Order) => {
  return order.orderDetails.reduce(
    (total, detail) => total + detail.unitPrice * detail.quantity,
    0
  );
};

// Filter orders based on search and filters
export const filterOrders = (
  orders: Order[],
  searchTerm: string,
  statusFilter: string,
  paymentFilter: string
): Order[] => {
  let filtered = orders;

  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(
      (order) =>
        order.orderId.toString().includes(searchTerm) ||
        order.user.fullName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply status filter
  if (statusFilter !== "ALL") {
    filtered = filtered.filter((order) => order.status === statusFilter);
  }

  // Apply payment filter
  if (paymentFilter !== "ALL") {
    filtered = filtered.filter((order) => {
      const hasPaymentStatus = order.payments.some(
        (payment) => payment.status === paymentFilter
      );
      return hasPaymentStatus;
    });
  }

  return filtered;
};

// Get today's orders
export const getTodaysOrders = (orders: Order[]): Order[] => {
  return orders.filter((order) => {
    const orderDate = parseISO(order.orderDate);
    return isToday(orderDate);
  });
};

// Calculate cashier stats
export const calculateCashierStats = (orders: Order[]) => {
  const todaysOrders = getTodaysOrders(orders);

  const todaysSales = todaysOrders.reduce((sum, order) => {
    const orderTotal = order.payments.reduce(
      (total, payment) =>
        total + (payment.status === "COMPLETED" ? payment.amount : 0),
      0
    );
    return sum + orderTotal;
  }, 0);

  // Calculate average order value
  const averageOrderValue =
    todaysOrders.length > 0 ? todaysSales / todaysOrders.length : 0;

  // Calculate processing efficiency (completed vs total)
  const completedToday = todaysOrders.filter(
    (order) => order.status === "DELIVERED"
  ).length;
  const efficiency =
    todaysOrders.length > 0
      ? (completedToday / todaysOrders.length) * 100
      : 0;

  return {
    todaysSales,
    ordersProcessed: todaysOrders.length,
    pendingOrders: orders.filter((order) => order.status === "PENDING").length,
    completedOrders: orders.filter((order) => order.status === "DELIVERED").length,
    averageOrderValue,
    efficiency,
  };
};
