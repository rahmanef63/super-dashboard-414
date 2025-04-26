import type { SidebarBaseProps, Dashboard, Workspace, User, MenuUsage, BaseMenuItem } from '../../types';
import type { ComponentProps } from 'react';
import type { Sidebar } from '@/components/ui/sidebar';

/**
 * AppSidebarProps extends SidebarBaseProps for DRYness and consistency.
 * Use this as the main props shape for the AppSidebar component.
 */
export interface AppSidebarProps extends SidebarBaseProps, ComponentProps<typeof Sidebar> {
  userDashboards: Dashboard[];
  currentDashboard: Dashboard | null;
  workspaces: Workspace[];
  menuUsages: MenuUsage[];
  user: User;
}

// Export User type for central barrel import
export type { User } from '@/types';
// Export MenuItem as BaseMenuItem from ../../types
export type { BaseMenuItem as MenuItem } from '../../types';

