"use client"

import * as React from "react"
import { getDashboards } from "@/lib/data-service"
import type { UIDashboard } from "@/types"
import type { Dashboard as DashboardLegacy, Workspace as WorkspaceLegacy } from "@/lib/data-service"

// Utility: map DashboardLegacy[] to UIDashboard[]
export function mapLegacyDashboardsToUIDashboards(
  legacyDashboards: DashboardLegacy[],
  getWorkspacesForDashboard?: (dashboardId: string) => WorkspaceLegacy[]
): UIDashboard[] {
  return legacyDashboards.map((d) => {
    const legacyWorkspaces = getWorkspacesForDashboard ? getWorkspacesForDashboard(d.id) : [];
    const workspaces = legacyWorkspaces.map((w) => ({
      id: w.id,
      name: w.name,
      description: w.description ?? null,
      dashboardId: w.dashboard_id ?? d.id,
      createdAt: w.created_at ? new Date(w.created_at) : new Date(),
    }));
    return {
      id: d.id,
      name: d.name,
      description: d.description ?? null,
      organizationId: d.organizationId ?? null,
      createdById: (d as any).owner_id ?? null, // fallback for legacy
      createdAt: d.created_at ? new Date(d.created_at) : new Date(), // fallback for legacy
      workspaces,
    };
  });
}



export function useDashboards() {
  return React.useMemo(() => getDashboards(), [])
}

export function useCurrentDashboard(allDashboards: UIDashboard[], currentDashboardId: string) {
  return React.useMemo(() => {
    const found = allDashboards.find((dashboard) => dashboard.id === currentDashboardId)
    console.log("Current dashboard ID:", currentDashboardId)
    console.log("Found dashboard:", found)
    return found || allDashboards[0]
  }, [allDashboards, currentDashboardId])
}
