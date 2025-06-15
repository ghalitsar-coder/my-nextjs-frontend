// Shared types for admin payments components

// Backend payment summary structure
export interface PaymentSummary {
  date: string;
  orderId: number;
  userName: string;
  paymentCount: number;
  paymentAmount: number;
  paymentStatus: string;
  status: string;
}

// Frontend payment structure (mapped from backend)
export interface Payment {
  paymentId: number;
  order: {
    orderId: number;
    user: {
      name: string;
      email: string;
    };
  };
  type: string;
  amount: number;
  status: string;
  paymentDate: string;
  transactionId?: string;
  paymentMethod?: string;
  fraudStatus?: string;
  bank?: string;
  vaNumber?: string;
}

export interface PaymentUpdateRequest {
  status: string;
  transactionId?: string;
  paymentMethod?: string;
}

export interface PaymentStats {
  totalAmount: number;
  totalCount: number;
  paidAmount: number;
  paidCount: number;
  pendingAmount: number;
  pendingCount: number;
  failedAmount: number;
  failedCount: number;
  averageAmount: number;
}

export interface PaymentFilters {
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
}

export type PaymentStatus = 'PAID' | 'PENDING' | 'FAILED' | 'CANCELLED';
export type PaymentType = 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'EWALLET' | 'ORDER_PAYMENT';
