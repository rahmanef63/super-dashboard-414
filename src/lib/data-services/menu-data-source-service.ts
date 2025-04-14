import prisma from "../prisma"
import type { MenuDataSource } from "@prisma/client"

// Get data sources for menu
export const getDataSourcesForMenu = async (menuId: string): Promise<MenuDataSource[]> => {
  try {
    console.log(`[menu-data-source-service] getDataSourcesForMenu called with menuId: ${menuId}`)
    return await prisma.menuDataSource.findMany({
      where: { menuId },
    })
  } catch (error) {
    console.error(`Error fetching data sources for menu ${menuId}:`, error)
    return []
  }
}

// Create a new menu data source
export const createMenuDataSource = async (data: {
  menuId: string
  sourceTable: string
  filterByWorkspaceId?: boolean
  filterByUserId?: boolean
}): Promise<MenuDataSource | null> => {
  try {
    console.log(`[menu-data-source-service] createMenuDataSource called with data: ${JSON.stringify(data)}`)
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

// Update a menu data source
export const updateMenuDataSource = async (
  id: string,
  data: {
    sourceTable?: string
    filterByWorkspaceId?: boolean
    filterByUserId?: boolean
  },
): Promise<MenuDataSource | null> => {
  try {
    console.log(`[menu-data-source-service] updateMenuDataSource called with id: ${id}, data: ${JSON.stringify(data)}`)
    return await prisma.menuDataSource.update({
      where: { id },
      data: {
        ...data,
        filterByWorkspaceId: data.filterByWorkspaceId || false,
        filterByUserId: data.filterByUserId || false,
      },
    })
  } catch (error) {
    console.error(`Error updating menu data source with ID ${id}:`, error)
    return null
  }
}

// Delete a menu data source
export const deleteMenuDataSource = async (id: string): Promise<boolean> => {
  try {
    console.log(`[menu-data-source-service] deleteMenuDataSource called with id: ${id}`)
    await prisma.menuDataSource.delete({
      where: { id },
    })
    return true
  } catch (error) {
    console.error(`Error deleting menu data source with ID ${id}:`, error)
    return false
  }
}
