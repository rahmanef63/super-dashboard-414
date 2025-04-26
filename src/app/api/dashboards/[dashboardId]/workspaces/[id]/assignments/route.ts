import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/middleware/auth-middleware"

// GET /api/dashboards/[dashboardId]/workspaces/[id]/assignments - Get all assignments for a workspace
export async function GET(req: NextRequest, { params }: { params: { dashboardId: string; id: string } }) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { dashboardId, id: workspaceId } = params

    // Check if user has access to the workspace
    const hasAccess = await prisma.workspaceAssignment.findFirst({
      where: {
        workspaceId,
        userId: user.id,
      },
    })

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden: You don't have access to this workspace" }, { status: 403 })
    }

    // Get all assignments for the workspace
    const assignments = await prisma.workspaceAssignment.findMany({
      where: {
        workspaceId,
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

    return NextResponse.json(assignments)
  } catch (error) {
    console.error("Error fetching workspace assignments:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// POST /api/dashboards/[dashboardId]/workspaces/[id]/assignments - Assign a user to the workspace
export async function POST(req: NextRequest, { params }: { params: { dashboardId: string; id: string } }) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { dashboardId, id: workspaceId } = params
    const { userId, roleId } = await req.json()

    // Check if user has permission to assign users to this workspace
    const assignment = await prisma.workspaceAssignment.findFirst({
      where: {
        workspaceId,
        userId: user.id,
      },
      include: {
        role: true,
      },
    })

    if (!assignment) {
      return NextResponse.json(
        { error: "Forbidden: You don't have permission to assign users to this workspace" },
        { status: 403 },
      )
    }

    // Create the assignment
    const newAssignment = await prisma.workspaceAssignment.create({
      data: {
        workspaceId,
        userId,
        roleId,
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

    return NextResponse.json(newAssignment, { status: 201 })
  } catch (error) {
    console.error("Error assigning user to workspace:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
