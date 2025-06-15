"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  IconPackage,
  IconTags,
  IconAlertTriangle,
  IconCurrencyDollar,
  IconTrendingUp,
} from "@tabler/icons-react";
import { formatCurrency } from "./utils";
import type { ProductStats, Category } from "./types";

interface ProductStatsCardsProps {
  stats: ProductStats;
  categories: Category[];
}

export function ProductStatsCards({
  stats,
  categories,
}: ProductStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <h3 className="text-2xl font-bold">{stats.totalProducts}</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <IconPackage className="h-6 w-6" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm">
            <IconTrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">12% from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Categories</p>
              <h3 className="text-2xl font-bold">{stats.activeCategories}</h3>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <IconTags className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Total: {categories.length} categories
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock Items</p>
              <h3 className="text-2xl font-bold">{stats.lowStockItems}</h3>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <IconAlertTriangle className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm text-red-500 mt-2">Needs attention</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <h3 className="text-2xl font-bold">{stats.outOfStock}</h3>
            </div>
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <IconAlertTriangle className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm text-red-500 mt-2">Restock required</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inventory Value</p>
              <h3 className="text-2xl font-bold">
                {formatCurrency(stats.totalValue).slice(0, -3)}K
              </h3>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <IconCurrencyDollar className="h-6 w-6" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm">
            <IconTrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">5.3% from last month</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
