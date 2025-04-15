"use client"
import { useRouter } from "next/navigation"
import { ChevronsUpDown, Plus, Folder, Home, Check } from "lucide-react"
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
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

import type { WorkspaceSwitcherProps } from "./types"
import { useWorkspaceIcon } from "./hooks"
import { useWorkspace } from "@/src/shared/sidebar/workspace-switcher/context/workspace-context"
import { dashboardHasWorkspaces, getWorkspaceType } from "@/lib/data-service"
import React from "react"

export function WorkspaceSwitcher({
  dashboardId,
  workspaces,
  activeWorkspaceId: propActiveWorkspaceId,
}: WorkspaceSwitcherProps) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const getWorkspaceIcon = useWorkspaceIcon()

  // Use the workspace context instead of props for active workspace
  const { activeWorkspaceId, setActiveWorkspaceId, goToDashboardHome } = useWorkspace()

  // Find the active workspace - use both context and URL
  const activeWorkspace = React.useMemo(() => {
    // First try to find by context ID
    if (activeWorkspaceId) {
      const workspace = workspaces.find((w) => w.id === activeWorkspaceId)
      if (workspace) return workspace
    }

    // If not found, try to find by URL param
    const params = new URLSearchParams(window.location.search)
    const urlWorkspaceId = window.location.pathname.split("/").pop()
    if (urlWorkspaceId) {
      const workspace = workspaces.find((w) => w.id === urlWorkspaceId)
      if (workspace) return workspace
    }

    return null
  }, [activeWorkspaceId, workspaces])

  // Handle workspace switching
  const handleWorkspaceSwitch = (workspaceId: string) => {
    console.log(`[workspace-switcher] Switching to workspace: ${workspaceId}`)

    // First update the context state
    setActiveWorkspaceId(workspaceId)

    // Store in localStorage immediately to ensure persistence
    localStorage.setItem(`dashboard:${dashboardId}:activeWorkspace`, workspaceId)

    // Then navigate to the workspace URL
    router.push(`/dashboard/${dashboardId}/${workspaceId}`)
  }

  // Handle going to dashboard home - this will clear the active workspace
  const handleGoToDashboardHome = () => {
    // Use the goToDashboardHome function from the workspace context
    goToDashboardHome()
  }

  // If no workspaces available, don't render the component
  if (!dashboardHasWorkspaces(dashboardId) || workspaces.length === 0) {
    return null
  }

  console.log("[workspace-switcher] Current activeWorkspaceId:", activeWorkspaceId)
  console.log("[workspace-switcher] Active workspace:", activeWorkspace?.name || "none")
  console.log("[workspace-switcher] Available workspaces:", workspaces.length)

  return (
    <SidebarGroup data-active-workspace={!!activeWorkspaceId}>
      <SidebarGroupLabel className="flex items-center justify-between">
        <span>{activeWorkspace ? `${activeWorkspace.name} Workspace` : "Workspaces"}</span>
        {activeWorkspaceId && (
          <Badge variant="outline" className="ml-2 text-xs bg-primary/10 text-primary">
            Active
          </Badge>
        )}
      </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className={cn(
                  "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
                  "transition-colors",
                  activeWorkspaceId ? "border-l-2 border-orange-500" : "",
                )}
              >
                {activeWorkspaceId ? (
                  <div className="flex aspect-square size-6 items-center justify-center rounded-md bg-orange-500/20 text-orange-500">
                    <Folder className="size-3.5" />
                  </div>
                ) : (
                  <div className="flex aspect-square size-6 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Folder className="size-3.5" />
                  </div>
                )}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <div className="flex items-center">
                    <span className={cn("truncate font-semibold", activeWorkspaceId ? "text-orange-500" : "")}>
                      {activeWorkspace ? activeWorkspace.name : "Select Workspace"}
                    </span>
                    {activeWorkspaceId && (
                      <Badge variant="outline" className="ml-2 h-4 text-[10px] bg-orange-500/10 text-orange-500">
                        Active
                      </Badge>
                    )}
                  </div>
                  <span
                    className={cn(
                      "truncate text-xs",
                      activeWorkspaceId ? "text-orange-500/70" : "text-muted-foreground",
                    )}
                  >
                    {activeWorkspaceId ? getWorkspaceType(activeWorkspaceId) : "No workspace selected"}
                  </span>
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
              <DropdownMenuLabel className="text-xs text-muted-foreground">Available Workspaces</DropdownMenuLabel>

              {workspaces.map((workspace, index) => {
                const WorkspaceIcon = getWorkspaceIcon(index, workspace.description)
                const isActive = workspace.id === activeWorkspaceId

                return (
                  <DropdownMenuItem
                    key={workspace.id}
                    onClick={() => handleWorkspaceSwitch(workspace.id)}
                    className={cn("gap-2 p-2", isActive && "bg-accent text-accent-foreground font-medium")}
                  >
                    <div
                      className={cn(
                        "flex size-5 items-center justify-center rounded-sm border",
                        isActive && "border-orange-500/50 bg-orange-500/10",
                      )}
                    >
                      <WorkspaceIcon className={cn("size-3.5 shrink-0", isActive && "text-orange-500")} />
                    </div>
                    <div className="flex-1 flex items-center">
                      <span className={cn("truncate", isActive && "text-orange-500")}>{workspace.name}</span>
                      {isActive && (
                        <Badge variant="outline" className="ml-2 h-4 text-[10px] bg-orange-500/10 text-orange-500">
                          Active
                        </Badge>
                      )}
                    </div>
                    {isActive && <Check className="ml-auto h-4 w-4 text-orange-500" />}
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                )
              })}

              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-5 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-3.5" />
                </div>
                <div className="font-medium text-muted-foreground">Create Workspace</div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              {/* Dashboard Home Option */}
              <DropdownMenuItem
                onClick={handleGoToDashboardHome}
                className={cn("gap-2 p-2", !activeWorkspaceId && "bg-accent text-accent-foreground font-medium")}
              >
                <div
                  className={cn(
                    "flex size-5 items-center justify-center rounded-sm border",
                    !activeWorkspaceId && "border-primary/50 bg-primary/10",
                  )}
                >
                  <Home className="size-3.5 shrink-0" />
                </div>
                <span>Dashboard Home</span>
                {!activeWorkspaceId && <Check className="ml-auto h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
