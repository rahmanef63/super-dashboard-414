"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

interface MenuItem {
  id: string
  menuId: string
  name: string
  url: string
  icon?: string
  parentId?: string
  order: number
  createdAt: Date
  updatedAt: Date
}

interface MenuItemCreateInput {
  menuId: string
  name: string
  url: string
  icon?: string
  parentId?: string
  order?: number
}

interface MenuItemUpdateInput {
  name?: string
  url?: string
  icon?: string
  parentId?: string
  order?: number
}

export function useMenuItems(menuId?: string) {
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const fetchMenuItems = async (): Promise<MenuItem[]> => {
    const url = menuId ? `/api/menu-items?menuId=${menuId}` : "/api/menu-items"
    const response = await fetch(url)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch menu items")
    }

    return response.json()
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["menuItems", menuId],
    queryFn: fetchMenuItems,
    onError: (err: Error) => {
      setError(err.message)
      toast.error("Failed to load menu items")
    },
  })

  const createMenuItem = useMutation({
    mutationFn: async (data: MenuItemCreateInput) => {
      const response = await fetch("/api/menu-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create menu item")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems", menuId] })
      toast.success("Menu item created successfully")
    },
    onError: (err: Error) => {
      setError(err.message)
      toast.error("Failed to create menu item")
    },
  })

  const updateMenuItem = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MenuItemUpdateInput }) => {
      const response = await fetch(`/api/menu-items/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to update menu item")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems", menuId] })
      toast.success("Menu item updated successfully")
    },
    onError: (err: Error) => {
      setError(err.message)
      toast.error("Failed to update menu item")
    },
  })

  const deleteMenuItem = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/menu-items/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to delete menu item")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems", menuId] })
      toast.success("Menu item deleted successfully")
    },
    onError: (err: Error) => {
      setError(err.message)
      toast.error("Failed to delete menu item")
    },
  })

  return {
    menuItems: data || [],
    isLoading,
    error,
    refetch,
    createMenuItem: createMenuItem.mutate,
    updateMenuItem: updateMenuItem.mutate,
    deleteMenuItem: deleteMenuItem.mutate,
  }
}
