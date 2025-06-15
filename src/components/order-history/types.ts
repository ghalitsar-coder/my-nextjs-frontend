// Shared types for order history components
export interface OrderItem {
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

export interface Payment {
  paymentId: number;
  type: string;
  amount: number;
  status: string;
  paymentDate?: string;
}

export interface Order {
  orderId: number;
  userId: string;
  status: string;
  orderDate: string;
  orderDetails: OrderItem[];
  payments: Payment[];
}

export const statusConfig = {
  PENDING: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: "IconClock",
    label: "Pending",
  },
  CONFIRMED: {
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: "IconCheck",
    label: "Confirmed",
  },
  PREPARING: {
    color: "bg-orange-100 text-orange-800 border-orange-300",
    icon: "IconCoffee",
    label: "Preparing",
  },
  READY: {
    color: "bg-purple-100 text-purple-800 border-purple-300",
    icon: "IconShoppingBag",
    label: "Ready",
  },
  DELIVERED: {
    color: "bg-green-100 text-green-800 border-green-300",
    icon: "IconTruck",
    label: "Delivered",
  },
  CANCELLED: {
    color: "bg-red-100 text-red-800 border-red-300",
    icon: "IconX",
    label: "Cancelled",
  },
} as const;

export type OrderStatus = keyof typeof statusConfig;
