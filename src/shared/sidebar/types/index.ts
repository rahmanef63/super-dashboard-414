import React from 'react';
import type { LucideIcon } from 'lucide-react';

// --- GLOBAL SIDEBAR TYPES ---
// All sidebar-related types should be defined or re-exported here for DRYness and easy extension.
// Subcomponents (e.g., nav-main, nav-user, switchers) should import from this file and extend as needed.

// Generic base props for any sidebar component
export interface SidebarBaseProps {
  /** Optional className for styling */
  className?: string;
  /** Optional children for nested rendering */
  children?: React.ReactNode;
  /** Optional identifier for the sidebar instance */
  id?: string;
}

// --- GLOBAL TYPES ---
export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  icon?: string;
  dashboardId: string;
  createdAt: Date;
  dashboard_id?: string;
}

export interface Dashboard {
  id: string;
  name: string;
  workspaces: Workspace[];
  // ... other dashboard properties
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

export interface Page {
  id: string;
  name: string;
  type: 'static' | 'dynamic';
  component: React.ComponentType;
}

// --- MENU ITEM TYPES ---
/**
 * BaseMenuItem is the core type for any sidebar menu item.
 * Extend this in subcomponents for specialized menu types (e.g., NavMainMenuItem, NavUserMenuItem).
 */
export interface BaseMenuItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon | string;
  isActive?: boolean;
  target?: string;
  type?: string;
}

/**
 * MenuItemWithChildren extends BaseMenuItem for nested menu structures.
 * Extend or use directly for menus with sub-items.
 */
export interface MenuItemWithChildren extends BaseMenuItem {
  items?: BaseMenuItem[];
  workspaceId?: string | null;
}

/**
 * MenuUsage is used to track menu item usage/order.
 * Extend or use directly in menu switchers or analytics.
 */
export interface MenuUsage {
  menuItem?: BaseMenuItem;
  workspaceId?: string | null;
  orderIndex?: number;
}

// --- NAV TYPES ---
/**
 * NavItem is the base type for navigation items in the sidebar.
 * Extend for specialized nav menus (e.g., user, workspace, dashboard nav).
 */
export interface NavItem {
  title: string;
  url: string;
  icon?: string | LucideIcon;
  isActive?: boolean;
  workspaceId?: string | null;
  items?: {
    title: string;
    url: string;
    isActive?: boolean;
    workspaceId?: string | null;
  }[];
}

// --- DATA TYPES FOR COMPONENTS ---
// These types are for data passed into sidebar components, e.g., WorkspaceData, DashboardData, UserData.
// Extend or compose as needed for custom sidebar modules.
export interface WorkspaceData {
  name: string;
  logo: React.ElementType;
}
export interface DashboardData {
  dashboard?: string;
  name: string;
  logo: React.ElementType;
  plan: string;
}
export interface UserData {
  name: string;
  email: string;
  avatar?: string | null;
}

// --- MENU DATA STRUCTURES ---
// Used for representing menu data (static or dynamic) in the sidebar.
// Extend or compose for advanced menu structures.
export interface MenuData {
  title: string;
  description: string;
  items: MenuDataItem[];
}
export interface MenuDataItem {
  id: string;
  title: string;
  description?: string;
  value?: number | string;
  status?: 'pending' | 'completed' | 'failed';
  date?: string;
  icon?: string;
}
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
