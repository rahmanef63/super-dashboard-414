import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getDashboardById } from "@/lib/data-service"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export default function DashboardSettingsPage({
  params,
}: {
  params: { dashboard: string }
}) {
  const dashboardId = params.dashboard
  const dashboard = getDashboardById(dashboardId)

  if (!dashboard) {
    notFound()
  }

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
                <BreadcrumbLink href={`/dashboard/${dashboardId}`}>{dashboard.name}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold">{dashboard.name} Dashboard Settings</h1>
        <p className="text-muted-foreground">Manage your dashboard preferences and configuration.</p>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="access">Access & Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Information</CardTitle>
                <CardDescription>Update your dashboard details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dashboard-name">Dashboard Name</Label>
                  <Input id="dashboard-name" defaultValue={dashboard.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dashboard-description">Description</Label>
                  <Input id="dashboard-description" defaultValue={dashboard.description || ""} />
                </div>
                <div className="flex items-center justify-between space-y-0">
                  <div className="space-y-0.5">
                    <Label htmlFor="default-dashboard">Set as Default Dashboard</Label>
                    <p className="text-sm text-muted-foreground">This dashboard will be shown when you first log in</p>
                  </div>
                  <Switch id="default-dashboard" defaultChecked={dashboardId === "professional"} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how your dashboard looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="justify-start">
                      <span className="mr-2 h-4 w-4 rounded-full bg-primary"></span>
                      Light
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <span className="mr-2 h-4 w-4 rounded-full bg-black"></span>
                      Dark
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <span className="mr-2 h-4 w-4 rounded-full bg-gradient-to-r from-primary to-black"></span>
                      System
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between space-y-0">
                  <div className="space-y-0.5">
                    <Label htmlFor="compact-view">Compact View</Label>
                    <p className="text-sm text-muted-foreground">Display more content with less spacing</p>
                  </div>
                  <Switch id="compact-view" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Control how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-y-0">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between space-y-0">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                  </div>
                  <Switch id="push-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between space-y-0">
                  <div className="space-y-0.5">
                    <Label htmlFor="digest-notifications">Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">Receive a weekly summary of activities</p>
                  </div>
                  <Switch id="digest-notifications" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Access & Permissions</CardTitle>
                <CardDescription>Manage who can access this dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Access Level</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="justify-start">
                      Private
                    </Button>
                    <Button variant="outline" className="justify-start">
                      Team
                    </Button>
                    <Button variant="outline" className="justify-start">
                      Public
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Currently set to: Private (Only you can access)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
