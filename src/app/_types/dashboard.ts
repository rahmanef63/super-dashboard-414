/**
 * Type definitions for dashboard route parameters
 */

export type DashboardParams = {
  dashboard: string
}

export type WorkspaceParams = DashboardParams & {
  workspace: string
}

export type MenuParams = WorkspaceParams & {
  menu: string
}

export type DashboardMenuParams = DashboardParams & {
  menu: string
}
