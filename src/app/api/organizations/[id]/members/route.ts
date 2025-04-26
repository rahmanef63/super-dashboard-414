import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getToken } from "next-auth/jwt"

// GET /api/organizations/[id]/members - Get all members of an organization
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = token.sub;
    const organizationId = params.id;
    // Check if user has access to the organization
    const hasAccess = await prisma.organizationMembership.findFirst({
      where: {
        organizationId,
        userId,
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
        orgRole: true,
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
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = token.sub;
    const organizationId = params.id;
    const { email, orgRoleId } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    // Check if user has permission to invite members
    const membership = await prisma.organizationMembership.findFirst({
      where: {
        organizationId,
        userId,
        status: "ACTIVE",
        orgRole: {
          name: {
            in: ["OWNER", "ADMIN"], // Only owners and admins can invite members
          },
        },
      },
    });
    if (!membership) {
      return NextResponse.json({ error: "Forbidden: You don't have permission to invite members" }, { status: 403 });
    }
    // Check if the role exists and belongs to the organization
    const orgRole = await prisma.orgRole.findFirst({
      where: {
        id: orgRoleId,
        organizationId,
      },
    });
    if (!orgRole) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        email,
        organizationId,
        roleId: orgRole.id,
        senderId: userId,
        token: crypto.randomUUID(), // Generate a unique token
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
      },
    });
    // TODO: Send invitation email
    return NextResponse.json({ message: "Invitation sent successfully", invitation }, { status: 201 });
  } catch (error) {
    console.error("Error inviting member:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
