import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  IconCalendar,
  IconReceipt,
  IconEye,
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

interface OrderCardProps {
  order: Order;
  isSelected: boolean;
  onSelect: (order: Order) => void;
}

const statusIcons = {
  IconClock,
  IconCheck,
  IconCoffee,
  IconShoppingBag,
  IconTruck,
  IconX,
};

export function OrderCard({ order, isSelected, onSelect }: OrderCardProps) {
  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusIcons[statusInfo.icon as keyof typeof statusIcons];

  const totalAmount = order.orderDetails.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-orange-500 border-orange-500" : ""
      }`}
      onClick={() => onSelect(order)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <IconReceipt className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Order #{order.orderId}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <IconCalendar className="h-4 w-4" />
                {formatDate(order.orderDate)}
              </div>
            </div>
          </div>
          <Badge className={`${statusInfo.color} flex items-center gap-1`}>
            <StatusIcon className="h-3 w-3" />
            {statusInfo.label}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Items:</span>
            <span className="text-sm font-medium">
              {order.orderDetails.length} item(s)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Amount:</span>
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Payment Status:</span>
            <Badge
              variant={
                order.payments[0]?.status === "COMPLETED"
                  ? "default"
                  : "destructive"
              }
            >
              {order.payments[0]?.status || "Pending"}
            </Badge>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <IconEye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <IconReceipt className="h-5 w-5" />
                  Order #{order.orderId}
                </DialogTitle>
                <DialogDescription>
                  Complete details for your coffee order
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Order Date:</span>
                    <p className="font-medium">{formatDate(order.orderDate)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <div className="mt-1">
                      <Badge
                        className={`${statusInfo.color} flex items-center gap-1 w-fit`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                      </Badge>
                    </div>
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
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
