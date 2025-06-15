import type { Product, ProductFilters, SortOption, ProductStatus } from "./types";

// Utility functions for admin products

export const sortOptions: SortOption[] = [
  { value: "newest", label: "Sort by: Newest" },
  { value: "oldest", label: "Sort by: Oldest" },
  { value: "price-low", label: "Sort by: Price (Low to High)" },
  { value: "price-high", label: "Sort by: Price (High to Low)" },
  { value: "name", label: "Sort by: Name" },
  { value: "stock", label: "Sort by: Stock" },
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

export const getStatusFromStock = (stock: number, isAvailable: boolean): ProductStatus => {
  if (!isAvailable) return "Out of Stock";
  if (stock === 0) return "Out of Stock";
  if (stock <= 15) return "Low Stock";
  return "Available";
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Available":
      return "bg-green-100 text-green-800 border-green-200";
    case "Low Stock":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Out of Stock":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const filterProducts = (products: Product[], filters: ProductFilters): Product[] => {
  return products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      product.productId.toString().includes(filters.searchTerm.toLowerCase());
    
    const matchesCategory =
      filters.selectedCategory === "All Categories" ||
      product.category.name === filters.selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
};

export const sortProducts = (products: Product[], sortBy: string): Product[] => {
  return [...products].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.productId - a.productId; // Assuming higher ID = newer
      case "oldest":
        return a.productId - b.productId;
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      case "stock":
        return b.stock - a.stock; // Higher stock first
      default:
        return b.productId - a.productId; // Default to newest
    }
  });
};

export const calculateProductStats = (products: Product[]) => {
  return {
    totalProducts: products.length,
    activeCategories: new Set(products.map((p) => p.category.name)).size,
    lowStockItems: products.filter((p) => p.stock > 0 && p.stock <= 15).length,
    totalValue: products.reduce(
      (sum, product) => sum + product.price * product.stock,
      0
    ),
    outOfStock: products.filter((p) => p.stock === 0 || !p.isAvailable).length,
  };
};

export const paginateProducts = (products: Product[], currentPage: number, itemsPerPage: number) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return {
    currentProducts: products.slice(startIndex, endIndex),
    totalPages: Math.ceil(products.length / itemsPerPage),
    indexOfFirstProduct: startIndex,
    indexOfLastProduct: Math.min(endIndex, products.length),
  };
};
