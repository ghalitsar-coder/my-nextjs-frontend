"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { refreshUserData } from "@/components/Header";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const handleRedirect = async () => {
      if (session?.user) {
        try {
          // Get user session with role from our API
          const sessionResponse = await fetch("/api/session");
          let userRole = "customer"; // default

          if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json();
            userRole = sessionData.user?.role || "customer";
          } // Set role cookie for middleware
          try {
            const roleResponse = await fetch("/api/set-role", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ role: userRole }),
            });

            if (roleResponse.ok) {
              console.log(
                `[Callback] Role cookie set successfully for role: ${userRole}`
              );
            } else {
              console.error(
                "[Callback] Failed to set role cookie:",
                await roleResponse.text()
              );
            }
          } catch (error) {
            console.error("Error setting role cookie:", error);
          }

          // Refresh header user data
          refreshUserData();

          // Wait for cookie to be set
          await new Promise((resolve) => setTimeout(resolve, 500));
          // Redirect based on role
          // Use window.location.href to ensure browser reload and middleware gets updated cookies
          console.log(`[Callback] Redirecting user with role: ${userRole}`);
          switch (userRole) {
            case "admin":
              window.location.href = "/dashboard/admin";
              break;
            case "cashier":
              window.location.href = "/dashboard/cashier";
              break;
            case "customer":
            default:
              window.location.href = "/";
              break;
          }
        } catch (error) {
          console.error("Error in callback:", error);
          refreshUserData();
          router.replace("/");
        }
      } else {
        // If no session, redirect to login
        router.replace("/login");
      }
    };

    // Wait a moment for session to be established
    const timer = setTimeout(handleRedirect, 800);
    return () => clearTimeout(timer);
  }, [session, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
