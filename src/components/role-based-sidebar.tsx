"use client";

import * as React from "react";
import { useEffect } from "react";
import Link from "next/link";
import {
  IconChartBar,
  IconDashboard,
  IconUsers,
  IconPackage,
  IconCash,
  IconReceipt,
  IconSettings,
  IconClipboardList,
  IconCreditCard,
  IconHistory,
  IconShoppingBag,
  IconCoffee,
  IconTag,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";

// Admin navigation - full access
const adminNavigation = [
  {
    title: "Dashboard",
    url: "/dashboard/admin",
    icon: IconDashboard,
  },
  {
    title: "Sales Analytics",
    url: "/dashboard/admin/analytics",
    icon: IconChartBar,
    items: [
      {
        title: "Daily Reports",
        url: "/dashboard/admin/analytics/daily",
      },
      {
        title: "Monthly Reports",
        url: "/dashboard/admin/analytics/monthly",
      },
      {
        title: "Product Performance",
        url: "/dashboard/admin/analytics/products",
      },
    ],
  },
  {
    title: "User Management",
    url: "/dashboard/admin/users",
    icon: IconUsers,
    items: [
      {
        title: "All Users",
        url: "/dashboard/admin/users",
      },
      {
        title: "Cashiers",
        url: "/dashboard/admin/users/cashiers",
      },
      {
        title: "Customers",
        url: "/dashboard/admin/users/customers",
      },
    ],
  },
  {
    title: "Product Management",
    url: "/dashboard/admin/products",
    icon: IconPackage,
    items: [
      {
        title: "All Products",
        url: "/dashboard/admin/products",
      },
      {
        title: "Categories",
        url: "/dashboard/admin/products/categories",
      },
      {
        title: "Inventory",
        url: "/dashboard/admin/products/inventory",
      },
    ],  },
  {
    title: "Promotions",
    url: "/dashboard/admin/promotions",
    icon: IconTag,
    items: [
      {
        title: "All Promotions",
        url: "/dashboard/admin/promotions",
      },
      {
        title: "Active Campaigns",
        url: "/dashboard/admin/promotions/active",
      },
      {
        title: "Scheduled",
        url: "/dashboard/admin/promotions/scheduled",
      },
    ],
  },
  {
    title: "Order Management",
    url: "/dashboard/admin/orders",
    icon: IconClipboardList,
    items: [
      {
        title: "All Orders",
        url: "/dashboard/admin/orders",
      },
      {
        title: "Pending Orders",
        url: "/dashboard/admin/orders/pending",
      },
      {
        title: "Completed Orders",
        url: "/dashboard/admin/orders/completed",
      },
    ],
  },
  {
    title: "Payment Management",
    url: "/dashboard/admin/payments",
    icon: IconCreditCard,
    items: [
      {
        title: "All Payments",
        url: "/dashboard/admin/payments",
      },
      {
        title: "Failed Payments",
        url: "/dashboard/admin/payments/failed",
      },
      {
        title: "Refunds",
        url: "/dashboard/admin/payments/refunds",
      },
    ],
  },
  {
    title: "System Settings",
    url: "/dashboard/admin/settings",
    icon: IconSettings,
    items: [
      {
        title: "General Settings",
        url: "/dashboard/admin/settings/general",
      },
      {
        title: "Payment Settings",
        url: "/dashboard/admin/settings/payment",
      },
      {
        title: "Email Templates",
        url: "/dashboard/admin/settings/email",
      },
    ],
  },
];

// Cashier navigation - limited access
const cashierNavigation = [
  {
    title: "Dashboard",
    url: "/dashboard/cashier",
    icon: IconDashboard,
  },
  {
    title: "Point of Sale",
    url: "/dashboard/cashier/pos",
    icon: IconShoppingBag,
    items: [
      {
        title: "New Order",
        url: "/dashboard/cashier/pos/new",
      },
      {
        title: "Current Orders",
        url: "/dashboard/cashier/pos/current",
      },
    ],
  },
  {
    title: "Order History",
    url: "/dashboard/cashier/orders",
    icon: IconHistory,
    items: [
      {
        title: "Today's Orders",
        url: "/dashboard/cashier/orders/today",
      },
      {
        title: "Recent Orders",
        url: "/dashboard/cashier/orders/recent",
      },
    ],
  },
  {
    title: "Products",
    url: "/dashboard/cashier/products",
    icon: IconCoffee,
    items: [
      {
        title: "Menu Items",
        url: "/dashboard/cashier/products/menu",
      },
      {
        title: "Stock Check",
        url: "/dashboard/cashier/products/stock",
      },
    ],
  },
  {
    title: "Payments",
    url: "/dashboard/cashier/payments",
    icon: IconCash,
    items: [
      {
        title: "Cash Payments",
        url: "/dashboard/cashier/payments/cash",
      },
      {
        title: "Digital Payments",
        url: "/dashboard/cashier/payments/digital",
      },
    ],
  },
  {
    title: "Daily Reports",
    url: "/dashboard/cashier/reports",
    icon: IconReceipt,
    items: [
      {
        title: "Sales Summary",
        url: "/dashboard/cashier/reports/sales",
      },
      {
        title: "Transaction Log",
        url: "/dashboard/cashier/reports/transactions",
      },    ],
  },
];

interface RoleBasedSidebarProps {
  variant?: "inset" | "sidebar" | "floating";
}

interface UserWithRole {
  id: string;
  name: string;
  email: string;
  username?: string;
  phone_number?: string;
  address?: string;
  role?: string;
  emailVerified?: boolean;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: unknown;
}

export function RoleBasedSidebar({
  variant = "sidebar",
}: RoleBasedSidebarProps) {
  const { data: session, isPending } = useSession();
 
  console.log(`User role:`, session?.user?.role);
  // Default navigation while loading
  const defaultNavigation = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
  ];
  // Determine navigation based on user role
  const getNavigationByRole = () => {
    if (isPending) {
      return defaultNavigation; // Show default while loading
    }

    if (!session?.user) {
      return defaultNavigation; // Show default if no session
    }

    // Handle different possible role field names
    const user = session.user as UserWithRole;
    const userRole = user.role || "customer";    console.log(`Determined user role: ${userRole}`);

    switch (userRole) {
      case "admin":
        return adminNavigation;
      case "cashier":
        return cashierNavigation;
      default:
        return defaultNavigation; // Default for unknown roles
    }
  };
  const navigationData = getNavigationByRole();
  const user = session?.user as UserWithRole;
  const userRole = user?.role || "guest";

  // Loading state for sidebar
  if (isPending) {
    return (
      <Sidebar variant={variant}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <div className="animate-pulse">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-200">
                    <IconCoffee className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <div className="h-4 bg-gray-200 rounded truncate"></div>
                    <div className="h-3 bg-gray-200 rounded truncate mt-1"></div>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <div className="p-4 space-y-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-8 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </SidebarContent>
        <SidebarFooter>
          <div className="p-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </SidebarFooter>
      </Sidebar>
    );
  }

  return (
    <Sidebar variant={variant}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <IconCoffee className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Coffee Haven</span>
                  <span className="truncate text-xs capitalize">
                    {userRole} Dashboard
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navigationData} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name || "Guest",
            email: user?.email || "",
            avatar: "/avatars/default.jpg",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
