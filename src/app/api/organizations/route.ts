import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/middleware/auth-middleware"

// GET /api/organizations - Get all organizations for the current user
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get organizations where the user is a member
    const memberships = await prisma.organizationMembership.findMany({
      where: {
        userId: user.id,
        status: "ACTIVE",
      },
      include: {
        organization: true,
      },
    })

    const organizations = memberships.map((membership) => membership.organization)

    return NextResponse.json(organizations)
  } catch (error) {
    console.error("Error fetching organizations:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// POST /api/organizations - Create a new organization
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description } = await req.json()

    if (!name) {
      return NextResponse.json({ error: "Organization name is required" }, { status: 400 })
    }

    // Create the organization and add the current user as an owner
    const organization = await prisma.$transaction(async (tx) => {
      // Create the organization
      const org = await tx.organization.create({
        data: {
          name,
          description,
          createdById: user.id,
        },
      })

      // Create the owner role if it doesn't exist
      let ownerRole = await tx.organizationRole.findFirst({
        where: {
          organizationId: org.id,
          name: "OWNER",
        },
      })

      if (!ownerRole) {
        ownerRole = await tx.organizationRole.create({
          data: {
            organizationId: org.id,
            name: "OWNER",
            description: "Organization Owner",
          },
        })
      }

      // Add the current user as an owner
      await tx.organizationMembership.create({
        data: {
          organizationId: org.id,
          userId: user.id,
          roleId: ownerRole.id,
          status: "ACTIVE",
        },
      })

      return org
    })

    return NextResponse.json(organization, { status: 201 })
  } catch (error) {
    console.error("Error creating organization:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
