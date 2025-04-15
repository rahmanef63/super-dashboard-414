"use client"

import * as React from "react"
import { Frame, PieChart, Map, Folder, BarChart2, LineChart } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { Workspace } from "../types"
import { usePathname, useParams } from "next/navigation"
import { getWorkspaceById, getMenuItemsForWorkspace } from "@/lib/data-service"

/**
 * Hook to get the active workspace from a list of workspaces
 */
export function useActiveWorkspace(workspaces: Workspace[], activeWorkspaceId?: string) {
  return React.useMemo(() => {
    if (!activeWorkspaceId || !workspaces.length) return null
    return workspaces.find((w) => w.id === activeWorkspaceId) || null
  }, [workspaces, activeWorkspaceId])
}

/**
 * Hook to get an icon for a workspace based on its index or type
 */
export function useWorkspaceIcon() {
  // Expanded set of icons for different workspace types
  const workspaceIcons: LucideIcon[] = [
    Folder, // Default folder icon
    Frame, // For design/UI workspaces
    PieChart, // For analytics workspaces
    Map, // For geographical/location workspaces
    BarChart2, // For financial workspaces
    LineChart, // For trend/performance workspaces
  ]

  // Function to get an icon for a workspace
  return React.useCallback((index: number, type?: string): LucideIcon => {
    // If a specific type is provided, try to match it
    if (type) {
      if (type?.includes("analytics")) return PieChart
      if (type?.includes("design") || type?.includes("ui")) return Frame
      if (type?.includes("map") || type?.includes("location")) return Map
      if (type?.includes("finance") || type?.includes("budget")) return BarChart2
      if (type?.includes("performance") || type?.includes("trend")) return LineChart
    }

    // Otherwise use index-based selection
    return workspaceIcons[index % workspaceIcons.length]
  }, [])
}

/**
 * Hook to get all workspaces for a dashboard
 */
export function useWorkspacesForDashboard(dashboardId: string, allWorkspaces: Workspace[]) {
  return React.useMemo(() => {
    return allWorkspaces.filter((workspace) => workspace.dashboard_id === dashboardId)
  }, [dashboardId, allWorkspaces])
}

/**
 * Hook to get the current workspace ID from the URL
 */
export function useCurrentWorkspaceFromUrl() {
  const params = useParams()
  const workspaceId = typeof params.workspace === "string" ? params.workspace : undefined

  return workspaceId
}

/**
 * Hook to get workspace details from ID
 */
export function useWorkspaceDetails(workspaceId?: string) {
  return React.useMemo(() => {
    if (!workspaceId) return null
    return getWorkspaceById(workspaceId)
  }, [workspaceId])
}

/**
 * Hook to get menu items for a workspace
 */
export function useWorkspaceMenuItems(workspaceId?: string) {
  return React.useMemo(() => {
    if (!workspaceId) return []
    console.log(`[useWorkspaceMenuItems] Getting menu items for workspace: ${workspaceId}`)
    const items = getMenuItemsForWorkspace(workspaceId)
    console.log(`[useWorkspaceMenuItems] Found ${items.length} menu items`)
    return items
  }, [workspaceId])
}

/**
 * Hook to manage workspace selection state
 */
export function useWorkspaceSelection(initialWorkspaceId?: string) {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = React.useState<string | undefined>(initialWorkspaceId)
  const pathname = usePathname()

  // Update selected workspace when URL changes
  React.useEffect(() => {
    const match = pathname.match(/\/dashboard\/[^/]+\/([^/]+)/)
    if (match && match[1]) {
      setSelectedWorkspaceId(match[1])
    } else {
      setSelectedWorkspaceId(undefined)
    }
  }, [pathname])

  const selectWorkspace = React.useCallback((workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId)
  }, [])

  const clearSelection = React.useCallback(() => {
    setSelectedWorkspaceId(undefined)
  }, [])

  return {
    selectedWorkspaceId,
    selectWorkspace,
    clearSelection,
  }
}
