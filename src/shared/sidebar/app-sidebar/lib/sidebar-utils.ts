import { LayoutDashboard, Folder, Settings, User, Bell, FileText, Home, Activity, type LucideIcon } from "lucide-react";
import type { SectionIconType } from "../types/sidebar-components";
import type { NavItem } from "@/shared/sidebar/types";
import type { AppSidebarProps } from "@/shared/sidebar/app-sidebar/types";
import { getIconByName } from "@/shared/icon-picker/utils";

// Map of icon names to Lucide components for sections (legacy)
const SECTION_ICON_MAP: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  workspace: Folder,
  system: Settings,
  user: User,
  notification: Bell,
  settings: Settings,
  default: FileText,
};

// Central static icons for sidebar nav items
export const staticIcons: Record<string, LucideIcon> = {
  Home,
  LayoutDashboard,
  Activity,
  Settings,
  Bell,
};

/**
 * Get the icon component for a section (legacy)
 */
export function getIconForSection(icon: SectionIconType): LucideIcon {
  if (typeof icon === "function") {
    return icon;
  }
  return SECTION_ICON_MAP[icon] || SECTION_ICON_MAP.default;
}

/**
 * Generate a unique ID for a sidebar section
 */
export function generateSectionId(prefix: string, suffix?: string): string {
  const uniquePart = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${suffix || uniquePart}`;
}

/**
 * Transform MenuUsage[] to NavItem[] for dashboard and workspace menus.
 */
export const processMenuUsages = (
  menuUsages: AppSidebarProps['menuUsages'],
  pathname: string,
  currentDashboardId: string,
  activeWorkspaceId: string | null
): { dashboardNavItems: NavItem[]; workspaceNavItems: NavItem[] } => {
  const dashboardNavItems: NavItem[] = [];
  const workspaceNavItems: NavItem[] = [];
  if (!Array.isArray(menuUsages)) {
    console.warn("[processMenuUsages] menuUsages is not an array:", menuUsages);
    return { dashboardNavItems, workspaceNavItems };
  }
  menuUsages.forEach((usage) => {
    if (!usage.menuItem || !usage.menuItem.title || !usage.menuItem.target) {
      console.warn("[processMenuUsages] Skipping invalid menu usage:", usage);
      return;
    }
    const { title, target, icon: iconName, type } = usage.menuItem;
    const IconComponent = iconName && typeof iconName === "string" ? getIconByName(iconName) : undefined;
    const isWorkspaceItem = usage.workspaceId !== null;
    const baseHref = `/dashboard/${currentDashboardId}`;
    const workspaceHrefPart = isWorkspaceItem ? `/${usage.workspaceId}` : '';
    const url = `${baseHref}${workspaceHrefPart}/${target}`;
    const navItem: NavItem = {
      title: title,
      url: url,
      icon: IconComponent || staticIcons.LayoutDashboard,
      isActive: pathname.startsWith(url),
      workspaceId: usage.workspaceId,
      items: [],
    };
    if (isWorkspaceItem) {
      if (usage.workspaceId === activeWorkspaceId) {
        workspaceNavItems.push(navItem);
      }
    } else {
      dashboardNavItems.push(navItem);
    }
  });
  dashboardNavItems.sort((a, b) => (menuUsages.find(u => u.menuItem?.title === a.title && u.workspaceId === null)?.orderIndex ?? 0) - (menuUsages.find(u => u.menuItem?.title === b.title && u.workspaceId === null)?.orderIndex ?? 0));
  workspaceNavItems.sort((a, b) => (menuUsages.find(u => u.menuItem?.title === a.title && u.workspaceId === activeWorkspaceId)?.orderIndex ?? 0) - (menuUsages.find(u => u.menuItem?.title === b.title && u.workspaceId === activeWorkspaceId)?.orderIndex ?? 0));
  return { dashboardNavItems, workspaceNavItems };
};

// NOTE: If SECTION_ICON_MAP and getIconByName are both used for different purposes, keep both. Otherwise, consider consolidating icon logic.
