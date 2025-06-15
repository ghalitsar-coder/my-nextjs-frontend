import { Payment, PaymentSummary } from "./types";

export const mapPaymentSummariesToPayments = (
  paymentSummaries: PaymentSummary[]
): Payment[] => {
  return paymentSummaries.map((summary) => ({
    paymentId: summary.orderId, // Using orderId as paymentId since it's 1:1
    order: {
      orderId: summary.orderId,
      user: {
        name: summary.userName,
        email: `${summary.userName}@example.com`, // Backend doesn't provide email
      },
    },
    type: "ORDER_PAYMENT",
    amount: summary.paymentAmount,
    status:
      summary.paymentStatus === "COMPLETED"
        ? "PAID"
        : summary.paymentStatus, // Map COMPLETED to PAID
    paymentDate: summary.date,
    transactionId: `TXN-${summary.orderId}`,
    paymentMethod: "CARD", // Default since backend doesn't provide this
  }));
};

export const filterPayments = (
  payments: Payment[],
  searchTerm: string,
  statusFilter: string
): Payment[] => {
  return payments.filter((payment) => {
    const matchesSearch =
      payment.order.user.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.order.user.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.order.orderId.toString().includes(searchTerm);

    const matchesStatus =
      statusFilter === "ALL" || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
};

export const calculatePaymentStats = (payments: Payment[]) => {
  return {
    total: payments.length,
    paid: payments.filter((p) => p.status === "PAID").length,
    pending: payments.filter((p) => p.status === "PENDING").length,
    failed: payments.filter((p) => p.status === "FAILED").length,
  };
};
