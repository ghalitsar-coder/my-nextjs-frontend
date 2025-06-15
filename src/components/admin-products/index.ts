// Components
export { ProductHeader } from "./ProductHeader";
export { ProductStatsCards } from "./ProductStatsCards";
export { ProductFiltersBar } from "./ProductFiltersBar";
export { ProductTable } from "./ProductTable";
export { ProductPagination } from "./ProductPagination";
export { ProductCreateDialog } from "./ProductCreateDialog";
export { ProductEditDialog } from "./ProductEditDialog";
export { ProductDeleteDialog } from "./ProductDeleteDialog";
export { ProductLoadingState } from "./ProductLoadingState";
export { ProductErrorState } from "./ProductErrorState";

// Utils
export {
  sortOptions,
  formatCurrency,
  getStatusFromStock,
  getStatusColor,
  filterProducts,
  sortProducts,
  calculateProductStats,
  paginateProducts,
} from "./utils";

// Types
export type {
  Category,
  Product,
  ProductFormData,
  ProductStats,
  ProductFilters,
  SortOption,
  ProductStatus,
  PaginationInfo,
} from "./types";
