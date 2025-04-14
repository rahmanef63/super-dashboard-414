import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/middleware/auth-middleware"

// GET /api/dashboards/[dashboardId]/workspaces/[id] - Get workspace details
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

    // Get workspace details
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
        dashboardId,
      },
    })

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    return NextResponse.json(workspace)
  } catch (error) {
    console.error("Error fetching workspace:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// PATCH /api/dashboards/[dashboardId]/workspaces/[id] - Update workspace details
export async function PATCH(req: NextRequest, { params }: { params: { dashboardId: string; id: string } }) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { dashboardId, id: workspaceId } = params
    const { name, description } = await req.json()

    // Check if user has permission to update the workspace
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
        { error: "Forbidden: You don't have permission to update this workspace" },
        { status: 403 },
      )
    }

    // Update workspace
    const updatedWorkspace = await prisma.workspace.update({
      where: {
        id: workspaceId,
        dashboardId,
      },
      data: {
        name,
        description,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedWorkspace)
  } catch (error) {
    console.error("Error updating workspace:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// DELETE /api/dashboards/[dashboardId]/workspaces/[id] - Delete workspace
export async function DELETE(req: NextRequest, { params }: { params: { dashboardId: string; id: string } }) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { dashboardId, id: workspaceId } = params

    // Check if user has permission to delete the workspace
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
        { error: "Forbidden: You don't have permission to delete this workspace" },
        { status: 403 },
      )
    }

    // Delete workspace
    await prisma.workspace.delete({
      where: {
        id: workspaceId,
        dashboardId,
      },
    })

    return NextResponse.json({ message: "Workspace deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting workspace:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
