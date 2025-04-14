import type { LucideIcon } from "lucide-react"

// Base menu item interface
export interface BaseMenuItem {
  id: string
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
}

// Menu item with children
export interface MenuItemWithChildren extends BaseMenuItem {
  items?: BaseMenuItem[]
  workspaceId?: string
}

// Menu context for dashboard or workspace
export interface MenuContext {
  dashboardId: string
  workspaceId?: string
  menuId?: string
  userId?: string
}

// Menu configuration
export interface MenuConfig {
  showLabel?: boolean
  title?: string
  emptyMessage?: string
}

// Menu data structure
export interface MenuData {
  title: string
  description: string
  items: MenuDataItem[]
}

// Menu data item
export interface MenuDataItem {
  id: string
  title: string
  description?: string
  value?: number | string
  status?: "pending" | "completed" | "failed"
  date?: string
  icon?: string
}

// Menu builder options
export interface MenuBuilderOptions {
  includeParents?: boolean
  sortByOrder?: boolean
  filterByType?: string[]
}

// Menu route params
export interface DashboardMenuParams {
  dashboard: string
  dashboard_menu: string
}

export interface WorkspaceMenuParams {
  dashboard: string
  workspace: string
  workspace_menu: string
}
