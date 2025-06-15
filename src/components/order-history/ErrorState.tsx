import { Card, CardContent } from "@/components/ui/card";
import { IconX } from "@tabler/icons-react";

interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <Card className="mb-6 border-red-200 bg-red-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-red-800">
          <IconX className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </CardContent>
    </Card>
  );
}
