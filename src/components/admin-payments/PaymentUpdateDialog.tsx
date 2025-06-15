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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Payment, PaymentUpdateRequest } from "./types";

interface PaymentUpdateDialogProps {
  payment: Payment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updateData: PaymentUpdateRequest) => void;
  updateData: PaymentUpdateRequest;
  onUpdateDataChange: (data: PaymentUpdateRequest) => void;
}

export function PaymentUpdateDialog({
  payment,
  open,
  onOpenChange,
  onUpdate,
  updateData,
  onUpdateDataChange,
}: PaymentUpdateDialogProps) {
  const handleUpdate = () => {
    onUpdate(updateData);
  };

  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Payment Status</DialogTitle>
          <DialogDescription>
            Update the payment status and additional information for payment #
            {payment.paymentId}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Payment Status</Label>
            <Select
              value={updateData.status}
              onValueChange={(value) =>
                onUpdateDataChange({ ...updateData, status: value })
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
              value={updateData.transactionId || ""}
              onChange={(e) =>
                onUpdateDataChange({
                  ...updateData,
                  transactionId: e.target.value,
                })
              }
              placeholder="Enter transaction ID"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Input
              id="paymentMethod"
              value={updateData.paymentMethod || ""}
              onChange={(e) =>
                onUpdateDataChange({
                  ...updateData,
                  paymentMethod: e.target.value,
                })
              }
              placeholder="Enter payment method"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Update Payment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
