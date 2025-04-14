"use client"

// hooks/use-workspace.ts
import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api-client"

interface Workspace {
  id: string
  name: string
  description?: string
}

interface UseWorkspacesReturn {
  workspaces: Workspace[]
  loading: boolean
  error: Error | null
}

export function useWorkspaces(dashboardId: string): UseWorkspacesReturn {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchWorkspaces = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await api.get<Workspace[]>(`/dashboards/${dashboardId}/workspaces`)
      setWorkspaces(data)
    } catch (err) {
      console.error("Error fetching workspaces:", err)
      setError(err instanceof Error ? err : new Error("Failed to fetch workspaces"))
    } finally {
      setLoading(false)
    }
  }, [dashboardId])

  useEffect(() => {
    fetchWorkspaces()
  }, [fetchWorkspaces])

  return {
    workspaces,
    loading,
    error,
  }
}
