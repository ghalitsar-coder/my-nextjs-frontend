import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
} from "lucide-react";
import { type PaymentStats } from "./types";

interface PaymentStatsCardsProps {
  stats: PaymentStats;
}

export function PaymentStatsCards({ stats }: PaymentStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${stats.totalAmount.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalCount} payments
          </p>
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
          <p className="text-xs text-muted-foreground">
            {stats.paidCount} payments
          </p>
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
          <p className="text-xs text-muted-foreground">
            {stats.pendingCount} payments
          </p>
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
          <p className="text-xs text-muted-foreground">
            {stats.failedCount} payments
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${stats.averageAmount.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">per payment</p>
        </CardContent>
      </Card>
    </div>
  );
}
