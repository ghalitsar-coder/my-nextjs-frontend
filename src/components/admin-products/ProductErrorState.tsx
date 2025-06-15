"use client";

import { Button } from "@/components/ui/button";
import { IconAlertTriangle } from "@tabler/icons-react";

interface ProductErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ProductErrorState({ error, onRetry }: ProductErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <IconAlertTriangle className="h-8 w-8 text-red-500 mb-2" />
      <p className="text-red-600 mb-4">{error}</p>
      <Button onClick={onRetry} variant="outline">
        Try Again
      </Button>
    </div>
  );
}
