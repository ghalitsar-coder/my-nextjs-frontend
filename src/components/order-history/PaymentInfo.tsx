import { Badge } from "@/components/ui/badge";
import { type Payment } from "./types";
import { formatCurrency, formatDate } from "./utils";

interface PaymentInfoProps {
  payments: Payment[];
}

export function PaymentInfo({ payments }: PaymentInfoProps) {
  if (payments.length === 0) {
    return <p className="text-gray-600">No payment information available.</p>;
  }

  return (
    <div className="space-y-3">
      {payments.map((payment) => (
        <div key={payment.paymentId} className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Payment Method:</span>
            <Badge variant="outline">{payment.type}</Badge>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Status:</span>
            <Badge
              variant={
                payment.status === "COMPLETED" ? "default" : "destructive"
              }
            >
              {payment.status}
            </Badge>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Amount:</span>
            <span className="font-bold">{formatCurrency(payment.amount)}</span>
          </div>
          {payment.paymentDate && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Paid At:</span>
              <span className="text-sm">{formatDate(payment.paymentDate)}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
