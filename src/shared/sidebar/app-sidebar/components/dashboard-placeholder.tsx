"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export function DashboardPlaceholder() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>No Dashboard Selected</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p>No dashboard is currently selected.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please select a dashboard from the sidebar or contact your administrator.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
