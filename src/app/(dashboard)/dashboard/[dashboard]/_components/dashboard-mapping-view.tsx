"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Folder, FileText, Tag } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { DashboardWorkspaceMenuMapping } from "@/lib/data-service"

interface DashboardMappingViewProps {
  mappings: DashboardWorkspaceMenuMapping[]
  title?: string
  description?: string
}

export function DashboardMappingView({
  mappings,
  title = "Dashboard Structure",
  description = "Visual representation of dashboards, workspaces, and menu items",
}: DashboardMappingViewProps) {
  // Group mappings by dashboard
  const dashboardGroups = mappings.reduce(
    (groups, mapping) => {
      const dashboardId = mapping.dashboard_id
      if (!groups[dashboardId]) {
        groups[dashboardId] = {
          id: dashboardId,
          name: mapping.dashboard_name,
          icon: mapping.dashboard_icon,
          workspaces: {},
          menuItems: [],
        }
      }

      // Add to workspaces if workspace exists
      if (mapping.workspace_id) {
        const workspaceId = mapping.workspace_id
        if (!groups[dashboardId].workspaces[workspaceId]) {
          groups[dashboardId].workspaces[workspaceId] = {
            id: workspaceId,
            name: mapping.workspace_name || "",
            description: mapping.workspace_description || "",
            menuItems: [],
          }
        }

        // Add menu item to workspace if it exists
        if (mapping.menu_id) {
          const existingMenuItem = groups[dashboardId].workspaces[workspaceId].menuItems.find(
            (item) => item.id === mapping.menu_id,
          )

          if (!existingMenuItem) {
            groups[dashboardId].workspaces[workspaceId].menuItems.push({
              id: mapping.menu_id,
              name: mapping.menu_name || "",
              type: mapping.menu_type || "MENU_ITEM",
              icon: mapping.menu_icon || null,
              parentId: mapping.parent_menu_id || null,
              path: mapping.target_path || null,
            })
          }
        }
      }
      // Add to dashboard menu items if no workspace but has menu
      else if (mapping.menu_id) {
        const existingMenuItem = groups[dashboardId].menuItems.find((item) => item.id === mapping.menu_id)

        if (!existingMenuItem) {
          groups[dashboardId].menuItems.push({
            id: mapping.menu_id,
            name: mapping.menu_name || "",
            type: mapping.menu_type || "MENU_ITEM",
            icon: mapping.menu_icon || null,
            parentId: mapping.parent_menu_id || null,
            path: mapping.target_path || null,
          })
        }
      }

      return groups
    },
    {} as Record<string, any>,
  )

  // Convert to array for rendering
  const dashboards = Object.values(dashboardGroups)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dashboards.map((dashboard: any) => (
            <DashboardNode key={dashboard.id} dashboard={dashboard} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function DashboardNode({ dashboard }: { dashboard: any }) {
  const [isOpen, setIsOpen] = useState(true)
  const workspaces = Object.values(dashboard.workspaces) as any[]
  const hasWorkspaces = workspaces.length > 0
  const hasMenuItems = dashboard.menuItems.length > 0

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="flex w-full items-center justify-start gap-2 p-2">
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="font-medium">{dashboard.name}</span>
          <Badge variant="outline" className="ml-2">
            Dashboard
          </Badge>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-6 space-y-2">
        {hasWorkspaces && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Workspaces</div>
            {workspaces.map((workspace) => (
              <WorkspaceNode key={workspace.id} workspace={workspace} />
            ))}
          </div>
        )}

        {hasMenuItems && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Dashboard Menu Items</div>
            {dashboard.menuItems.map((menuItem: any) => (
              <MenuItemNode key={menuItem.id} menuItem={menuItem} />
            ))}
          </div>
        )}

        {!hasWorkspaces && !hasMenuItems && (
          <div className="text-sm text-muted-foreground italic">No workspaces or menu items</div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

function WorkspaceNode({ workspace }: { workspace: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const hasMenuItems = workspace.menuItems.length > 0

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="flex w-full items-center justify-start gap-2 p-2 pl-4">
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <Folder className="h-4 w-4 text-muted-foreground" />
          <span>{workspace.name}</span>
          <Badge variant="outline" className="ml-2">
            Workspace
          </Badge>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-10 space-y-2">
        {hasMenuItems ? (
          workspace.menuItems.map((menuItem: any) => <MenuItemNode key={menuItem.id} menuItem={menuItem} />)
        ) : (
          <div className="text-sm text-muted-foreground italic">No menu items</div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

function MenuItemNode({ menuItem }: { menuItem: any }) {
  const getMenuItemIcon = () => {
    switch (menuItem.type) {
      case "GROUP_LABEL":
        return <Tag className="h-4 w-4 text-muted-foreground" />
      case "SUBMENU_ITEM":
        return <ChevronRight className="h-4 w-4 text-muted-foreground" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="flex items-center gap-2 p-2 pl-4">
      {getMenuItemIcon()}
      <span className="text-sm">{menuItem.name}</span>
      <Badge variant="outline" className="ml-2 text-xs">
        {menuItem.type}
      </Badge>
      {menuItem.parentId && <span className="text-xs text-muted-foreground ml-auto">Parent: {menuItem.parentId}</span>}
    </div>
  )
}
