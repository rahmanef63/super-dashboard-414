import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/middleware/auth-middleware"

// Helper function to check if user has access to the dashboard
async function checkDashboardAccess(dashboardId: string, userId: string) {
  const assignment = await prisma.dashboardAssignment.findFirst({
    where: {
      dashboardId,
      userId,
    },
  })

  return !!assignment
}

// GET /api/dashboards/[id] - Get dashboard details
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dashboardId = params.id

    // Check if user has access to the dashboard
    const hasAccess = await checkDashboardAccess(dashboardId, user.id)

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden: You don't have access to this dashboard" }, { status: 403 })
    }

    // Get dashboard details
    const dashboard = await prisma.dashboard.findUnique({
      where: {
        id: dashboardId,
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!dashboard) {
      return NextResponse.json({ error: "Dashboard not found" }, { status: 404 })
    }

    return NextResponse.json(dashboard)
  } catch (error) {
    console.error("Error fetching dashboard:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// PATCH /api/dashboards/[id] - Update dashboard details
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dashboardId = params.id
    const { name, description } = await req.json()

    // Check if user has permission to update the dashboard
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
        { error: "Forbidden: You don't have permission to update this dashboard" },
        { status: 403 },
      )
    }

    // Update dashboard
    const updatedDashboard = await prisma.dashboard.update({
      where: {
        id: dashboardId,
      },
      data: {
        name,
        description,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedDashboard)
  } catch (error) {
    console.error("Error updating dashboard:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// DELETE /api/dashboards/[id] - Delete dashboard
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dashboardId = params.id

    // Check if user has permission to delete the dashboard
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
        { error: "Forbidden: You don't have permission to delete this dashboard" },
        { status: 403 },
      )
    }

    // Delete dashboard (this should cascade to all related records)
    await prisma.dashboard.delete({
      where: {
        id: dashboardId,
      },
    })

    return NextResponse.json({ message: "Dashboard deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting dashboard:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
