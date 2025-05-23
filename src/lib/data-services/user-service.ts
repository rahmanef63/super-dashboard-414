import type { User, Prisma } from "@prisma/client"
import { prisma } from "../prisma"

// Assuming these functions already exist:
// getUserById, getUserByEmail, createUser, updateUser

/**
 * Get a user by ID
 * @param id The ID of the user
 * @returns The user or null if not found
 */
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    return await prisma.user.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error(`Error getting user by id ${id}:`, error)
    throw new Error(`Failed to get user by id: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Update a user
 * @param id The ID of the user
 * @param data The data to update
 * @returns The updated user
 */
export const updateUser = async (id: string, data: Prisma.UserUpdateInput): Promise<User> => {
  try {
    return await prisma.user.update({
      where: { id },
      data,
    })
  } catch (error: unknown) {
    console.error(`Error updating user ${id}:`, error)
    throw new Error(`Failed to update user: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Delete a user
 * @param id The ID of the user to delete
 * @returns The deleted user
 */
export const deleteUser = async (id: string): Promise<User> => {
  try {
    return await prisma.user.delete({
      where: { id },
    })
  } catch (error: unknown) {
    console.error(`Error deleting user ${id}:`, error)
    throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Get all roles assigned to a user
 * @param userId The ID of the user
 * @returns Array of roles
 */
export const getUserRoles = async (userId: string): Promise<any[]> => {
  try {
    // Get system role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    })

    // Get organization roles
    const orgMemberships = await prisma.organizationMembership.findMany({
      where: {
        userId,
        status: "ACTIVE",
      },
      include: {
        orgRole: true,
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Combine system and organization roles
    const roles = []

    if (user?.role) {
      roles.push({
        type: "system",
        role: user.role,
        organization: null,
      })
    }

    orgMemberships.forEach((membership: any) => {
      if (membership.orgRole) {
        roles.push({
          type: "organization",
          role: membership.orgRole,
          organization: membership.organization,
        })
      }
    })

    return roles
  } catch (error: unknown) {
    console.error(`Error fetching roles for user ${userId}:`, error)
    throw new Error(`Failed to fetch user roles: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Get UI settings for a user
 * @param userId The ID of the user
 * @returns The user's UI settings or null if not found
 */
export const getUserUiSettings = async (userId: string): Promise<any | null> => {
  try {
    const settings = await prisma.userUiSetting.findUnique({
      where: { userId },
    })

    return settings
  } catch (error: unknown) {
    console.error(`Error fetching UI settings for user ${userId}:`, error)
    throw new Error(`Failed to fetch user UI settings: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Update UI settings for a user
 * @param userId The ID of the user
 * @param data The updated settings data
 * @returns The updated UI settings
 */
export const updateUserUiSettings = async (
  userId: string,
  data: {
    fontSize?: string
    colorTheme?: string
    layoutMode?: string
    additionalSettings?: any
  },
): Promise<any> => {
  try {
    // Check if settings exist
    const existingSettings = await prisma.userUiSetting.findUnique({
      where: { userId },
    })

    if (existingSettings) {
      // Update existing settings
      return await prisma.userUiSetting.update({
        where: { userId },
        data,
      })
    } else {
      // Create new settings
      return await prisma.userUiSetting.create({
        data: {
          userId,
          ...data,
        },
      })
    }
  } catch (error: unknown) {
    console.error(`Error updating UI settings for user ${userId}:`, error)
    throw new Error(`Failed to update user UI settings: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Log user activity
 * @param userId The ID of the user
 * @param action The action performed
 * @param metadata Additional metadata about the action
 * @returns The created activity log
 */
export const logUserActivity = async (userId: string, action: string, metadata?: any): Promise<any> => {
  try {
    return await prisma.activityLog.create({
      data: {
        userId,
        action,
        metadata,
      },
    })
  } catch (error: unknown) {
    console.error(`Error logging activity for user ${userId}:`, error)
    // Don't throw an error for logging failures to prevent disrupting the main flow
    console.warn(`Failed to log user activity: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}

/**
 * Get activity logs for a user
 * @param userId The ID of the user
 * @param limit Maximum number of logs to return
 * @param offset Offset for pagination
 * @returns Array of activity logs
 */
export const getUserActivityLogs = async (userId: string, limit = 50, offset = 0): Promise<any[]> => {
  try {
    return await prisma.activityLog.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    })
  } catch (error: unknown) {
    console.error(`Error fetching activity logs for user ${userId}:`, error)
    throw new Error(`Failed to fetch user activity logs: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Create a new role
 * @param data The role data
 * @returns The created role
 */
export const createRole = async (data: {
  name: string
  description?: string
  createdById?: string
}): Promise<any> => {
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
