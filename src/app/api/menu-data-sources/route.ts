import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware/auth-middleware"
import * as menuDataSourceService from "@/lib/data-services/menu-data-source-service"

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

    // Build query
    const query: any = {}

    if (menuId) {
      query.menuId = menuId
    }

    // Get menu data sources
    const menuDataSources = await menuDataSourceService.getDataSourcesForMenu(query.menuId)

    return NextResponse.json({ data: menuDataSources })
  } catch (error) {
    console.error("Error in GET /api/menu-data-sources:", error)
    return NextResponse.json({ error: "Failed to fetch menu data sources" }, { status: 500 })
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
    if (!body.menuId || !body.sourceTable) {
      return NextResponse.json(
        { error: "Missing required fields: menuId and sourceTable are required" },
        { status: 400 },
      )
    }

    // Create menu data source
    const menuDataSource = await menuDataSourceService.createMenuDataSource({
      menuId: body.menuId,
      sourceTable: body.sourceTable,
      filterByWorkspaceId: body.filterByWorkspaceId,
      filterByUserId: body.filterByUserId,
    })

    if (!menuDataSource) {
      return NextResponse.json({ error: "Failed to create menu data source" }, { status: 500 })
    }

    return NextResponse.json({ data: menuDataSource }, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/menu-data-sources:", error)
    return NextResponse.json({ error: "Failed to create menu data source" }, { status: 500 })
  }
}
