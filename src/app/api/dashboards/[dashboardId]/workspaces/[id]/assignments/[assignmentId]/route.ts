import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/middleware/auth-middleware"

// DELETE /api/dashboards/[dashboardId]/workspaces/[id]/assignments/[assignmentId] - Remove a user from the workspace
export async function DELETE(
  req: NextRequest,
  { params }: { params: { dashboardId: string; id: string; assignmentId: string } },
) {
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { dashboardId, id: workspaceId, assignmentId } = params

    // Check if user has permission to remove users from the workspace
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
        { error: "Forbidden: You don't have permission to remove users from this workspace" },
        { status: 403 },
      )
    }

    // Delete the assignment
    await prisma.workspaceAssignment.delete({
      where: {
        id: assignmentId,
      },
    })

    return NextResponse.json({ message: "User removed from workspace successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error removing user from workspace:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
