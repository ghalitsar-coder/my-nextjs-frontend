import { Button } from "@/components/ui/button";

interface CashierPaymentHeaderProps {
  onRefresh: () => void;
}

export function CashierPaymentHeader({ onRefresh }: CashierPaymentHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Payment Management</h1>
      <Button onClick={onRefresh} variant="outline">
        Refresh
      </Button>
    </div>
  );
}
