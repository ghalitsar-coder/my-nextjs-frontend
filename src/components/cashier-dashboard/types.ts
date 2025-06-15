export interface CashierStats {
  todaysSales: number;
  ordersProcessed: number;
  pendingOrders: number;
  completedOrders: number;
  averageOrderValue: number;
  efficiency: number;
}

export interface CashierFilters {
  searchTerm: string;
  statusFilter: string;
  paymentFilter: string;
}

export { type Order } from "@/lib/api";
