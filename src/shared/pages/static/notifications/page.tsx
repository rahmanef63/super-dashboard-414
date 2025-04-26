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
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle, Clock, AlertCircle } from "lucide-react"

export default function DashboardNotificationsPage({
  params,
}: {
  params: { dashboard: string }
}) {
  const dashboardId = params.dashboard
  const dashboard = getDashboardById(dashboardId)

  if (!dashboard) {
    notFound()
  }

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: "New workspace added",
      description: "Marketing Agency workspace has been added to your dashboard",
      date: "2 hours ago",
      type: "info",
      read: false,
    },
    {
      id: 2,
      title: "Task completed",
      description: "The task 'Update project timeline' has been marked as complete",
      date: "Yesterday",
      type: "success",
      read: false,
    },
    {
      id: 3,
      title: "Meeting reminder",
      description: "You have a team meeting scheduled in 30 minutes",
      date: "Yesterday",
      type: "warning",
      read: true,
    },
    {
      id: 4,
      title: "System update",
      description: "The system will be undergoing maintenance on Friday at 11 PM",
      date: "3 days ago",
      type: "info",
      read: true,
    },
    {
      id: 5,
      title: "Payment due",
      description: "Your subscription payment is due in 2 days",
      date: "4 days ago",
      type: "error",
      read: true,
    },
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
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
                <BreadcrumbPage>Notifications</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with the latest activities and alerts.</p>
          </div>
          <Button variant="outline">Mark all as read</Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Notifications</CardTitle>
                <CardDescription>View all your recent notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-3 rounded-lg ${notification.read ? "bg-background" : "bg-muted"}`}
                  >
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${notification.read ? "" : "font-semibold"}`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Unread Notifications</CardTitle>
                <CardDescription>Notifications you haven't read yet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications
                  .filter((n) => !n.read)
                  .map((notification) => (
                    <div key={notification.id} className="flex items-start gap-4 p-3 rounded-lg bg-muted">
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="read" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Read Notifications</CardTitle>
                <CardDescription>Notifications you've already seen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications
                  .filter((n) => n.read)
                  .map((notification) => (
                    <div key={notification.id} className="flex items-start gap-4 p-3 rounded-lg bg-background">
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <h3 className="font-medium">{notification.title}</h3>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
