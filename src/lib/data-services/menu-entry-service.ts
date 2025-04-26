import { prisma } from "../prisma"
import type { MenuEntry } from "@prisma/client"

// Create menu entry (dynamic data)
export const createMenuEntry = async (data: {
  menuId: string
  userId: string
  workspaceId?: string
  dashboardId?: string
  data: any
}): Promise<MenuEntry | null> => {
  try {
    console.log(`[menu-entry-service] createMenuEntry called with data: ${JSON.stringify(data)}`)
    return await prisma.menuEntry.create({
      data: {
        ...data,
        data: data.data,
      },
    })
  } catch (error) {
    console.error("Error creating menu entry:", error)
    return null
  }
}

// Get menu entries for menu item
export const getMenuEntriesForMenuItem = async (
  menuId: string,
  options?: {
    userId?: string
    workspaceId?: string
    dashboardId?: string
  },
): Promise<MenuEntry[]> => {
  try {
    console.log(
      `[menu-entry-service] getMenuEntriesForMenuItem called with menuId: ${menuId}, options: ${JSON.stringify(options)}`,
    )
    const where: any = { menuId }

    if (options?.userId) {
      where.userId = options.userId
    }

    if (options?.workspaceId) {
      where.workspaceId = options.workspaceId
    }

    if (options?.dashboardId) {
      where.dashboardId = options.dashboardId
    }

    return await prisma.menuEntry.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (error) {
    console.error(`Error fetching menu entries for menu ${menuId}:`, error)
    return []
  }
}

// Update menu entry
export const updateMenuEntry = async (
  id: string,
  data: {
    data: any
  },
): Promise<MenuEntry | null> => {
  try {
    console.log(`[menu-entry-service] updateMenuEntry called with id: ${id}, data: ${JSON.stringify(data)}`)
    return await prisma.menuEntry.update({
      where: { id },
      data: {
        data: data.data,
        updatedAt: new Date(),
      },
    })
  } catch (error) {
    console.error(`Error updating menu entry with ID ${id}:`, error)
    return null
  }
}

// Delete menu entry
export const deleteMenuEntry = async (id: string): Promise<boolean> => {
  try {
    console.log(`[menu-entry-service] deleteMenuEntry called with id: ${id}`)
    await prisma.menuEntry.delete({
      where: { id },
    })
    return true
  } catch (error) {
    console.error(`Error deleting menu entry with ID ${id}:`, error)
    return false
  }
}
