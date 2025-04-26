import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/middleware/auth-middleware"

// GET /api/dashboards/[id]/assignments - Get all assignments for a dashboard
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dashboardId = params.id

    // Check if user has access to the dashboard
    const hasAccess = await prisma.dashboardAssignment.findFirst({
      where: {
        dashboardId,
        userId: user.id,
      },
    })

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden: You don't have access to this dashboard" }, { status: 403 })
    }

    // Get all assignments for the dashboard
    const assignments = await prisma.dashboardAssignment.findMany({
      where: {
        dashboardId,
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
    console.error("Error fetching dashboard assignments:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// POST /api/dashboards/[id]/assignments - Assign a user to the dashboard
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dashboardId = params.id
    const { userId, roleId } = await req.json()

    // Check if user has permission to assign users to the dashboard
    const assignment = await prisma.dashboardAssignment.findFirst({
      where: {
        dashboardId,
        userId: user.id,
      },
      include: {
        role: true,
      },
    })

    if (!assignment) {
      return NextResponse.json(
        { error: "Forbidden: You don't have permission to assign users to this dashboard" },
        { status: 403 },
      )
    }

    // Create the assignment
    const newAssignment = await prisma.dashboardAssignment.create({
      data: {
        dashboardId,
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
    console.error("Error assigning user to dashboard:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
