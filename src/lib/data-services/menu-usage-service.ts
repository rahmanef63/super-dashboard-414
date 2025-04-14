import prisma from "../prisma"
import type { MenuUsage } from "@prisma/client"

// Get menu usages for dashboard
export const getMenuUsagesForDashboard = async (dashboardId: string): Promise<MenuUsage[]> => {
  try {
    console.log(`[menu-usage-service] getMenuUsagesForDashboard called with dashboardId: ${dashboardId}`)
    return await prisma.menuUsage.findMany({
      where: { dashboardId },
    })
  } catch (error) {
    console.error(`Error fetching menu usages for dashboard ${dashboardId}:`, error)
    return []
  }
}

// Get menu usages for workspace
export const getMenuUsagesForWorkspace = async (workspaceId: string): Promise<MenuUsage[]> => {
  try {
    console.log(`[menu-usage-service] getMenuUsagesForWorkspace called with workspaceId: ${workspaceId}`)
    return await prisma.menuUsage.findMany({
      where: { workspaceId },
    })
  } catch (error) {
    console.error(`Error fetching menu usages for workspace ${workspaceId}:`, error)
    return []
  }
}

// Create a new menu usage
export const createMenuUsage = async (data: {
  menuId: string
  dashboardId?: string
  workspaceId?: string
  orderIndex?: number
}): Promise<MenuUsage | null> => {
  try {
    console.log(`[menu-usage-service] createMenuUsage called with data: ${JSON.stringify(data)}`)
    return await prisma.menuUsage.create({
      data,
    })
  } catch (error) {
    console.error("Error creating menu usage:", error)
    return null
  }
}

// Update menu usage order
export const updateMenuUsageOrder = async (id: string, orderIndex: number): Promise<MenuUsage | null> => {
  try {
    console.log(`[menu-usage-service] updateMenuUsageOrder called with id: ${id}, orderIndex: ${orderIndex}`)
    return await prisma.menuUsage.update({
      where: { id },
      data: { orderIndex },
    })
  } catch (error) {
    console.error(`Error updating menu usage order with ID ${id}:`, error)
    return null
  }
}

// Delete a menu usage
export const deleteMenuUsage = async (id: string): Promise<boolean> => {
  try {
    console.log(`[menu-usage-service] deleteMenuUsage called with id: ${id}`)
    await prisma.menuUsage.delete({
      where: { id },
    })
    return true
  } catch (error) {
    console.error(`Error deleting menu usage with ID ${id}:`, error)
    return false
  }
}
