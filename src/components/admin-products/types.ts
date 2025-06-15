// Shared types for admin products components

export interface Category {
  categoryId: number;
  name: string;
  description: string;
}

export interface Product {
  productId: number;
  category: Category;
  name: string;
  description: string;
  price: number;
  stock: number;
  isAvailable: boolean;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  isAvailable: boolean;
}

export interface ProductStats {
  totalProducts: number;
  activeCategories: number;
  lowStockItems: number;
  totalValue: number;
  outOfStock: number;
}

export interface ProductFilters {
  searchTerm: string;
  selectedCategory: string;
  sortBy: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export type ProductStatus = 'Available' | 'Low Stock' | 'Out of Stock';

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}
