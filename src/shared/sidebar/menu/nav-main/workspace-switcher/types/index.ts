import type { SidebarBaseProps, Workspace } from '../../../../types';

/**
 * Props for WorkspaceSwitcher menu. Extends SidebarBaseProps for DRYness.
 * - workspaces: List of available workspaces
 * - currentWorkspace: The currently selected workspace
 * - dashboardId: (optional) The dashboard context (if needed)
 * - activeWorkspaceId: (optional) The currently active workspace id, if controlled externally
 */
export interface WorkspaceSwitcherProps extends SidebarBaseProps {
  workspaces: Workspace[];
  currentWorkspace: Workspace;
  dashboardId?: string;
  activeWorkspaceId?: string;
}
