"use client";

import { useState, useEffect, useCallback } from "react";
import { promotionApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  IconPlus,
  IconSearch,
  IconFileExport,
  IconEdit,
  IconTrash,
  IconTag,
  IconGift,
  IconClock,
  IconUsers,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";

// Backend Promotion interface
interface Promotion {
  promotionId: number;
  name: string;
  description?: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  minimumPurchaseAmount?: number;
  maximumUses?: number;
  currentUses?: number;
  promotionType?: string; // "PERCENTAGE", "FIXED_AMOUNT", etc.
  maxDiscountAmount?: number;
}

// Form interface for frontend form handling
interface PromotionFormData {
  name: string;
  description: string;
  discountValue: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  minimumPurchaseAmount: string;
  maximumUses: string;
  promotionType: string;
  maxDiscountAmount: string;
}

// Form state
const defaultFormData = {
  name: "",
  description: "",
  discountValue: "",
  startDate: "",
  endDate: "",
  isActive: true,
  minimumPurchaseAmount: "",
  maximumUses: "",
  promotionType: "PERCENTAGE",
  maxDiscountAmount: "",
};

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [formData, setFormData] = useState<PromotionFormData>(defaultFormData);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  // Load promotions from API
  const loadPromotions = useCallback(async () => {
    try {
      const data = await promotionApi.getAll();
      setPromotions(data);
    } catch {
      toast.error("Failed to load promotions");
    }
  }, []);

  useEffect(() => {
    loadPromotions();
  }, [loadPromotions]);
  // Handle form submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        discountValue: Number(formData.discountValue),
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive,
        minimumPurchaseAmount: formData.minimumPurchaseAmount
          ? Number(formData.minimumPurchaseAmount)
          : undefined,
        maximumUses: formData.maximumUses
          ? Number(formData.maximumUses)
          : undefined,
        promotionType: formData.promotionType,
        maxDiscountAmount: formData.maxDiscountAmount
          ? Number(formData.maxDiscountAmount)
          : undefined,
      };
      if (editingPromotion) {
        await promotionApi.update(editingPromotion?.promotionId, payload);
        toast.success("Promotion updated successfully");
      } else {
        await promotionApi.create(payload);
        toast.success("Promotion created successfully");
      }
      await loadPromotions();
      resetForm();
    } catch {
      toast.error("Failed to save promotion");
    }
  };
  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      await promotionApi.delete(id);
      toast.success("Promotion deleted successfully");
      await loadPromotions();
    } catch {
      toast.error("Failed to delete promotion");
    }
  };
  // Edit handler
  const handleEdit = (promotion: Promotion) => {
    setFormData({
      name: promotion.name,
      description: promotion.description || "",
      discountValue: promotion.discountValue.toString(),
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      isActive: promotion.isActive,
      minimumPurchaseAmount: promotion.minimumPurchaseAmount?.toString() || "",
      maximumUses: promotion.maximumUses?.toString() || "",
      promotionType: promotion.promotionType || "PERCENTAGE",
      maxDiscountAmount: promotion.maxDiscountAmount?.toString() || "",
    });
    setEditingPromotion(promotion);
    setIsAddModalOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData(defaultFormData);
    setEditingPromotion(null);
    setIsAddModalOpen(false);
  };
  // Status logic
  const getPromotionStatus = (promotion: Promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);
    if (!promotion.isActive) return "inactive";
    if (now < startDate) return "scheduled";
    if (now > endDate) return "expired";
    return "active";
  };
  // Filtering
  const filteredPromotions = promotions.filter((promotion) => {
    const matchesSearch = promotion.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const promotionStatus = getPromotionStatus(promotion);
    const matchesStatus =
      statusFilter === "all" || promotionStatus === statusFilter;
    const promotionType = promotion.promotionType || "PERCENTAGE";
    const matchesType =
      typeFilter === "all" ||
      promotionType.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPromotions = filteredPromotions.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  // Stats
  const activePromotions = promotions.filter(
    (p) => getPromotionStatus(p) === "active"
  ).length;
  const totalRedemptions = promotions.reduce(
    (sum, p) => sum + (p.currentUses || 0),
    0
  );
  const scheduledPromotions = promotions.filter(
    (p) => getPromotionStatus(p) === "scheduled"
  ).length;
  const totalSavings = promotions.reduce((sum, p) => {
    if (p.promotionType === "PERCENTAGE") {
      return sum + (p.currentUses || 0) * (p.maxDiscountAmount || 0);
    } else if (p.promotionType === "FIXED_AMOUNT") {
      return sum + (p.currentUses || 0) * p.discountValue;
    }
    return sum;
  }, 0);

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800 border-green-200",
      scheduled: "bg-blue-100 text-blue-800 border-blue-200",
      expired: "bg-red-100 text-red-800 border-red-200",
      draft: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return variants[status as keyof typeof variants] || variants.draft;
  };
  const getTypeBadge = (type: string) => {
    const variants = {
      PERCENTAGE: "bg-purple-100 text-purple-800",
      FIXED_AMOUNT: "bg-blue-100 text-blue-800",
    };
    return variants[type as keyof typeof variants] || variants.PERCENTAGE;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="backdrop-blur-sm bg-white/10 border-b border-white/20">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Promotions Management
                </h1>
                <p className="text-indigo-100">
                  Manage discounts, coupons, and promotional campaigns
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-bold">{activePromotions}</div>
                  <div className="text-sm text-indigo-200">
                    Active Promotions
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Active Promotions
                  </p>
                  <p className="text-3xl font-bold mt-2">{activePromotions}</p>
                  <p className="text-blue-200 text-xs mt-1">
                    Currently running
                  </p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <IconTag className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Total Redemptions
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {totalRedemptions.toLocaleString()}
                  </p>
                  <p className="text-green-200 text-xs mt-1">Times used</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <IconUsers className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Scheduled
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {scheduledPromotions}
                  </p>
                  <p className="text-purple-200 text-xs mt-1">
                    Upcoming promos
                  </p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <IconClock className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">
                    Total Savings
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {formatCurrency(totalSavings)}
                  </p>
                  <p className="text-orange-200 text-xs mt-1">
                    Customer savings
                  </p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <IconGift className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Main Content */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Promotions Management
                </CardTitle>
                <CardDescription>
                  Manage your promotional campaigns and discount codes
                </CardDescription>
              </div>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
                    <IconPlus className="mr-2 h-4 w-4" />
                    Add Promotion
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPromotion
                        ? "Edit Promotion"
                        : "Create New Promotion"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingPromotion
                        ? "Update the promotion details below."
                        : "Fill in the details to create a new promotional campaign."}
                    </DialogDescription>
                  </DialogHeader>{" "}
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Promotion Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="promotionType">Promotion Type</Label>
                        <Select
                          value={formData.promotionType}
                          onValueChange={(value) =>
                            setFormData({ ...formData, promotionType: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PERCENTAGE">
                              Percentage
                            </SelectItem>
                            <SelectItem value="FIXED_AMOUNT">
                              Fixed Amount
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discountValue">
                          {formData.promotionType === "PERCENTAGE"
                            ? "Discount Percentage (%)"
                            : "Discount Amount (IDR)"}
                        </Label>
                        <Input
                          id="discountValue"
                          type="number"
                          value={formData.discountValue}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              discountValue: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxDiscountAmount">
                          Maximum Discount Amount (IDR)
                        </Label>
                        <Input
                          id="maxDiscountAmount"
                          type="number"
                          value={formData.maxDiscountAmount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              maxDiscountAmount: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              startDate: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              endDate: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minimumPurchaseAmount">
                          Minimum Purchase (IDR)
                        </Label>
                        <Input
                          id="minimumPurchaseAmount"
                          type="number"
                          value={formData.minimumPurchaseAmount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              minimumPurchaseAmount: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maximumUses">
                          Maximum Uses (optional)
                        </Label>
                        <Input
                          id="maximumUses"
                          type="number"
                          value={formData.maximumUses}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              maximumUses: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isActive: e.target.checked,
                            })
                          }
                        />
                        <Label htmlFor="isActive">Active</Label>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        {editingPromotion
                          ? "Update Promotion"
                          : "Create Promotion"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search promotions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>{" "}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                  <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center">
                <IconFileExport className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>{" "}
            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPromotions.map((promotion) => (
                    <TableRow
                      key={promotion.promotionId}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{promotion.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {promotion.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getTypeBadge(
                            promotion.promotionType || "PERCENTAGE"
                          )}
                        >
                          {(promotion.promotionType || "PERCENTAGE").replace(
                            "_",
                            " "
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {promotion.promotionType === "PERCENTAGE"
                          ? `${promotion.discountValue}%`
                          : formatCurrency(promotion.discountValue)}
                        {promotion.maxDiscountAmount && (
                          <div className="text-xs text-gray-500">
                            Max: {formatCurrency(promotion.maxDiscountAmount)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{formatDate(promotion.startDate)}</div>
                          <div className="text-gray-500">
                            to {formatDate(promotion.endDate)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {(promotion.currentUses || 0).toLocaleString()}
                          </div>
                          {promotion.maximumUses && (
                            <div className="text-gray-500">
                              / {promotion.maximumUses.toLocaleString()}
                            </div>
                          )}
                        </div>
                        {promotion.maximumUses && (
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{
                                width: `${Math.min(
                                  ((promotion.currentUses || 0) /
                                    promotion.maximumUses) *
                                    100,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusBadge(
                            getPromotionStatus(promotion)
                          )}
                        >
                          {getPromotionStatus(promotion).toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(promotion)}
                          >
                            <IconEdit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <IconTrash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Promotion
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete &quot;
                                  {promotion.name}&quot;? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDelete(promotion.promotionId)
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(
                    startIndex + itemsPerPage,
                    filteredPromotions.length
                  )}{" "}
                  of {filteredPromotions.length} promotions
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <IconChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <IconChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>{" "}
        {/* Insights Section */}
        <div className="grid grid-cols-1 gap-6 mt-8">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Promotion Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {promotions.length}
                  </div>
                  <div className="text-sm text-gray-500">Total Promotions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {promotions.filter((p) => p.isActive).length}
                  </div>
                  <div className="text-sm text-gray-500">Active Promotions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {promotions.filter((p) => !p.isActive).length}
                  </div>
                  <div className="text-sm text-gray-500">
                    Inactive Promotions
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {
                      promotions.filter((p) => p.promotionType === "PERCENTAGE")
                        .length
                    }
                  </div>
                  <div className="text-sm text-gray-500">
                    Percentage Discounts
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
