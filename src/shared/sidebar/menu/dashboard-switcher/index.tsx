"use client"
import { useRouter, useParams } from "next/navigation"
import { ChevronsUpDown, Plus, LayoutDashboard, Check, Briefcase } from "lucide-react"
import { SidebarDashboardPlaceholder } from "@/shared/sidebar/app-sidebar/components/sidebar-dashboard-placeholder"
import { cn } from "@/lib/utils"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

import type { DashboardSwitcherProps } from "./types"
import { useDashboards, useCurrentDashboard, mapLegacyDashboardsToUIDashboards } from "./hooks"
import { getWorkspacesForDashboard } from "@/lib/data-services/compatibility-layer"

export function DashboardSwitcher({ teams, dashboard }: DashboardSwitcherProps) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const params = useParams()
  const currentDashboardId = params?.dashboard as string

  // Get all available dashboards
  let allDashboards: ReturnType<typeof useDashboards> = [];
  let uiDashboards = [];
  try {
    allDashboards = useDashboards();
    // Convert legacy dashboards to UIDashboard[]
    uiDashboards = mapLegacyDashboardsToUIDashboards(allDashboards, getWorkspacesForDashboard);
    if (!uiDashboards || uiDashboards.length === 0) {
      throw new Error("No dashboards available");
    }
  } catch (err) {
    console.error("Failed to load dashboards:", err);
    return (
      <SidebarMenu>
      <SidebarMenuItem>
        <SidebarDashboardPlaceholder 
        icon={Briefcase} 
        title="Dashboard" 
        subtitle="Failed to load dashboards" />
      </SidebarMenuItem>
    </SidebarMenu>
    );
  }

  // Find the current dashboard
  const currentDashboard = useCurrentDashboard(uiDashboards, currentDashboardId);

  // Function to handle dashboard switching
  const handleDashboardSwitch = (dashboardId: string) => {
    console.log("Switching to dashboard:", dashboardId);
    router.push(`/dashboard/${dashboardId}`);
  };

  if (!currentDashboard) {
    console.error("No current dashboard found");
    return (
      <SidebarMenu>
      <SidebarMenuItem>
        <SidebarDashboardPlaceholder 
        icon={Briefcase} 
        title="Dashboard" 
        subtitle="No current dashboard found" />
      </SidebarMenuItem>
    </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
                "transition-colors",
              )}
            >
              <div className="flex aspect-square size-6 items-center justify-center rounded-md bg-primary/20 text-primary">
                <LayoutDashboard className="size-3.5" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex items-center">
                  <span className="truncate font-semibold">{currentDashboard.name}</span>
                  <Badge variant="outline" className="ml-2 h-4 text-[10px] bg-primary/10 text-primary">
                    Active
                  </Badge>
                </div>
                <span className="truncate text-xs text-muted-foreground">Active Dashboard</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 opacity-70" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">Available Dashboards</DropdownMenuLabel>
            {allDashboards.map((dashboard, index) => (
              <DropdownMenuItem
                key={dashboard.id}
                onClick={() => handleDashboardSwitch(dashboard.id)}
                className={cn(
                  "gap-2 p-2",
                  dashboard.id === currentDashboardId && "bg-accent text-accent-foreground font-medium",
                )}
              >
                <div
                  className={cn(
                    "flex size-5 items-center justify-center rounded-sm border",
                    dashboard.id === currentDashboardId && "border-primary/50 bg-primary/10",
                  )}
                >
                  <LayoutDashboard className="size-3.5 shrink-0" />
                </div>
                <div className="flex-1 flex items-center">
                  <span className="truncate">{dashboard.name}</span>
                  {dashboard.id === currentDashboardId && (
                    <Badge variant="outline" className="ml-2 h-4 text-[10px] bg-primary/10 text-primary">
                      Active
                    </Badge>
                  )}
                </div>
                {dashboard.id === currentDashboardId && <Check className="ml-auto h-4 w-4 text-primary" />}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-5 items-center justify-center rounded-md border bg-background">
                <Plus className="size-3.5" />
              </div>
              <div className="font-medium text-muted-foreground">Create Dashboard</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
