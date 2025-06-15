"use client";

import { Button } from "@/components/ui/button";
import { IconUpload, IconDownload } from "@tabler/icons-react";

interface ProductHeaderProps {
  onImport?: () => void;
  onExport?: () => void;
}

export function ProductHeader({ onImport, onExport }: ProductHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your products, inventory, and categories
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onImport}>
          <IconUpload className="h-4 w-4 mr-2" />
          Import
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <IconDownload className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}
