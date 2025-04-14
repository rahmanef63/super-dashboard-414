"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

interface MenuUsage {
  id: string
  menuId: string
  entityType: string
  entityId: string
  createdAt: Date
  updatedAt: Date
}

interface MenuUsageCreateInput {
  menuId: string
  entityType: string
  entityId: string
}

interface MenuUsageUpdateInput {
  menuId?: string
  entityType?: string
  entityId?: string
}

export function useMenuUsages(menuId?: string) {
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const fetchMenuUsages = async (): Promise<MenuUsage[]> => {
    const url = menuId ? `/api/menu-usages?menuId=${menuId}` : "/api/menu-usages"
    const response = await fetch(url)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch menu usages")
    }

    return response.json()
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["menuUsages", menuId],
    queryFn: fetchMenuUsages,
    onError: (err: Error) => {
      setError(err.message)
      toast.error("Failed to load menu usages")
    },
  })

  const createMenuUsage = useMutation({
    mutationFn: async (data: MenuUsageCreateInput) => {
      const response = await fetch("/api/menu-usages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create menu usage")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuUsages", menuId] })
      toast.success("Menu usage created successfully")
    },
    onError: (err: Error) => {
      setError(err.message)
      toast.error("Failed to create menu usage")
    },
  })

  const updateMenuUsage = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MenuUsageUpdateInput }) => {
      const response = await fetch(`/api/menu-usages/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to update menu usage")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuUsages", menuId] })
      toast.success("Menu usage updated successfully")
    },
    onError: (err: Error) => {
      setError(err.message)
      toast.error("Failed to update menu usage")
    },
  })

  const deleteMenuUsage = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/menu-usages/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to delete menu usage")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuUsages", menuId] })
      toast.success("Menu usage deleted successfully")
    },
    onError: (err: Error) => {
      setError(err.message)
      toast.error("Failed to delete menu usage")
    },
  })

  return {
    menuUsages: data || [],
    isLoading,
    error,
    refetch,
    createMenuUsage: createMenuUsage.mutate,
    updateMenuUsage: updateMenuUsage.mutate,
    deleteMenuUsage: deleteMenuUsage.mutate,
  }
}
