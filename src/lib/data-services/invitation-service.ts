import type { Invitation } from "@prisma/client"
import prisma from "../prisma"
import { v4 as uuidv4 } from "uuid"

/**
 * Create a new invitation
 * @param data The invitation data
 * @returns The created invitation
 */
export const createInvitation = async (data: {
  organizationId: string
  email: string
  roleId?: string
  senderId?: string
  expiresAt?: Date
}): Promise<Invitation> => {
  try {
    // Generate a unique token
    const token = uuidv4()

    // Set expiration date (default: 7 days from now)
    const expiresAt = data.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    return await prisma.invitation.create({
      data: {
        organizationId: data.organizationId,
        email: data.email,
        token,
        roleId: data.roleId,
        senderId: data.senderId,
        status: "SENT",
        expiresAt,
      },
      include: {
        organization: true,
        orgRole: true,
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("Error creating invitation:", error)
    throw new Error(`Failed to create invitation: ${error.message}`)
  }
}

/**
 * Get an invitation by its token
 * @param token The invitation token
 * @returns The invitation or null if not found
 */
export const getInvitationByToken = async (token: string): Promise<Invitation | null> => {
  try {
    return await prisma.invitation.findUnique({
      where: { token },
      include: {
        organization: true,
        orgRole: true,
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  } catch (error) {
    console.error(`Error fetching invitation with token ${token}:`, error)
    throw new Error(`Failed to fetch invitation: ${error.message}`)
  }
}

/**
 * Get all invitations for an organization
 * @param organizationId The ID of the organization
 * @returns Array of invitations
 */
export const getInvitationsForOrganization = async (organizationId: string): Promise<Invitation[]> => {
  try {
    return await prisma.invitation.findMany({
      where: { organizationId },
      include: {
        orgRole: true,
        sender: {
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
    console.error(`Error fetching invitations for organization ${organizationId}:`, error)
    throw new Error(`Failed to fetch invitations: ${error.message}`)
  }
}

/**
 * Get all invitations for a specific email
 * @param email The email address
 * @returns Array of invitations
 */
export const getInvitationsForEmail = async (email: string): Promise<Invitation[]> => {
  try {
    return await prisma.invitation.findMany({
      where: {
        email,
        status: "SENT",
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        organization: true,
        orgRole: true,
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  } catch (error) {
    console.error(`Error fetching invitations for email ${email}:`, error)
    throw new Error(`Failed to fetch invitations: ${error.message}`)
  }
}

/**
 * Accept an invitation and create organization membership
 * @param token The invitation token
 * @param userId The ID of the user accepting the invitation
 * @returns The created organization membership
 */
export const acceptInvitation = async (
  token: string,
  userId: string,
): Promise<{ success: boolean; message: string; membershipId?: string }> => {
  try {
    // Start a transaction
    return await prisma.$transaction(async (tx) => {
      // Find the invitation
      const invitation = await tx.invitation.findUnique({
        where: { token },
        include: { organization: true },
      })

      if (!invitation) {
        return { success: false, message: "Invitation not found" }
      }

      if (invitation.status !== "SENT") {
        return { success: false, message: `Invitation has already been ${invitation.status.toLowerCase()}` }
      }

      if (invitation.expiresAt < new Date()) {
        // Update invitation status to EXPIRED
        await tx.invitation.update({
          where: { id: invitation.id },
          data: { status: "EXPIRED" },
        })
        return { success: false, message: "Invitation has expired" }
      }

      // Check if user already has a membership in this organization
      const existingMembership = await tx.organizationMembership.findFirst({
        where: {
          userId,
          organizationId: invitation.organizationId,
        },
      })

      if (existingMembership) {
        // Update invitation status to ACCEPTED
        await tx.invitation.update({
          where: { id: invitation.id },
          data: { status: "ACCEPTED" },
        })

        return {
          success: false,
          message: "You are already a member of this organization",
          membershipId: existingMembership.id,
        }
      }

      // Create a new membership
      const membership = await tx.organizationMembership.create({
        data: {
          userId,
          organizationId: invitation.organizationId,
          orgRoleId: invitation.roleId,
          status: "ACTIVE",
          invitedById: invitation.senderId,
        },
      })

      // Update invitation status
      await tx.invitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED" },
      })

      return {
        success: true,
        message: `You have successfully joined ${invitation.organization.name}`,
        membershipId: membership.id,
      }
    })
  } catch (error) {
    console.error(`Error accepting invitation with token ${token}:`, error)
    throw new Error(`Failed to accept invitation: ${error.message}`)
  }
}

/**
 * Cancel an invitation
 * @param id The ID of the invitation
 * @returns The updated invitation
 */
export const cancelInvitation = async (id: string): Promise<Invitation> => {
  try {
    return await prisma.invitation.update({
      where: { id },
      data: { status: "CANCELLED" },
    })
  } catch (error) {
    console.error(`Error cancelling invitation ${id}:`, error)
    throw new Error(`Failed to cancel invitation: ${error.message}`)
  }
}

/**
 * Resend an invitation (creates a new token and resets expiration)
 * @param id The ID of the invitation
 * @returns The updated invitation
 */
export const resendInvitation = async (id: string): Promise<Invitation> => {
  try {
    // Generate a new token
    const token = uuidv4()

    // Set new expiration date (7 days from now)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    return await prisma.invitation.update({
      where: { id },
      data: {
        token,
        status: "SENT",
        expiresAt,
      },
    })
  } catch (error) {
    console.error(`Error resending invitation ${id}:`, error)
    throw new Error(`Failed to resend invitation: ${error.message}`)
  }
}

/**
 * Clean up expired invitations
 * @returns Number of deleted invitations
 */
export const cleanupExpiredInvitations = async (): Promise<number> => {
  try {
    const result = await prisma.invitation.deleteMany({
      where: {
        status: "SENT",
        expiresAt: {
          lt: new Date(),
        },
      },
    })

    return result.count
  } catch (error) {
    console.error("Error cleaning up expired invitations:", error)
    throw new Error(`Failed to clean up expired invitations: ${error.message}`)
  }
}
