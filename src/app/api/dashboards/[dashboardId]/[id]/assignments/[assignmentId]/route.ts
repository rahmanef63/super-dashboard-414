import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/middleware/auth-middleware"

// DELETE /api/dashboards/[id]/assignments/[assignmentId] - Remove a user from the dashboard
export async function DELETE(req: NextRequest, { params }: { params: { id: string; assignmentId: string } }) { // Changed id to dashboardId - but it should remain id here as the route parameter in the file name is [id]
  try {
    const user = await requireAuth(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: dashboardId, assignmentId } = params // Changed id to dashboardId - but it should remain id here as the route parameter in the file name is [id]

    // Check if user has permission to remove users from the dashboard
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
        { error: "Forbidden: You don't have permission to remove users from this dashboard" },
        { status: 403 },
      )
    }

    // Delete the assignment
    await prisma.dashboardAssignment.delete({
      where: {
        id: assignmentId,
      },
    })

    return NextResponse.json({ message: "User removed from dashboard successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error removing user from dashboard:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
