import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware/auth-middleware"
import * as menuDataSourceService from "@/lib/data-services/menu-data-source-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get menu data source by ID
    const menuDataSource = await menuDataSourceService.getMenuDataSourceById(params.id)

    if (!menuDataSource) {
      return NextResponse.json({ error: "Menu data source not found" }, { status: 404 })
    }

    return NextResponse.json({ data: menuDataSource })
  } catch (error) {
    console.error(`Error in GET /api/menu-data-sources/${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch menu data source" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const body = await request.json()

    // Update menu data source
    const menuDataSource = await menuDataSourceService.updateMenuDataSource(params.id, {
      sourceTable: body.sourceTable,
      filterByWorkspaceId: body.filterByWorkspaceId,
      filterByUserId: body.filterByUserId,
    })

    if (!menuDataSource) {
      return NextResponse.json({ error: "Menu data source not found" }, { status: 404 })
    }

    return NextResponse.json({ data: menuDataSource })
  } catch (error) {
    console.error(`Error in PATCH /api/menu-data-sources/${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update menu data source" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete menu data source
    const success = await menuDataSourceService.deleteMenuDataSource(params.id)
    if (!success) {
      return NextResponse.json({ error: "Menu data source not found or could not be deleted" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error in DELETE /api/menu-data-sources/${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete menu data source" }, { status: 500 })
  }
}
