import React from 'react';
import { useDevTools } from "../dev-tools-provider"; // Assuming provider is one level up
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function SessionViewer() {
  const { currentUser } = useDevTools();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Session Information</CardTitle>
        <CardDescription>Details about the current user session.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentUser ? (
          <>
            <div className="space-y-1">
              <Label htmlFor="user-id">User ID</Label>
              <Input id="user-id" value={currentUser.id} readOnly />
            </div>
            <div className="space-y-1">
              <Label htmlFor="user-email">Email</Label>
              <Input id="user-email" value={currentUser.email} readOnly />
            </div>
            {/* Add more session details as needed */}
          </>
        ) : (
          <p>No active session.</p>
        )}
      </CardContent>
    </Card>
  );
}
