import type { DashboardAssignment } from "@prisma/client"
import prisma from "../prisma"

/**
 * Get all assignments for a specific dashboard
 * @param dashboardId The ID of the dashboard
 * @returns Array of dashboard assignments with user details
 */
export const getAssignmentsForDashboard = async (dashboardId: string): Promise<DashboardAssignment[]> => {
  try {
    return await prisma.dashboardAssignment.findMany({
      where: { dashboardId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (error) {
    console.error(`Error fetching assignments for dashboard ${dashboardId}:`, error)
    throw new Error(`Failed to fetch dashboard assignments: ${error.message}`)
  }
}

/**
 * Get all dashboard assignments for a specific user
 * @param userId The ID of the user
 * @returns Array of dashboard assignments with dashboard details
 */
export const getAssignmentsForUser = async (userId: string): Promise<DashboardAssignment[]> => {
  try {
    return await prisma.dashboardAssignment.findMany({
      where: { userId },
      include: {
        dashboard: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (error) {
    console.error(`Error fetching dashboard assignments for user ${userId}:`, error)
    throw new Error(`Failed to fetch user's dashboard assignments: ${error.message}`)
  }
}

/**
 * Assign a user to a dashboard
 * @param data The assignment data
 * @returns The created dashboard assignment
 */
export const assignUserToDashboard = async (data: {
  dashboardId: string
  userId: string
  canEdit?: boolean
  assignedById?: string
}): Promise<DashboardAssignment> => {
  try {
    // Check if assignment already exists
    const existingAssignment = await prisma.dashboardAssignment.findFirst({
      where: {
        dashboardId: data.dashboardId,
        userId: data.userId,
      },
    })

    if (existingAssignment) {
      return await prisma.dashboardAssignment.update({
        where: { id: existingAssignment.id },
        data: {
          canEdit: data.canEdit ?? existingAssignment.canEdit,
          assignedById: data.assignedById ?? existingAssignment.assignedById,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          dashboard: true,
        },
      })
    }

    return await prisma.dashboardAssignment.create({
      data: {
        dashboardId: data.dashboardId,
        userId: data.userId,
        canEdit: data.canEdit ?? false,
        assignedById: data.assignedById,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        dashboard: true,
      },
    })
  } catch (error) {
    console.error(`Error assigning user ${data.userId} to dashboard ${data.dashboardId}:`, error)
    throw new Error(`Failed to assign user to dashboard: ${error.message}`)
  }
}

/**
 * Update a dashboard assignment
 * @param id The ID of the assignment
 * @param data The updated assignment data
 * @returns The updated dashboard assignment
 */
export const updateDashboardAssignment = async (
  id: string,
  data: {
    canEdit?: boolean
  },
): Promise<DashboardAssignment> => {
  try {
    return await prisma.dashboardAssignment.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        dashboard: true,
      },
    })
  } catch (error) {
    console.error(`Error updating dashboard assignment ${id}:`, error)
    throw new Error(`Failed to update dashboard assignment: ${error.message}`)
  }
}

/**
 * Remove a user from a dashboard
 * @param id The ID of the assignment to remove
 * @returns The deleted dashboard assignment
 */
export const removeUserFromDashboard = async (id: string): Promise<DashboardAssignment> => {
  try {
    return await prisma.dashboardAssignment.delete({
      where: { id },
    })
  } catch (error) {
    console.error(`Error removing dashboard assignment ${id}:`, error)
    throw new Error(`Failed to remove user from dashboard: ${error.message}`)
  }
}

/**
 * Bulk assign users to a dashboard
 * @param dashboardId The ID of the dashboard
 * @param userIds Array of user IDs to assign
 * @param assignedById ID of the user making the assignments
 * @returns Array of created dashboard assignments
 */
export const bulkAssignUsersToDashboard = async (
  dashboardId: string,
  userIds: string[],
  assignedById?: string,
): Promise<DashboardAssignment[]> => {
  try {
    const assignments = []

    // Use a transaction to ensure all assignments are created or none
    await prisma.$transaction(async (tx) => {
      for (const userId of userIds) {
        // Check if assignment already exists
        const existingAssignment = await tx.dashboardAssignment.findFirst({
          where: {
            dashboardId,
            userId,
          },
        })

        if (!existingAssignment) {
          const assignment = await tx.dashboardAssignment.create({
            data: {
              dashboardId,
              userId,
              canEdit: false,
              assignedById,
            },
          })
          assignments.push(assignment)
        }
      }
    })

    return assignments
  } catch (error) {
    console.error(`Error bulk assigning users to dashboard ${dashboardId}:`, error)
    throw new Error(`Failed to bulk assign users to dashboard: ${error.message}`)
  }
}
