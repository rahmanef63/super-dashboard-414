import type { WorkspaceAssignment } from "@prisma/client"
import prisma from "../prisma"

/**
 * Get all assignments for a specific workspace
 * @param workspaceId The ID of the workspace
 * @returns Array of workspace assignments with user details
 */
export const getAssignmentsForWorkspace = async (workspaceId: string): Promise<WorkspaceAssignment[]> => {
  try {
    return await prisma.workspaceAssignment.findMany({
      where: { workspaceId },
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
    console.error(`Error fetching assignments for workspace ${workspaceId}:`, error)
    throw new Error(`Failed to fetch workspace assignments: ${error.message}`)
  }
}

/**
 * Get all workspace assignments for a specific user
 * @param userId The ID of the user
 * @returns Array of workspace assignments with workspace details
 */
export const getAssignmentsForUser = async (userId: string): Promise<WorkspaceAssignment[]> => {
  try {
    return await prisma.workspaceAssignment.findMany({
      where: { userId },
      include: {
        workspace: {
          include: {
            dashboard: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (error) {
    console.error(`Error fetching workspace assignments for user ${userId}:`, error)
    throw new Error(`Failed to fetch user's workspace assignments: ${error.message}`)
  }
}

/**
 * Assign a user to a workspace
 * @param data The assignment data
 * @returns The created workspace assignment
 */
export const assignUserToWorkspace = async (data: {
  workspaceId: string
  userId: string
  canEdit?: boolean
  assignedById?: string
}): Promise<WorkspaceAssignment> => {
  try {
    // Check if assignment already exists
    const existingAssignment = await prisma.workspaceAssignment.findFirst({
      where: {
        workspaceId: data.workspaceId,
        userId: data.userId,
      },
    })

    if (existingAssignment) {
      return await prisma.workspaceAssignment.update({
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
          workspace: {
            include: {
              dashboard: true,
            },
          },
        },
      })
    }

    return await prisma.workspaceAssignment.create({
      data: {
        workspaceId: data.workspaceId,
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
        workspace: {
          include: {
            dashboard: true,
          },
        },
      },
    })
  } catch (error) {
    console.error(`Error assigning user ${data.userId} to workspace ${data.workspaceId}:`, error)
    throw new Error(`Failed to assign user to workspace: ${error.message}`)
  }
}

/**
 * Update a workspace assignment
 * @param id The ID of the assignment
 * @param data The updated assignment data
 * @returns The updated workspace assignment
 */
export const updateWorkspaceAssignment = async (
  id: string,
  data: {
    canEdit?: boolean
  },
): Promise<WorkspaceAssignment> => {
  try {
    return await prisma.workspaceAssignment.update({
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
        workspace: {
          include: {
            dashboard: true,
          },
        },
      },
    })
  } catch (error) {
    console.error(`Error updating workspace assignment ${id}:`, error)
    throw new Error(`Failed to update workspace assignment: ${error.message}`)
  }
}

/**
 * Remove a user from a workspace
 * @param id The ID of the assignment to remove
 * @returns The deleted workspace assignment
 */
export const removeUserFromWorkspace = async (id: string): Promise<WorkspaceAssignment> => {
  try {
    return await prisma.workspaceAssignment.delete({
      where: { id },
    })
  } catch (error) {
    console.error(`Error removing workspace assignment ${id}:`, error)
    throw new Error(`Failed to remove user from workspace: ${error.message}`)
  }
}

/**
 * Bulk assign users to a workspace
 * @param workspaceId The ID of the workspace
 * @param userIds Array of user IDs to assign
 * @param assignedById ID of the user making the assignments
 * @returns Array of created workspace assignments
 */
export const bulkAssignUsersToWorkspace = async (
  workspaceId: string,
  userIds: string[],
  assignedById?: string,
): Promise<WorkspaceAssignment[]> => {
  try {
    const assignments = []

    // Use a transaction to ensure all assignments are created or none
    await prisma.$transaction(async (tx) => {
      for (const userId of userIds) {
        // Check if assignment already exists
        const existingAssignment = await tx.workspaceAssignment.findFirst({
          where: {
            workspaceId,
            userId,
          },
        })

        if (!existingAssignment) {
          const assignment = await tx.workspaceAssignment.create({
            data: {
              workspaceId,
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
    console.error(`Error bulk assigning users to workspace ${workspaceId}:`, error)
    throw new Error(`Failed to bulk assign users to workspace: ${error.message}`)
  }
}
