import { cache } from "react"
import prisma from "../prisma"
import type { MenuItem, MenuUsage, MenuPermission, MenuDataSource, MenuEntry } from "@prisma/client"

// Get menu item by ID
export const getMenuItemById = async (id: string): Promise<MenuItem | null> => {
  try {
    console.log(`[menu-service] getMenuItemById called with id: ${id}`)
    return await prisma.menuItem.findUnique({
      where: { id },
      include: {
        children: true,
        parent: true,
      },
    })
  } catch (error) {
    console.error(`[menu-service] Error fetching menu item with ID ${id}:`, error)
    return null
  }
}

// Get menu items for dashboard
export const getMenuItemsForDashboard = cache(async (dashboardId: string): Promise<MenuItem[]> => {
  try {
    console.log(`[menu-service] getMenuItemsForDashboard called with dashboardId: ${dashboardId}`)
    const menuUsages = await prisma.menuUsage.findMany({
      where: { dashboardId },
      include: {
        menu: {
          include: {
            children: true,
          },
        },
      },
      orderBy: {
        orderIndex: "asc",
      },
    })

    return menuUsages.map((usage) => usage.menu)
  } catch (error) {
    console.error(`[menu-service] Error fetching menu items for dashboard ${dashboardId}:`, error)
    return []
  }
})

// Get menu items for workspace
export const getMenuItemsForWorkspace = cache(async (workspaceId: string): Promise<MenuItem[]> => {
  try {
    console.log(`[menu-service] getMenuItemsForWorkspace called with workspaceId: ${workspaceId}`)
    const menuUsages = await prisma.menuUsage.findMany({
      where: { workspaceId },
      include: {
        menu: {
          include: {
            children: true,
          },
        },
      },
      orderBy: {
        orderIndex: "asc",
      },
    })

    return menuUsages.map((usage) => usage.menu)
  } catch (error) {
    console.error(`[menu-service] Error fetching menu items for workspace ${workspaceId}:`, error)
    return []
  }
})

// Create a new menu item
export const createMenuItem = async (data: {
  title: string
  type: string
  icon?: string
  target?: string
  globalContext?: boolean
  parentId?: string
}): Promise<MenuItem | null> => {
  try {
    console.log(`[menu-service] createMenuItem called with data: ${JSON.stringify(data)}`)
    return await prisma.menuItem.create({
      data,
    })
  } catch (error) {
    console.error("Error creating menu item:", error)
    return null
  }
}

// Update a menu item
export const updateMenuItem = async (
  id: string,
  data: {
    title?: string
    type?: string
    icon?: string
    target?: string
    globalContext?: boolean
    parentId?: string
  },
): Promise<MenuItem | null> => {
  try {
    console.log(`[menu-service] updateMenuItem called with id: ${id}, data: ${JSON.stringify(data)}`)
    return await prisma.menuItem.update({
      where: { id },
      data,
    })
  } catch (error) {
    console.error(`Error updating menu item with ID ${id}:`, error)
    return null
  }
}

// Associate menu item with dashboard
export const associateMenuWithDashboard = async (data: {
  menuId: string
  dashboardId: string
  orderIndex?: number
}): Promise<MenuUsage | null> => {
  try {
    console.log(`[menu-service] associateMenuWithDashboard called with data: ${JSON.stringify(data)}`)
    return await prisma.menuUsage.create({
      data,
    })
  } catch (error) {
    console.error("Error associating menu with dashboard:", error)
    return null
  }
}

// Associate menu item with workspace
export const associateMenuWithWorkspace = async (data: {
  menuId: string
  workspaceId: string
  orderIndex?: number
}): Promise<MenuUsage | null> => {
  try {
    console.log(`[menu-service] associateMenuWithWorkspace called with data: ${JSON.stringify(data)}`)
    return await prisma.menuUsage.create({
      data,
    })
  } catch (error) {
    console.error("Error associating menu with workspace:", error)
    return null
  }
}

// Set menu permission
export const setMenuPermission = async (data: {
  menuId: string
  roleId?: string
  userId?: string
  permissionType: string
}): Promise<MenuPermission | null> => {
  try {
    console.log(`[menu-service] setMenuPermission called with data: ${JSON.stringify(data)}`)
    return await prisma.menuPermission.create({
      data,
    })
  } catch (error) {
    console.error("Error setting menu permission:", error)
    return null
  }
}

// Create menu data source
export const createMenuDataSource = async (data: {
  menuId: string
  sourceTable: string
  filterByWorkspaceId?: boolean
  filterByUserId?: boolean
}): Promise<MenuDataSource | null> => {
  try {
    console.log(`[menu-service] createMenuDataSource called with data: ${JSON.stringify(data)}`)
    return await prisma.menuDataSource.create({
      data: {
        ...data,
        filterByWorkspaceId: data.filterByWorkspaceId || false,
        filterByUserId: data.filterByUserId || false,
      },
    })
  } catch (error) {
    console.error("Error creating menu data source:", error)
    return null
  }
}

// Create menu entry (dynamic data)
export const createMenuEntry = async (data: {
  menuId: string
  userId: string
  workspaceId?: string
  dashboardId?: string
  data: any
}): Promise<MenuEntry | null> => {
  try {
    console.log(`[menu-service] createMenuEntry called with data: ${JSON.stringify(data)}`)
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
      `[menu-service] getMenuEntriesForMenuItem called with menuId: ${menuId}, options: ${JSON.stringify(options)}`,
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
    console.log(`[menu-service] updateMenuEntry called with id: ${id}, data: ${JSON.stringify(data)}`)
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
    console.log(`[menu-service] deleteMenuEntry called with id: ${id}`)
    await prisma.menuEntry.delete({
      where: { id },
    })
    return true
  } catch (error) {
    console.error(`Error deleting menu entry with ID ${id}:`, error)
    return false
  }
}
