"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconPlus, IconLoader2 } from "@tabler/icons-react";
import type { ProductFormData, Category } from "./types";

interface ProductCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ProductFormData;
  onFormDataChange: (data: ProductFormData) => void;
  categories: Category[];
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
}

export function ProductCreateDialog({
  open,
  onOpenChange,
  formData,
  onFormDataChange,
  categories,
  onSubmit,
  loading = false,
}: ProductCreateDialogProps) {
  const updateFormData = (
    key: keyof ProductFormData,
    value: string | number | boolean
  ) => {
    onFormDataChange({ ...formData, [key]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <IconPlus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Add a new product to your inventory. Fill in all the required
            details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name</Label>
                <Input
                  id="product-name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-category">Category</Label>
                <Select
                  value={formData.categoryId.toString()}
                  onValueChange={(value) =>
                    updateFormData("categoryId", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem
                        key={category.categoryId}
                        value={category.categoryId.toString()}
                      >
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
                  onChange={(e) =>
                    updateFormData("price", parseFloat(e.target.value) || 0)
                  }
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
                  onChange={(e) =>
                    updateFormData("stock", parseInt(e.target.value) || 0)
                  }
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
                onChange={(e) => updateFormData("description", e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="product-available"
                checked={formData.isAvailable}
                onChange={(e) =>
                  updateFormData("isAvailable", e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="product-available">Available for purchase</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
