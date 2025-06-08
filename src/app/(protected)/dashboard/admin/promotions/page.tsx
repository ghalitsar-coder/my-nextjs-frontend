"use client";

import { useState, useEffect } from "react";
import { promotionApi } from "@/lib/api";
import { toast } from "sonner";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconFileExport,
  IconEdit,
  IconTrash,
  IconCalendar,
  IconTag,
  IconPercentage,
  IconGift,
  IconTrendingUp,
  IconClock,
  IconUsers,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";

interface Promotion {
  promotionId: number;
  name: string;
  description: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  minimumPurchaseAmount?: number;
  maximumUses?: number;
  currentUses?: number;
  promotionType?: string;
  maxDiscountAmount?: number;
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null
  );  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discountValue: "",
    startDate: "",
    endDate: "",
    minimumPurchaseAmount: "",
    maximumUses: "",
    promotionType: "PERCENTAGE",
    maxDiscountAmount: "",
    isActive: true,
  });

  // Load promotions from API
  useEffect(() => {
    loadPromotions();
  }, []);
  const loadPromotions = async () => {
    try {
      setLoading(true);
      const data = await promotionApi.getAll();
      setPromotions(data);
    } catch (error) {
      console.error("Error loading promotions:", error);
      toast.error("Failed to load promotions");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const promotionData = {
        name: formData.name,
        description: formData.description,
        discountValue: Number(formData.discountValue),
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive,
        ...(formData.minimumPurchaseAmount && {
          minimumPurchaseAmount: Number(formData.minimumPurchaseAmount)
        }),
        ...(formData.maximumUses && {
          maximumUses: Number(formData.maximumUses)
        }),
        ...(formData.promotionType && {
          promotionType: formData.promotionType
        }),
        ...(formData.maxDiscountAmount && {
          maxDiscountAmount: Number(formData.maxDiscountAmount)
        }),
      };

      if (editingPromotion) {
        await promotionApi.update(editingPromotion.promotionId, promotionData);
        toast.success("Promotion updated successfully");
      } else {
        await promotionApi.create(promotionData);
        toast.success("Promotion created successfully");
      }
      
      await loadPromotions();
      resetForm();
    } catch (error) {
      console.error("Error saving promotion:", error);
      toast.error(`Failed to ${editingPromotion ? 'update' : 'create'} promotion`);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await promotionApi.delete(id);
      toast.success("Promotion deleted successfully");
      await loadPromotions();
    } catch (error) {
      console.error("Error deleting promotion:", error);
      toast.error("Failed to delete promotion");
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await promotionApi.toggle(id);
      toast.success("Promotion status updated successfully");
      await loadPromotions();
    } catch (error) {
      console.error("Error toggling promotion status:", error);
      toast.error("Failed to toggle promotion status");
    }
  };

  const itemsPerPage = 10;
  // Helper function to determine promotion status
  const getPromotionStatus = (promotion: Promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);
    
    if (!promotion.isActive) return "inactive";
    if (now < startDate) return "scheduled";
    if (now > endDate) return "expired";
    return "active";
  };

  // Filter promotions
  const filteredPromotions = promotions.filter((promotion) => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchTerm.toLowerCase());
    const promotionStatus = getPromotionStatus(promotion);
    const matchesStatus = statusFilter === "all" || promotionStatus === statusFilter;
    const promotionType = promotion.promotionType || "PERCENTAGE";
    const matchesType = typeFilter === "all" || promotionType.toLowerCase() === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPromotions = filteredPromotions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Stats calculations
  const activePromotions = promotions.filter((p) => getPromotionStatus(p) === "active").length;
  const totalRedemptions = promotions.reduce((sum, p) => sum + (p.currentUses || 0), 0);
  const scheduledPromotions = promotions.filter((p) => getPromotionStatus(p) === "scheduled").length;
  const totalSavings = promotions.reduce((sum, p) => {
    if (p.type === "percentage") {
      return sum + p.currentUses * (p.maxDiscount || 0);
    } else if (p.type === "fixed") {
      return sum + p.currentUses * p.discountValue;
    }
    return sum;
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPromotion: Promotion = {
      id: editingPromotion?.id || Date.now().toString(),
      name: formData.name,
      code: formData.code,
      type: formData.type as Promotion["type"],
      discountValue: Number(formData.discountValue),
      startDate: formData.startDate,
      endDate: formData.endDate,
      minPurchase: Number(formData.minPurchase),
      maxDiscount: formData.maxDiscount
        ? Number(formData.maxDiscount)
        : undefined,
      description: formData.description,
      maxUses: formData.maxUses ? Number(formData.maxUses) : undefined,
      currentUses: editingPromotion?.currentUses || 0,
      status: formData.status as Promotion["status"],
      createdAt: editingPromotion?.createdAt || new Date().toISOString(),
    };

    if (editingPromotion) {
      setPromotions(
        promotions.map((p) => (p.id === editingPromotion.id ? newPromotion : p))
      );
    } else {
      setPromotions([...promotions, newPromotion]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      type: "percentage",
      discountValue: "",
      startDate: "",
      endDate: "",
      minPurchase: "",
      maxDiscount: "",
      description: "",
      maxUses: "",
      status: "active",
    });
    setEditingPromotion(null);
    setIsAddModalOpen(false);
  };

  const handleEdit = (promotion: Promotion) => {
    setFormData({
      name: promotion.name,
      code: promotion.code,
      type: promotion.type,
      discountValue: promotion.discountValue.toString(),
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      minPurchase: promotion.minPurchase.toString(),
      maxDiscount: promotion.maxDiscount?.toString() || "",
      description: promotion.description,
      maxUses: promotion.maxUses?.toString() || "",
      status: promotion.status,
    });
    setEditingPromotion(promotion);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setPromotions(promotions.filter((p) => p.id !== id));
  };

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
      percentage: "bg-purple-100 text-purple-800",
      fixed: "bg-blue-100 text-blue-800",
      free_shipping: "bg-green-100 text-green-800",
      bogo: "bg-orange-100 text-orange-800",
    };
    return variants[type as keyof typeof variants] || variants.percentage;
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
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6">
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
                        <Label htmlFor="code">Promo Code</Label>
                        <Input
                          id="code"
                          value={formData.code}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              code: e.target.value.toUpperCase(),
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Discount Type</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value) =>
                            setFormData({ ...formData, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">
                              Percentage
                            </SelectItem>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                            <SelectItem value="free_shipping">
                              Free Shipping
                            </SelectItem>
                            <SelectItem value="bogo">
                              Buy One Get One
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discountValue">
                          {formData.type === "percentage"
                            ? "Discount Percentage (%)"
                            : formData.type === "fixed"
                            ? "Discount Amount (IDR)"
                            : "Discount Value"}
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
                          required={formData.type !== "free_shipping"}
                          disabled={formData.type === "free_shipping"}
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
                        <Label htmlFor="minPurchase">
                          Minimum Purchase (IDR)
                        </Label>
                        <Input
                          id="minPurchase"
                          type="number"
                          value={formData.minPurchase}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              minPurchase: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxDiscount">
                          Maximum Discount (IDR)
                        </Label>
                        <Input
                          id="maxDiscount"
                          type="number"
                          value={formData.maxDiscount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              maxDiscount: e.target.value,
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="maxUses">Maximum Uses (optional)</Label>
                        <Input
                          id="maxUses"
                          type="number"
                          value={formData.maxUses}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              maxUses: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <RadioGroup
                          value={formData.status}
                          onValueChange={(value) =>
                            setFormData({ ...formData, status: value })
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="active" id="active" />
                            <Label htmlFor="active">Active</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="scheduled" id="scheduled" />
                            <Label htmlFor="scheduled">Scheduled</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="draft" id="draft" />
                            <Label htmlFor="draft">Draft</Label>
                          </div>
                        </RadioGroup>
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
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="free_shipping">Free Shipping</SelectItem>
                  <SelectItem value="bogo">Buy One Get One</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center">
                <IconFileExport className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
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
                    <TableRow key={promotion.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{promotion.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {promotion.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {promotion.code}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeBadge(promotion.type)}>
                          {promotion.type.replace("_", " ").toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {promotion.type === "percentage"
                          ? `${promotion.discountValue}%`
                          : promotion.type === "fixed"
                          ? formatCurrency(promotion.discountValue)
                          : promotion.type === "free_shipping"
                          ? "Free Shipping"
                          : "BOGO"}
                        {promotion.maxDiscount && (
                          <div className="text-xs text-gray-500">
                            Max: {formatCurrency(promotion.maxDiscount)}
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
                            {promotion.currentUses.toLocaleString()}
                          </div>
                          {promotion.maxUses && (
                            <div className="text-gray-500">
                              / {promotion.maxUses.toLocaleString()}
                            </div>
                          )}
                        </div>
                        {promotion.maxUses && (
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{
                                width: `${Math.min(
                                  (promotion.currentUses / promotion.maxUses) *
                                    100,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(promotion.status)}>
                          {promotion.status.toUpperCase()}
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
                                  Are you sure you want to delete "
                                  {promotion.name}"? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(promotion.id)}
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
        </Card>

        {/* Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Promotion Performance</span>
                <Select defaultValue="90days">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">7 days</SelectItem>
                    <SelectItem value="30days">30 days</SelectItem>
                    <SelectItem value="90days">90 days</SelectItem>
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between">
                {/* Mock chart data */}
                {[
                  "SUMMER24",
                  "WELCOME15",
                  "FREESHIP",
                  "FLASH50",
                  "VALENTINE",
                  "BLACKFRI",
                ].map((code, index) => (
                  <div key={code} className="flex flex-col items-center">
                    <div
                      className={`w-12 rounded-t-md bg-gradient-to-t ${
                        index % 6 === 0
                          ? "from-blue-400 to-blue-200"
                          : index % 6 === 1
                          ? "from-purple-400 to-purple-200"
                          : index % 6 === 2
                          ? "from-green-400 to-green-200"
                          : index % 6 === 3
                          ? "from-yellow-400 to-yellow-200"
                          : index % 6 === 4
                          ? "from-pink-400 to-pink-200"
                          : "from-red-400 to-red-200"
                      }`}
                      style={{ height: `${Math.random() * 150 + 50}px` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2 text-center">
                      {code}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Upcoming Promotions</span>
                <Button variant="ghost" size="sm" className="text-indigo-600">
                  <IconPlus className="mr-1 h-4 w-4" />
                  Schedule
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {promotions
                  .filter((p) => p.status === "scheduled")
                  .slice(0, 3)
                  .map((promotion) => (
                    <div
                      key={promotion.id}
                      className="flex items-center p-4 border border-gray-100 rounded-lg"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-3">
                        <IconCalendar className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {promotion.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          Code: {promotion.code} •{" "}
                          {formatDate(promotion.startDate)}
                        </p>
                      </div>
                      <Badge className={getStatusBadge(promotion.status)}>
                        {promotion.status.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                {promotions.filter((p) => p.status === "scheduled").length ===
                  0 && (
                  <div className="text-center py-8 text-gray-500">
                    <IconCalendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No upcoming promotions scheduled</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
