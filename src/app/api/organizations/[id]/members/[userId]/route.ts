import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/middleware/auth-middleware"

// GET /api/organizations/[id]/members/[userId] - Get details of a specific member
export async function GET(req: NextRequest, { params }: { params: { id: string; userId: string } }) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: organizationId, userId: memberId } = params

    // Check if user has access to the organization
    const hasAccess = await prisma.organizationMembership.findFirst({
      where: {
        organizationId,
        userId: user.id,
        status: "ACTIVE",
      },
    })

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden: You don't have access to this organization" }, { status: 403 })
    }

    // Get member details
    const member = await prisma.organizationMembership.findFirst({
      where: {
        organizationId,
        userId: memberId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        role: true,
      },
    })

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    return NextResponse.json(member)
  } catch (error) {
    console.error("Error fetching member details:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// PATCH /api/organizations/[id]/members/[userId] - Update member role
export async function PATCH(req: NextRequest, { params }: { params: { id: string; userId: string } }) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: organizationId, userId: memberId } = params
    const { roleId } = await req.json()

    // Check if user has permission to update members
    const currentUserMembership = await prisma.organizationMembership.findFirst({
      where: {
        organizationId,
        userId: user.id,
        status: "ACTIVE",
        role: {
          name: {
            in: ["OWNER", "ADMIN"], // Only owners and admins can update members
          },
        },
      },
      include: {
        role: true,
      },
    })

    if (!currentUserMembership) {
      return NextResponse.json({ error: "Forbidden: You don't have permission to update members" }, { status: 403 })
    }

    // Get the member to update
    const memberToUpdate = await prisma.organizationMembership.findFirst({
      where: {
        organizationId,
        userId: memberId,
      },
      include: {
        role: true,
      },
    })

    if (!memberToUpdate) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    // Check if the role exists and belongs to the organization
    const newRole = await prisma.organizationRole.findFirst({
      where: {
        id: roleId,
        organizationId,
      },
    })

    if (!newRole) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Prevent non-owners from modifying owner roles
    if (memberToUpdate.role.name === "OWNER" && currentUserMembership.role.name !== "OWNER") {
      return NextResponse.json({ error: "Forbidden: Only owners can modify owner roles" }, { status: 403 })
    }

    // Update member role
    const updatedMember = await prisma.organizationMembership.update({
      where: {
        id: memberToUpdate.id,
      },
      data: {
        roleId,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        role: true,
      },
    })

    return NextResponse.json(updatedMember)
  } catch (error) {
    console.error("Error updating member:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// DELETE /api/organizations/[id]/members/[userId] - Remove a member from the organization
export async function DELETE(req: NextRequest, { params }: { params: { id: string; userId: string } }) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: organizationId, userId: memberId } = params

    // Check if user has permission to remove members
    const currentUserMembership = await prisma.organizationMembership.findFirst({
      where: {
        organizationId,
        userId: user.id,
        status: "ACTIVE",
        role: {
          name: {
            in: ["OWNER", "ADMIN"], // Only owners and admins can remove members
          },
        },
      },
      include: {
        role: true,
      },
    })

    if (!currentUserMembership) {
      return NextResponse.json({ error: "Forbidden: You don't have permission to remove members" }, { status: 403 })
    }

    // Get the member to remove
    const memberToRemove = await prisma.organizationMembership.findFirst({
      where: {
        organizationId,
        userId: memberId,
      },
      include: {
        role: true,
      },
    })

    if (!memberToRemove) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    // Prevent non-owners from removing owners
    if (memberToRemove.role.name === "OWNER" && currentUserMembership.role.name !== "OWNER") {
      return NextResponse.json({ error: "Forbidden: Only owners can remove owners" }, { status: 403 })
    }

    // Prevent removing the last owner
    if (memberToRemove.role.name === "OWNER") {
      const ownerCount = await prisma.organizationMembership.count({
        where: {
          organizationId,
          role: {
            name: "OWNER",
          },
        },
      })

      if (ownerCount <= 1) {
        return NextResponse.json({ error: "Cannot remove the last owner of the organization" }, { status: 400 })
      }
    }

    // Remove the member
    await prisma.organizationMembership.delete({
      where: {
        id: memberToRemove.id,
      },
    })

    return NextResponse.json({ message: "Member removed successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error removing member:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
