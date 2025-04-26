"use client"

import * as React from "react"
import { MenuHeader } from "../app-sidebar/components/page-header"
import { MenuContent } from "../app-sidebar/components/menu-content"
import { useMenuContext } from "./nav-main/hooks/use-menu-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import { getDashboardById, getWorkspaceById, getMenuItemById } from "@/lib/data-service"

export function MenuPage() {
  const { dashboardId, workspaceId, menuId } = useMenuContext()

  // Get entity details - use state to handle async data
  const [dashboard, setDashboard] = React.useState<any>(null)
  const [workspace, setWorkspace] = React.useState<any>(null)
  const [menuItem, setMenuItem] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  // Fetch data on component mount
  React.useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        if (dashboardId) {
          const dashboardData = await getDashboardById(dashboardId)
          setDashboard(dashboardData)
        }
        
        if (workspaceId) {
          const workspaceData = await getWorkspaceById(workspaceId)
          setWorkspace(workspaceData)
        }
        
        if (menuId) {
          const menuItemData = await getMenuItemById(menuId)
          setMenuItem(menuItemData)
        }
      } catch (error) {
        console.error('Error fetching menu page data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [dashboardId, workspaceId, menuId])

  // Show loading state
  if (loading) {
    return (
      <>
        <MenuHeader />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </>
    )
  }

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
