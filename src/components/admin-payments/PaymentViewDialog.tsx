"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { Payment } from "./types";

interface PaymentViewDialogProps {
  payment: Payment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentViewDialog({
  payment,
  open,
  onOpenChange,
}: PaymentViewDialogProps) {
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

  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
          <DialogDescription>
            Detailed information for payment #{payment.paymentId}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Payment ID</Label>
              <p className="text-sm text-muted-foreground">
                {payment.paymentId}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Order ID</Label>
              <p className="text-sm text-muted-foreground">
                #{payment.order.orderId}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Customer</Label>
              <p className="text-sm text-muted-foreground">
                {payment.order.user.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {payment.order.user.email}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Amount</Label>
              <p className="text-sm text-muted-foreground">
                ${payment.amount.toFixed(2)}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Type</Label>
              <p className="text-sm text-muted-foreground">{payment.type}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <div className="mt-1">{getStatusBadge(payment.status)}</div>
            </div>
            <div>
              <Label className="text-sm font-medium">Payment Date</Label>
              <p className="text-sm text-muted-foreground">
                {new Date(payment.paymentDate).toLocaleString()}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Transaction ID</Label>
              <p className="text-sm text-muted-foreground">
                {payment.transactionId || "N/A"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Payment Method</Label>
              <p className="text-sm text-muted-foreground">
                {payment.paymentMethod || "N/A"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Fraud Status</Label>
              <p className="text-sm text-muted-foreground">
                {payment.fraudStatus || "N/A"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Bank</Label>
              <p className="text-sm text-muted-foreground">
                {payment.bank || "N/A"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">VA Number</Label>
              <p className="text-sm text-muted-foreground">
                {payment.vaNumber || "N/A"}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
