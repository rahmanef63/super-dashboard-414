"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MenuSliceProps {
  context: {
    dashboardId: string
    workspaceId?: string
    menuId?: string
  }
}

export default function MenuSlice({ context }: MenuSliceProps) {
  const { dashboardId, workspaceId, menuId } = context
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{menuId ? `${menuId.charAt(0).toUpperCase() + menuId.slice(1)} Menu` : "Generic Menu"}</CardTitle>
        <CardDescription>
          {workspaceId
            ? `Menu content for ${menuId} in workspace ${workspaceId}`
            : `Dashboard-level menu content for ${menuId}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Quick Stats</h3>
                <p className="text-muted-foreground text-sm">
                  This is a generic menu component that can be customized for each specific menu item.
                </p>
              </div>
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Recent Activity</h3>
                <p className="text-muted-foreground text-sm">No recent activity to display.</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="details">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Menu Details</h3>
              <p className="text-muted-foreground text-sm">
                Menu ID: {menuId || "None"}
                <br />
                Dashboard ID: {dashboardId}
                <br />
                Workspace ID: {workspaceId || "None"}
              </p>
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Menu Settings</h3>
              <p className="text-muted-foreground text-sm">No configurable settings available.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
