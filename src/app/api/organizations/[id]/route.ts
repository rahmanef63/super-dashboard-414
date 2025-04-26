import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getToken } from "next-auth/jwt"

// Helper function to check if user has access to the organization
async function checkOrganizationAccess(organizationId: string, userId: string) {
  const membership = await prisma.organizationMembership.findFirst({
    where: {
      organizationId,
      userId,
      status: "ACTIVE",
    },
  })

  return !!membership
}

// GET /api/organizations/[id] - Get organization details
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = token.sub;
    const organizationId = params.id;
    // Check if user has access to the organization
    const hasAccess = await checkOrganizationAccess(organizationId, userId);
    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden: You don't have access to this organization" }, { status: 403 });
    }

    // Get organization details
    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    return NextResponse.json(organization)
  } catch (error) {
    console.error("Error fetching organization:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// PATCH /api/organizations/[id] - Update organization details
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = token.sub;
    const organizationId = params.id;
    const { name } = await req.json();
    // Check if user has access to the organization
    const membership = await prisma.organizationMembership.findFirst({
      where: {
        organizationId,
        userId,
        status: "ACTIVE",
        orgRole: {
          name: "OWNER", // Only owners can update organization details
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Forbidden: You don't have permission to update this organization" },
        { status: 403 },
      )
    }

    // Update organization
    const updatedOrganization = await prisma.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        name,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedOrganization)
  } catch (error) {
    console.error("Error updating organization:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// DELETE /api/organizations/[id] - Delete organization
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = token.sub;
    const organizationId = params.id;
    // Check if user is the owner of the organization
    const membership = await prisma.organizationMembership.findFirst({
      where: {
        organizationId,
        userId,
        status: "ACTIVE",
        orgRole: {
          name: "OWNER", // Only owners can delete the organization
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Forbidden: You don't have permission to delete this organization" },
        { status: 403 },
      )
    }

    // Delete organization (this should cascade to all related records)
    await prisma.organization.delete({
      where: {
        id: organizationId,
      },
    })

    return NextResponse.json({ message: "Organization deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting organization:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
