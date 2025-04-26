import type { DashboardAssignment } from "@prisma/client"
import { prisma } from "../prisma"

function handlePrismaError(context: string, error: unknown): never {
  if (error instanceof Error) {
    console.error(`${context}:`, error.message);
    throw new Error(`${context}: ${error.message}`);
  } else {
    console.error(`${context}:`, error);
    throw new Error(`${context}: Unknown error`);
  }
}

/**
 * Get all assignments for a specific dashboard
 * @param dashboardId The ID of the dashboard
 * @returns Array of dashboard assignments with user details
 */
export const getAssignmentsForDashboard = async (dashboardId: string): Promise<DashboardAssignment[] | undefined> => {
  try {
    return await prisma.dashboardAssignment.findMany({
      where: { dashboardId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (error) {
    handlePrismaError(`Error fetching assignments for dashboard ${dashboardId}`, error);
    return undefined;
  }
}

/**
 * Get all dashboard assignments for a specific user
 * @param userId The ID of the user
 * @returns Array of dashboard assignments with dashboard details
 */
export const getAssignmentsForUser = async (userId: string): Promise<DashboardAssignment[] | undefined> => {
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
    handlePrismaError(`Error fetching dashboard assignments for user ${userId}`, error);
    return undefined;
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
}): Promise<DashboardAssignment | undefined> => {
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
          
          
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              
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
        
        
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            
          },
        },
        dashboard: true,
      },
    })
  } catch (error) {
    handlePrismaError(`Error assigning user ${data.userId} to dashboard ${data.dashboardId}`, error);
    return undefined;
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
  data: Partial<Omit<DashboardAssignment, 'id'>>, // Only allow schema fields except id
): Promise<DashboardAssignment | undefined> => {
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
            
          },
        },
        dashboard: true,
      },
    })
  } catch (error) {
    handlePrismaError(`Error updating dashboard assignment ${id}`, error);
    return undefined;
  }
}

/**
 * Remove a user from a dashboard
 * @param id The ID of the assignment to remove
 * @returns The deleted dashboard assignment
 */
export const removeUserFromDashboard = async (id: string): Promise<DashboardAssignment | undefined> => {
  try {
    return await prisma.dashboardAssignment.delete({
      where: { id },
    })
  } catch (error) {
    handlePrismaError(`Error removing dashboard assignment ${id}`, error);
    return undefined;
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
): Promise<DashboardAssignment[] | undefined> => {
  try {
    const assignments: DashboardAssignment[] = []

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
              userId
            },
          })
          assignments.push(assignment)
        }
      }
    })

    return assignments
  } catch (error) {
    handlePrismaError(`Error bulk assigning users to dashboard ${dashboardId}`, error);
    return undefined;
  }
}
