// Utility functions for order history components
import { format, isValid, parseISO } from "date-fns";
import { statusConfig, type OrderStatus } from "./types";

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

export const formatDate = (dateString?: string) => {
  if (!dateString) return "Unknown Date";
  try {
    // Remove microseconds if present
    const cleanedDateString = dateString.replace(/(\.\d{3})\d+/, "$1");
    const date = parseISO(cleanedDateString);
    if (!isValid(date)) return "Invalid Date";
    return format(date, "dd MMM yyyy, HH:mm");
  } catch {
    console.error("Failed to parse date:", dateString);
    return "Invalid Date";
  }
};

export const getStatusInfo = (status: string) => {
  return statusConfig[status as OrderStatus] || statusConfig.PENDING;
};
