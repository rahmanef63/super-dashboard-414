"use client"

import { MenuHeader } from "./menu-header"
import { MenuContent } from "./menu-content"
import { useMenuContext } from "../hooks/use-menu-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { getDashboardById, getWorkspaceById, getMenuItemById } from "@/lib/data-service"

export function MenuPage() {
  const { dashboardId, workspaceId, menuId } = useMenuContext()

  // Get entity details
  const dashboard = dashboardId ? getDashboardById(dashboardId) : null
  const workspace = workspaceId ? getWorkspaceById(workspaceId) : null
  const menuItem = menuId ? getMenuItemById(menuId) : null

  // Handle missing dashboard
  if (!dashboard) {
    return (
      <>
        <MenuHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle>Dashboard Not Found</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p>The dashboard "{dashboardId}" doesn't exist.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Please select a valid dashboard from the sidebar or contact your administrator.
              </p>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  // Handle missing workspace if in workspace context
  if (workspaceId && !workspace) {
    return (
      <>
        <MenuHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle>Workspace Not Found</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                The workspace "{workspaceId}" doesn't exist in dashboard "{dashboard.name}".
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Please select a valid workspace from the sidebar or contact your administrator.
              </p>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  // Handle missing menu item
  if (menuId && !menuItem) {
    return (
      <>
        <MenuHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle>Menu Item Not Found</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                The menu item "{menuId}" doesn't exist{" "}
                {workspace ? `in workspace "${workspace.name}".` : `in dashboard "${dashboard.name}".`}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Please select a valid menu item from the sidebar or contact your administrator.
              </p>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  // Render the menu page
  return (
    <>
      <MenuHeader />
      <MenuContent />
    </>
  )
}
