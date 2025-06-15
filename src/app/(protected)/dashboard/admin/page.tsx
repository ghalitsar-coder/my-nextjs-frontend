"use client";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminOnly } from "@/components/role-guard";
import {
  IconCurrencyDollar,
  IconShoppingCart,
  IconUsers,
  IconPercentage,
  IconTrendingUp,
  IconTrendingDown,
  IconChartLine,
  IconBell,
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconClipboardList,
} from "@tabler/icons-react";
import React, { useState } from "react";
import data from "../data.json";

// Mock data for the enhanced dashboard
const dashboardStats = {
  totalRevenue: 12854,
  totalOrders: 842,
  activeUsers: 1235,
  conversionRate: 3.2,
  trends: {
    revenue: 24.5,
    orders: 12.3,
    users: 8.7,
    conversion: -1.1,
  },
};

const recentActivities = [
  {
    id: 1,
    type: "order",
    title: "New order #3251",
    time: "2 minutes ago",
    icon: IconShoppingCart,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: 2,
    type: "user",
    title: "New user registered",
    time: "25 minutes ago",
    icon: IconUsers,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: 3,
    type: "payment",
    title: "Payment received",
    time: "1 hour ago",
    icon: IconCurrencyDollar,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: 4,
    type: "return",
    title: "Order returned",
    time: "3 hours ago",
    icon: IconClipboardList,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
];

const quickStats = [
  { label: "Avg. Order Value", value: "Rp 657,125" },
  { label: "Customer Satisfaction", value: "4.3/5" },
  { label: "Top Selling Product", value: "Wireless Headphones" },
  { label: "Return Rate", value: "4.5%" },
];

// Enhanced product data for the table
const productData = [
  {
    id: "PROD-001",
    name: "The Silent Patient",
    author: "Alex Michaelides",
    category: "Fiction",
    price: 215400, // IDR
    stock: 54,
    status: "Available",
    image: "https://via.placeholder.com/40x60/4A5568/FFFFFF?text=Book",
  },
  {
    id: "PROD-002",
    name: "Where the Crawdads Sing",
    author: "Delia Owens",
    category: "Fiction",
    price: 189300, // IDR
    stock: 32,
    status: "Available",
    image: "https://via.placeholder.com/40x60/4A5568/FFFFFF?text=Book",
  },
  {
    id: "PROD-003",
    name: "Educated",
    author: "Tara Westover",
    category: "Biography",
    price: 234600, // IDR
    stock: 0,
    status: "Out of Stock",
    image: "https://via.placeholder.com/40x60/4A5568/FFFFFF?text=Book",
  },
];

type Product = {
  id: string;
  name: string;
  author: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  image: string;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

const AdminDashboard = () => {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  return (
    <AdminOnly>
      <div className="space-y-6">
        {/* Header with gradient background */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Dashboard Overview</h1>
                <p className="text-blue-100 text-lg">
                  Welcome back! Here&apos;s what&apos;s happening with your
                  business today.
                </p>
                <div className="flex items-center mt-4 space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-blue-100">System Online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-blue-100">
                      Last updated: Just now
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search anything..."
                    className="pl-10 pr-4 py-2 w-64 bg-white/90 backdrop-blur-sm border-white/20 text-gray-900 placeholder-gray-500"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                >
                  <IconBell className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium">
                    AD
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">Administrator</div>
                    <div className="text-xs text-blue-100">Full Access</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-40 -mt-40 w-80 h-80 bg-white/5 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-white/5 rounded-full"></div>
        </div>{" "}
        {/* Enhanced Dashboard Summary Cards with animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">
                    Total Revenue
                  </p>
                  <h3 className="text-3xl font-bold text-purple-900">
                    {formatCurrency(dashboardStats.totalRevenue * 14000)}
                  </h3>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                  <IconCurrencyDollar className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-3 text-sm">
                <div className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  <IconTrendingUp className="h-4 w-4 mr-1" />
                  <span className="font-medium">
                    {dashboardStats.trends.revenue}%
                  </span>
                </div>
                <span className="text-gray-600 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">
                    Total Orders
                  </p>
                  <h3 className="text-3xl font-bold text-blue-900">
                    {dashboardStats.totalOrders.toLocaleString()}
                  </h3>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <IconShoppingCart className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-3 text-sm">
                <div className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  <IconTrendingUp className="h-4 w-4 mr-1" />
                  <span className="font-medium">
                    {dashboardStats.trends.orders}%
                  </span>
                </div>
                <span className="text-gray-600 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>

          {/* Active Users */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">
                    Active Users
                  </p>
                  <h3 className="text-3xl font-bold text-green-900">
                    {dashboardStats.activeUsers.toLocaleString()}
                  </h3>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                  <IconUsers className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-3 text-sm">
                <div className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  <IconTrendingUp className="h-4 w-4 mr-1" />
                  <span className="font-medium">
                    {dashboardStats.trends.users}%
                  </span>
                </div>
                <span className="text-gray-600 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>

          {/* Conversion Rate */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium">
                    Conversion Rate
                  </p>
                  <h3 className="text-3xl font-bold text-yellow-900">
                    {dashboardStats.conversionRate}%
                  </h3>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg">
                  <IconPercentage className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-3 text-sm">
                <div className="flex items-center bg-red-100 text-red-700 px-2 py-1 rounded-full">
                  <IconTrendingDown className="h-4 w-4 mr-1" />
                  <span className="font-medium">
                    {Math.abs(dashboardStats.trends.conversion)}%
                  </span>
                </div>
                <span className="text-gray-600 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>{" "}
        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Overview Chart */}
          <Card className="lg:col-span-2 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <div>
                <CardTitle className="text-xl text-gray-800">
                  Sales Overview
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Track your revenue trends over time
                </p>
              </div>
              <Select defaultValue="7days">
                <SelectTrigger className="w-40 bg-white shadow-sm border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-72 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 flex items-center justify-center border border-gray-100">
                <div className="text-center text-gray-400">
                  <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                    <IconChartLine className="h-12 w-12 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">
                    Sales Analytics
                  </h4>
                  <p className="text-sm text-gray-500">
                    Interactive chart will be displayed here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Recent Activity */}
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
              <CardTitle className="text-xl text-gray-800">
                Recent Activity
              </CardTitle>
              <p className="text-sm text-gray-600">
                Latest updates from your store
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {recentActivities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div
                      className={`flex-shrink-0 h-12 w-12 rounded-xl ${activity.bgColor} flex items-center justify-center ${activity.iconColor} shadow-sm`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full w-fit">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  View All Activities
                </Button>
              </div>
            </CardContent>{" "}
          </Card>
        </div>
        {/* Enhanced Quick Stats Section */}
        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-lg">
            <CardTitle className="text-xl text-gray-800">Quick Stats</CardTitle>
            <p className="text-sm text-gray-600">
              Key performance indicators at a glance
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">
                    {stat.label}
                  </h4>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Enhanced Product Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Product Management</CardTitle>
              <CardDescription>
                Manage your products and inventory
              </CardDescription>
            </div>
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogTrigger asChild>
                <Button>
                  <IconPlus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Add a new product to your inventory.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="product-name" className="text-right">
                      Name
                    </Label>
                    <Input id="product-name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="product-price" className="text-right">
                      Price
                    </Label>
                    <Input
                      id="product-price"
                      type="number"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="product-stock" className="text-right">
                      Stock
                    </Label>
                    <Input
                      id="product-stock"
                      type="number"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Product</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productData.map((product) => (
                    <TableRow key={product.id} className="hover:bg-gray-50">
                      <TableCell className="font-mono text-sm">
                        {product.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded object-cover"
                              src={product.image}
                              alt={product.name}
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.author}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {product.category}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatCurrency(product.price)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {product.stock}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.status === "Available"
                              ? "default"
                              : "destructive"
                          }
                          className={
                            product.status === "Available"
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsEditOpen(true);
                            }}
                          >
                            <IconEdit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsDeleteOpen(true);
                            }}
                          >
                            <IconTrash className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        {/* Legacy components - keeping for compatibility */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Legacy Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartAreaInteractive />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legacy Data</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable data={data} />
            </CardContent>
          </Card>
        </div>
        {/* Edit Product Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Edit product details for {selectedProduct?.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  defaultValue={selectedProduct?.name}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right">
                  Price
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  defaultValue={selectedProduct?.price}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-stock" className="text-right">
                  Stock
                </Label>
                <Input
                  id="edit-stock"
                  type="number"
                  defaultValue={selectedProduct?.stock}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedProduct?.name}? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteOpen(false)}
              >
                Delete
              </Button>
            </DialogFooter>{" "}
          </DialogContent>
        </Dialog>
        {/* Quick Navigation Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                    <IconCurrencyDollar className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Payment Management
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  View and manage all payments, transactions, and refunds
                </p>
                <Button
                  className="w-full"
                  onClick={() =>
                    (window.location.href = "/dashboard/admin/payments")
                  }
                >
                  Manage Payments
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">
                    <IconShoppingCart className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Product Management
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add, edit, and organize your product catalog
                </p>
                <Button
                  className="w-full"
                  onClick={() =>
                    (window.location.href = "/dashboard/admin/products")
                  }
                >
                  Manage Products
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
                    <IconPercentage className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Promotions
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Create and manage discount campaigns and offers
                </p>
                <Button
                  className="w-full"
                  onClick={() =>
                    (window.location.href = "/dashboard/admin/promotions")
                  }
                >
                  Manage Promotions
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors">
                    <IconUsers className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  User Management
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Manage users, roles, and permissions
                </p>
                <Button
                  className="w-full"
                  onClick={() =>
                    (window.location.href = "/dashboard/admin/users")
                  }
                >
                  Manage Users
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminOnly>
  );
};

export default AdminDashboard;
