import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/middleware/auth-middleware"

// GET /api/dashboards/[dashboardId]/workspaces - Get all workspaces for a dashboard
export async function GET(req: NextRequest, { params }: { params: { dashboardId: string } }) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dashboardId = params.dashboardId

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

    // Get all workspaces for the dashboard
    const workspaces = await prisma.workspace.findMany({
      where: {
        dashboardId,
      },
    })

    return NextResponse.json(workspaces)
  } catch (error) {
    console.error("Error fetching workspaces:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// POST /api/dashboards/[dashboardId]/workspaces - Create a new workspace
export async function POST(req: NextRequest, { params }: { params: { dashboardId: string } }) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dashboardId = params.dashboardId
    const { name, description } = await req.json()

    // Check if user has permission to create workspaces in this dashboard
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
        { error: "Forbidden: You don't have permission to create workspaces in this dashboard" },
        { status: 403 },
      )
    }

    // Create the workspace
    const workspace = await prisma.workspace.create({
      data: {
        name,
        description,
        dashboardId,
      },
    })

    return NextResponse.json(workspace, { status: 201 })
  } catch (error) {
    console.error("Error creating workspace:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
