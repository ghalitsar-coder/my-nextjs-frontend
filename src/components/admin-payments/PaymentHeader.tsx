import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface PaymentHeaderProps {
  onExportCSV: () => void;
  onRefresh: () => void;
}

export function PaymentHeader({ onExportCSV, onRefresh }: PaymentHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Payment Administration</h1>
      <div className="flex gap-2">
        <Button onClick={onExportCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
        <Button onClick={onRefresh} variant="outline">
          Refresh
        </Button>
      </div>
    </div>
  );
}
