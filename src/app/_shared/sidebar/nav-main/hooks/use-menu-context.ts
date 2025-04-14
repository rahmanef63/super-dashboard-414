"use client"

import { useParams, usePathname } from "next/navigation"
import { useMemo } from "react"
import { MENU_CONTEXT } from "../constants"
import type { MenuContext } from "../types"

/**
 * Hook to determine the current menu context (dashboard or workspace)
 */
export function useMenuContext(): MenuContext {
  const params = useParams()
  const pathname = usePathname()

  return useMemo(() => {
    const dashboardId = params.dashboard as string
    const workspaceId = params.workspace as string
    const dashboardMenuId = params.dashboard_menu as string
    const workspaceMenuId = params.workspace_menu as string

    // Determine the menu ID based on the context
    const menuId = workspaceId ? workspaceMenuId : dashboardMenuId

    // Get the user ID from somewhere (this is a placeholder)
    const userId = "user_1"

    return {
      dashboardId,
      workspaceId,
      menuId,
      userId,
    }
  }, [params, pathname])
}

/**
 * Hook to determine the type of menu context
 */
export function useMenuContextType(): string {
  const { workspaceId } = useMenuContext()

  return workspaceId ? MENU_CONTEXT.WORKSPACE : MENU_CONTEXT.DASHBOARD
}
