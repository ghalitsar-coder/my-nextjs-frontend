import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconCurrencyDollar,
  IconShoppingCart,
  IconClock,
  IconCheck,
} from "@tabler/icons-react";
import { CashierStats, Order } from "./types";
import { getTodaysOrders } from "./utils";

interface CashierStatsCardsProps {
  stats: CashierStats;
  orders: Order[];
}

export function CashierStatsCards({ stats, orders }: CashierStatsCardsProps) {
  const todaysOrders = getTodaysOrders(orders);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Today&apos;s Revenue
          </CardTitle>
          <IconCurrencyDollar className="h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            Rp {stats.todaysSales.toLocaleString()}
          </div>
          <p className="text-blue-100 text-sm mt-1">+24% from yesterday</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
          <IconShoppingCart className="h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{todaysOrders.length}</div>
          <p className="text-green-100 text-sm mt-1">
            {stats.ordersProcessed} processed
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Action</CardTitle>
          <IconClock className="h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.pendingOrders}</div>
          <p className="text-orange-100 text-sm mt-1">Need confirmation</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <IconCheck className="h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.completedOrders}</div>
          <p className="text-purple-100 text-sm mt-1">Successfully delivered</p>
        </CardContent>
      </Card>
    </div>
  );
}
