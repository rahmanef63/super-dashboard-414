"use client"

import * as React from "react"
import { getDashboards } from "@/lib/data-service"
import type { Dashboard } from "../types"

export function useDashboards() {
  return React.useMemo(() => getDashboards(), [])
}

export function useCurrentDashboard(allDashboards: Dashboard[], currentDashboardId: string) {
  return React.useMemo(() => {
    const found = allDashboards.find((dashboard) => dashboard.id === currentDashboardId)
    console.log("Current dashboard ID:", currentDashboardId)
    console.log("Found dashboard:", found)
    return found || allDashboards[0]
  }, [allDashboards, currentDashboardId])
}
