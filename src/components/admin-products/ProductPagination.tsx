"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import type { PaginationInfo } from "./types";

interface ProductPaginationProps {
  pagination: PaginationInfo;
  totalFilteredItems: number;
  onPageChange: (page: number) => void;
}

export function ProductPagination({
  pagination,
  totalFilteredItems,
  onPageChange,
}: ProductPaginationProps) {
  const { currentPage, totalPages, itemsPerPage } = pagination;

  const indexOfFirstProduct = (currentPage - 1) * itemsPerPage;
  const indexOfLastProduct = Math.min(
    currentPage * itemsPerPage,
    totalFilteredItems
  );

  if (totalFilteredItems === 0) {
    return null;
  }

  return (
    <div className="px-6 py-4 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {indexOfFirstProduct + 1} to {indexOfLastProduct} of{" "}
          {totalFilteredItems} products
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            <IconChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
              )
              .map((page, index, array) => (
                <React.Fragment key={page}>
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="px-2 text-gray-400">...</span>
                  )}
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                </React.Fragment>
              ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <IconChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
