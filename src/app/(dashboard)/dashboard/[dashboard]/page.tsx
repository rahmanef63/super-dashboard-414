import type React from "react";
import {
  getDashboardById,
  getWorkspacesForDashboard,
  getMenuItemsForDashboard,
} from "@/lib/data-service";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, ArrowRight, Folder } from "lucide-react";
import type { DashboardParams } from "@/app/_types/dashboard";
import { SliceLoader } from "@/app/(dashboard)/_components/slice-loader";
import { SliceLoaderFallback } from "@/app/(dashboard)/_components/slice-loader-fallback";

export default function DashboardPage({
  params,
}: { params: DashboardParams }) {
  try {
    const dashboardId = params.dashboard;
    const dashboard = getDashboardById(dashboardId);

    if (!dashboard) {
      notFound();
    }

    const workspaces = getWorkspacesForDashboard(dashboardId);
    const menuItems = getMenuItemsForDashboard(dashboardId);

    // Check if the dashboard has an overview menu item
    const hasOverviewMenu = menuItems.some((item) => item.id === "overview");

    return (
      <>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{dashboard.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <h1 className="text-2xl font-bold">{dashboard.name}</h1>
          <p className="text-muted-foreground">{dashboard.description}</p>

          {/* Only load the Overview slice if the dashboard has an overview menu item */}
          {hasOverviewMenu ? (
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
          ) : (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Dashboard Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This dashboard doesn't have an overview section configured.</p>
              </CardContent>
            </Card>
          )}

          {/* Add a card for the structure mapping */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Dashboard Structure
              </CardTitle>
              <CardDescription>View the structure and relationships of this dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Explore the relationships between this dashboard, its workspaces, and menu items in a visual format.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href={`/dashboard/${dashboardId}/mapping`}>View Structure</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Workspaces Section */}
          {workspaces.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mt-4">Workspaces</h2>
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                {workspaces.map((workspace) => (
                  <Card key={workspace.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-md bg-primary/10">
                          <Folder className="h-4 w-4 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{workspace.name}</CardTitle>
                      </div>
                      <CardDescription>{workspace.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="text-2xl font-bold">
                        {/* Placeholder for workspace stats */}
                        {Math.floor(Math.random() * 10) + 1} Items
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full group">
                        <Link href={`/dashboard/${dashboardId}/${workspace.id}`}>
                          Open Workspace
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Menu Items Section */}
          {menuItems.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mt-4">Menu Items</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {menuItems.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardFooter>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href={`/dashboard/${dashboardId}/${item.id}`}>Open Menu</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* No workspaces or menu items message */}
          {workspaces.length === 0 && menuItems.length === 0 && (
            <div className="rounded-lg border p-6 bg-card text-card-foreground">
              <h3 className="text-lg font-semibold mb-2">Empty Dashboard</h3>
              <p className="text-muted-foreground mb-4">
                This dashboard doesn't have any workspaces or menu items configured.
              </p>
            </div>
          )}
        </div>
      </>
    );
  } catch (error) {
    console.error("[app/(dashboard)/dashboard/[dashboard]/page.tsx] Error in DashboardPage:", error);
    // Provide a fallback UI in case of error
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Dashboard Error</h1>
        <p className="text-muted-foreground">There was an error loading the dashboard content.</p>
      </div>
    );
  }
}

// Simple error boundary component
function ErrorBoundary({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("Error in ErrorBoundary:", error);
    return <>{fallback}</>;
  }
}