'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { 
  IconPackage,
  IconTags,
  IconAlertTriangle,
  IconCurrencyDollar,
  IconTrendingUp,
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconUpload,
  IconLoader2
} from "@tabler/icons-react";
import React, { useState, useEffect } from "react";
import { productApi, categoryApi } from "@/lib/api";
import { toast } from "sonner";

// Product interfaces matching backend structure
interface Category {
  categoryId: number;
  name: string;
  description: string;
}

interface Product {
  productId: number;
  category: Category;
  name: string;
  description: string;
  price: number;
  stock: number;
  isAvailable: boolean;
}

// Form data interface for create/update operations
interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;  isAvailable: boolean;
}

const sortOptions = [
  { value: 'newest', label: 'Sort by: Newest' },
  { value: 'oldest', label: 'Sort by: Oldest' },
  { value: 'price-low', label: 'Sort by: Price (Low to High)' },
  { value: 'price-high', label: 'Sort by: Price (High to Low)' },
  { value: 'name', label: 'Sort by: Name' },
  { value: 'stock', label: 'Sort by: Stock' }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(amount);
};

const getStatusFromStock = (stock: number, isAvailable: boolean) => {
  if (!isAvailable) return 'Out of Stock';
  if (stock === 0) return 'Out of Stock';
  if (stock <= 15) return 'Low Stock';
  return 'Available';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Available':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Low Stock':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Out of Stock':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const ProductsManagement = () => {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: 1,
    isAvailable: true
  });
  const [formLoading, setFormLoading] = useState(false);
  const itemsPerPage = 5;

  // Load products and categories on component mount
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productApi.getAll();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products. Please try again.');      toast.error("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const loadCategories = async () => {
    try {
      const data = await categoryApi.getAll();
      // Ensure data is an array before setting it
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.warn('Categories data is not an array:', data);
        setCategories([]);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      toast.error("Failed to load categories. Using default categories.");
      // Set empty array as fallback
      setCategories([]);
    }
  };

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.productId.toString().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || product.category.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate stats
  const stats = {
    totalProducts: products.length,
    activeCategories: new Set(products.map(p => p.category.name)).size,
    lowStockItems: products.filter(p => p.stock > 0 && p.stock <= 15).length,
    totalValue: products.reduce((sum, product) => sum + (product.price * product.stock), 0),
    outOfStock: products.filter(p => p.stock === 0 || !p.isAvailable).length
  };
  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);
  
  // Pagination calculations for display
  const indexOfFirstProduct = (currentPage - 1) * itemsPerPage;
  const indexOfLastProduct = Math.min(currentPage * itemsPerPage, filteredProducts.length);

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.category.categoryId,
      isAvailable: product.isAvailable
    });
    setIsEditOpen(true);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      const productData = {
        ...formData,
        categoryId: formData.categoryId
      };
      
      await productApi.create(productData);
        toast.success("Product created successfully!");
      
      setIsAddProductOpen(false);
      setFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        categoryId: 1,
        isAvailable: true
      });
      
      await loadProducts();
    } catch (err) {
      console.error('Error creating product:', err);      toast.error("Failed to create product. Please try again.");
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
        categoryId: formData.categoryId
      };
      
      await productApi.update(selectedProduct.productId, productData);
        toast.success("Product updated successfully!");
      
      setIsEditOpen(false);
      setSelectedProduct(null);
      
      await loadProducts();
    } catch (err) {
      console.error('Error updating product:', err);      toast.error("Failed to update product. Please try again.");
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
      console.error('Error deleting product:', err);      toast.error("Failed to delete product. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your products, inventory, and categories</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <IconUpload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <IconDownload className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
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
            <p className="text-sm text-gray-500 mt-2">Total: {categories.length - 1} categories</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Low Stock Items</p>
                <h3 className="text-2xl font-bold">{stats.lowStockItems}</h3>
              </div>              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
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
              </div>              <div className="p-3 rounded-full bg-red-100 text-red-600">
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
                <h3 className="text-2xl font-bold">{formatCurrency(stats.totalValue).slice(0, -3)}K</h3>
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

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">All Products</CardTitle>
              <CardDescription>Manage your product inventory and details</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
              <Select value={sortBy} onValueChange={setSortBy}>
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
              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <IconPlus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                      Add a new product to your inventory. Fill in all the required details.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateProduct}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="product-name">Product Name</Label>
                          <Input 
                            id="product-name" 
                            placeholder="Enter product name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="product-category">Category</Label>                          <Select 
                            value={formData.categoryId.toString()}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: parseInt(value) }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories?.map((category) => (
                                <SelectItem key={category.categoryId} value={category.categoryId.toString()}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="product-price">Price (IDR)</Label>
                          <Input 
                            id="product-price" 
                            type="number" 
                            placeholder="0"
                            value={formData.price}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="product-stock">Stock Quantity</Label>
                          <Input 
                            id="product-stock" 
                            type="number" 
                            placeholder="0"
                            value={formData.stock}
                            onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                            min="0"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="product-description">Description</Label>
                        <Textarea 
                          id="product-description" 
                          placeholder="Enter product description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="product-available"
                          checked={formData.isAvailable}
                          onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="product-available">Available for purchase</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddProductOpen(false)}
                        disabled={formLoading}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={formLoading}>
                        {formLoading ? (
                          <>
                            <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          'Add Product'
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>        <CardContent>
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <IconLoader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Loading products...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <IconAlertTriangle className="h-8 w-8 text-red-500 mb-2" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={loadProducts} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {/* Product Table */}
          {!loading && !error && (
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
                  {currentProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center">
                          <IconPackage className="h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-gray-600 mb-2">No products found</p>
                          <p className="text-sm text-gray-500">
                            {searchTerm || selectedCategory !== 'All Categories' 
                              ? 'Try adjusting your search or filters' 
                              : 'Add your first product to get started'}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentProducts.map((product) => {
                      const status = getStatusFromStock(product.stock, product.isAvailable);
                      return (
                        <TableRow key={product.productId} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="font-mono text-sm text-gray-600">
                            PROD-{product.productId.toString().padStart(3, '0')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 h-12 w-12">
                                <div className="h-12 w-12 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center">
                                  <IconPackage className="h-6 w-6 text-gray-400" />
                                </div>
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-gray-50">
                              {product.category.name}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm font-medium">{formatCurrency(product.price)}</TableCell>
                          <TableCell className="text-sm">
                            <span className={`font-medium ${product.stock <= 15 && product.stock > 0 ? 'text-yellow-600' : product.stock === 0 ? 'text-red-600' : 'text-gray-900'}`}>
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
                                onClick={() => handleEditProduct(product)}
                              >
                                <IconEdit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProduct(product)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <IconTrash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>          )}        </CardContent>
        
        {/* Pagination */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <IconChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => 
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
                          onClick={() => setCurrentPage(page)}
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <IconChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>{/* Edit Product Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Edit the details for {selectedProduct?.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateProduct}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input 
                    id="edit-name" 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>                  <Select 
                    value={formData.categoryId.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.categoryId} value={category.categoryId.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price (IDR)</Label>
                  <Input 
                    id="edit-price" 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-stock">Stock Quantity</Label>
                  <Input 
                    id="edit-stock" 
                    type="number" 
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description" 
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-available"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="edit-available">Available for purchase</Label>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditOpen(false)}
                disabled={formLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? (
                  <>
                    <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{selectedProduct?.name}&rdquo;? This action cannot be undone and will permanently remove the product from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteProduct}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsManagement;
