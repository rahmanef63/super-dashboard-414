"use client"

import { usePathname } from "next/navigation"
import { useMenuContext } from "../../menu/nav-main/hooks/use-menu-context"
import { buildDashboardMenu, buildWorkspaceMenu } from "../../menu/nav-main/lib/menu-builder"

interface MenuNavigationProps {
  showLabel?: boolean
  title?: string
  emptyMessage?: string
}

export function MenuNavigation({ showLabel = true, title, emptyMessage }: MenuNavigationProps) {
  const { dashboardId, workspaceId } = useMenuContext()
  const pathname = usePathname()

  // If no dashboard ID, we can't build a menu
  if (!dashboardId) {
    return null
  }

  // Build the appropriate menu based on context
  const menuItems = workspaceId
    ? buildWorkspaceMenu(dashboardId, workspaceId, pathname)
    : buildDashboardMenu(dashboardId, pathname)

  // Determine the title based on context
  const menuTitle =
    title ||
    (workspaceId
      ? `${workspaceId.charAt(0).toUpperCase() + workspaceId.slice(1)} Menu`
      : `${dashboardId.charAt(0).toUpperCase() + dashboardId.slice(1)} Menu`)

  // Determine the empty message based on context
  const menuEmptyMessage =
    emptyMessage ||
    (workspaceId ? `No menu items available for this workspace` : `No menu items available for this dashboard`)

  return <SidebarFeatureMenuLoader items={menuItems} title={menuTitle} showLabel={showLabel} emptyMessage={menuEmptyMessage} />
}
