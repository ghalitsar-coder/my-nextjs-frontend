import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconShoppingBag, IconCoffee } from "@tabler/icons-react";

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => (window.location.href = "/order-history")}
        >
          <IconShoppingBag className="h-4 w-4 mr-2" />
          View Order History
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => (window.location.href = "/coffee-list")}
        >
          <IconCoffee className="h-4 w-4 mr-2" />
          Browse Coffee Menu
        </Button>
      </CardContent>
    </Card>
  );
}
