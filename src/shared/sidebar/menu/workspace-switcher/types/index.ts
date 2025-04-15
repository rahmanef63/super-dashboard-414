export interface WorkspaceSwitcherProps {
  dashboardId: string
  workspaces: Workspace[]
  activeWorkspaceId?: string
}

export interface Workspace {
  id: string
  name: string
  description: string | null
  icon?: string
  dashboard_id: string
}

export interface WorkspaceItemProps {
  workspace: Workspace
  isActive: boolean
  index: number
  onSelect: (workspaceId: string) => void
}

export interface WorkspaceDropdownProps {
  workspaces: Workspace[]
  activeWorkspace?: Workspace | null
  activeWorkspaceId?: string
  dashboardId: string
  onWorkspaceSwitch: (workspaceId: string) => void
  onDashboardHome: () => void
  isMobile: boolean
}

export interface WorkspaceOption {
  id: string
  name: string
  description?: string
  icon?: string
}
