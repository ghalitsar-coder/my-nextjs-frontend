import { ScrollArea } from "@/components/ui/scroll-area";
import { type Order } from "./types";
import { OrderCard } from "./OrderCard";

interface OrderListProps {
  orders: Order[];
  selectedOrder: Order | null;
  onOrderSelect: (order: Order) => void;
}

export function OrderList({
  orders,
  selectedOrder,
  onOrderSelect,
}: OrderListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              isSelected={selectedOrder?.orderId === order.orderId}
              onSelect={onOrderSelect}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
