import type { Prisma } from "@prisma/client"
import prisma from "../prisma"

export type OrganizationMembershipWithUser = Prisma.OrganizationMembershipGetPayload<{
  include: {
    user: true
    role: true
  }
}>

export type OrganizationMembershipWithOrganization = Prisma.OrganizationMembershipGetPayload<{
  include: {
    organization: true
    role: true
  }
}>

/**
 * Get all memberships for a specific organization
 * @param organizationId - The ID of the organization
 * @returns Array of organization memberships with user details
 */
export async function getMembershipsForOrganization(organizationId: string): Promise<OrganizationMembershipWithUser[]> {
  return prisma.organizationMembership.findMany({
    where: {
      organizationId,
    },
    include: {
      user: true,
      role: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

/**
 * Get all memberships for a specific user
 * @param userId - The ID of the user
 * @returns Array of organization memberships with organization details
 */
export async function getMembershipsForUser(userId: string): Promise<OrganizationMembershipWithOrganization[]> {
  return prisma.organizationMembership.findMany({
    where: {
      userId,
    },
    include: {
      organization: true,
      role: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

/**
 * Create a new organization membership
 * @param data - The membership data
 * @returns The created organization membership
 */
export async function createMembership(data: {
  userId: string
  organizationId: string
  roleId: string
  status?: "ACTIVE" | "PENDING" | "INACTIVE"
}): Promise<OrganizationMembershipWithUser> {
  return prisma.organizationMembership.create({
    data: {
      userId: data.userId,
      organizationId: data.organizationId,
      roleId: data.roleId,
      status: data.status || "ACTIVE",
    },
    include: {
      user: true,
      role: true,
    },
  })
}

/**
 * Update the status of an organization membership
 * @param membershipId - The ID of the membership to update
 * @param status - The new status
 * @returns The updated organization membership
 */
export async function updateMembershipStatus(
  membershipId: string,
  status: "ACTIVE" | "PENDING" | "INACTIVE",
): Promise<OrganizationMembershipWithUser> {
  return prisma.organizationMembership.update({
    where: {
      id: membershipId,
    },
    data: {
      status,
    },
    include: {
      user: true,
      role: true,
    },
  })
}

/**
 * Delete an organization membership
 * @param membershipId - The ID of the membership to delete
 * @returns The deleted organization membership
 */
export async function deleteMembership(membershipId: string): Promise<OrganizationMembershipWithUser> {
  return prisma.organizationMembership.delete({
    where: {
      id: membershipId,
    },
    include: {
      user: true,
      role: true,
    },
  })
}
