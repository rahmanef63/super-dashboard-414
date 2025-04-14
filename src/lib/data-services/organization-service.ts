import prisma from "../prisma"
import type {
  Organization,
  OrganizationMembership,
  OrgRole,
  Invitation,
  OrgType,
  PlanType,
  MembershipStatus,
  InvitationStatus,
} from "@prisma/client"
import { v4 as uuidv4 } from "uuid"

// Get organization by ID
export const getOrganizationById = async (id: string): Promise<Organization | null> => {
  try {
    console.log(`[organization-service] getOrganizationById called with id: ${id}`)
    return await prisma.organization.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error(`[organization-service] Error fetching organization with ID ${id}:`, error)
    return null
  }
}

// Get organizations for user
export const getOrganizationsForUser = async (userId: string): Promise<Organization[]> => {
  try {
    console.log(`[organization-service] getOrganizationsForUser called with userId: ${userId}`)
    const memberships = await prisma.organizationMembership.findMany({
      where: {
        userId,
        status: "ACTIVE",
      },
      include: {
        organization: true,
      },
    })

    return memberships.map((m) => m.organization)
  } catch (error) {
    console.error(`[organization-service] Error fetching organizations for user ${userId}:`, error)
    return []
  }
}

// Create a new organization
export const createOrganization = async (data: {
  name: string
  type?: OrgType
  plan?: PlanType
  createdById?: string
  domainId?: string
}): Promise<Organization | null> => {
  try {
    console.log(`[organization-service] createOrganization called with data: ${JSON.stringify(data)}`)
    return await prisma.organization.create({
      data,
    })
  } catch (error) {
    console.error("Error creating organization:", error)
    return null
  }
}

// Update an organization
export const updateOrganization = async (
  id: string,
  data: {
    name?: string
    type?: OrgType
    plan?: PlanType
    domainId?: string
  },
): Promise<Organization | null> => {
  try {
    console.log(`[organization-service] updateOrganization called with id: ${id}, data: ${JSON.stringify(data)}`)
    return await prisma.organization.update({
      where: { id },
      data,
    })
  } catch (error) {
    console.error(`Error updating organization with ID ${id}:`, error)
    return null
  }
}

// Delete an organization
export const deleteOrganization = async (id: string): Promise<boolean> => {
  try {
    console.log(`[organization-service] deleteOrganization called with id: ${id}`)

    // Delete all memberships associated with the organization
    await prisma.organizationMembership.deleteMany({
      where: { organizationId: id },
    })

    // Delete all dashboards associated with the organization
    await prisma.dashboard.deleteMany({
      where: { organizationId: id },
    })

    // Finally, delete the organization
    await prisma.organization.delete({
      where: { id },
    })

    return true
  } catch (error) {
    console.error(`Error deleting organization with ID ${id}:`, error)
    return false
  }
}

// Create organization membership
export const createOrganizationMembership = async (data: {
  userId: string
  organizationId: string
  orgRoleId?: string
  status?: MembershipStatus
  invitedById?: string
}): Promise<OrganizationMembership | null> => {
  try {
    console.log(`[organization-service] createOrganizationMembership called with data: ${JSON.stringify(data)}`)
    return await prisma.organizationMembership.create({
      data: {
        ...data,
        status: data.status || "PENDING",
      },
    })
  } catch (error) {
    console.error("Error creating organization membership:", error)
    return null
  }
}

// Update organization membership
export const updateOrganizationMembership = async (
  id: string,
  data: {
    orgRoleId?: string
    status?: MembershipStatus
  },
): Promise<OrganizationMembership | null> => {
  try {
    console.log(
      `[organization-service] updateOrganizationMembership called with id: ${id}, data: ${JSON.stringify(data)}`,
    )
    return await prisma.organizationMembership.update({
      where: { id },
      data,
    })
  } catch (error) {
    console.error(`Error updating organization membership with ID ${id}:`, error)
    return null
  }
}

// Create organization role
export const createOrgRole = async (data: {
  name: string
  description?: string
  organizationId: string
  permissions: any
}): Promise<OrgRole | null> => {
  try {
    console.log(`[organization-service] createOrgRole called with data: ${JSON.stringify(data)}`)
    return await prisma.orgRole.create({
      data,
    })
  } catch (error) {
    console.error("Error creating organization role:", error)
    return null
  }
}

// Create invitation
export const createInvitation = async (data: {
  organizationId: string
  email: string
  roleId?: string
  senderId?: string
  expiresAt: Date
}): Promise<Invitation | null> => {
  try {
    console.log(`[organization-service] createInvitation called with data: ${JSON.stringify(data)}`)
    const token = uuidv4()

    return await prisma.invitation.create({
      data: {
        ...data,
        token,
        status: "SENT",
      },
    })
  } catch (error) {
    console.error("Error creating invitation:", error)
    return null
  }
}

// Get invitation by token
export const getInvitationByToken = async (token: string): Promise<Invitation | null> => {
  try {
    console.log(`[organization-service] getInvitationByToken called with token: ${token}`)
    return await prisma.invitation.findUnique({
      where: { token },
      include: {
        organization: true,
        orgRole: true,
      },
    })
  } catch (error) {
    console.error(`Error fetching invitation with token ${token}:`, error)
    return null
  }
}

// Update invitation status
export const updateInvitationStatus = async (id: string, status: InvitationStatus): Promise<Invitation | null> => {
  try {
    console.log(`[organization-service] updateInvitationStatus called with id: ${id}, status: ${status}`)
    return await prisma.invitation.update({
      where: { id },
      data: { status },
    })
  } catch (error) {
    console.error(`Error updating invitation status for ID ${id}:`, error)
    return null
  }
}

// Create user and organization in a transaction
export const createUserWithOrganization = async (data: {
  user: {
    email: string
    name?: string
    passwordHash?: string
  }
  organization: {
    name: string
    type?: OrgType
    plan?: PlanType
  }
}): Promise<{ user: any; organization: any; membership: any } | null> => {
  try {
    console.log(`[organization-service] createUserWithOrganization called with data: ${JSON.stringify(data)}`)
    return await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: data.user,
      })

      // Create organization
      const organization = await tx.organization.create({
        data: {
          ...data.organization,
          createdById: user.id,
        },
      })

      // Create membership
      const membership = await tx.organizationMembership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          status: "ACTIVE",
        },
      })

      return { user, organization, membership }
    })
  } catch (error) {
    console.error("Error creating user with organization:", error)
    return null
  }
}
