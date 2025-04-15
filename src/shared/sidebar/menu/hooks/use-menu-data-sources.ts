"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api-client"

interface MenuDataSource {
  id: string
  menuId: string
  sourceTable: string
  filterByWorkspaceId: boolean
  filterByUserId: boolean
}

interface UseMenuDataSourcesReturn {
  menuDataSources: MenuDataSource[]
  loading: boolean
  error: Error | null
}

export function useMenuDataSources(menuId: string): UseMenuDataSourcesReturn {
  const [menuDataSources, setMenuDataSources] = useState<MenuDataSource[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMenuDataSources = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await api.get<MenuDataSource[]>(`/menu-data-sources?menuId=${menuId}`)
      setMenuDataSources(data)
    } catch (err) {
      console.error("Error fetching menu data sources:", err)
      setError(err instanceof Error ? err : new Error("Failed to fetch menu data sources"))
    } finally {
      setLoading(false)
    }
  }, [menuId])

  useEffect(() => {
    fetchMenuDataSources()
  }, [fetchMenuDataSources])

  return {
    menuDataSources,
    loading,
    error,
  }
}
