"use client"

// hooks/use-dashboard.ts
import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api-client"

interface Dashboard {
  id: string
  name: string
  description?: string
}

interface UseDashboardReturn {
  dashboard: Dashboard | null
  loading: boolean
  error: Error | null
}

export function useDashboard(dashboardId: string): UseDashboardReturn {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await api.get<Dashboard>(`/dashboards/${dashboardId}`)
      setDashboard(data)
    } catch (err) {
      console.error("Error fetching dashboard:", err)
      setError(err instanceof Error ? err : new Error("Failed to fetch dashboard"))
    } finally {
      setLoading(false)
    }
  }, [dashboardId])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return {
    dashboard,
    loading,
    error,
  }
}
