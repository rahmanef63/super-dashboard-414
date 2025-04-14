"use client"

import type React from "react"
import {
  SidebarProvider as BaseSidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { getDashboards } from "@/lib/data-service"
import { LayoutDashboard, Settings, Bell, Home } from "lucide-react"

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // In a real app, you would get this from cookies on the server
  const defaultOpen = true
  const dashboards = getDashboards()

  return (
    <BaseSidebarProvider defaultOpen={defaultOpen}>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {dashboards.map((dashboard) => (
              <SidebarMenuItem key={dashboard.id}>
                <SidebarMenuButton asChild>
                  <Link href={`/dashboard/${dashboard.id}`} className="flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>{dashboard.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/settings" className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/notifications" className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      {children}
    </BaseSidebarProvider>
  )
}
