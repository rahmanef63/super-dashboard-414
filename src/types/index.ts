// Central type exports for the app

// --- PAGE CONTEXT & PARAMS TYPES ---
/**
 * Shared context for all pages (dynamic and static), slices, and loaders.
 * Extend as needed for new params.
 */
export interface PageContext {
  dashboardId: string;
  workspaceId?: string;
  menuId?: string;
  // Add more shared context keys as needed
  [key: string]: any;
}

/**
 * Props for slice loader components (dynamic/static).
 * Always use this for consistency and scalability.
 */
export interface SliceLoaderProps {
  sliceName: string;
  context: PageContext;
}

/**
 * Props for feature loader components (dynamic/static).
 * Always use this for consistency and scalability.
 */
export interface FeatureLoaderProps {
  feature: string;
  context: PageContext;
  params?: Record<string, any>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  // Add any other fields needed globally
}

import type { Dashboard, DashboardAssignment, Workspace } from "@prisma/client";
export type { Workspace } from "@prisma/client";

export type DashboardAssignmentWithDashboard = DashboardAssignment & {
  dashboard: Dashboard & { workspaces?: Workspace[] };
};
export interface UIDashboard {
  id: string;
  name: string;
  description: string | null;
  organizationId: string | null;
  createdById: string | null;
  createdAt: Date;
  workspaces: Workspace[];
}

// --- WORKSPACE SWITCHER TYPES ---
export interface WorkspaceSwitcherProps {
  dashboardId: string;
  workspaces: Workspace[];
  activeWorkspaceId?: string;
}

export interface WorkspaceItemProps {
  workspace: Workspace;
  isActive: boolean;
  index: number;
  onSelect: (workspaceId: string) => void;
}

export interface WorkspaceDropdownProps {
  workspaces: Workspace[];
  activeWorkspace?: Workspace | null;
  activeWorkspaceId?: string;
  dashboardId: string;
  onWorkspaceSwitch: (workspaceId: string) => void;
  onDashboardHome: () => void;
  isMobile: boolean;
}

export interface WorkspaceOption {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface WorkspaceContextType {
  activeWorkspaceId: string | undefined;
  setActiveWorkspaceId: (id: string | undefined) => void;
  dashboardId: string | undefined;
  isWorkspaceView: boolean;
  goToDashboardHome: () => void;
}

export interface WorkspacePlaceholderProps {
  workspaceName: string;
  isLoading?: boolean;
}

export type { FeatureManifest } from "@/shared/pages/types/manifest";
export type * from "@/shared/sidebar/app-sidebar/types";
export type { MenuUsage } from "@/shared/sidebar/types";
export type { User as DataServiceUser } from "@/shared/sidebar/app-sidebar/types";
