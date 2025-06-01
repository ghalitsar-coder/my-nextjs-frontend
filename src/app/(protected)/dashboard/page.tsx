"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session?.user) {
      // Redirect based on user role
      const user = session.user as any;
      const userRole = user.role || "customer";

      switch (userRole) {
        case "admin":
          router.push("/dashboard/admin");
          break;
        case "cashier":
          router.push("/dashboard/cashier");
          break;
        default:
          router.push("/"); // Redirect to home if not admin/cashier
          break;
      }
    } else if (!isPending && !session) {
      // Redirect to login if not authenticated
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Redirecting...
        </h1>
        <p className="text-gray-600">
          Please wait while we redirect you to your dashboard
        </p>
      </div>
    </div>
  );
}
