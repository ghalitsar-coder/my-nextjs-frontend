"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export function PaymentAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4" />
          <p>Advanced analytics and reporting features coming soon!</p>
          <p className="text-sm">
            This will include charts, trends, and detailed reports.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
