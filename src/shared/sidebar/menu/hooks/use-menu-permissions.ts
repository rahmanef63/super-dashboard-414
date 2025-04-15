"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

interface MenuPermission {
  id: string
  menuId: string
  roleId: string
  canView: boolean
  canEdit: boolean
  createdAt: Date
  updatedAt: Date
}

interface MenuPermissionCreateInput {
  menuId: string
  roleId: string
  canView: boolean
  canEdit: boolean
}

interface MenuPermissionUpdateInput {
  canView?: boolean
  canEdit?: boolean
}

export function useMenuPermissions(menuId?: string, roleId?: string) {
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const fetchMenuPermissions = async (): Promise<MenuPermission[]> => {
    let url = "/api/menu-permissions"
    const params = new URLSearchParams()

    if (menuId) params.append("menuId", menuId)
    if (roleId) params.append("roleId", roleId)

    if (params.toString()) {
      url += `?${params.toString()}`
    }

    const response = await fetch(url)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch menu permissions")
    }

    return response.json()
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["menuPermissions", menuId, roleId],
    queryFn: fetchMenuPermissions,
    onError: (err: Error) => {
      setError(err.message)
      toast.error("Failed to load menu permissions")
    },
  })

  const createMenuPermission = useMutation({
    mutationFn: async (data: MenuPermissionCreateInput) => {
      const response = await fetch("/api/menu-permissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create menu permission")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuPermissions", menuId, roleId] })
      toast.success("Menu permission created successfully")
    },
    onError: (err: Error) => {
      setError(err.message)
      toast.error("Failed to create menu permission")
    },
  })

  const updateMenuPermission = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MenuPermissionUpdateInput }) => {
      const response = await fetch(`/api/menu-permissions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to update menu permission")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuPermissions", menuId, roleId] })
      toast.success("Menu permission updated successfully")
    },
    onError: (err: Error) => {
      setError(err.message)
      toast.error("Failed to update menu permission")
    },
  })

  const deleteMenuPermission = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/menu-permissions/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to delete menu permission")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuPermissions", menuId, roleId] })
      toast.success("Menu permission deleted successfully")
    },
    onError: (err: Error) => {
      setError(err.message)
      toast.error("Failed to delete menu permission")
    },
  })

  return {
    menuPermissions: data || [],
    isLoading,
    error,
    refetch,
    createMenuPermission: createMenuPermission.mutate,
    updateMenuPermission: updateMenuPermission.mutate,
    deleteMenuPermission: deleteMenuPermission.mutate,
  }
}
