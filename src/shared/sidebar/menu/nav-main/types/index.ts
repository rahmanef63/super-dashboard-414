import type {
  BaseMenuItem,
  MenuItemWithChildren,
  MenuData,
  MenuDataItem,
  SidebarBaseProps,
  DashboardMenuParams as GlobalDashboardMenuParams,
  WorkspaceParams as GlobalWorkspaceParams
} from '../../../types';

/**
 * MenuContext extends SidebarBaseProps for nav-main context usage.
 * Use this as the main context shape for nav-main menu components.
 */
export interface MenuContext extends SidebarBaseProps {
  dashboardId: string;
  workspaceId?: string;
  menuId?: string;
  userId?: string;
}

import type { LucideIcon } from "lucide-react";

// Main menu item type
export type NavMenuItem = {
  title: string;
  url: string;
  icon?: string | LucideIcon;
  isActive?: boolean;
  items?: NavMenuItem[];
};

// Props for the NavMain component (and similar)
export interface NavMainProps {
  staticItems?: NavMenuItem[];
  dynamicItems?: NavMenuItem[];
  showStaticLabel?: boolean;
  showDynamicLabel?: boolean;
  staticTitle?: string;
  dynamicTitle?: string;
}

// (Retain any other types needed for menu config/building)
export interface MenuConfig {
  showLabel?: boolean;
  title?: string;
  emptyMessage?: string;
}

export interface MenuBuilderOptions {
  includeParents?: boolean;
  sortByOrder?: boolean;
  filterByType?: string[];
}

export type DashboardMenuParams = GlobalDashboardMenuParams & {
  dashboard_menu: string;
};

export type WorkspaceMenuParams = GlobalWorkspaceParams & {
  dashboard: string;
  workspace_menu: string;
};
