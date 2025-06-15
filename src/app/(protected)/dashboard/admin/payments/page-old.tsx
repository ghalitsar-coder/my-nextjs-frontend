"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Search,
  CreditCard,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  TrendingUp,
  Eye,
  Trash2,
  FileText,
} from "lucide-react";

// Backend payment summary structure
interface PaymentSummary {
  date: string;
  orderId: number;
  userName: string;
  paymentCount: number;
  paymentAmount: number;
  paymentStatus: string;
  status: string;
}

// Frontend payment structure (mapped from backend)
interface Payment {
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

interface PaymentUpdateRequest {
  status: string;
  transactionId?: string;
  paymentMethod?: string;
}

interface PaymentStats {
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

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
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
        
        // Map backend data to frontend Payment structure
        const mappedPayments: Payment[] = paymentSummaries.map((summary) => ({
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

  const exportToCSV = () => {
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

    const csvData = filteredPayments.map((payment) => [
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "FAILED":
        return <Badge className="bg-red-500">Failed</Badge>;
      case "CANCELLED":
        return <Badge className="bg-gray-500">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case "CASH":
        return <DollarSign className="h-4 w-4" />;
      case "CARD":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.order.orderId.toString().includes(searchTerm);

    const matchesStatus = statusFilter === "ALL" || payment.status === statusFilter;
    const matchesType = typeFilter === "ALL" || payment.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const calculateStats = (): PaymentStats => {
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
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Payment Administration</h1>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={fetchPayments} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{stats.totalCount} payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${stats.paidAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">{stats.paidCount} payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ${stats.pendingAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">{stats.pendingCount} payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${stats.failedAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">{stats.failedCount} payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.averageAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">per payment</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">All Payments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by customer, email, or transaction ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status Filter</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Statuses</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type Filter</Label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Types</SelectItem>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="CARD">Card</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                      <SelectItem value="EWALLET">E-Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payments Table */}
          <Card>
            <CardHeader>
              <CardTitle>Payments ({filteredPayments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.paymentId}>
                      <TableCell>{payment.paymentId}</TableCell>
                      <TableCell>#{payment.order.orderId}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.order.user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {payment.order.user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPaymentTypeIcon(payment.type)}
                          <span>{payment.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        {new Date(payment.paymentDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {payment.transactionId || "N/A"}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openViewDialog(payment)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openUpdateDialog(payment)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(payment)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredPayments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No payments found matching your criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <p>Advanced analytics and reporting features coming soon!</p>
                <p className="text-sm">This will include charts, trends, and detailed reports.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Payment Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Detailed information for payment #{selectedPayment?.paymentId}
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Payment ID</Label>
                  <p className="text-sm text-muted-foreground">{selectedPayment.paymentId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Order ID</Label>
                  <p className="text-sm text-muted-foreground">#{selectedPayment.order.orderId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Customer</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedPayment.order.user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedPayment.order.user.email}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Amount</Label>
                  <p className="text-sm text-muted-foreground">
                    ${selectedPayment.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <p className="text-sm text-muted-foreground">{selectedPayment.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedPayment.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedPayment.paymentDate).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Transaction ID</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedPayment.transactionId || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedPayment.paymentMethod || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Fraud Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedPayment.fraudStatus || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Bank</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedPayment.bank || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">VA Number</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedPayment.vaNumber || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Payment Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Payment Status</DialogTitle>
            <DialogDescription>
              Update the payment status and additional information for payment #
              {selectedPayment?.paymentId}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Payment Status</Label>
              <Select
                value={updateData.status}
                onValueChange={(value) =>
                  setUpdateData({ ...updateData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transactionId">Transaction ID</Label>
              <Input
                id="transactionId"
                value={updateData.transactionId}
                onChange={(e) =>
                  setUpdateData({ ...updateData, transactionId: e.target.value })
                }
                placeholder="Enter transaction ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Input
                id="paymentMethod"
                value={updateData.paymentMethod}
                onChange={(e) =>
                  setUpdateData({ ...updateData, paymentMethod: e.target.value })
                }
                placeholder="Enter payment method"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePayment}>Update Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Payment Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete payment #
              {selectedPayment?.paymentId} and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePayment}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
