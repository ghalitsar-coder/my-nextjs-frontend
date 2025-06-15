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
}

export interface PaymentUpdateRequest {
  status: string;
  transactionId?: string;
  paymentMethod?: string;
}

export interface PaymentStats {
  total: number;
  paid: number;
  pending: number;
  failed: number;
}

export interface PaymentFilters {
  searchTerm: string;
  statusFilter: string;
}
