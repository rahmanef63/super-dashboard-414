import prisma from "../prisma"
import type { MenuPermission } from "@prisma/client"

// Get permissions for menu
export const getPermissionsForMenu = async (menuId: string): Promise<MenuPermission[]> => {
  try {
    console.log(`[menu-permission-service] getPermissionsForMenu called with menuId: ${menuId}`)
    return await prisma.menuPermission.findMany({
      where: { menuId },
    })
  } catch (error) {
    console.error(`Error fetching permissions for menu ${menuId}:`, error)
    return []
  }
}

// Get permissions for user
export const getPermissionsForUser = async (userId: string): Promise<MenuPermission[]> => {
  try {
    console.log(`[menu-permission-service] getPermissionsForUser called with userId: ${userId}`)
    return await prisma.menuPermission.findMany({
      where: { userId },
    })
  } catch (error) {
    console.error(`Error fetching permissions for user ${userId}:`, error)
    return []
  }
}

// Get permissions for role
export const getPermissionsForRole = async (roleId: string): Promise<MenuPermission[]> => {
  try {
    console.log(`[menu-permission-service] getPermissionsForRole called with roleId: ${roleId}`)
    return await prisma.menuPermission.findMany({
      where: { roleId },
    })
  } catch (error) {
    console.error(`Error fetching permissions for role ${roleId}:`, error)
    return []
  }
}

// Create a new menu permission
export const createMenuPermission = async (data: {
  menuId: string
  roleId?: string
  userId?: string
  permissionType: string
}): Promise<MenuPermission | null> => {
  try {
    console.log(`[menu-permission-service] createMenuPermission called with data: ${JSON.stringify(data)}`)
    return await prisma.menuPermission.create({
      data,
    })
  } catch (error) {
    console.error("Error creating menu permission:", error)
    return null
  }
}

// Delete a menu permission
export const deleteMenuPermission = async (id: string): Promise<boolean> => {
  try {
    console.log(`[menu-permission-service] deleteMenuPermission called with id: ${id}`)
    await prisma.menuPermission.delete({
      where: { id },
    })
    return true
  } catch (error) {
    console.error(`Error deleting menu permission with ID ${id}:`, error)
    return false
  }
}
