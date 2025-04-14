import { getMenuItemById, getMenuItemsForDashboard, getMenuItemsForWorkspace } from "@/lib/data-service";
import { MENU_ICON_MAP } from "../constants";
import type { MenuItemWithChildren, MenuBuilderOptions } from "../types";

/**
 * Builds a menu structure for a dashboard
 */
export function buildDashboardMenu(
  dashboardId: string,
  currentPath: string,
  options: MenuBuilderOptions = {},
): MenuItemWithChildren[] {
  const { includeParents = true, sortByOrder = true } = options;

  // Get all menu items for this dashboard
  const menuItems = getMenuItemsForDashboard(dashboardId);

  // Filter root items (those without a parent)
  const rootItems = menuItems.filter((item) => !item.parent_id);

  // Map to the format expected by the UI components
  return rootItems.map((item) => {
    // Get icon for this menu item
    const IconComponent = MENU_ICON_MAP[item.id] || MENU_ICON_MAP.default;

    // Generate URL for this menu item
    const url = `/dashboard/${dashboardId}/${item.id}`; // Modified line

    // Check if this item is active based on the current path
    const isActive = currentPath.includes(url);

    // Find child items if needed
    let childItems: MenuItemWithChildren[] = [];

    if (includeParents) {
      // Find direct children of this menu item
      childItems = menuItems
        .filter((childItem) => childItem.parent_id === item.id)
        .map((childItem) => {
          const childUrl = `/dashboard/${dashboardId}/${childItem.id}`;
          const childIsActive = currentPath.includes(childUrl);

          return {
            id: childItem.id,
            title: childItem.name,
            url: childUrl,
            isActive: childIsActive,
          };
        });
    }

    return {
      id: item.id,
      title: item.name,
      url,
      icon: IconComponent,
      isActive,
      items: childItems,
    };
  });
}

/**
 * Builds a menu structure for a workspace
 */
export function buildWorkspaceMenu(
  dashboardId: string,
  workspaceId: string,
  currentPath: string,
  options: MenuBuilderOptions = {},
): MenuItemWithChildren[] {
  const { includeParents = true, sortByOrder = true } = options;

  // Get all menu items for this workspace
  const menuItems = getMenuItemsForWorkspace(workspaceId);

  // Filter root items (those without a parent)
  const rootItems = menuItems.filter((item) => !item.parent_id);

  // Map to the format expected by the UI components
  return rootItems.map((item) => {
    // Get icon for this menu item
    const IconComponent = MENU_ICON_MAP[item.id] || MENU_ICON_MAP.default;

    // Generate URL for this menu item
    const url = `/dashboard/${dashboardId}/${workspaceId}/${item.id}`; // Modified line

    // Check if this item is active based on the current path
    const isActive = currentPath.includes(url);

    // Find child items if needed
    let childItems: MenuItemWithChildren[] = [];

    if (includeParents) {
      // Find direct children of this menu item
      childItems = menuItems
        .filter((childItem) => childItem.parent_id === item.id)
        .map((childItem) => {
          const childUrl = `/dashboard/${dashboardId}/${workspaceId}/${childItem.id}`; // Modified line
          const childIsActive = currentPath.includes(childUrl);

          return {
            id: childItem.id,
            title: childItem.name,
            url: childUrl,
            isActive: childIsActive,
          };
        });
    }

    return {
      id: item.id,
      title: item.name,
      url,
      icon: IconComponent,
      isActive,
      items: childItems,
      workspaceId,
    };
  });
}

/**
 * Gets a menu item with its full details
 */
export function getMenuItemDetails(menuId: string) {
  return getMenuItemById(menuId);
}
