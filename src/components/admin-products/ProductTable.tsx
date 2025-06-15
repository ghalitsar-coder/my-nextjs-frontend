"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconPackage, IconEdit, IconTrash } from "@tabler/icons-react";
import { formatCurrency, getStatusFromStock, getStatusColor } from "./utils";
import type { Product } from "./types";

interface ProductTableProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
}

export function ProductTable({
  products,
  onEditProduct,
  onDeleteProduct,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Product ID</TableHead>
              <TableHead className="min-w-[250px]">Product Details</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12">
                <div className="flex flex-col items-center">
                  <IconPackage className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">No products found</p>
                  <p className="text-sm text-gray-500">
                    Add your first product to get started
                  </p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Product ID</TableHead>
            <TableHead className="min-w-[250px]">Product Details</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const status = getStatusFromStock(
              product.stock,
              product.isAvailable
            );
            return (
              <TableRow
                key={product.productId}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell className="font-mono text-sm text-gray-600">
                  PROD-{product.productId.toString().padStart(3, "0")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-12 w-12">
                      <div className="h-12 w-12 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <IconPackage className="h-6 w-6 text-gray-400" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-gray-50">
                    {product.category.name}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell className="text-sm">
                  <span
                    className={`font-medium ${
                      product.stock <= 15 && product.stock > 0
                        ? "text-yellow-600"
                        : product.stock === 0
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(status)}>
                    {status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditProduct(product)}
                    >
                      <IconEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteProduct(product)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
