import type { Payment, PaymentFilters, PaymentSummary, PaymentStats } from "./types";

// Calculate payment statistics
export function calculatePaymentStats(payments: Payment[]): PaymentStats {
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalCount = payments.length;
  const paidPayments = payments.filter((p) => p.status === "PAID");
  const pendingPayments = payments.filter((p) => p.status === "PENDING");
  const failedPayments = payments.filter((p) => p.status === "FAILED");

  return {
    totalAmount,
    totalCount,
    paidAmount: paidPayments.reduce((sum, p) => sum + p.amount, 0),
    paidCount: paidPayments.length,
    pendingAmount: pendingPayments.reduce((sum, p) => sum + p.amount, 0),
    pendingCount: pendingPayments.length,
    failedAmount: failedPayments.reduce((sum, p) => sum + p.amount, 0),
    failedCount: failedPayments.length,
    averageAmount: totalCount > 0 ? totalAmount / totalCount : 0,
  };
}

// Filter payments based on search term, status, and type
export function filterPayments(payments: Payment[], filters: PaymentFilters): Payment[] {
  return payments.filter((payment) => {
    const matchesSearch =
      payment.order.user.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      payment.order.user.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      payment.order.orderId.toString().includes(filters.searchTerm);

    const matchesStatus = filters.statusFilter === "ALL" || payment.status === filters.statusFilter;
    const matchesType = filters.typeFilter === "ALL" || payment.type === filters.typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });
}

// Map backend payment summaries to frontend Payment structure
export function mapPaymentSummariesToPayments(paymentSummaries: PaymentSummary[]): Payment[] {
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
    status: summary.paymentStatus === "COMPLETED" ? "PAID" : summary.paymentStatus, // Map COMPLETED to PAID
    paymentDate: summary.date,
    transactionId: `TXN-${summary.orderId}`,
    paymentMethod: "CARD", // Default since backend doesn't provide this
    fraudStatus: "CLEAN", // Default
    bank: "Unknown", // Default
    vaNumber: undefined,
  }));
}

// Export payments data to CSV format
export function exportPaymentsToCSV(payments: Payment[]) {
  const headers = [
    "Payment ID",
    "Order ID",
    "Customer Name",
    "Customer Email",
    "Type",
    "Amount",
    "Status",
    "Payment Date",
    "Transaction ID",
    "Payment Method",
  ];

  const csvData = payments.map((payment) => [
    payment.paymentId,
    payment.order.orderId,
    payment.order.user.name,
    payment.order.user.email,
    payment.type,
    payment.amount,
    payment.status,
    payment.paymentDate,
    payment.transactionId || "",
    payment.paymentMethod || "",
  ]);

  const csvContent = [headers, ...csvData]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}
