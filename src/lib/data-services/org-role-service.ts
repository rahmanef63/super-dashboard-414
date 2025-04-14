import prisma from "../prisma"

/**
 * Get an organization role by its ID
 * @param id The ID of the organization role
 * @returns The organization role or null if not found
 */
export async function getOrgRoleById(id: string) {
  try {
    return await prisma.organizationRole.findUnique({
      where: { id },
      include: {
        permissions: true,
      },
    })
  } catch (error) {
    console.error("Error getting organization role by ID:", error)
    return null
  }
}

/**
 * Get all roles for a specific organization
 * @param organizationId The ID of the organization
 * @returns Array of organization roles
 */
export async function getOrgRolesForOrganization(organizationId: string) {
  try {
    return await prisma.organizationRole.findMany({
      where: { organizationId },
      include: {
        permissions: true,
      },
      orderBy: {
        name: "asc",
      },
    })
  } catch (error) {
    console.error("Error getting organization roles:", error)
    return []
  }
}

/**
 * Create a new organization role
 * @param data The organization role data
 * @returns The created organization role
 */
export async function createOrgRole(data: {
  name: string
  description?: string
  organizationId: string
  permissionIds?: string[]
}) {
  const { name, description, organizationId, permissionIds = [] } = data

  try {
    return await prisma.organizationRole.create({
      data: {
        name,
        description,
        organization: {
          connect: { id: organizationId },
        },
        permissions: {
          connect: permissionIds.map((id) => ({ id })),
        },
      },
      include: {
        permissions: true,
      },
    })
  } catch (error) {
    console.error("Error creating organization role:", error)
    throw error
  }
}

/**
 * Update an organization role
 * @param id The ID of the organization role to update
 * @param data The updated organization role data
 * @returns The updated organization role
 */
export async function updateOrgRole(
  id: string,
  data: {
    name?: string
    description?: string
    permissionIds?: string[]
  },
) {
  const { name, description, permissionIds } = data

  try {
    // First, get the current role to check if it exists
    const existingRole = await prisma.organizationRole.findUnique({
      where: { id },
      include: { permissions: true },
    })

    if (!existingRole) {
      throw new Error(`Organization role with ID ${id} not found`)
    }

    // Prepare the update data
    const updateData: any = {}

    if (name !== undefined) {
      updateData.name = name
    }

    if (description !== undefined) {
      updateData.description = description
    }

    // If permission IDs are provided, update the permissions
    let updatedRole
    if (permissionIds !== undefined) {
      // Disconnect all existing permissions and connect the new ones
      updatedRole = await prisma.organizationRole.update({
        where: { id },
        data: {
          ...updateData,
          permissions: {
            disconnect: existingRole.permissions.map((p) => ({ id: p.id })),
            connect: permissionIds.map((id) => ({ id })),
          },
        },
        include: {
          permissions: true,
        },
      })
    } else {
      // Just update the role data without changing permissions
      updatedRole = await prisma.organizationRole.update({
        where: { id },
        data: updateData,
        include: {
          permissions: true,
        },
      })
    }

    return updatedRole
  } catch (error) {
    console.error("Error updating organization role:", error)
    throw error
  }
}

/**
 * Delete an organization role
 * @param id The ID of the organization role to delete
 * @returns The deleted organization role
 */
export async function deleteOrgRole(id: string) {
  try {
    // First check if the role exists
    const existingRole = await prisma.organizationRole.findUnique({
      where: { id },
      include: { permissions: true },
    })

    if (!existingRole) {
      throw new Error(`Organization role with ID ${id} not found`)
    }

    // Disconnect all permissions before deleting
    await prisma.organizationRole.update({
      where: { id },
      data: {
        permissions: {
          disconnect: existingRole.permissions.map((p) => ({ id: p.id })),
        },
      },
    })

    // Now delete the role
    return await prisma.organizationRole.delete({
      where: { id },
    })
  } catch (error) {
    console.error("Error deleting organization role:", error)
    throw error
  }
}
