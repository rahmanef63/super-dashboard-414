import prisma from "../prisma"
import type { Role } from "@prisma/client"

// Get role by ID
export const getRoleById = async (id: string): Promise<Role | null> => {
  try {
    console.log(`[data-service] getRoleById called with id: ${id}`)
    return await prisma.role.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error(`Error fetching role with ID ${id}:`, error)
    return null
  }
}

// Get all roles
export const getAllRoles = async (): Promise<Role[]> => {
  try {
    console.log("[data-service] getAllRoles called")
    return await prisma.role.findMany()
  } catch (error) {
    console.error("Error fetching roles:", error)
    return []
  }
}

// Create a new role
export const createRole = async (data: {
  name: string
  description?: string
  createdById?: string
}): Promise<Role | null> => {
  try {
    console.log(`[data-service] createRole called with name: ${data.name}`)
    return await prisma.role.create({
      data,
    })
  } catch (error) {
    console.error("Error creating role:", error)
    return null
  }
}

// Update a role
export const updateRole = async (
  id: string,
  data: {
    name?: string
    description?: string
  },
): Promise<Role | null> => {
  try {
    console.log(`[data-service] updateRole called with id: ${id}`)
    return await prisma.role.update({
      where: { id },
      data,
    })
  } catch (error) {
    console.error(`Error updating role with ID ${id}:`, error)
    return null
  }
}

// Delete a role
export const deleteRole = async (id: string): Promise<boolean> => {
  try {
    console.log(`[data-service] deleteRole called with id: ${id}`)
    await prisma.role.delete({
      where: { id },
    })
    return true
  } catch (error) {
    console.error(`Error deleting role with ID ${id}:`, error)
    return false
  }
}

// Assign a role to a user
export const assignRoleToUser = async (userId: string, roleId: string): Promise<boolean> => {
  try {
    console.log(`[data-service] assignRoleToUser called with userId: ${userId}, roleId: ${roleId}`)
    await prisma.user.update({
      where: { id: userId },
      data: { roleId },
    })
    return true
  } catch (error) {
    console.error(`Error assigning role ${roleId} to user ${userId}:`, error)
    return false
  }
}
