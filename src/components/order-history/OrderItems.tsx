import { IconCoffee } from "@tabler/icons-react";
import { type OrderItem } from "./types";
import { formatCurrency } from "./utils";

interface OrderItemsProps {
  items: OrderItem[];
}

export function OrderItems({ items }: OrderItemsProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.detailId}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <IconCoffee className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">
              {formatCurrency(item.unitPrice * item.quantity)}
            </p>
            <p className="text-sm text-gray-600">
              {formatCurrency(item.unitPrice)} each
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
