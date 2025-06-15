import { IconCoffee, IconShoppingBag } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyOrdersStateProps {
  onBrowseCoffee?: () => void;
}

export function EmptyOrdersState({ onBrowseCoffee }: EmptyOrdersStateProps) {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <IconShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Orders Yet
        </h3>
        <p className="text-gray-600 mb-6">
          You haven&apos;t placed any orders yet. Start exploring our coffee
          menu!
        </p>
        <Button onClick={onBrowseCoffee}>
          <IconCoffee className="h-4 w-4 mr-2" />
          Browse Coffee
        </Button>
      </CardContent>
    </Card>
  );
}

export function EmptyDetailsState() {
  return (
    <Card>
      <CardContent className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <IconCoffee className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p>Select an order to view details</p>
        </div>
      </CardContent>
    </Card>
  );
}
