"use client"

// hooks/use-menu.ts
import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api-client"

interface MenuEntry {
  id: string
  data: any
}

interface UseMenuEntriesReturn {
  menuEntries: MenuEntry[]
  loading: boolean
  error: Error | null
}

export function useMenuEntries(menuId: string): UseMenuEntriesReturn {
  const [menuEntries, setMenuEntries] = useState<MenuEntry[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMenuEntries = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await api.get<MenuEntry[]>(`/menu-entries?menuId=${menuId}`)
      setMenuEntries(data)
    } catch (err) {
      console.error("Error fetching menu entries:", err)
      setError(err instanceof Error ? err : new Error("Failed to fetch menu entries"))
    } finally {
      setLoading(false)
    }
  }, [menuId])

  useEffect(() => {
    fetchMenuEntries()
  }, [fetchMenuEntries])

  return {
    menuEntries,
    loading,
    error,
  }
}
