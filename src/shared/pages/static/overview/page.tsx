import type React from "react"
import { getDashboardById } from "@/lib/data-service"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SliceLoader } from "@/shared/pages/_components/page-loader"
import { SliceLoaderFallback } from "@/shared/pages/_components/page-loader-fallback"

export default function OverviewPage({
  params,
}: {
  params: { dashboard: string }
}) {
  console.log(`[app/(dashboard)/dashboard/[dashboard]/overview/page.tsx] OverviewPage rendering with params:`, params)

  try {
    const dashboardId = params.dashboard
    console.log(`[app/(dashboard)/dashboard/[dashboard]/overview/page.tsx] Fetching dashboard with ID: ${dashboardId}`)
    const dashboard = getDashboardById(dashboardId)

    if (!dashboard) {
      console.log(
        `[app/(dashboard)/dashboard/[dashboard]/overview/page.tsx] Dashboard not found for ID: ${dashboardId}`,
      )
      notFound()
    }

    console.log(`[app/(dashboard)/dashboard/[dashboard]/overview/page.tsx] Rendering overview page`)
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{dashboard.name} Overview</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>Key metrics and information</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Dashboard overview content for {dashboard.name}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <p>No recent activity to display</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>View settings</li>
                <li>Check notifications</li>
                <li>Update profile</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Load the Overview slice if available */}
        <ErrorBoundary
          fallback={
            <SliceLoaderFallback sliceName="overview" context={{ dashboardId: dashboard.id, menuId: "overview" }} />
          }
        >
          <SliceLoader
            sliceName="overview"
            context={{
              dashboardId: dashboard.id,
              menuId: "overview",
            }}
          />
        </ErrorBoundary>
      </div>
    )
  } catch (error) {
    console.error("[app/(dashboard)/dashboard/[dashboard]/overview/page.tsx] Error in OverviewPage:", error)
    // Provide a fallback UI in case of error
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Overview Error</h1>
        <p className="text-muted-foreground">There was an error loading the overview content.</p>
      </div>
    )
  }
}

// Simple error boundary component
function ErrorBoundary({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  try {
    return <>{children}</>
  } catch (error) {
    console.error("Error in ErrorBoundary:", error)
    return <>{fallback}</>
  }
}
