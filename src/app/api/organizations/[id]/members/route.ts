import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/middleware/auth-middleware"

// GET /api/organizations/[id]/members - Get all members of an organization
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organizationId = params.id

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

    // Get all members of the organization
    const members = await prisma.organizationMembership.findMany({
      where: {
        organizationId,
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

    return NextResponse.json(members)
  } catch (error) {
    console.error("Error fetching organization members:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// POST /api/organizations/[id]/members - Invite a new member to the organization
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organizationId = params.id
    const { email, roleId } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if user has permission to invite members
    const membership = await prisma.organizationMembership.findFirst({
      where: {
        organizationId,
        userId: user.id,
        status: "ACTIVE",
        role: {
          name: {
            in: ["OWNER", "ADMIN"], // Only owners and admins can invite members
          },
        },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Forbidden: You don't have permission to invite members" }, { status: 403 })
    }

    // Check if the role exists and belongs to the organization
    const role = await prisma.organizationRole.findFirst({
      where: {
        id: roleId,
        organizationId,
      },
    })

    if (!role) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Check if the user already exists
    const invitedUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    // If the user already exists, check if they're already a member
    if (invitedUser) {
      const existingMembership = await prisma.organizationMembership.findFirst({
        where: {
          organizationId,
          userId: invitedUser.id,
        },
      })

      if (existingMembership) {
        return NextResponse.json({ error: "User is already a member of this organization" }, { status: 400 })
      }
    }

    // Create an invitation
    const invitation = await prisma.invitation.create({
      data: {
        email,
        organizationId,
        roleId,
        invitedById: user.id,
        token: crypto.randomUUID(), // Generate a unique token
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
      },
    })

    // TODO: Send invitation email

    return NextResponse.json({ message: "Invitation sent successfully", invitation }, { status: 201 })
  } catch (error) {
    console.error("Error inviting member:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
