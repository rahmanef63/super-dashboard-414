import prisma from "../prisma"
import type { MenuItem } from "@prisma/client"

// Get menu item by ID
export const getMenuItemById = async (id: string): Promise<MenuItem | null> => {
  try {
    console.log(`[menu-item-service] getMenuItemById called with id: ${id}`)
    return await prisma.menuItem.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error(`Error fetching menu item with ID ${id}:`, error)
    return null
  }
}

// Get menu items with children
export const getMenuItemsWithChildren = async (parentId: string | null): Promise<MenuItem[]> => {
  try {
    console.log(`[menu-item-service] getMenuItemsWithChildren called with parentId: ${parentId}`)
    return await prisma.menuItem.findMany({
      where: { parentId },
      include: {
        children: true,
      },
    })
  } catch (error) {
    console.error(`Error fetching menu items with children for parent ID ${parentId}:`, error)
    return []
  }
}

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
    console.log(`[menu-item-service] createMenuItem called with data: ${JSON.stringify(data)}`)
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
    console.log(`[menu-item-service] updateMenuItem called with id: ${id}, data: ${JSON.stringify(data)}`)
    return await prisma.menuItem.update({
      where: { id },
      data,
    })
  } catch (error) {
    console.error(`Error updating menu item with ID ${id}:`, error)
    return null
  }
}

// Delete a menu item
export const deleteMenuItem = async (id: string): Promise<boolean> => {
  try {
    console.log(`[menu-item-service] deleteMenuItem called with id: ${id}`)
    await prisma.menuItem.delete({
      where: { id },
    })
    return true
  } catch (error) {
    console.error(`Error deleting menu item with ID ${id}:`, error)
    return false
  }
}
