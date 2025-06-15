"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  PaymentHeader,
  PaymentStatsCards,
  PaymentTable,
  PaymentViewDialog,
  PaymentUpdateDialog,
  PaymentDeleteDialog,
  PaymentAnalytics,
  PaymentLoadingState,
  calculatePaymentStats,
  filterPayments,
  mapPaymentSummariesToPayments,
  exportPaymentsToCSV,
  type Payment,
  type PaymentSummary,
  type PaymentUpdateRequest,
} from "@/components/admin-payments";

// Import components and types separately to avoid naming conflicts
import { PaymentFilters } from "@/components/admin-payments";
import type { PaymentFilters as PaymentFiltersType } from "@/components/admin-payments/types";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PaymentFiltersType>({
    searchTerm: "",
    statusFilter: "ALL",
    typeFilter: "ALL",
  });
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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

  const handleDeletePayment = async () => {
    if (!selectedPayment) return;

    try {
      // Note: You'll need to implement a delete endpoint in the backend
      // For now, we'll show a warning that this feature isn't implemented
      toast.warning("Delete functionality not yet implemented");
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast.error("Error deleting payment");
    }
  };

  const handleExportCSV = () => {
    exportPaymentsToCSV(filteredPayments);
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

  const openViewDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setViewDialogOpen(true);
  };

  const openDeleteDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setDeleteDialogOpen(true);
  };

  const filteredPayments = filterPayments(payments, filters);
  const stats = calculatePaymentStats(payments);

  if (loading) {
    return <PaymentLoadingState />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PaymentHeader onExportCSV={handleExportCSV} onRefresh={fetchPayments} />

      <PaymentStatsCards stats={stats} />

      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">All Payments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          <PaymentFilters filters={filters} onFiltersChange={setFilters} />

          <PaymentTable
            payments={filteredPayments}
            onViewPayment={openViewDialog}
            onUpdatePayment={openUpdateDialog}
            onDeletePayment={openDeleteDialog}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <PaymentAnalytics />
        </TabsContent>
      </Tabs>

      <PaymentViewDialog
        payment={selectedPayment}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      <PaymentUpdateDialog
        payment={selectedPayment}
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        onUpdate={handleUpdatePayment}
        updateData={updateData}
        onUpdateDataChange={setUpdateData}
      />

      <PaymentDeleteDialog
        payment={selectedPayment}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDeletePayment}
      />
    </div>
  );
}
