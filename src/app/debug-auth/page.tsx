"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DebugInfo {
  authenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
  roleFromBackend: string | null;
  sessionUser: {
    id: string;
    email: string;
    name?: string;
    image?: string;
  } | null;
  hasSession: boolean;
  error?: string;
}

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDebugInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/debug/role");
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      console.error("Error fetching debug info:", error);
      setDebugInfo({
        authenticated: false,
        user: null,
        roleFromBackend: null,
        sessionUser: null,
        hasSession: false,
        error: "Failed to fetch debug info",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebugInfo();
  }, []);

  const checkCookies = () => {
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [name, value] = cookie.split("=").map((c) => c.trim());
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);

    console.log("Available cookies:", cookies);
    alert("Check console for cookie information");
  };
  const testRoleEndpoint = async () => {
    try {
      const response = await fetch("/api/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: debugInfo?.roleFromBackend || "customer",
        }),
      });

      if (response.ok) {
        alert("Role cookie set successfully!");
      } else {
        const error = await response.text();
        alert(`Failed to set role cookie: ${error}`);
      }
    } catch (error) {
      alert(`Error setting role cookie: ${error}`);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Debug Authentication & Role</h1>

      <div className="flex gap-4">
        <Button onClick={fetchDebugInfo} disabled={loading}>
          {loading ? "Loading..." : "Refresh Debug Info"}
        </Button>
        <Button onClick={checkCookies} variant="outline">
          Check Cookies (Console)
        </Button>
        {debugInfo?.roleFromBackend && (
          <Button onClick={testRoleEndpoint} variant="outline">
            Test Set Role Cookie
          </Button>
        )}
      </div>

      {debugInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Authenticated:</strong>{" "}
                <Badge
                  variant={debugInfo.authenticated ? "default" : "destructive"}
                >
                  {debugInfo.authenticated ? "Yes" : "No"}
                </Badge>
              </div>
              <div>
                <strong>Has Session:</strong>{" "}
                <Badge
                  variant={debugInfo.hasSession ? "default" : "destructive"}
                >
                  {debugInfo.hasSession ? "Yes" : "No"}
                </Badge>
              </div>
              <div>
                <strong>Role from Backend:</strong>{" "}
                <Badge variant="outline">
                  {debugInfo.roleFromBackend || "None"}
                </Badge>
              </div>
              <div>
                <strong>User Email:</strong>{" "}
                <span className="text-sm">
                  {debugInfo.user?.email || "None"}
                </span>
              </div>
            </div>

            {debugInfo.error && (
              <div className="text-red-600 text-sm">
                <strong>Error:</strong> {debugInfo.error}
              </div>
            )}

            <div className="space-y-2">
              <strong>Full User Data:</strong>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                {JSON.stringify(debugInfo.user, null, 2)}
              </pre>
            </div>

            <div className="space-y-2">
              <strong>Session User Data:</strong>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                {JSON.stringify(debugInfo.sessionUser, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Test Navigation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => (window.location.href = "/")}>
              Home (Customer)
            </Button>
            <Button
              size="sm"
              onClick={() => (window.location.href = "/order-history")}
            >
              Order History (Customer)
            </Button>
            <Button
              size="sm"
              onClick={() => (window.location.href = "/profile")}
            >
              Profile (Customer)
            </Button>
            <Button
              size="sm"
              onClick={() => (window.location.href = "/dashboard/admin")}
            >
              Admin Dashboard
            </Button>
            <Button
              size="sm"
              onClick={() => (window.location.href = "/dashboard/cashier")}
            >
              Cashier Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
