"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconSearch } from "@tabler/icons-react";
import { sortOptions } from "./utils";
import type { Category, ProductFilters } from "./types";

interface ProductFiltersBarProps {
  filters: ProductFilters;
  categories: Category[];
  onFiltersChange: (filters: ProductFilters) => void;
}

export function ProductFiltersBar({
  filters,
  categories,
  onFiltersChange,
}: ProductFiltersBarProps) {
  const updateFilter = (key: keyof ProductFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search products..."
          className="pl-10 w-64"
          value={filters.searchTerm}
          onChange={(e) => updateFilter("searchTerm", e.target.value)}
        />
      </div>

      <Select
        value={filters.selectedCategory}
        onValueChange={(value) => updateFilter("selectedCategory", value)}
      >
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key="all" value="All Categories">
            All Categories
          </SelectItem>
          {categories?.map((category) => (
            <SelectItem key={category.categoryId} value={category.name}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.sortBy}
        onValueChange={(value) => updateFilter("sortBy", value)}
      >
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
