import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/middleware/auth-middleware"

// GET /api/dashboards - Get all dashboards for the current user
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get dashboards where the user is assigned
    const assignments = await prisma.dashboardAssignment.findMany({
      where: {
        userId: user.id,
      },
      include: {
        dashboard: true,
      },
    })

    const dashboards = assignments.map((assignment) => assignment.dashboard)

    return NextResponse.json(dashboards)
  } catch (error) {
    console.error("Error fetching dashboards:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// POST /api/dashboards - Create a new dashboard
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, organizationId } = await req.json()

    if (!name) {
      return NextResponse.json({ error: "Dashboard name is required" }, { status: 400 })
    }

    // Create the dashboard
    const dashboard = await prisma.dashboard.create({
      data: {
        name,
        description,
        organizationId,
        createdById: user.id,
      },
    })

    // Assign the current user to the dashboard
    await prisma.dashboardAssignment.create({
      data: {
        dashboardId: dashboard.id,
        userId: user.id,
      },
    })

    return NextResponse.json(dashboard, { status: 201 })
  } catch (error) {
    console.error("Error creating dashboard:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
