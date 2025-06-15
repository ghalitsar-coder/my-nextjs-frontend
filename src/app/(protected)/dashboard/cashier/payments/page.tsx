"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  CashierPaymentHeader,
  CashierPaymentStatsCards,
  CashierPaymentFilters,
  CashierPaymentTable,
  CashierPaymentUpdateDialog,
  CashierPaymentLoadingState,
  Payment,
  PaymentSummary,
  PaymentUpdateRequest,
  PaymentFilters,
  mapPaymentSummariesToPayments,
  filterPayments,
  calculatePaymentStats,
} from "@/components/cashier-payments";

export default function CashierPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PaymentFilters>({
    searchTerm: "",
    statusFilter: "ALL",
  });
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateData, setUpdateData] = useState<PaymentUpdateRequest>({
    status: "",
    transactionId: "",
    paymentMethod: "",
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders/payment-summary");
      if (response.ok) {
        const paymentSummaries: PaymentSummary[] = await response.json();
        const mappedPayments = mapPaymentSummariesToPayments(paymentSummaries);
        setPayments(mappedPayments);
      } else {
        toast.error("Failed to fetch payments");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Error fetching payments");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePayment = async () => {
    if (!selectedPayment) return;

    try {
      const response = await fetch(
        `/api/orders/${selectedPayment.order.orderId}/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (response.ok) {
        toast.success("Payment status updated successfully");
        setUpdateDialogOpen(false);
        fetchPayments(); // Refresh the list
      } else {
        toast.error("Failed to update payment status");
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      toast.error("Error updating payment status");
    }
  };

  const openUpdateDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setUpdateData({
      status: payment.status,
      transactionId: payment.transactionId || "",
      paymentMethod: payment.paymentMethod || "",
    });
    setUpdateDialogOpen(true);
  };

  const filteredPayments = filterPayments(
    payments,
    filters.searchTerm,
    filters.statusFilter
  );
  const paymentStats = calculatePaymentStats(payments);

  if (loading) {
    return <CashierPaymentLoadingState />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <CashierPaymentHeader onRefresh={fetchPayments} />

      <CashierPaymentStatsCards stats={paymentStats} />

      <CashierPaymentFilters
        filters={filters}
        onSearchChange={(searchTerm) => setFilters({ ...filters, searchTerm })}
        onStatusFilterChange={(statusFilter) =>
          setFilters({ ...filters, statusFilter })
        }
      />

      <CashierPaymentTable
        payments={filteredPayments}
        onUpdatePayment={openUpdateDialog}
      />

      <CashierPaymentUpdateDialog
        isOpen={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        payment={selectedPayment}
        updateData={updateData}
        onUpdateDataChange={setUpdateData}
        onConfirmUpdate={handleUpdatePayment}
      />
    </div>
  );
}
