import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconRefresh } from "@tabler/icons-react";

interface CashierDashboardHeaderProps {
  onRefresh: () => void;
  lastRefresh: Date;
}

export function CashierDashboardHeader({
  onRefresh,
  lastRefresh,
}: CashierDashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Cashier Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Manage orders efficiently and provide great service
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <Button onClick={onRefresh} variant="outline" size="sm">
          <IconRefresh className="w-4 h-4 mr-2" />
          Refresh
        </Button>
        <div className="text-xs text-gray-500">
          Last updated: {lastRefresh.toLocaleTimeString()}
        </div>
        <Badge
          variant="secondary"
          className="bg-blue-100 text-blue-800 px-4 py-2"
        >
          Cashier Mode
        </Badge>
      </div>
    </div>
  );
}
