import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware/auth-middleware"
import * as menuEntryService from "@/lib/data-services/menu-entry-service"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const url = new URL(request.url)
    const menuId = url.searchParams.get("menuId")
    const userId = url.searchParams.get("userId")
    const workspaceId = url.searchParams.get("workspaceId")
    const dashboardId = url.searchParams.get("dashboardId")

    // Build query options
    const options: any = {}
    if (userId) {
      options.userId = userId
    }
    if (workspaceId) {
      options.workspaceId = workspaceId
    }
    if (dashboardId) {
      options.dashboardId = dashboardId
    }

    // Get menu entries
    const menuEntries = await menuEntryService.getMenuEntriesForMenuItem(menuId!, options)

    return NextResponse.json({ data: menuEntries })
  } catch (error) {
    console.error("Error in GET /api/menu-entries:", error)
    return NextResponse.json({ error: "Failed to fetch menu entries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const body = await request.json()

    // Validate required fields
    if (!body.menuId || !body.userId || !body.data) {
      return NextResponse.json(
        { error: "Missing required fields: menuId, userId, and data are required" },
        { status: 400 },
      )
    }

    // Create menu entry
    const menuEntry = await menuEntryService.createMenuEntry({
      menuId: body.menuId,
      userId: body.userId,
      workspaceId: body.workspaceId,
      dashboardId: body.dashboardId,
      data: body.data,
    })

    if (!menuEntry) {
      return NextResponse.json({ error: "Failed to create menu entry" }, { status: 500 })
    }

    return NextResponse.json({ data: menuEntry }, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/menu-entries:", error)
    return NextResponse.json({ error: "Failed to create menu entry" }, { status: 500 })
  }
}
