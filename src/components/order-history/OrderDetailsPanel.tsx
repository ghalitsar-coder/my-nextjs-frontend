import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  IconReceipt,
  IconCoffee,
  IconClock,
  IconCheck,
  IconShoppingBag,
  IconTruck,
  IconX,
} from "@tabler/icons-react";
import { type Order } from "./types";
import { formatCurrency, formatDate, getStatusInfo } from "./utils";
import { OrderItems } from "./OrderItems";
import { PaymentInfo } from "./PaymentInfo";

interface OrderDetailsPanelProps {
  order: Order;
}

const statusIcons = {
  IconClock,
  IconCheck,
  IconCoffee,
  IconShoppingBag,
  IconTruck,
  IconX,
};

export function OrderDetailsPanel({ order }: OrderDetailsPanelProps) {
  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusIcons[statusInfo.icon as keyof typeof statusIcons];

  const totalAmount = order.orderDetails.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <IconReceipt className="h-5 w-5" />
            Order #{order.orderId}
          </CardTitle>
          <Badge className={`${statusInfo.color} flex items-center gap-1`}>
            <StatusIcon className="h-3 w-3" />
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Order Date:</span>
            <p className="font-medium">{formatDate(order.orderDate)}</p>
          </div>
        </div>

        <Separator />

        {/* Items */}
        <div>
          <h4 className="font-semibold mb-3">Order Items</h4>
          <OrderItems items={order.orderDetails} />
        </div>

        <Separator />

        {/* Payment Info */}
        <div>
          <h4 className="font-semibold mb-3">Payment Information</h4>
          <PaymentInfo payments={order.payments} />
        </div>

        <Separator />

        {/* Total */}
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Total Amount:</span>
            <span className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
