"use client"

import { SliceLoader } from "@/app/(dashboard)/_components/slice-loader"
import { useMenuContext } from "../hooks/use-menu-context"
import { getMenuItemDetails } from "../lib/menu-builder"
import { MENU_TO_SLICE_MAP } from "../constants"
import { getDashboardById, getWorkspaceById } from "@/lib/data-service"

export function MenuContent() {
  const { dashboardId, workspaceId, menuId, userId } = useMenuContext()

  // Get entity details
  const dashboard = dashboardId ? getDashboardById(dashboardId) : null
  const workspace = workspaceId ? getWorkspaceById(workspaceId) : null
  const menuItem = menuId ? getMenuItemDetails(menuId) : null

  // If no menu item, we can't render content
  if (!menuItem || !dashboard) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">No menu item selected or menu item not found.</p>
      </div>
    )
  }

  // Determine which slice to load based on the menu ID
  const sliceName = MENU_TO_SLICE_MAP[menuId] || MENU_TO_SLICE_MAP.default
  console.log(`[MenuContent] Menu ID: ${menuId}, mapped to slice: ${sliceName}`, MENU_TO_SLICE_MAP)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Menu: {menuItem.name}</h1>

      {workspace ? (
        <p className="text-muted-foreground">
          Dashboard: {dashboard.name} / Workspace: {workspace.name}
        </p>
      ) : (
        <p className="text-muted-foreground">Dashboard: {dashboard.name}</p>
      )}

      {/* Load the appropriate slice for this menu */}
      <SliceLoader
        sliceName={sliceName}
        context={{
          dashboardId,
          workspaceId,
          menuId: menuItem.id,
          userId,
        }}
      />
    </div>
  )
}
