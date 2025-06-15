"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { productApi, categoryApi } from "@/lib/api";
import { toast } from "sonner";
import {
  ProductHeader,
  ProductStatsCards,
  ProductFiltersBar,
  ProductTable,
  ProductPagination,
  ProductCreateDialog,
  ProductEditDialog,
  ProductDeleteDialog,
  ProductLoadingState,
  ProductErrorState,
  filterProducts,
  sortProducts,
  calculateProductStats,
  paginateProducts,
  type Product,
  type Category,
  type ProductFormData,
  type ProductFilters,
  type PaginationInfo,
} from "@/components/admin-products";

export default function ProductsManagement() {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: 1,
    isAvailable: true,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({
    searchTerm: "",
    selectedCategory: "All Categories",
    sortBy: "newest",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // Load products and categories on component mount
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.searchTerm, filters.selectedCategory, filters.sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productApi.getAll();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Failed to load products. Please try again.");
      toast.error("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryApi.getAll();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.warn("Categories data is not an array:", data);
        setCategories([]);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
      toast.error("Failed to load categories. Using default categories.");
      setCategories([]);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const productData = {
        ...formData,
        categoryId: formData.categoryId,
      };

      await productApi.create(productData);
      toast.success("Product created successfully!");

      setIsAddProductOpen(false);
      setFormData({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        categoryId: 1,
        isAvailable: true,
      });

      await loadProducts();
    } catch (err) {
      console.error("Error creating product:", err);
      toast.error("Failed to create product. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setFormLoading(true);

    try {
      const productData = {
        ...formData,
        categoryId: formData.categoryId,
      };

      await productApi.update(selectedProduct.productId, productData);
      toast.success("Product updated successfully!");

      setIsEditOpen(false);
      setSelectedProduct(null);

      await loadProducts();
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("Failed to update product. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      await productApi.delete(selectedProduct.productId);
      toast.success("Product deleted successfully!");

      setIsDeleteOpen(false);
      setSelectedProduct(null);

      await loadProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product. Please try again.");
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.category.categoryId,
      isAvailable: product.isAvailable,
    });
    setIsEditOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleImport = () => {
    toast.info("Import functionality coming soon!");
  };

  const handleExport = () => {
    toast.info("Export functionality coming soon!");
  };

  // Filter, sort, and paginate products
  const filteredProducts = filterProducts(products, filters);
  const sortedProducts = sortProducts(filteredProducts, filters.sortBy);
  const paginationResult = paginateProducts(
    sortedProducts,
    currentPage,
    itemsPerPage
  );
  const stats = calculateProductStats(products);

  const paginationInfo: PaginationInfo = {
    currentPage,
    totalPages: paginationResult.totalPages,
    itemsPerPage,
    totalItems: sortedProducts.length,
  };

  return (
    <div className="container mx-auto px-10 space-y-6">
      <ProductHeader onImport={handleImport} onExport={handleExport} />

      <ProductStatsCards stats={stats} categories={categories} />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">All Products</CardTitle>
              <CardDescription>
                Manage your product inventory and details
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <ProductFiltersBar
                filters={filters}
                categories={categories}
                onFiltersChange={setFilters}
              />
              <ProductCreateDialog
                open={isAddProductOpen}
                onOpenChange={setIsAddProductOpen}
                formData={formData}
                onFormDataChange={setFormData}
                categories={categories}
                onSubmit={handleCreateProduct}
                loading={formLoading}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading && <ProductLoadingState />}

          {error && !loading && (
            <ProductErrorState error={error} onRetry={loadProducts} />
          )}

          {!loading && !error && (
            <ProductTable
              products={paginationResult.currentProducts}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}
        </CardContent>

        {!loading && !error && sortedProducts.length > 0 && (
          <ProductPagination
            pagination={paginationInfo}
            totalFilteredItems={sortedProducts.length}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>

      <ProductEditDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        product={selectedProduct}
        formData={formData}
        onFormDataChange={setFormData}
        categories={categories}
        onSubmit={handleUpdateProduct}
        loading={formLoading}
      />

      <ProductDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        product={selectedProduct}
        onConfirm={confirmDeleteProduct}
      />
    </div>
  );
}
